import { describe, expect, it } from "vitest";
import { getPrivacyContent, getTermsContent } from "@/lib/legal/content";

describe("getTermsContent", () => {
  it("should return a title", () => {
    const content = getTermsContent();
    expect(content.title).toBe("利用規約");
  });

  it("should return a lastUpdated date", () => {
    const content = getTermsContent();
    expect(content.lastUpdated).toBeDefined();
    expect(content.lastUpdated.length).toBeGreaterThan(0);
  });

  it("should contain all required sections", () => {
    const content = getTermsContent();
    const headings = content.sections.map((s) => s.heading);

    expect(headings).toContain("1. サービスの定義");
    expect(headings).toContain("2. 利用資格");
    expect(headings).toContain("6. 返金ポリシー");
    expect(headings).toContain("7. 娯楽目的の免責事項");
    expect(headings).toContain("13. 準拠法");
    expect(headings).toContain("14. お問い合わせ");
  });

  it("should use Stellara brand name", () => {
    const content = getTermsContent();
    const allText = content.sections.map((s) => s.content).join(" ");
    expect(allText).toContain("Stellara");
    expect(allText).not.toContain("{BRAND}");
  });

  it("should include entertainment disclaimer", () => {
    const content = getTermsContent();
    const disclaimer = content.sections.find((s) => s.heading.includes("娯楽"));
    expect(disclaimer).toBeDefined();
    expect(disclaimer?.content).toContain("娯楽目的");
    expect(disclaimer?.content).toContain("代替となるものではない");
  });

  it("should include contact email", () => {
    const content = getTermsContent();
    const contact = content.sections.find((s) => s.heading.includes("お問い合わせ"));
    expect(contact?.content).toContain("hello@stellara.chat");
  });

  it("should include EU Art.16(m) section", () => {
    const content = getTermsContent();
    const eu = content.sections.find((s) => s.heading.includes("EU/EEA"));
    expect(eu).toBeDefined();
    expect(eu?.content).toContain("撤回権");
  });

  it("should include AI-generated content disclaimer", () => {
    const content = getTermsContent();
    const ai = content.sections.find((s) => s.heading.includes("AI生成コンテンツ"));
    expect(ai).toBeDefined();
    expect(ai?.content).toContain("現状のまま");
  });
});

describe("getPrivacyContent", () => {
  it("should return a title", () => {
    const content = getPrivacyContent();
    expect(content.title).toBe("プライバシーポリシー");
  });

  it("should contain all required sections", () => {
    const content = getPrivacyContent();
    const headings = content.sections.map((s) => s.heading);

    expect(headings).toContain("1. 収集するデータ");
    expect(headings).toContain("2. データの利用目的");
    expect(headings).toContain("3. 第三者との共有");
    expect(headings).toContain("4. データの保持期間");
    expect(headings).toContain("5. 利用者の権利");
    expect(headings).toContain("11. お問い合わせ");
  });

  it("should use Stellara brand name", () => {
    const content = getPrivacyContent();
    const allText = content.sections.map((s) => s.content).join(" ");
    expect(allText).toContain("Stellara");
    expect(allText).not.toContain("{BRAND}");
  });

  it("should disclose Anthropic data sharing", () => {
    const content = getPrivacyContent();
    const sharing = content.sections.find((s) => s.heading.includes("第三者"));
    expect(sharing?.content).toContain("Anthropic");
    expect(sharing?.content).toContain("モデルの学習には使用されない");
  });

  it("should include CCPA section", () => {
    const content = getPrivacyContent();
    const ccpa = content.sections.find((s) => s.heading.includes("カリフォルニア"));
    expect(ccpa).toBeDefined();
    expect(ccpa?.content).toContain("CCPA");
  });

  it("should include cookie policy", () => {
    const content = getPrivacyContent();
    const cookies = content.sections.find((s) => s.heading.includes("クッキー"));
    expect(cookies).toBeDefined();
    expect(cookies?.content).toContain("必須セッションクッキー");
  });

  it("should include data retention info", () => {
    const content = getPrivacyContent();
    const retention = content.sections.find((s) => s.heading.includes("保持期間"));
    expect(retention?.content).toContain("30日");
    expect(retention?.content).toContain("90日");
  });
});
