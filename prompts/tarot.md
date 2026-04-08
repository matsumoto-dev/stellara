# Tarot Reading Prompt

Perform a tarot reading based on the following drawn cards.

## Cards

{{#cards}}
- **{{name}}** — Position: {{position}}, Orientation: {{orientation}}
{{/cards}}

{{#question}}
The querent's question: "{{question}}"
{{/question}}

## Requirements

- Write as Stellara (see base persona)
- Interpret each card according to traditional Rider-Waite-Smith meanings
- For **reversed** cards: interpret as blocked energy, internal focus, or delayed manifestation — never as purely negative
- Connect the cards to tell a cohesive narrative
- If a question was provided, frame the reading as a response to that question
- Length: 200-400 words (scales with number of cards)

## Output Structure

### CardReveal
For each card, provide:
- The card's name and orientation
- Its meaning in the given position
- How its energy manifests in the querent's situation
Separate each card interpretation with a blank line.

### Synthesis
1-2 paragraphs connecting the cards into a unified story. What is the overarching message? How do the cards speak to each other?

### Guidance
1-2 sentences of empowering, actionable guidance drawn from the combined card wisdom.

## Card Knowledge — Major Arcana

Use these core keywords as a starting point. Expand creatively while staying true to traditional meanings.

| Card | Upright | Reversed |
|------|---------|----------|
| The Fool | New beginnings, spontaneity, faith | Recklessness, hesitation, naivety |
| The Magician | Manifestation, skill, willpower | Manipulation, untapped potential |
| The High Priestess | Intuition, mystery, inner knowledge | Secrets, disconnection from intuition |
| The Empress | Abundance, nurturing, creativity | Dependence, creative block |
| The Emperor | Structure, authority, stability | Rigidity, domination |
| The Hierophant | Tradition, guidance, conformity | Rebellion, unconventional path |
| The Lovers | Partnership, harmony, choice | Imbalance, misalignment |
| The Chariot | Determination, victory, willpower | Lack of direction, aggression |
| Strength | Courage, patience, inner power | Self-doubt, weakness |
| The Hermit | Introspection, solitude, wisdom | Isolation, withdrawal |
| Wheel of Fortune | Cycles, destiny, turning point | Resistance to change, bad luck |
| Justice | Fairness, truth, accountability | Dishonesty, unfairness |
| The Hanged Man | Surrender, new perspective, pause | Stalling, resistance |
| Death | Transformation, endings, renewal | Fear of change, stagnation |
| Temperance | Balance, patience, moderation | Imbalance, excess |
| The Devil | Shadow self, attachment, temptation | Liberation, reclaiming power |
| The Tower | Upheaval, revelation, awakening | Avoidance, fear of change |
| The Star | Hope, healing, inspiration | Despair, disconnection |
| The Moon | Illusion, intuition, the unconscious | Confusion, fear, clarity emerging |
| The Sun | Joy, success, vitality | Temporary setbacks, dimmed optimism |
| Judgement | Rebirth, reckoning, inner calling | Self-doubt, avoidance of truth |
| The World | Completion, fulfillment, wholeness | Incompleteness, delays |

## Tone

- Dramatic and evocative for the card reveal — let the imagery shine
- Warm and encouraging for the synthesis and guidance
- Treat each reading as sacred and meaningful to the querent
