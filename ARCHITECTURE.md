# Architecture

> 技術選定・インフラ構成・実装方針。技術判断で迷ったらここを参照。

---

## 技術選定方針

1. **コスト最小**: 無料枠を最大活用。有料プランは月$500+の収益が出てから
2. **TypeScript統一**: フロントもバックもTypeScript。松本さんの主力言語
3. **エッジ優先**: Vercel Edge Functions or Cloudflare Workers でレスポンス最速
4. **マネージドサービス優先**: インフラ運用に時間を割かない

---

## アーキテクチャ概要

```
┌──────────────────────────────────────────────────────┐
│                    ユーザー                            │
│         Web App (英語)    │    LINE Bot (日本)        │
└──────────┬───────────────┴──────────┬────────────────┘
           │                          │
           ▼                          ▼
┌─────────────────────┐    ┌──────────────────────┐
│  Next.js App Router │    │  LINE Webhook Handler │
│  (Vercel)           │    │  (Vercel API Route)   │
└──────────┬──────────┘    └──────────┬───────────┘
           │                          │
           ▼                          ▼
┌──────────────────────────────────────────────────────┐
│              Astrology Engine (共通)                   │
│  ┌────────────────┐  ┌──────────────┐  ┌──────────┐ │
│  │ Prompt Manager  │  │ Chart Calc   │  │ Session  │ │
│  │ (鑑定プロンプト)│  │ (星座計算)   │  │ Manager  │ │
│  └───────┬────────┘  └──────┬───────┘  └────┬─────┘ │
└──────────┼──────────────────┼───────────────┼────────┘
           │                  │               │
           ▼                  ▼               ▼
┌──────────────────┐  ┌────────────┐  ┌─────────────┐
│  Claude API      │  │ Astronomy  │  │ Database    │
│  (Haiku 4.5)     │  │ Library    │  │ (Supabase)  │
└──────────────────┘  └────────────┘  └─────────────┘
```

---

## 技術スタック

### フロントエンド（Web App）

| 技術 | 選定理由 |
|------|---------|
| **Next.js 15 (App Router)** | SSR/SSG + API Routes。Vercelとの親和性最高 |
| **Tailwind CSS v4** | ユーティリティファースト。デザインの一貫性 |
| **Framer Motion** | 星座・タロットのアニメーション |
| **next-intl** | i18n（英語 / 日本語切り替え） |

### バックエンド / API

| 技術 | 選定理由 |
|------|---------|
| **Next.js API Routes (Edge)** | フロントと同一デプロイ。エッジ実行で低レイテンシ |
| **Claude API (Haiku 4.5)** | 鑑定文生成。コスト最小($0.01-0.03/鑑定)で十分な品質 |
| **Zod** | API リクエスト/レスポンスバリデーション |

### データベース

| 技術 | 選定理由 |
|------|---------|
| **Supabase (PostgreSQL)** | 無料枠が十分（500MB, 50K MAU）。Auth組み込み |
| **Supabase Auth** | Email/パスワード + Google OAuth。無料 |

### 決済

| 技術 | 選定理由 |
|------|---------|
| **Stripe** | グローバル対応。サブスク管理が堅牢 |
| **Stripe Checkout** | 決済UIを自前で作らない。PCI DSS準拠 |
| **Stripe Customer Portal** | プラン変更・解約をユーザー自身で完結 |

### LINE Bot（日本市場）

| 技術 | 選定理由 |
|------|---------|
| **LINE Messaging API** | 日本市場の標準チャネル |
| **Webhook → Next.js API Route** | 既存インフラに統合。別デプロイ不要 |
| **LINE Pay or Stripe** | 日本向け課金（Phase 2以降で決定） |

### インフラ / デプロイ

| 技術 | 選定理由 |
|------|---------|
| **Vercel** | Next.jsのデプロイ先として最適。無料枠で開始 |
| **Cloudflare** | ドメイン管理 + DNS + CDN |
| **GitHub Actions** | CI/CD（テスト → デプロイ自動化） |

### 星座計算

| 技術 | 選定理由 |
|------|---------|
| **astronomia** or **ephemeris** | JavaScriptで天体位置計算。出生図（バースチャート）の算出 |

> **注**: 本格的な出生図計算は Phase 1 では不要。太陽星座（誕生日ベース）で開始し、Phase 2 で月・上昇星座を追加する。

---

## コア設計: Astrology Engine

### Prompt Manager

占い鑑定の品質を決める最重要コンポーネント。

```
プロンプト構造:
├── system-prompt/
│   ├── base.md          — 占い師としてのペルソナ・口調・禁止事項
│   ├── horoscope.md     — デイリーホロスコープ用
│   ├── tarot.md         — タロットリーディング用
│   ├── compatibility.md — 相性診断用
│   └── chat.md          — 自由質問チャット用
├── user-context/
│   ├── 星座情報（太陽/月/上昇）
│   ├── 過去の鑑定サマリ
│   └── ユーザーの質問
└── output-format/
    ├── 英語版テンプレート
    └── 日本語版テンプレート
```

**設計原則**:
- プロンプトはコードとは別ファイルで管理（`.md` or `.txt`）
- バージョン管理して A/B テスト可能にする
- 「断定しない」「恐怖を煽らない」をシステムプロンプトで強制

### Session Manager

- ユーザーとの会話履歴を管理
- 過去の鑑定コンテキストを次回に引き継ぎ（「前回、仕事の悩みがありましたね」）
- Supabase に保存。セッション単位でトークン数を制御

---

## セキュリティ

| 対策 | 実装 |
|------|------|
| 認証 | Supabase Auth（JWT） |
| API保護 | Rate Limiting（Free: 10req/分, Pro: 60req/分） |
| 入力バリデーション | Zod スキーマ |
| 決済情報 | Stripe Checkout（自前で扱わない） |
| 個人情報 | 生年月日のみ保存。名前・住所は不要 |
| プロンプトインジェクション | 多層防御（下記参照） |

### プロンプトインジェクション多層防御

> 単一防御（システムプロンプトのみ）は容易にバイパスされる。
> 以下の4層で防御し、有害コンテンツの生成リスクを最小化する。

**Layer 1: 入力サニタイズ**
- ユーザー入力から既知のインジェクションパターンを検出・除去する
- 実装: Zod バリデーション + カスタムサニタイザ（`lib/astrology/sanitizer.ts`）
- 検出対象: `ignore previous instructions`, `you are now`, `system:`, `<|`, role偽装パターン
- 検出時: 入力を拒否し、占いに関する質問を促すメッセージを返す

**Layer 2: システムプロンプト制約**
- 占い師ペルソナの厳格な定義（`prompts/base.md`）
- 「占い・運勢・自己理解」以外のトピックに応じない明示的ルール
- 医療・法律・金融アドバイスの禁止ルール
- 「断定しない」「恐怖を煽らない」の出力ガードレール

**Layer 3: 出力分類器**
- Claude API レスポンスを返す前に、有害カテゴリをチェックする
- 実装: 軽量なキーワード/パターンマッチ + 必要に応じて別の Claude 呼び出しで分類
- 検出カテゴリ: 自殺/自傷助長、医療診断、金融助言、差別的コンテンツ
- 検出時: 定型の安全メッセージに差し替え + ログ記録

**Layer 4: 会話制御**
- 1セッションのターン数上限: Free 5ターン、Pro 30ターン
- トークン数上限: 1ターンの入力を2,000トークンに制限
- 連続エラー（3回拒否）でセッション終了 + 新セッション開始を促す
- 異常パターン（短時間に大量リクエスト）を Rate Limiting で制御

**Phase 1 実装範囲**: Layer 1（基本パターン）+ Layer 2 + Layer 4。Layer 3 はキーワードベースで開始し、Phase 2 で強化。

---

## データライフサイクル

### 保持ポリシー

| データ種別 | 保持期間 | 削除トリガー | 保存先 |
|-----------|---------|-------------|--------|
| ユーザープロフィール（email, 生年月日） | アカウント存続中 | アカウント削除 | Supabase |
| 鑑定履歴（会話内容） | アカウント存続中 | アカウント削除 | Supabase |
| セッションログ | 90日 | 自動削除（cron） | Supabase |
| 決済データ | Stripe管理 | Stripe のポリシーに準拠 | Stripe |
| 税務記録 | 7年（日本税法） | 法的保持期間満了 | Stripe + ログ |
| 匿名化統計 | 無期限 | — | Supabase |

### アカウント削除フロー

```
1. ユーザーが「アカウント削除」をリクエスト
2. 即座にソフトデリート（ログイン不可、deleted_at にタイムスタンプ）
3. 30日の猶予期間（撤回可能）
4. 30日後にハードデリート（cron）:
   - Supabase: ユーザーレコード + 全関連データを物理削除
   - Stripe: Customer オブジェクトを削除（サブスクは自動解約）
   - Claude API: 送信済みデータは Anthropic 側で30日保持後に削除（API ToS準拠）
5. 削除完了通知メールを送信
```

**実装時の注意:**
- P1-05（DBスキーマ設計）で `deleted_at` カラムとソフトデリートの RLS ポリシーを組み込む
- アカウント削除の API エンドポイントを Phase 1 のスコープに含める（GDPR 消去権）

### Claude API データフロー

- 鑑定生成時、ユーザーの生年月日 + 会話履歴を Claude API に送信する
- Anthropic API 利用規約により、API データはモデルトレーニングに**使用されない**
- Anthropic は safety/abuse 検知のため最大30日間ログを保持する
- この事実をプライバシーポリシーで明示的に開示する（`legal/PRIVACY.md` §3 参照）

---

## モデル選定

| 用途 | モデル | 理由 |
|------|--------|------|
| 鑑定文生成 | **Haiku 4.5** | コスト最小（$0.01-0.03/鑑定）で十分な文章品質 |
| プロンプト開発・テスト | **Sonnet 4.6** | より高品質な出力で品質基準を設定 |
| 複雑な相性分析 | **Sonnet 4.6** | Haiku では不十分な場合のフォールバック |

**コスト最適化**: 90%の鑑定を Haiku で処理。Pro ユーザーの深い対話のみ Sonnet にルーティング。

---

## シークレット管理

| 環境 | 方法 | 備考 |
|------|------|------|
| **本番 (Vercel)** | Vercel Environment Variables（暗号化） | Vercel ダッシュボードで設定。デプロイ時に注入 |
| **ローカル開発** | `.env.local` | `.gitignore` 対象。リポジトリに含めない |
| **CI/CD (GitHub Actions)** | GitHub Secrets | ワークフローで `${{ secrets.XXX }}` として参照 |

**必要なシークレット:**

| キー | 用途 | 取得元 |
|------|------|--------|
| `ANTHROPIC_API_KEY` | Claude API 呼び出し | Anthropic Console |
| `SUPABASE_URL` | Supabase 接続 | Supabase ダッシュボード |
| `SUPABASE_ANON_KEY` | Supabase クライアント認証 | Supabase ダッシュボード |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase 管理操作（cron等） | Supabase ダッシュボード |
| `STRIPE_SECRET_KEY` | Stripe API | Stripe ダッシュボード |
| `STRIPE_PUBLISHABLE_KEY` | Stripe クライアント（公開可） | Stripe ダッシュボード |
| `STRIPE_WEBHOOK_SECRET` | Stripe Webhook 検証 | Stripe Webhook 設定 |
| `LINE_CHANNEL_SECRET` | LINE Bot 検証（Phase 3） | LINE Developers |
| `LINE_CHANNEL_ACCESS_TOKEN` | LINE Bot API（Phase 3） | LINE Developers |

**ルール:**
- `.env.local` をコミットしたら即座にキーをローテーションする
- 起動時に必須シークレットの存在を検証する（`lib/config.ts` で Zod バリデーション）

---

## レジリエンス / フォールバック

### Claude API 障害時

```
1. リクエスト失敗 → 指数バックオフで3回リトライ（1s, 2s, 4s）
2. 3回失敗 → フォールバック:
   a. デイリーホロスコープ: 事前生成キャッシュから配信（深夜バッチで翌日分を生成済み）
   b. パーソナル鑑定/チャット: 「ただいま鑑定サービスを一時停止しています」メッセージ
   c. Haiku 障害 → Sonnet にフォールバック（コスト増を許容。15分で自動切り戻し）
3. ステータスページに障害情報を表示
```

### Supabase 障害時

- 認証: JWT トークンが有効な間はサービス継続可能
- データ読み取り: Edge Cache で直近のデータを配信
- データ書き込み: キューに蓄積し、復旧後に一括書き込み（Phase 2）

### Stripe 障害時

- 既存 Pro ユーザー: JWT に Pro ステータスを含めるため、Stripe 障害中もサービス継続
- 新規課金: 「現在決済処理ができません。しばらく後にお試しください」メッセージ

### デイリーホロスコープ事前生成

- 毎日 UTC 00:00 に Vercel Cron で翌日の12星座ホロスコープを一括生成
- Supabase に保存。API 障害に関係なく配信可能
- 生成失敗時: 前日分を再利用（「更新: 昨日の運勢を引き続きお届けします」）

---

## 監視 & アラート

> 「日次作業ゼロ」を実現するには、自動監視が前提。

| 監視対象 | ツール | アラート条件 | 通知先 |
|---------|--------|-------------|--------|
| サイト死活監視 | BetterStack（無料枠） | ダウンタイム検知 | メール |
| API エラー率 | Vercel Analytics | エラー率 > 5% | メール |
| Claude API レスポンス | アプリ内ログ | 連続失敗 3回以上 | メール |
| Stripe Webhook | Stripe Dashboard | 失敗率 > 1% | メール + Stripe通知 |
| Supabase 使用量 | Supabase Dashboard | ストレージ 80%超過 | メール |
| 不審なアクセス | Rate Limiter ログ | 閾値超過 | ログ記録 |

**Phase 1 実装範囲**: BetterStack 死活監視 + Vercel Analytics + Stripe Dashboard 通知。
**Phase 2**: カスタムアラート（Claude API 連続失敗、Supabase 使用量）を追加。

---

## ディレクトリ構成（実装時）

```
ai-astrology/
├── app/                  — Next.js App Router
│   ├── (marketing)/      — LP, 料金ページ（SSG）
│   ├── (app)/            — 認証後のアプリUI
│   │   ├── horoscope/    — デイリーホロスコープ
│   │   ├── tarot/        — タロットリーディング
│   │   ├── compatibility/— 相性診断
│   │   └── chat/         — 質問チャット
│   └── api/              — API Routes
│       ├── webhook/line/ — LINE Bot Webhook
│       ├── reading/      — 鑑定生成API
│       └── stripe/       — Stripe Webhook
├── lib/
│   ├── astrology/        — Astrology Engine
│   │   ├── prompts/      — プロンプトファイル群
│   │   ├── chart.ts      — 星座計算
│   │   ├── reading.ts    — 鑑定生成（Claude API呼び出し）
│   │   └── session.ts    — セッション管理
│   ├── auth/             — Supabase Auth ヘルパー
│   ├── db/               — Supabase クライアント
│   └── stripe/           — Stripe ヘルパー
├── prompts/              — システムプロンプト（.md）
├── messages/             — i18n メッセージ（en.json, ja.json）
└── tests/                — Vitest + Playwright
```
