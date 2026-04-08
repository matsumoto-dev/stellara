/**
 * Tarot card data and content generation for SEO pages.
 * Covers all 78 cards: 22 Major Arcana + 56 Minor Arcana.
 */

export type Suit = "wands" | "cups" | "swords" | "pentacles";
export type Arcana = "major" | "minor";

export interface TarotCard {
  readonly slug: string;
  readonly name: string;
  readonly arcana: Arcana;
  readonly suit?: Suit;
  readonly number: number; // Major: 0–21, Minor: 1–14 (1=Ace, 11=Page, 12=Knight, 13=Queen, 14=King)
  readonly symbol: string;
  readonly keywords: readonly string[];
  readonly uprightMeaning: string;
  readonly reversedMeaning: string;
  readonly loveReading: string;
  readonly careerReading: string;
  readonly spiritualReading: string;
  readonly description: string;
  readonly element?: string;
  readonly planet?: string;
  readonly zodiac?: string;
}

// ─── Major Arcana ──────────────────────────────────────────────────────────────

export const MAJOR_ARCANA: ReadonlyArray<TarotCard> = [
  {
    slug: "the-fool",
    name: "The Fool",
    arcana: "major",
    number: 0,
    symbol: "🌟",
    keywords: ["new beginnings", "innocence", "spontaneity", "free spirit", "leap of faith"],
    uprightMeaning:
      "The Fool marks the beginning of every great journey. It invites you to step off the cliff with open arms, trusting that the universe will catch you. Now is a time for fresh starts, spontaneous action, and childlike wonder. Release the need to have every detail mapped out — the path reveals itself to those who dare to walk it.",
    reversedMeaning:
      "Reversed, The Fool cautions against recklessness or naïve decisions made without any forethought. You may be taking unnecessary risks, ignoring practical warnings, or clinging to a state of immaturity. Pause before leaping — courage and carefulness can coexist.",
    loveReading:
      "In love, The Fool heralds an exciting new chapter — a first date energy, a fresh start after heartbreak, or the beautiful vulnerability of opening your heart again. If you've been too cautious, this card encourages you to take the leap.",
    careerReading:
      "A bold new professional opportunity is emerging. Whether it's a career pivot, a startup idea, or a project that feels like a leap into the unknown — The Fool says yes. Trust your instincts and begin.",
    spiritualReading:
      "Spiritually, The Fool is pure potential — the soul at the threshold of incarnation. Meditate on beginner's mind. What would you do if you truly believed the universe supported you?",
    description:
      "The Fool is card zero — the alpha and omega of the Major Arcana. Numbered 0, it exists outside the traditional sequence, reminding us that every journey begins in the space before the first step. Associated with Uranus and the element of Air, The Fool carries the energy of pure, unfiltered possibility.",
    element: "Air",
    planet: "Uranus",
  },
  {
    slug: "the-magician",
    name: "The Magician",
    arcana: "major",
    number: 1,
    symbol: "✨",
    keywords: ["willpower", "manifestation", "skill", "resourcefulness", "focused intention"],
    uprightMeaning:
      "The Magician tells you that you already possess every tool you need. Before you stands the full array of the four suits — wand, cup, sword, and pentacle — representing fire, water, air, and earth. Your task is to channel your will with precision and bring your vision into form. The power is yours to direct.",
    reversedMeaning:
      "Reversed, The Magician warns of misdirected willpower, trickery, or a failure to use your gifts. You may be scattering your energy, experiencing self-doubt, or — in shadow — manipulating others for personal gain. Realign with authentic intention.",
    loveReading:
      "In love, The Magician speaks of deliberate, intentional connection. You have the ability to create the relationship you desire — if you apply focused attention and authentic communication. If single, use your considerable charm with integrity.",
    careerReading:
      "Your skills are fully available to you. The Magician confirms that you have everything required to succeed — now it's about focus, follow-through, and masterful execution. Negotiations and presentations go well under this card.",
    spiritualReading:
      "The Magician is the conscious mind aligned with higher will. Spiritually, this card invites you to act as a co-creator with the universe, channeling divine energy through your focused human intention.",
    description:
      "Card I of the Major Arcana, The Magician is governed by Mercury — the planet of communication, intellect, and skill. He stands at the altar of creation with one hand pointing to heaven and the other to earth, embodying the Hermetic axiom: 'As above, so below.'",
    planet: "Mercury",
  },
  {
    slug: "the-high-priestess",
    name: "The High Priestess",
    arcana: "major",
    number: 2,
    symbol: "🌙",
    keywords: ["intuition", "mystery", "subconscious", "inner knowing", "sacred feminine"],
    uprightMeaning:
      "The High Priestess guards the threshold between the conscious and unconscious worlds. She does not speak — she knows. When she appears, the message is clear: stop seeking answers outside yourself. The wisdom you need lives in the silence between your thoughts. Trust your intuition without needing to explain or justify it.",
    reversedMeaning:
      "Reversed, The High Priestess may indicate that you are disconnected from your intuition, ignoring inner signals, or allowing others to override your inner knowing. Secrets may be hidden from you. Spend time in silence and reconnect with what you actually feel to be true.",
    loveReading:
      "In love, The High Priestess speaks of depth, mystery, and what is left unspoken between two people. There may be hidden feelings, unspoken desires, or a need for more emotional depth. Trust what you sense beneath the surface rather than only what is said.",
    careerReading:
      "In career matters, The High Priestess advises patience and research. Not everything is ready to be revealed yet. Gather information quietly, trust your gut about people and opportunities, and wait for the right moment to act.",
    spiritualReading:
      "This is perhaps the most spiritually potent card in the deck. The High Priestess invites you to develop your psychic and intuitive faculties — through meditation, dream work, and sitting with the unknown. She is the keeper of esoteric wisdom.",
    description:
      "Card II, The High Priestess is ruled by the Moon, the luminary of the inner world. She sits between the pillars of Boaz (darkness) and Jachin (light), guardian of the veil between worlds. She is the embodiment of sacred, receptive wisdom.",
    planet: "Moon",
  },
  {
    slug: "the-empress",
    name: "The Empress",
    arcana: "major",
    number: 3,
    symbol: "🌿",
    keywords: ["abundance", "fertility", "nurturing", "sensuality", "creativity", "nature"],
    uprightMeaning:
      "The Empress is the great mother — lush, creative, and overflowing with life. She signals a time of abundance, beauty, and fertile potential. Whatever you are tending — a relationship, a creative project, a garden, a business — will flourish now. Connect with nature, honor your body, and allow yourself to receive.",
    reversedMeaning:
      "Reversed, The Empress may speak of creative blocks, codependency, neglecting self-care, or smothering others with excessive nurturing. Examine your relationship with abundance: are you blocking it through self-denial, or are you giving from an empty well?",
    loveReading:
      "In love, The Empress brings sensuality, warmth, and deep emotional nourishment. This is a card of committed, blossoming love — or, for singles, a signal that romantic abundance is on its way when you love yourself fully first.",
    careerReading:
      "Creativity and abundance flow through your work. The Empress favors artistic pursuits, beauty-related industries, and anything connected to growth, nature, or nurturing others. Financial prosperity and recognition for your work are likely.",
    spiritualReading:
      "The Empress invites you to find the sacred in the physical — in the body, in the earth, in sensory experience. Spiritual practice doesn't require austerity; sometimes the divine is found in a meal shared with loved ones, in a flower, in your own heartbeat.",
    description:
      "Card III, The Empress is ruled by Venus, the planet of love, beauty, and sensual pleasure. She wears a crown of twelve stars (one for each zodiac sign) and reclines in a field of wheat and pomegranates. She is the living embodiment of the natural world's generosity.",
    planet: "Venus",
  },
  {
    slug: "the-emperor",
    name: "The Emperor",
    arcana: "major",
    number: 4,
    symbol: "👑",
    keywords: ["authority", "structure", "stability", "leadership", "fatherhood", "discipline"],
    uprightMeaning:
      "The Emperor brings order from chaos. As the archetypal father figure of the tarot, he offers the gift of structure, clear boundaries, and reliable systems. Now is a time to take charge, establish foundations, and lead with authority. Discipline and consistency will yield lasting results.",
    reversedMeaning:
      "Reversed, The Emperor may indicate an abuse of power, excessive rigidity, or an inability to accept advice. Authority figures may be controlling or domineering. On a personal level, you may be struggling with structure — either imposing it too harshly on yourself or others, or resisting it entirely.",
    loveReading:
      "In love, The Emperor speaks to the need for stability, reliability, and clear commitments. This pairing works best when both partners value loyalty and consistency. If there are power imbalances in the relationship, now is the time to address them honestly.",
    careerReading:
      "The Emperor is an excellent omen for leadership, management, and any career that benefits from clear authority and well-organized systems. Promotions, business expansion, and long-term planning are all favored.",
    spiritualReading:
      "The Emperor teaches that spiritual growth also requires structure and discipline. Meditation practices, consistent ritual, and clear boundaries with your time and energy are not at odds with spirituality — they create the container in which it thrives.",
    description:
      "Card IV, The Emperor is associated with Aries and the element of Fire. He sits upon a stone throne adorned with ram heads — a symbol of his Aries rulership — surveying his domain with calm authority. He is the yang complement to The Empress, giving form to her fertile potential.",
    element: "Fire",
    zodiac: "Aries",
  },
  {
    slug: "the-hierophant",
    name: "The Hierophant",
    arcana: "major",
    number: 5,
    symbol: "⛪",
    keywords: ["tradition", "spiritual guidance", "institutions", "conformity", "inner teaching"],
    uprightMeaning:
      "The Hierophant is the keeper of established traditions and the bridge between the sacred and the earthly. His appearance may signal a time to seek guidance from a mentor, teacher, or spiritual community. There is value in time-tested wisdom, structured learning, and the support of shared belief systems.",
    reversedMeaning:
      "Reversed, The Hierophant challenges you to question orthodoxy and find your own spiritual truth. You may be feeling constrained by convention, rebelling against institutions, or discovering that the rules no longer fit your authentic path.",
    loveReading:
      "In love, this card often signals a relationship moving toward conventional commitment — engagement, marriage, or a shared set of values. It may also indicate a relationship shaped by shared religious or cultural traditions.",
    careerReading:
      "A traditional career path or established institution is highlighted. The Hierophant favors structured environments, mentorship relationships, and roles that carry social prestige or uphold institutional values.",
    spiritualReading:
      "The Hierophant calls you to explore the accumulated wisdom of spiritual traditions. Formal study, working with a teacher, or deepening your relationship with an established faith or practice can be profoundly rewarding now.",
    description:
      "Card V, The Hierophant is associated with Taurus. He is the earthly counterpart to The High Priestess — where she guards esoteric, hidden wisdom, he preserves exoteric, public spiritual tradition. His blessing hand grants permission to proceed through sacred rites.",
    zodiac: "Taurus",
  },
  {
    slug: "the-lovers",
    name: "The Lovers",
    arcana: "major",
    number: 6,
    symbol: "💕",
    keywords: ["love", "union", "alignment", "choices", "values", "harmony"],
    uprightMeaning:
      "The Lovers is much more than a romance card — it is a card of alignment. It appears when you face a significant choice that requires you to act in accordance with your deepest values. Yes, it often signals love and deep connection — but at its core, it asks: what do you truly value, and are you living in alignment with that?",
    reversedMeaning:
      "Reversed, The Lovers may indicate misalignment in values, a difficult choice being avoided, or a relationship plagued by disharmony. Are you staying in a situation out of fear rather than love? Examine where you are out of alignment with your authentic self.",
    loveReading:
      "In love, The Lovers is a powerful positive omen — soul-level connection, mutual recognition, and the beauty of two people who genuinely choose each other. For those facing relationship decisions, this card encourages choosing love aligned with your deepest truth.",
    careerReading:
      "A significant professional choice is before you. The Lovers asks you to select the path most aligned with your authentic values, not merely financial reward or social approval. A career you love is well within reach.",
    spiritualReading:
      "The Lovers speaks to the sacred union of opposites — masculine and feminine, conscious and unconscious, self and other. Spiritually, this card invites deep inner integration and the recognition that wholeness comes from embracing all parts of yourself.",
    description:
      "Card VI, The Lovers is associated with Gemini. Depicted as two figures beneath an angel's blessing, this card represents the divine witnessing of a profound choice. The choice is never simply between two people — it is always between two paths, two aspects of self.",
    element: "Air",
    zodiac: "Gemini",
  },
  {
    slug: "the-chariot",
    name: "The Chariot",
    arcana: "major",
    number: 7,
    symbol: "🏆",
    keywords: ["determination", "willpower", "triumph", "control", "direction", "momentum"],
    uprightMeaning:
      "The Chariot signals triumph through focused will and discipline. Two opposing forces — like the black and white sphinxes that pull the chariot — are being brought under conscious control. Victory is yours, but only through unwavering direction and the refusal to be pulled off course by competing desires or external turbulence.",
    reversedMeaning:
      "Reversed, The Chariot warns of losing control, scattered energy, or aggression misdirected outward. The charioteer has lost the reins. Reclaim your direction by clarifying your goal and disciplining your response to distractions.",
    loveReading:
      "In love, The Chariot suggests that you are taking the driver's seat in your romantic life — actively pursuing what you want rather than passively waiting. If there has been conflict, you have the will to navigate through it and come out stronger.",
    careerReading:
      "Career advancement and victory over competition are strongly indicated. The Chariot says: stay focused, drive forward, and don't let setbacks redirect you from your destination. Momentum is on your side.",
    spiritualReading:
      "The Chariot asks: what drives you? Spiritual progress requires harnessing both the light and shadow aspects of the self — not suppressing them, but directing them toward a unified purpose. This is the alchemical work of spiritual maturity.",
    description:
      "Card VII, The Chariot is associated with Cancer. Though Cancer is typically associated with emotional depth and nurturing, the Chariot reflects the Cardinal quality of this water sign — the capacity to initiate and move forward with determined force, protecting what it loves.",
    element: "Water",
    zodiac: "Cancer",
  },
  {
    slug: "strength",
    name: "Strength",
    arcana: "major",
    number: 8,
    symbol: "🦁",
    keywords: ["inner strength", "courage", "patience", "compassion", "gentle power"],
    uprightMeaning:
      "Strength is not brute force — it is the quiet, steady power of a person who has tamed their inner lion through love, not domination. When this card appears, you are being asked to approach a challenge or a difficult person (including yourself) with courage, patience, and compassionate inner authority. You are stronger than you think.",
    reversedMeaning:
      "Reversed, Strength may point to self-doubt, inner weakness, or an inner conflict that has not been resolved. You may be suppressing your instincts rather than integrating them, or allowing fear to substitute for genuine courage. Reclaim your quiet inner power.",
    loveReading:
      "In love, Strength speaks of a relationship that survives challenges through mutual patience, compassion, and emotional courage. It can also indicate healing after a difficult period — the lion within is being gently calmed.",
    careerReading:
      "You have the inner reserves to handle whatever professional challenge is before you. Strength advises patience over force — influence will be achieved through quiet consistency and authenticity, not aggression or manipulation.",
    spiritualReading:
      "Strength embodies the spiritual ideal of ahimsa — non-violence toward oneself and others. True power comes from a place of inner stillness and self-acceptance. This card invites you to meet your shadow with compassion rather than suppression.",
    description:
      "Card VIII (in some traditions, XI), Strength is associated with Leo and the Sun. The figure in the card tames a lion not by subduing it through force, but by gently placing her hands around its jaws — communicating love, not fear. She wears an infinity symbol above her head, suggesting that this kind of power is boundless.",
    element: "Fire",
    zodiac: "Leo",
  },
  {
    slug: "the-hermit",
    name: "The Hermit",
    arcana: "major",
    number: 9,
    symbol: "🏮",
    keywords: ["solitude", "inner guidance", "introspection", "wisdom", "soul-searching"],
    uprightMeaning:
      "The Hermit has climbed to the peak of the mountain — not to escape the world, but to find the light within that illuminates the path forward. When this card appears, you are being called inward. A period of retreat, reflection, and honest self-examination is not only timely — it is necessary. The wisdom you seek is already within you.",
    reversedMeaning:
      "Reversed, The Hermit may indicate excessive isolation, refusal to engage with others, or a loneliness that has curdled into withdrawal. You may be hiding your light or avoiding the wisdom that only comes through reconnection with others and the world.",
    loveReading:
      "In love, The Hermit signals a time of introspection about what you truly want in a relationship. If single, this is a powerful time to understand yourself more deeply before inviting a partner. In existing relationships, space and reflection strengthen the bond.",
    careerReading:
      "The Hermit calls for focused, independent work. This is not the time for networking or external validation — it is a time to develop mastery and think deeply. Your careful, considered work will be noticed in time.",
    spiritualReading:
      "The Hermit is the great spiritual seeker. His lantern holds the Star of Solomon — the light of integrated wisdom. This is a deeply auspicious card for meditation, retreat, and the serious practice of any contemplative tradition.",
    description:
      "Card IX, The Hermit is associated with Virgo. He stands alone on a snowy peak, lantern in hand, having turned away from the world not out of cynicism, but out of the profound need to find the light within. His staff — a symbol of knowledge — supports him on his solitary path.",
    element: "Earth",
    zodiac: "Virgo",
  },
  {
    slug: "wheel-of-fortune",
    name: "Wheel of Fortune",
    arcana: "major",
    number: 10,
    symbol: "🎡",
    keywords: ["cycles", "destiny", "turning points", "luck", "karma", "change"],
    uprightMeaning:
      "The Wheel of Fortune is always turning, and right now it turns in your favor. This card announces a pivotal turning point — a change of fortune, an opportunity arising from seemingly random circumstance, or the beginning of a new cycle in the great spiral of your life. What you have sown, you are beginning to reap.",
    reversedMeaning:
      "Reversed, the Wheel may indicate resistance to inevitable change, a stroke of bad luck, or a sense that circumstances are spinning out of your control. Remember: the Wheel always turns. Every low precedes a rise. Your task is to remain adaptable and refuse to be defined by temporary circumstances.",
    loveReading:
      "A fateful encounter or a significant turning point in your love life is approaching. If you have been stuck, the Wheel promises movement. Trust the timing — even when it doesn't match your own schedule.",
    careerReading:
      "A major shift in your professional landscape is underway. Fortune is moving, and the opportunities that arise now have the quality of destiny about them. Stay alert and be ready to act when the moment presents itself.",
    spiritualReading:
      "The Wheel of Fortune invites you to embrace the cyclical nature of all experience. Suffering and joy, abundance and lack — these are not failures or rewards but the very fabric of a life fully lived. Find the still point at the center of the turning wheel.",
    description:
      "Card X, The Wheel of Fortune is associated with Jupiter, the planet of expansion and good fortune. Four symbolic figures — a sphinx, a snake, Anubis, and a wheel — represent the four elements and the ceaseless rotation of time. TARO, TORA, ROTA — the letters on the wheel spell many things, all pointing to the mystery of cycles.",
    planet: "Jupiter",
  },
  {
    slug: "justice",
    name: "Justice",
    arcana: "major",
    number: 11,
    symbol: "⚖️",
    keywords: ["fairness", "truth", "cause and effect", "law", "accountability", "balance"],
    uprightMeaning:
      "Justice does not promise that life is fair — it promises that the universe is precise. What you put into the world, you receive back in kind. When this card appears, a situation is being evaluated with impartiality. Legal matters resolve fairly. Decisions made now must be grounded in truth and integrity; there are consequences to every action.",
    reversedMeaning:
      "Reversed, Justice warns of dishonesty, bias, unfair outcomes, or a refusal to accept accountability. Are you avoiding the consequences of your choices? Is a situation in your life fundamentally unjust? Name it clearly, and take the steps you can to restore balance.",
    loveReading:
      "In love, Justice calls for honesty and mutual fairness. Are both partners contributing equally? Is a past imbalance being addressed? A commitment made now — or a difficult conversation — carries long-term weight. Say what is true.",
    careerReading:
      "Legal contracts, formal evaluations, and any situation requiring a decision will go in your favor if you have acted with integrity. Justice rewards those who have done the right thing consistently. It also cautions against shortcuts.",
    spiritualReading:
      "Justice is the spiritual law of karma made visible. Every thought, word, and action creates ripples in the fabric of reality. This card invites you to take full and compassionate responsibility for your life as it is — not as a judgment, but as an invitation to conscious co-creation.",
    description:
      "Card XI (in some traditions, VIII), Justice is associated with Libra. She holds a double-edged sword — truth cuts both ways — and scales in perfect equilibrium. Her crown and throne speak of divine authority; her direct gaze meets yours without flinching. There is no hiding from Justice.",
    element: "Air",
    zodiac: "Libra",
  },
  {
    slug: "the-hanged-man",
    name: "The Hanged Man",
    arcana: "major",
    number: 12,
    symbol: "🙃",
    keywords: ["suspension", "surrender", "new perspective", "sacrifice", "pause", "enlightenment"],
    uprightMeaning:
      "The Hanged Man is suspended willingly — his face is serene, even radiant. He has chosen to pause and see the world from an entirely different angle, and what he finds there is illumination. When this card appears, stop pushing and allow yourself to rest in a state of conscious not-knowing. The breakthrough comes through surrender, not struggle.",
    reversedMeaning:
      "Reversed, The Hanged Man suggests an unwillingness to surrender, a delay caused by indecision, or a sacrifice that has been prolonged past its useful season. What are you holding on to that is keeping you stuck? The time for hanging has passed — it is time to cut yourself down.",
    loveReading:
      "In love, this card often calls for a pause before action. Are you seeing your partner clearly, or through the lens of old stories? A shift in perspective — dropping the need to be right, or viewing the relationship from your partner's eyes — transforms everything.",
    careerReading:
      "Progress in your career may feel stalled right now, but this suspension is purposeful. Use this time to learn, research, or rethink your approach. What seems like a delay is actually incubation. An insight is forming.",
    spiritualReading:
      "The Hanged Man is the seeker who voluntarily sacrifices ordinary consciousness in the pursuit of greater wisdom — like Odin hanging on Yggdrasil to receive the runes. This card is a call to spiritual surrender: let go of what you think you know.",
    description:
      "Card XII, The Hanged Man is associated with Neptune and the element of Water. He hangs from the ankh cross — a symbol of life — by one foot, his other leg crossed to form a figure 4. Around his head shines a halo of gold light. He has let go of the ordinary world and found something extraordinary in the stillness.",
    element: "Water",
    planet: "Neptune",
  },
  {
    slug: "death",
    name: "Death",
    arcana: "major",
    number: 13,
    symbol: "🌹",
    keywords: ["transformation", "endings", "transition", "release", "rebirth", "change"],
    uprightMeaning:
      "Death is the most misunderstood card in the tarot. It almost never refers to physical death — instead, it heralds a profound and necessary transformation. Something in your life has run its course: a relationship dynamic, a self-concept, a chapter of your story. The ending is real, but so is the fertile darkness that follows. Let it go completely.",
    reversedMeaning:
      "Reversed, Death may indicate a resistance to the inevitable — clinging to what must end, refusing to complete a necessary transition, or experiencing stagnation as a result. You cannot hold back the tide. The longer you resist this change, the more painful the eventual release.",
    loveReading:
      "In love, Death signals a significant transformation in how you relate — not necessarily an ending, but a deep change. Old relationship patterns must die to make way for something more authentic. If a relationship has truly ended, this card offers permission to grieve and release.",
    careerReading:
      "A chapter in your career is genuinely closing. Though this may feel uncomfortable, it clears the ground for something far better suited to who you are becoming. Don't grieve what is leaving — focus on what space is being created.",
    spiritualReading:
      "Death is the great initiator. In mystery traditions, death and rebirth are the central spiritual events. This card invites you to practice the small deaths that lead to greater aliveness — letting go of ego identifications, false certainties, and limiting stories about who you are.",
    description:
      "Card XIII, Death is associated with Scorpio. The skeleton knight rides a white horse across a field where kings, priests, and children have all fallen equally — death does not discriminate. A rising sun in the background promises dawn after even the darkest night.",
    element: "Water",
    zodiac: "Scorpio",
  },
  {
    slug: "temperance",
    name: "Temperance",
    arcana: "major",
    number: 14,
    symbol: "🌊",
    keywords: ["balance", "moderation", "patience", "purpose", "healing", "integration"],
    uprightMeaning:
      "Temperance is the angel of the middle way. She pours water between two cups in a figure-eight flow, combining opposites into a unified, living whole. This card speaks of healing, integration, and the patient process of alchemical transformation. What once seemed like incompatible parts of you are being woven together into something extraordinary.",
    reversedMeaning:
      "Reversed, Temperance warns of imbalance, excess, or impatience with the slow work of transformation. You may be forcing outcomes rather than trusting the process, or living in extremes rather than seeking the harmonious middle path.",
    loveReading:
      "Temperance in love speaks of a relationship growing through patience, compromise, and the intentional blending of two different lives. This is not the passion of lightning-strike attraction — it is the lasting warmth of two people willing to do the work.",
    careerReading:
      "A period of steady, patient effort is bearing fruit. Temperance rewards those who work methodically toward long-term goals. This is also an excellent time for creative or therapeutic work that integrates disparate elements.",
    spiritualReading:
      "Temperance is the card of the alchemist's laboratory — slow, careful, and profoundly transformative. Spiritual practice is working through you in ways you cannot yet fully see. Trust the process of integration even when progress feels imperceptible.",
    description:
      "Card XIV, Temperance is associated with Sagittarius. The angelic figure stands with one foot in water (the unconscious) and one on land (the material world), pouring the living water of the soul between two golden cups. The path behind leads to a crown — the destination of the Great Work.",
    element: "Fire",
    zodiac: "Sagittarius",
  },
  {
    slug: "the-devil",
    name: "The Devil",
    arcana: "major",
    number: 15,
    symbol: "⛓️",
    keywords: ["shadow", "attachment", "addiction", "materialism", "illusion", "liberation"],
    uprightMeaning:
      "The Devil reveals the chains that bind you — but look closely: the chains around the necks of the two figures in this card are loose. They could remove them at any moment. The question is: why don't they? This card brings awareness to the patterns, beliefs, addictions, or material attachments that keep you trapped. Awareness is the first step to liberation.",
    reversedMeaning:
      "Reversed, The Devil may signal the beginning of liberation — a recognition of and escape from a destructive pattern, toxic relationship, or addictive cycle. Alternatively, it may warn that you are too close to the shadow to see it clearly. Ask a trusted friend what they observe.",
    loveReading:
      "In love, The Devil can indicate a relationship defined by unhealthy attachment, co-dependency, or toxic patterns that both parties recognize but struggle to change. It may also speak to repressed desires or shadow dynamics being brought into the light.",
    careerReading:
      "Examine your relationship with work and money: is it fueling your growth or serving your shadow? The Devil may point to an unhealthy workplace dynamic, golden handcuffs, or a career path chosen from fear rather than genuine desire.",
    spiritualReading:
      "The Devil is a profound spiritual teacher — the mirror that shows us where we are not free. Shadow work, honest self-examination, and the willingness to look at the parts of ourselves we prefer to ignore are the practices this card calls for.",
    description:
      "Card XV, The Devil is associated with Capricorn. He is Baphomet — the bat-winged, goat-headed figure of paradox — enthroned above two bound figures who are his mirror. He is not a force that possesses you; he is what you have not yet chosen to release.",
    element: "Earth",
    zodiac: "Capricorn",
  },
  {
    slug: "the-tower",
    name: "The Tower",
    arcana: "major",
    number: 16,
    symbol: "⚡",
    keywords: ["sudden change", "upheaval", "revelation", "chaos", "breakthrough", "liberation"],
    uprightMeaning:
      "The Tower is the demolition of what was built on a false foundation. Lightning — sudden, divine, unstoppable truth — strikes the crown of a tower built on false beliefs or faulty structures. What collapses was never meant to stand. The destruction is painful, but it is ultimately liberating. What remains after The Tower is what is real.",
    reversedMeaning:
      "Reversed, The Tower may indicate a crisis averted, a slow-building collapse rather than sudden upheaval, or a fear of the necessary destruction that would bring liberation. You may be delaying an inevitable reckoning — the tower will fall; it's only a question of when and how much you have to lose.",
    loveReading:
      "In love, The Tower marks a relationship-defining moment — a sudden revelation, a confrontation with truth, or an abrupt ending of what no longer works. Though destabilizing, this clears the ground for authentic connection. What is real will survive; what was false will not.",
    careerReading:
      "A sudden professional shake-up — a job loss, an unexpected pivot, or the collapse of a plan — is actually a course correction toward something better. The Tower destroys false security to make room for genuine opportunity.",
    spiritualReading:
      "The Tower is divine intervention in your life. The structures that must fall are the ones your ego has built to avoid truth. This is not punishment — it is grace in its most confrontational form. Let it fall and find the freedom on the other side.",
    description:
      "Card XVI, The Tower is associated with Mars. The bolt of lightning that strikes the Tower's crown is the same force as the lightning bolt of Zeus — divine consciousness cutting through the illusions of the human ego. Two figures fall from the tower, entering freefall toward the unknown.",
    planet: "Mars",
  },
  {
    slug: "the-star",
    name: "The Star",
    arcana: "major",
    number: 17,
    symbol: "⭐",
    keywords: ["hope", "inspiration", "renewal", "serenity", "healing", "faith"],
    uprightMeaning:
      "After the chaos of The Tower comes the quiet, healing grace of The Star. A woman kneels by still water beneath a canopy of eight stars, pouring life back into the earth and the stream. This card is pure hope — the kind that doesn't demand guarantees. Healing is available. You are guided and supported. Believe in the future that is calling to you.",
    reversedMeaning:
      "Reversed, The Star may indicate a loss of faith, a feeling of hopelessness, or a disconnection from your own inner light. You may be waiting for external validation of a hope that only you can nourish. Reconnect with what genuinely inspires you, even in small ways.",
    loveReading:
      "The Star brings gentle, healing energy to love. After a difficult period, renewed hope and openness to love become available. This card invites you to remain vulnerable, to remain open — your authentic self is exactly what the right connection is drawn to.",
    careerReading:
      "Your gifts are genuinely needed in the world. The Star confirms that the work you find meaningful — the work that feels like a calling — is worth pursuing. Inspiration is flowing; allow it to guide your professional direction.",
    spiritualReading:
      "The Star is the purest spiritual card of the Major Arcana — the light that guides without obligation, the hope that asks for nothing in return. This card invites deep faith: not faith despite uncertainty, but faith that is born from it.",
    description:
      "Card XVII, The Star is associated with Aquarius. The central star surrounded by seven smaller stars represents Sirius — the brightest star in the night sky and a traditional symbol of guidance and spiritual illumination. The woman's nakedness signifies openness and vulnerability in the face of the divine.",
    element: "Air",
    zodiac: "Aquarius",
  },
  {
    slug: "the-moon",
    name: "The Moon",
    arcana: "major",
    number: 18,
    symbol: "🌕",
    keywords: ["illusion", "fear", "the unconscious", "confusion", "intuition", "cycles"],
    uprightMeaning:
      "The Moon illuminates only in shadow. What you see by moonlight is not false — but it is incomplete, shifting, and full of dream-logic. When The Moon appears, you are navigating a liminal space where things are not quite what they seem. Pay close attention to your dreams, your instincts, and the fears that are rising from the depths. Not everything can be seen clearly yet — trust your intuition over apparent facts.",
    reversedMeaning:
      "Reversed, The Moon suggests that the fog is beginning to lift — confusion gives way to clarity, and fears that haunted you are being revealed for what they actually are. Alternatively, it may warn of lies, deception, or a refusal to look at what the unconscious is trying to show you.",
    loveReading:
      "In love, The Moon speaks of mystery, projection, and the parts of a relationship that live in shadow. You may be seeing your partner through the lens of past wounds or fears rather than clearly. What is actually happening? Be careful of assumptions; seek truth.",
    careerReading:
      "There is uncertainty in your professional life, and some information you need may not yet be available. Trust your gut while continuing to gather facts. Avoid making major decisions until the picture becomes clearer.",
    spiritualReading:
      "The Moon is the great teacher of the unconscious mind. Dreams, archetypes, and shadow work are her domain. This card invites you to descend — willingly and with guidance — into the depths of your own psyche to retrieve what has been hidden there.",
    description:
      "Card XVIII, The Moon is associated with Pisces. A crayfish emerges from the primordial pool; a wolf and a dog howl at the face of the moon between two towers. The path winds between them toward the mountains beyond — the journey through the unconscious toward integration.",
    element: "Water",
    zodiac: "Pisces",
  },
  {
    slug: "the-sun",
    name: "The Sun",
    arcana: "major",
    number: 19,
    symbol: "☀️",
    keywords: ["joy", "success", "vitality", "clarity", "abundance", "positivity"],
    uprightMeaning:
      "The Sun is one of the most unambiguously positive cards in the entire tarot. A child rides joyfully on horseback beneath a radiant sun, arms spread wide in pure celebration of being alive. Joy, success, and vitality are flowing. What you have worked toward is coming to fruition. Life is very, very good right now — or soon will be. Receive it fully.",
    reversedMeaning:
      "Reversed, The Sun doesn't become dark — it becomes dimmed. You may be struggling to access joy, experiencing temporary setbacks that obscure the light, or blocking your own happiness through excessive self-criticism. The sun still shines; step out from whatever is casting its shadow.",
    loveReading:
      "The Sun in love is pure joy, warmth, and mutual happiness. Relationships flourish under this card — engagement, celebration, shared adventure, or the uncomplicated pleasure of being with someone who genuinely lights you up.",
    careerReading:
      "Success, recognition, and achievement are strongly indicated. Your work is shining, your efforts are being seen, and professional satisfaction is high. Creative projects, public-facing work, and leadership roles all benefit greatly from The Sun's energy.",
    spiritualReading:
      "The Sun represents the light of consciousness fully and joyfully inhabiting the body and the world. Spiritual practice need not be serious or austere — sometimes the highest spiritual act is to dance, to laugh, to be fully, ecstatically present in this one beautiful life.",
    description:
      "Card XIX, The Sun is associated with — the Sun itself. The child on horseback wears a crown of flowers and carries a red banner, representing the victory of life over death, of consciousness over shadow. Above them, the sunflowers (symbols of loyalty to the light) turn their faces upward.",
    planet: "Sun",
  },
  {
    slug: "judgement",
    name: "Judgement",
    arcana: "major",
    number: 20,
    symbol: "🎺",
    keywords: ["reflection", "reckoning", "awakening", "absolution", "calling", "renewal"],
    uprightMeaning:
      "Judgement is not condemnation — it is resurrection. The great angel's trumpet calls the dead from their graves, and they rise — not in fear, but in awe. This card signals a profound awakening, a reckoning with your past that leads not to shame but to genuine rebirth. You are being called to your higher purpose. Are you ready to answer?",
    reversedMeaning:
      "Reversed, Judgement may indicate self-judgment and self-doubt, an inability to forgive yourself or others, or a refusal to answer the call of your higher purpose. Are you still carrying old guilt? What would it take to truly put down the weight of your past?",
    loveReading:
      "In love, Judgement calls for honest reflection on what patterns have shaped your relationships — not to judge, but to truly understand and release them. A relationship may be experiencing a profound renewal, or a past connection may resurface for healing closure.",
    careerReading:
      "A calling is becoming undeniable. Judgement invites you to ask the deepest question of your professional life: what were you born to contribute? The answer may require real change — but it leads to work that feels genuinely meaningful.",
    spiritualReading:
      "Judgement is the archetype of spiritual resurrection — the moment when the soul hears its true name being called and rises to answer. This card marks a genuine awakening and invites you to fully and joyfully step into who you are becoming.",
    description:
      "Card XX, Judgement is associated with Pluto and the element of Fire. The archangel's trumpet signals not the end of the world, but the end of the old self. Below, naked figures emerge from coffins — the symbols of limiting beliefs, past identities, and closed chapters — and raise their arms in surrender and gratitude.",
    element: "Fire",
    planet: "Pluto",
  },
  {
    slug: "the-world",
    name: "The World",
    arcana: "major",
    number: 21,
    symbol: "🌍",
    keywords: ["completion", "integration", "accomplishment", "wholeness", "travel", "fulfillment"],
    uprightMeaning:
      "The World is the final card of the Major Arcana — the triumphant completion of the Fool's journey. A dancing figure surrounded by a laurel wreath holds a wand in each hand, and the four fixed signs of the zodiac watch from the corners: Taurus, Leo, Scorpio, and Aquarius. Something has been fully accomplished. A cycle is complete. Celebrate, integrate, and prepare to begin again at a higher level.",
    reversedMeaning:
      "Reversed, The World may indicate that a cycle is almost but not quite complete — something still needs attention before you can fully close this chapter. Don't rush the ending; make sure everything is genuinely finished before you move on.",
    loveReading:
      "The World in love speaks of deep fulfillment and completion — a relationship that has weathered its storms and arrived at a place of genuine, lasting happiness. It may also signal the end of a search: what you have been looking for in love is within reach.",
    careerReading:
      "A major professional accomplishment is being reached. This is the card of graduation, of arriving, of the successful conclusion of a long project or career chapter. Celebrate what you have achieved before beginning the next adventure.",
    spiritualReading:
      "The World is the soul's homecoming — the integration of all experiences, all polarities, all shadow and light, into the wholeness of your true nature. You have learned what this cycle was meant to teach. Dance with gratitude, and prepare for the next spiral of growth.",
    description:
      "Card XXI, The World is associated with Saturn, the planet of time, structure, and karmic completion. The dancer holds the tension of opposites effortlessly. The four cherubs at the corners represent the four elements, the four seasons, and the four corners of existence — all of which have been mastered and integrated.",
    element: "Earth",
    planet: "Saturn",
  },
];

// ─── Minor Arcana ──────────────────────────────────────────────────────────────

type SuitData = {
  name: Suit;
  element: string;
  domain: string;
  themeWord: string;
  planet?: string;
};

const SUIT_DATA: Record<Suit, SuitData> = {
  wands: {
    name: "wands",
    element: "Fire",
    domain: "passion, creativity, ambition, and entrepreneurial spirit",
    themeWord: "inspiration",
  },
  cups: {
    name: "cups",
    element: "Water",
    domain: "emotions, relationships, intuition, and the inner life",
    themeWord: "feeling",
  },
  swords: {
    name: "swords",
    element: "Air",
    domain: "intellect, communication, conflict, and clarity",
    themeWord: "thought",
  },
  pentacles: {
    name: "pentacles",
    element: "Earth",
    domain: "material life, work, health, and practical matters",
    themeWord: "manifestation",
  },
};

type MinorCardTemplate = {
  number: number;
  pipName: string; // "Ace", "Two", etc.
  coreKeywords: Record<Suit, readonly string[]>;
  coreUpright: Record<Suit, string>;
  coreReversed: Record<Suit, string>;
  coreLove: Record<Suit, string>;
  coreCareer: Record<Suit, string>;
  coreSpiritual: Record<Suit, string>;
};

function numberToSlugPip(n: number): string {
  const map: Record<number, string> = {
    1: "ace",
    2: "two",
    3: "three",
    4: "four",
    5: "five",
    6: "six",
    7: "seven",
    8: "eight",
    9: "nine",
    10: "ten",
    11: "page",
    12: "knight",
    13: "queen",
    14: "king",
  };
  return map[n] ?? String(n);
}

function numberToDisplayPip(n: number): string {
  const map: Record<number, string> = {
    1: "Ace",
    2: "Two",
    3: "Three",
    4: "Four",
    5: "Five",
    6: "Six",
    7: "Seven",
    8: "Eight",
    9: "Nine",
    10: "Ten",
    11: "Page",
    12: "Knight",
    13: "Queen",
    14: "King",
  };
  return map[n] ?? String(n);
}

function suitToDisplayName(suit: Suit): string {
  return suit.charAt(0).toUpperCase() + suit.slice(1);
}

const SUIT_SYMBOLS: Record<Suit, string> = {
  wands: "🔥",
  cups: "🥤",
  swords: "⚔️",
  pentacles: "⭕",
};

const PIP_UPRIGHT: Record<number, Record<Suit, string>> = {
  1: {
    wands:
      "The Ace of Wands bursts forth with raw creative energy — a spark of pure inspiration, a brand-new venture, or the ignition of a long-held passion. Now is the time to begin. Channel this fiery potential into action before the moment passes.",
    cups:
      "The Ace of Cups overflows with pure emotional potential — new love, creative inspiration flowing from the depths, or a spiritual opening of the heart. Something tender and beautiful is beginning. Let yourself receive it.",
    swords:
      "The Ace of Swords cuts through confusion with the force of absolute clarity. A breakthrough in thinking, a decisive truth, or the beginning of a new intellectual pursuit is signaled. Wield this sword with integrity and precision.",
    pentacles:
      "The Ace of Pentacles plants a seed of material abundance. A new financial opportunity, a promising new job, or the beginning of a project that will yield real-world results is available. This seed, properly tended, will flourish.",
  },
  2: {
    wands:
      "You stand at the crossroads of vision and action. The Two of Wands says you have already achieved something — now you must decide where your ambition takes you next. The world is genuinely before you. Make a plan and choose your horizon.",
    cups:
      "The Two of Cups is the card of sacred union — mutual recognition, a deep emotional connection, or the beginning of a partnership built on genuine respect and love. Two become one; this bond is full of beautiful potential.",
    swords:
      "The Two of Swords depicts a blindfolded figure holding two crossed swords — a stalemate, a decision being avoided, or a truth not yet ready to be acknowledged. You know more than you are willing to see. The swords will remain crossed until you choose.",
    pentacles:
      "The Two of Pentacles is the juggler — balancing competing priorities with impressive skill, adapting to life's constant fluctuations. Financial decisions require careful attention to multiple demands. Stay flexible; you can do this.",
  },
  3: {
    wands:
      "The Three of Wands stands at the cliff-edge, watching ships sail toward the horizon — the fruit of forward planning and bold vision. What you set in motion is now moving. Expand your perspective, think globally, and be patient as your efforts travel outward.",
    cups:
      "The Three of Cups is a celebration! Friends gather in joy, community flourishes, and creative collaboration produces something wonderful. This is a card of shared happiness — give yourself full permission to enjoy the fullness of your social and emotional life.",
    swords:
      "The Three of Swords depicts a heart pierced by three blades — grief, heartbreak, or a painful truth that must be faced. This pain is real, and it deserves to be felt. Crying is not weakness; it is the heart processing what the mind cannot yet accept.",
    pentacles:
      "The Three of Pentacles is the craftsman at work — collaboration, mastery developing through practice, and the recognition that comes from doing quality work with others. Teamwork is key; seek out those whose skills complement your own.",
  },
  4: {
    wands:
      "The Four of Wands is pure celebration — a homecoming, a milestone reached, a foundation strong enough to build upon. Allow yourself to rest in the joy of what has been accomplished. Community, harmony, and a sense of belonging are all present.",
    cups:
      "The Four of Cups shows a figure in contemplation, arms crossed, while a hand from a cloud offers a cup. What is being offered may be going unnoticed. Introspection is valuable, but be careful not to miss the blessings extended to you in moments of withdrawal.",
    swords:
      "The Four of Swords calls for rest, recuperation, and strategic withdrawal. After conflict or mental strain, the only wisdom is to lie down your swords and restore your inner reserves. This pause is not defeat — it is the preparation for what comes next.",
    pentacles:
      "The Four of Pentacles shows a figure clutching possessions with rigid hands — financial security is important, but hoarding, control, and excessive attachment to material things can block the very abundance you seek. Hold resources with an open hand.",
  },
  5: {
    wands:
      "The Five of Wands captures the chaos of competing voices and conflicting ambitions — a competitive environment, creative conflict, or a situation where everyone is trying to be heard at once. Channel this energy productively; not all conflict is destructive.",
    cups:
      "The Five of Cups stands before three spilled cups while two full ones wait behind him — grief over what has been lost, while refusing to turn and see what remains. The loss is real and should be mourned. But in time, turn and see the cups still standing.",
    swords:
      "The Five of Swords captures a hollow victory — winning in a way that costs you something essential, or a conflict in which everyone, including the apparent victor, loses something. Ask yourself: is this fight worth the cost? Choose your battles with wisdom.",
    pentacles:
      "The Five of Pentacles depicts two figures in the cold outside a stained-glass window — financial hardship, a sense of exclusion, or a time of material struggle. Reach out for help. The light through the window is not as far away as it seems.",
  },
  6: {
    wands:
      "The Six of Wands is the victory parade — public recognition, well-earned success, and the confidence that comes from having achieved something real. You have earned this moment. Receive the acknowledgment without diminishing it.",
    cups:
      "The Six of Cups is a gentle, nostalgic card — revisiting the past with fondness, reconnecting with a childhood friend or lost love, or returning to your authentic nature. The past has gifts for you, as long as you don't use nostalgia as an escape from the present.",
    swords:
      "The Six of Swords shows a ferryman moving passengers across still water — transition, recovery, and the gradual journey from turbulence to calmer ground. Things are getting better. The passage is not yet complete, but the roughest water is behind you.",
    pentacles:
      "The Six of Pentacles is the card of generosity and reciprocity — giving and receiving in equal measure. Be generous with what you have; be gracious in receiving what is offered. The scales of material exchange are in motion; watch where the balance falls.",
  },
  7: {
    wands:
      "The Seven of Wands shows a figure holding his ground against many — defending your position, standing up for your beliefs, or maintaining your advantage despite challenges. The high ground is yours; hold it with conviction and don't be worn down by opposition.",
    cups:
      "The Seven of Cups floats in a dream of possibilities — an overwhelming number of choices, pleasant fantasies, or the seductive pull of wishful thinking. Not all that glitters is real. Ground yourself and examine which options are genuinely available versus which are illusions.",
    swords:
      "The Seven of Swords depicts a figure sneaking away with stolen swords — deception, avoidance, or the taking of what belongs to another. Someone or something in your situation is not entirely honest. Look carefully; ask the questions you have been avoiding.",
    pentacles:
      "The Seven of Pentacles shows a farmer pausing to assess the crop — patient evaluation of long-term investment, deciding where to prune and where to let grow. Your efforts are bearing fruit; this is a moment of honest review before moving forward.",
  },
  8: {
    wands:
      "The Eight of Wands is rapid movement — news arriving swiftly, a situation accelerating, or a long-delayed project suddenly gaining unstoppable momentum. Prepare to move fast. The time for waiting is over; everything is in motion.",
    cups:
      "The Eight of Cups shows a figure walking away in the moonlight from a careful arrangement of cups — a courageous departure, the willingness to leave behind what no longer fulfills, and the search for something more meaningful even when what you have is 'good enough.'",
    swords:
      "The Eight of Swords depicts a blindfolded figure surrounded by swords — feeling trapped, powerless, or mentally constrained by beliefs that are not actually true. The binding is looser than it appears. The blindfold is the first thing to remove.",
    pentacles:
      "The Eight of Pentacles is the apprentice at work — dedicated practice, skill development, and the deep satisfaction of doing a job with genuine craftsmanship. Excellence is built one careful, practiced repetition at a time. Stay the course.",
  },
  9: {
    wands:
      "The Nine of Wands shows a weary but unbowed figure — battle-scarred, cautious from experience, but still standing. You have come so far; now is not the time to give up. One more effort, one more boundary held, and the destination is within reach.",
    cups:
      "The Nine of Cups is the wish card — emotional satisfaction, a dream achieved, a sense of contentment in your material and emotional life. You worked for this; allow yourself to feel genuinely satisfied. Make a wish; the stars are listening.",
    swords:
      "The Nine of Swords is the card of the 3 a.m. mind — anxiety, catastrophic thinking, and fears that seem enormous in the dark but may look different in the light of day. Reach out. Talk to someone you trust. Much of what you fear is not as inevitable as it feels right now.",
    pentacles:
      "The Nine of Pentacles is the embodiment of self-sufficiency — a figure surrounded by the abundant fruits of their own labor, comfortable in their own company, and at ease in the beauty they have created. Independence, refinement, and well-deserved luxury are present.",
  },
  10: {
    wands:
      "The Ten of Wands shows a figure struggling beneath an overwhelming bundle of wands — the weight of responsibilities, commitments, and burdens that have accumulated past the point of sustainability. You are carrying too much. Ask for help, or put some things down.",
    cups:
      "The Ten of Cups is the card of emotional fulfillment — a joyful family, a loving community, the feeling of having arrived at the life you dreamed of. This is deep, enduring happiness rooted in love. Count your blessings today.",
    swords:
      "The Ten of Swords depicts a figure fallen face-down, ten swords in their back — a painful ending, a situation that has reached its absolute lowest point. This is rock bottom. But every rock bottom has one direction: up. The sun rises in the background. The worst is over.",
    pentacles:
      "The Ten of Pentacles is generational wealth, lasting legacy, and the fullness of material and familial abundance. What you are building is meant to endure. Your efforts create a foundation not just for yourself, but for those who come after you.",
  },
  11: {
    wands:
      "The Page of Wands bursts onto the scene with irrepressible enthusiasm and the energy of a new creative adventure. They are fearless, curious, and eager — a messenger of exciting new opportunities or the creative spirit within you seeking fresh expression.",
    cups:
      "The Page of Cups is the sensitive, romantic dreamer — creative, intuitive, and full of sweet emotional surprises. A message from the heart is coming. Stay open to unexpected emotional invitations and the gentle nudges of intuition.",
    swords:
      "The Page of Swords is sharp, quick-minded, and eager to speak truth — a messenger of news, a young person with a bold opinion, or the part of you that is ready to cut through ambiguity with direct, honest communication.",
    pentacles:
      "The Page of Pentacles approaches the physical world with reverence and a student's careful attention — a new opportunity to study, to apprentice, or to begin building something of lasting material value. Be thorough; take your time; learn well.",
  },
  12: {
    wands:
      "The Knight of Wands charges forward on a fiery horse — passionate, adventurous, and utterly fearless. An exciting adventure or a passionate new chapter is underway. The danger is impulsiveness; the gift is unstoppable enthusiasm for the journey ahead.",
    cups:
      "The Knight of Cups rides toward you bearing a cup — the arrival of a romantic suitor, a message of love, or the pursuit of an ideal. He is guided by feeling above all else. When this knight arrives, follow where your heart leads.",
    swords:
      "The Knight of Swords charges forward at full speed, sword raised — a situation moving fast, sharp communication, or a person who speaks with unfiltered directness. There is power in this energy and danger in it equally. Choose your words with both honesty and care.",
    pentacles:
      "The Knight of Pentacles moves slowly and methodically — but he always arrives. He is the reliable, hardworking knight who finishes what he starts and does every task with meticulous care. Progress is steady; patience is the virtue being cultivated.",
  },
  13: {
    wands:
      "The Queen of Wands radiates magnetic confidence, creative authority, and a warm, sunny charisma that draws others to her. She knows who she is and she is not apologizing for it. Own your power; share your light; lead from the heart of your authentic passion.",
    cups:
      "The Queen of Cups sits at the water's edge, holding her ornate cup with deep introspective care. She is the emotionally wise, compassionate, and deeply intuitive feminine archetype — she knows what others feel before they speak it. Trust your feelings as information.",
    swords:
      "The Queen of Swords sits apart from the crowd, sharp-eyed and clear-minded — she has earned her clarity through experience, including pain. Her gift is honest, incisive perception uncluttered by sentiment. Think clearly and speak truthfully.",
    pentacles:
      "The Queen of Pentacles embodies nurturing abundance — she is practical, warm, and deeply grounded in the care of the material world. She creates beautiful, nourishing environments and manages resources with generous wisdom. Tend to what you love.",
  },
  14: {
    wands:
      "The King of Wands is the visionary leader — charismatic, entrepreneurial, and bold in his command of creative fire. He sees the big picture and inspires others to follow. Own your authority, speak your vision, and lead from genuine passion.",
    cups:
      "The King of Cups is the emotionally mature leader — calm on the surface of deep waters, governing his feelings with wisdom rather than repression. He is compassionate, diplomatic, and deeply empathic. This is the archetype of emotional mastery in service of others.",
    swords:
      "The King of Swords is the highest expression of air energy — clear, just, articulate, and unafraid of difficult truths. He rules with intellect, integrity, and the courage to make hard decisions clearly. Think with precision; communicate with fairness.",
    pentacles:
      "The King of Pentacles is the master of the material world — he has built something of enduring value through patience, strategic thinking, and unshakeable commitment to his domain. He is generous with his abundance and secure in his worth. Build for legacy.",
  },
};

const PIP_REVERSED: Record<number, Record<Suit, string>> = {
  1: {
    wands:
      "Reversed, the Ace of Wands suggests creative blocks, hesitation, or a spark of energy that cannot yet find a channel. A promising start may have stalled. Revisit your motivation: is the resistance external, or is it fear of your own potential?",
    cups:
      "Reversed, the Ace of Cups may indicate blocked emotions, self-love issues, or creative energy that has turned inward unproductively. You may be resisting emotional openness. What would it feel like to let yourself receive?",
    swords:
      "Reversed, the Ace of Swords may indicate confusion, miscommunication, or a mental breakthrough that has been aborted. An idea may lack direction or clarity. Return to the core truth before proceeding.",
    pentacles:
      "Reversed, the Ace of Pentacles may point to missed opportunities, poor planning, or a lack of groundedness in material matters. Examine whether fear of failure is preventing you from taking a practical first step.",
  },
  2: {
    wands:
      "Reversed, the Two of Wands indicates plans that are falling through or a fear of venturing beyond the familiar. Personal goals may feel blocked. Examine whether it is circumstances or your own resistance that is keeping you from the horizon.",
    cups:
      "Reversed, the Two of Cups may signal a breakdown in a relationship, a misalignment of values, or a connection that seemed promising but lacks genuine depth. Communication is needed.",
    swords:
      "Reversed, the Two of Swords suggests that the stalemate is breaking — information is emerging, a decision is being forced, or a truth that has been avoided is becoming impossible to ignore. Face it directly.",
    pentacles:
      "Reversed, the Two of Pentacles warns of losing balance — juggling too many things poorly, financial disorganization, or being overwhelmed by competing demands. Simplify and prioritize.",
  },
  3: {
    wands:
      "Reversed, the Three of Wands may indicate delays in plans, an unexpected setback to expansion, or frustration at plans not yet materializing. Review the strategy; something needs adjusting before your ships can sail.",
    cups:
      "Reversed, the Three of Cups may warn of gossip, overindulgence, or a social situation that has soured. A friendship or group dynamic needs careful attention.",
    swords:
      "Reversed, the Three of Swords speaks of recovery — the worst of the grief is beginning to pass. You are slowly removing the swords from your heart and learning to live with what has happened. Healing is real and possible.",
    pentacles:
      "Reversed, the Three of Pentacles suggests poor collaboration, a lack of planning, or a team that is not working in alignment. Clarify roles, rebuild communication, and address the disorganization directly.",
  },
  4: {
    wands:
      "Reversed, the Four of Wands may indicate a rocky homecoming, instability in the home environment, or celebration cut short. The foundation may need reinforcement.",
    cups:
      "Reversed, the Four of Cups suggests emerging from a period of apathy or withdrawal, newly open to the opportunities that have been waiting patiently. Something is shifting in your inner landscape.",
    swords:
      "Reversed, the Four of Swords may indicate a refusal to rest when rest is needed, mental burnout, or a recovery period that is not being honored. Your body and mind need more time. Grant them the mercy of rest.",
    pentacles:
      "Reversed, the Four of Pentacles suggests releasing unhealthy attachment to material security — generosity emerging, the grip loosening, or a recognition that control has become its own cage.",
  },
  5: {
    wands:
      "Reversed, the Five of Wands may indicate conflict coming to resolution, or alternatively, an avoidance of necessary confrontation. Examine which is true in your situation.",
    cups:
      "Reversed, the Five of Cups suggests beginning to move beyond grief — the ability to finally look at the two cups still standing and find something to hold onto. Moving through, not past.",
    swords:
      "Reversed, the Five of Swords may indicate reconciliation after conflict or the lingering consequences of a past dishonest victory. Is there damage to repair? Now is the time.",
    pentacles:
      "Reversed, the Five of Pentacles signals recovery from financial hardship or a renewed sense of hope after a difficult period. Help is near. Open the door.",
  },
  6: {
    wands:
      "Reversed, the Six of Wands warns against arrogance, an ego inflated by success, or a victory that is not as secure as it appears. Humility is wisdom.",
    cups:
      "Reversed, the Six of Cups may indicate an unhealthy attachment to the past, difficulty moving forward, or a return to old situations that no longer serve. The past has gifts; it also has traps.",
    swords:
      "Reversed, the Six of Swords suggests resistance to necessary transition or a return to turbulent waters. The calmer shore is real — but something internal is blocking the crossing.",
    pentacles:
      "Reversed, the Six of Pentacles warns of strings-attached giving, charity used as control, or an imbalance of generosity in a relationship or financial situation.",
  },
  7: {
    wands:
      "Reversed, the Seven of Wands suggests overwhelm by opposition, difficulty holding your position, or an exhaustion with having to constantly defend yourself. Reassess whether the hill you're defending is worth the cost.",
    cups:
      "Reversed, the Seven of Cups may indicate coming out of confusion — seeing through illusions, making a clearer choice, or recognizing that you have been avoiding a necessary decision.",
    swords:
      "Reversed, the Seven of Swords suggests that deception is being uncovered, a confession is coming, or consequences of past dishonest behavior are arriving. Truth surfaces eventually.",
    pentacles:
      "Reversed, the Seven of Pentacles may indicate impatience with long-term investments, reassessing whether effort is producing sufficient return, or cutting losses on something that is no longer viable.",
  },
  8: {
    wands:
      "Reversed, the Eight of Wands may indicate delays, miscommunications, or scattered energy. Things are moving, but not in a coordinated direction. Slow down and clarify before acting.",
    cups:
      "Reversed, the Eight of Cups may suggest a return to a situation left behind, or difficulty finding the courage to walk away from something emotionally depleting. What would it take to choose your own wellbeing?",
    swords:
      "Reversed, the Eight of Swords indicates liberation from a self-created mental prison — the blindfold is being removed, the bonds loosening, the inner critic losing its authority. You are freer than you knew.",
    pentacles:
      "Reversed, the Eight of Pentacles warns of poor-quality work, lack of focus, or the misapplication of skills. Are you doing work you care about? Meaningless repetition without intention produces nothing of lasting value.",
  },
  9: {
    wands:
      "Reversed, the Nine of Wands suggests that paranoia has replaced healthy vigilance, or that past wounds are preventing you from trusting a situation that is actually safe. Examine what you are actually protecting yourself from.",
    cups:
      "Reversed, the Nine of Cups may indicate dissatisfaction despite apparent success, materialism masking deeper emptiness, or wishes that have been granted but don't bring the satisfaction expected.",
    swords:
      "Reversed, the Nine of Swords suggests that anxiety is beginning to lift, the worst of the mental torment passing, or a recognition that catastrophic thinking has been distorting reality. Seek support; the weight can be shared.",
    pentacles:
      "Reversed, the Nine of Pentacles may indicate financial dependency, work-life imbalance, or the feeling that material success has come at the expense of deeper fulfillment. What have you sacrificed in the pursuit of security?",
  },
  10: {
    wands:
      "Reversed, the Ten of Wands suggests the beginning of laying down an unsustainable burden — delegation, release, or a renegotiation of responsibilities. You cannot carry everything alone indefinitely. Ask for help.",
    cups:
      "Reversed, the Ten of Cups warns of a disconnect beneath a seemingly perfect emotional surface — family tension, misaligned values within a group, or an idealized vision of happiness that doesn't match reality.",
    swords:
      "Reversed, the Ten of Swords may indicate a very slow recovery from a painful ending, a refusal to accept finality, or the dawning recognition that the situation, while bad, was not as absolute as it felt.",
    pentacles:
      "Reversed, the Ten of Pentacles may indicate family financial conflict, a legacy being squandered, or short-term thinking undermining long-term stability. What are the values beneath the material reality of your family system?",
  },
  11: {
    wands:
      "Reversed, the Page of Wands may show creative energy without follow-through, a lack of direction in new pursuits, or news that gets lost in transit. Ground the inspiration into a concrete plan.",
    cups:
      "Reversed, the Page of Cups warns of emotional immaturity, unrealistic romantic fantasies, or a message that doesn't arrive as hoped. Check in with emotional reality rather than what you wish were true.",
    swords:
      "Reversed, the Page of Swords may indicate a tendency to use sharp words without wisdom, spreading rumors, or a young energy that mistakes rudeness for honesty. Direct communication requires both truth and kindness.",
    pentacles:
      "Reversed, the Page of Pentacles suggests distraction from study, procrastination on practical matters, or a promising start that loses momentum. Recommit to the work with discipline.",
  },
  12: {
    wands:
      "Reversed, the Knight of Wands warns of impulsive actions, reckless decisions, or a tendency to charge ahead without adequate preparation. Harness the fire without letting it burn what matters.",
    cups:
      "Reversed, the Knight of Cups may indicate emotional manipulation, unrealistic romantic idealization, or a charming offer that lacks substance beneath the surface. Look for what is real beneath what is poetic.",
    swords:
      "Reversed, the Knight of Swords moving too fast causes damage — words delivered without compassion, decisions made without sufficient information. Slow down; think before you speak or act.",
    pentacles:
      "Reversed, the Knight of Pentacles may indicate excessive caution, dullness, or being stuck in a routine that no longer serves growth. Methodical has its place; stagnation does not.",
  },
  13: {
    wands:
      "Reversed, the Queen of Wands may indicate a loss of confidence, jealousy, or a domineering use of personal power. Reconnect with the authentic fire within before acting from insecurity.",
    cups:
      "Reversed, the Queen of Cups may suggest emotional manipulation, a tendency to become overwhelmed by others' feelings, or using emotional sensitivity as a means of control. Establish healthy boundaries with compassion.",
    swords:
      "Reversed, the Queen of Swords warns of cold, calculated cruelty — intelligence weaponized against others, or a tendency to cut with words where healing was possible. Soften the sword with genuine empathy.",
    pentacles:
      "Reversed, the Queen of Pentacles may indicate neglect of domestic or practical matters, materialism prioritized over relationship, or smothering others with excessive material provision in place of genuine emotional presence.",
  },
  14: {
    wands:
      "Reversed, the King of Wands may indicate an abuse of authority, reckless leadership, or a tendency toward arrogance and domineering behavior. True leadership is in service of others, not the satisfaction of the ego.",
    cups:
      "Reversed, the King of Cups warns of emotional manipulation, passive aggression, or the emotional volatility of someone who has not done the inner work. Emotional maturity requires honest self-examination.",
    swords:
      "Reversed, the King of Swords may indicate a misuse of power — cold, authoritarian decisions made without regard for human impact, or an inability to move beyond intellectual analysis into genuine wisdom.",
    pentacles:
      "Reversed, the King of Pentacles warns of materialism taken to its extreme — a person who has achieved material success but lost touch with deeper values, or whose financial control has become a means of domination.",
  },
};

const PIP_LOVE: Record<number, Record<Suit, string>> = {
  1: {
    wands: "A passionate new romantic spark or the reignition of desire in an existing relationship. Say yes to the invitation.",
    cups: "New love is beginning — pure, open-hearted, and full of tender potential. Allow yourself to receive this beautiful opening.",
    swords: "A conversation that needed to happen is finally happening — honest communication clears the air and creates space for genuine connection.",
    pentacles: "A relationship becoming more stable, practical, and committed. Building a shared material life together begins now.",
  },
  2: {
    wands: "A decision is needed about the relationship's direction. The future is open; choose the horizon that feels most true.",
    cups: "A soulful connection, a proposal, or a deep mutual recognition between two people. This is the card of true meeting.",
    swords: "An avoidance of a necessary conversation. The tension cannot be resolved until someone speaks the truth — be the one who does.",
    pentacles: "Balancing relationship priorities with practical life demands. Both require attention; neither can be sacrificed entirely.",
  },
  3: {
    wands: "Long-distance love, or a relationship expanding to include travel, shared adventure, and new horizons.",
    cups: "Joyful celebration with friends and loved ones; a loving social circle; wedding festivities; female friendship celebrated.",
    swords: "Grief after a loss — a breakup, a betrayal, or painful information about a relationship. Feel what needs to be felt.",
    pentacles: "A relationship strengthened through working together toward shared goals; teamwork in love is beautiful.",
  },
  4: {
    wands: "A wedding, engagement, celebration of love, or the stable happiness of a home shared with someone you love.",
    cups: "Emotional withdrawal or taking a relationship for granted. Look up from your introspection; someone is offering something real.",
    swords: "A needed break in a relationship — space, rest, and recovery. This pause, honored fully, allows the relationship to breathe.",
    pentacles: "Financial security in the relationship is valued, but excessive control or material focus may be limiting emotional intimacy.",
  },
  5: {
    wands: "Passionate conflict or playful competition in love. The spark is still alive; channel the energy productively.",
    cups: "Grief about what has been lost in a relationship while failing to see what remains. Look also at what is still standing.",
    swords: "A painful conflict with a hollow victory for one side. The relationship pays a price. Is winning more important than connecting?",
    pentacles: "Going through a difficult material period together — financial strain can either divide or deepen a partnership.",
  },
  6: {
    wands: "Public recognition of a relationship; pride in a partnership; a love that is seen and celebrated by the community.",
    cups: "A sweet reconnection with a past love, or a relationship colored by nostalgia and the sweetness of shared history.",
    swords: "Moving forward together after a difficult period; healing transition navigated as a team.",
    pentacles: "Give and receive with equal grace. A generous relationship; be careful that generosity doesn't become imbalance.",
  },
  7: {
    wands: "Defending your relationship from external pressures or third-party interference. Stand your ground.",
    cups: "Too many options in love, or idealizing romantic possibilities rather than committing to what is real.",
    swords: "Be alert to dishonesty in a relationship — yours or your partner's. Something is being concealed.",
    pentacles: "Assessing whether the emotional investment is being reciprocated. Patience in love, with honest evaluation.",
  },
  8: {
    wands: "Romantic news arriving quickly; a relationship moving faster than expected; communication accelerates.",
    cups: "Leaving a relationship that no longer nourishes, or the courage to walk away from emotional comfort that has become stagnation.",
    swords: "Feeling trapped in a relationship by fear or belief. The truth: you have more freedom than you are allowing yourself.",
    pentacles: "Dedicating yourself to the craft of love — putting in the consistent, quality attention that a relationship deserves.",
  },
  9: {
    wands: "Maintaining healthy emotional boundaries in love; protecting your heart from repeated hurt while staying open.",
    cups: "Emotional fulfillment; a relationship deeply satisfying to the heart. Your romantic wish is granted.",
    swords: "Anxiety about a relationship — 3 a.m. fears that may or may not be grounded in reality. Talk to someone you trust.",
    pentacles: "Self-sufficient and content; attracting a partner from a place of wholeness rather than need.",
  },
  10: {
    wands: "Carrying too much of the emotional weight in a relationship. Share the load or it will break you.",
    cups: "Deep, lasting family happiness and emotional fulfillment. The love you have been building has arrived in its fullness.",
    swords: "The painful ending of a relationship that has run its course. Allow the grief; begin the healing.",
    pentacles: "Generational love; building a family legacy; long-term committed relationship creating lasting security.",
  },
  11: {
    wands: "A youthful, excitable romantic energy — a new flirtation, a surprising invitation, or the rekindling of playful desire.",
    cups: "A sweet, romantic message or gesture; the arrival of love in an unexpected, delightful form.",
    swords: "A direct, honest communication in love that cuts through ambiguity. Say what you mean.",
    pentacles: "A relationship taking a slow but grounded step toward greater commitment and material reality.",
  },
  12: {
    wands: "A passionate, adventurous lover arriving — or the passionate, adventurous part of yourself ready to pursue what it wants.",
    cups: "A romantic idealist arriving — charming, emotionally expressive, pursuing love with a poetic heart.",
    swords: "A direct, fast-moving situation in love — communication is the key; say what is true without cruelty.",
    pentacles: "A reliable, steady romantic energy — not flashy, but genuinely dependable. Consistency is its own form of devotion.",
  },
  13: {
    wands: "A confident, charismatic partner; or the invitation to embody your own magnetic, authentic power in love.",
    cups: "Deep emotional wisdom in a relationship; a partner (or yourself) who holds space for feeling with rare compassion.",
    swords: "Clarity and honesty in a relationship — someone who loves you enough to tell you the truth.",
    pentacles: "A partner who loves through nurturing, providing, and creating a beautiful, safe environment.",
  },
  14: {
    wands: "A dynamic, visionary partner; or the call to lead with passion and authenticity in your love life.",
    cups: "Emotional maturity and mastery in love — a calm, wise partner who loves with depth and steady equanimity.",
    swords: "Intellectual honesty and clarity — a relationship built on direct communication and mutual respect.",
    pentacles: "A stable, secure, generous partnership; love expressed through material provision and lasting commitment.",
  },
};

const PIP_CAREER: Record<number, Record<Suit, string>> = {
  1: {
    wands: "A bold new project, business idea, or creative direction is calling. Say yes and begin.",
    cups: "A career that aligns with your emotional values or creative gifts is starting to take shape.",
    swords: "A new intellectual project, communication role, or truth-telling opportunity begins.",
    pentacles: "A new job offer, financial opportunity, or practical investment deserves serious consideration.",
  },
  2: {
    wands: "Planning for the next phase of your career; a decision about direction is needed. Choose boldly.",
    cups: "A meaningful professional partnership or creative collaboration is being offered.",
    swords: "A difficult professional decision is being avoided. The stalemate will only resolve with direct engagement.",
    pentacles: "Managing multiple financial or practical responsibilities requires skillful prioritization.",
  },
  3: {
    wands: "Expansion is underway — think bigger; your professional reach is extending.",
    cups: "Team success, creative collaboration, and a joyful workplace community.",
    swords: "A professional betrayal or painful setback. Feel it, process it, and then get back to work.",
    pentacles: "Collaborative expertise producing high-quality work; recognition for craftsmanship in a team environment.",
  },
  4: {
    wands: "A career milestone celebrated; a stable professional foundation to build upon.",
    cups: "An opportunity may be going unnoticed while you are lost in complacency or dissatisfaction.",
    swords: "A necessary professional retreat — sabbatical, recovery time, or deliberate strategic pause.",
    pentacles: "Financial security valued, but be careful that risk-aversion doesn't block genuine opportunity.",
  },
  5: {
    wands: "A competitive environment requiring strategy and persistence. Stay focused on your unique contribution.",
    cups: "Professional disappointment; refocus on the projects and opportunities that remain.",
    swords: "A workplace conflict with no true winner. Choose resolution over victory.",
    pentacles: "Financial difficulty; seek help and remember that this period is temporary.",
  },
  6: {
    wands: "Public professional recognition; a well-earned promotion or award.",
    cups: "A return to a former employer or field; skills from the past creating value in the present.",
    swords: "A difficult professional transition moving toward smoother waters.",
    pentacles: "Generosity in professional resources; a mentor relationship; reciprocal exchange of support.",
  },
  7: {
    wands: "Holding your professional position against competition or criticism. Defend with confidence.",
    cups: "Too many professional options creating paralysis. Assess what is genuinely feasible.",
    swords: "Workplace deception or a hidden agenda. Protect your work and professional integrity.",
    pentacles: "Assessing long-term professional investments; patient evaluation of career strategy.",
  },
  8: {
    wands: "Career news arriving fast; a situation accelerating; deadlines intensifying — stay focused.",
    cups: "Leaving a professional situation that no longer aligns; the courage to walk away from a comfortable but unfulfilling job.",
    swords: "A mental block in your career; breaking free requires changing your thinking, not your circumstances.",
    pentacles: "Deep professional development; skill-building through focused, repetitive, high-quality practice.",
  },
  9: {
    wands: "Maintaining professional resilience in a demanding environment; the finish line is closer than it feels.",
    cups: "Professional satisfaction and fulfillment; a career milestone achieved.",
    swords: "Work-related anxiety; catastrophic thinking about professional outcomes that need reality-testing.",
    pentacles: "Self-made success; the fruits of independent effort; a refinement of professional identity.",
  },
  10: {
    wands: "Professional burnout; carrying too many responsibilities. Delegation is not weakness — it is strategy.",
    cups: "Deep personal fulfillment in work that aligns with your values and emotional life.",
    swords: "A professional ending that felt devastating is actually clearing the ground for something better.",
    pentacles: "Lasting financial legacy; building something of enduring professional value.",
  },
  11: {
    wands: "News of an exciting new professional opportunity; fresh creative energy entering the workplace.",
    cups: "A creative invitation or emotionally meaningful professional communication.",
    swords: "Sharp, fast professional communication; news of intellectual significance.",
    pentacles: "A new financial opportunity or practical learning opportunity worth pursuing carefully.",
  },
  12: {
    wands: "A fast-moving entrepreneurial energy; charging toward a new professional adventure.",
    cups: "A creatively driven professional pursuit; following your passion with genuine heart.",
    swords: "Quick, decisive professional action; a fast-moving communication environment.",
    pentacles: "Steady, methodical professional progress; a reliable approach to career advancement.",
  },
  13: {
    wands: "A confident, creative leader or the invitation to step fully into your own professional authority.",
    cups: "A compassionate, emotionally intelligent approach to leadership and professional relationships.",
    swords: "Intellectual authority and honest professional communication; a wise, clear voice in the workplace.",
    pentacles: "Practical, nurturing professional leadership; managing resources with generous wisdom.",
  },
  14: {
    wands: "Visionary leadership; commanding a professional space with passionate authority and creative direction.",
    cups: "Emotionally mature professional leadership; calm authority in a complex interpersonal environment.",
    swords: "Intellectual authority and fair professional judgment; speaking difficult truths with integrity.",
    pentacles: "Mastery of the material domain; stable, generous professional leadership that creates lasting value.",
  },
};

const PIP_SPIRITUAL: Record<number, Record<Suit, string>> = {
  1: {
    wands: "A spiritual awakening is sparking — the first flame of genuine seeking. Honor the impulse; don't let it die.",
    cups: "The heart is opening to the divine — a spiritual gift of emotional receptivity is being offered.",
    swords: "Mental clarity cutting through spiritual confusion; a truth that sets you free.",
    pentacles: "Grounding spiritual practice in the physical body and material world; sacred embodiment.",
  },
  2: {
    wands: "A spiritual crossroads; a decision about the direction of your spiritual path.",
    cups: "A spiritual partnership or teacher relationship of deep significance.",
    swords: "Spiritual indecision; the need to choose a path rather than standing still between two truths.",
    pentacles: "Integrating spiritual practice with the demands of material life; finding the sacred in the everyday.",
  },
  3: {
    wands: "Expanding your spiritual horizons; the call to learn from traditions beyond your own.",
    cups: "Spiritual community and celebration; the joy of shared devotion.",
    swords: "A spiritual test or trial; the purification that comes through genuine suffering.",
    pentacles: "Spiritual practice as craft; the development of mastery through consistent, devoted effort.",
  },
  4: {
    wands: "Celebrating a spiritual milestone; a period of grounded, joyful integration.",
    cups: "Spiritual complacency; missing the divine gifts available in the present moment.",
    swords: "Spiritual retreat; rest as a sacred act; the divine permission to stop and simply be.",
    pentacles: "Materialism potentially blocking spiritual growth; examine attachment to the physical.",
  },
  5: {
    wands: "The spiritual challenge of competing inner voices; finding your authentic path through the noise.",
    cups: "A spiritual dark night of the soul; the grief that precedes genuine spiritual deepening.",
    swords: "A spiritual conflict or ethical dilemma; the search for truth in a difficult situation.",
    pentacles: "A material difficulty as a spiritual teacher; finding faith in the midst of scarcity.",
  },
  6: {
    wands: "Spiritual confidence earned through genuine experience; sharing your gifts with the world.",
    cups: "Reconnecting with the innocence and wonder of your early spiritual life.",
    swords: "A spiritual transition toward calmer, clearer inner waters.",
    pentacles: "Spiritual generosity; sharing what you have received; the dharma of giving.",
  },
  7: {
    wands: "Spiritual resilience; defending your beliefs and practice against doubt or external pressure.",
    cups: "Spiritual illusions versus genuine insight; discerning what is real guidance from wishful thinking.",
    swords: "The shadow in spiritual life; examining self-deception or spiritual bypassing.",
    pentacles: "Patient long-term spiritual cultivation; assessing the fruits of your practice honestly.",
  },
  8: {
    wands: "Spiritual acceleration; insights arriving rapidly; a quickening of spiritual energy.",
    cups: "The spiritual journey as a movement away from the comfortable and toward the genuine.",
    swords: "Liberation from a spiritually limiting belief system; breaking free from mental bondage.",
    pentacles: "Spiritual discipline as a path to mastery; devoted, consistent practice yields deep fruits.",
  },
  9: {
    wands: "Spiritual vigilance; maintaining your practice even when tired or discouraged.",
    cups: "The contentment of spiritual fulfillment; a wish of the soul has been granted.",
    swords: "The spiritual discipline of working with fear and anxiety as teachers rather than enemies.",
    pentacles: "Spiritual self-sufficiency; the inner abundance that comes from genuine spiritual development.",
  },
  10: {
    wands: "The spiritual lesson of releasing burdens; the dharma of right action without attachment to outcome.",
    cups: "Spiritual fulfillment and the sense of coming home; the soul recognizing its place of belonging.",
    swords: "The spiritual death that precedes resurrection; the darkest night before the inevitable dawn.",
    pentacles: "Spiritual legacy; the contribution of your life's work to the fabric of existence.",
  },
  11: {
    wands: "A young, eager spiritual seeker; the beginner's mind as a spiritual virtue.",
    cups: "A psychic opening; an invitation to develop intuitive and spiritual receptivity.",
    swords: "A spiritually significant mental insight; truth arriving like a breath of fresh air.",
    pentacles: "Beginning a grounded, embodied spiritual practice; learning to find the sacred in practical life.",
  },
  12: {
    wands: "Adventurous spiritual seeking; following spiritual fire with courage and curiosity.",
    cups: "A spiritually idealistic journey; following the heart toward a higher vision.",
    swords: "A decisive spiritual movement; cutting through illusion with the sword of discernment.",
    pentacles: "Slow, steady spiritual progress; the knight who always arrives, however long it takes.",
  },
  13: {
    wands: "The divine feminine as fire — passionate, creative, and fully alive in spiritual expression.",
    cups: "The spiritually wise, emotionally attuned teacher; the compassionate witness to all that is felt.",
    swords: "The clear spiritual vision of one who has faced and integrated great suffering.",
    pentacles: "The sacred feminine as nurturer of earth and body; finding divinity in the material.",
  },
  14: {
    wands: "Spiritual leadership through passionate, authentic vision; inspiring others to their own fire.",
    cups: "Spiritual mastery through emotional equanimity; the still center beneath the moving waters.",
    swords: "Spiritual authority through clarity and integrity; speaking truth in service of all.",
    pentacles: "Spiritual mastery expressed through material stewardship; the sacred in the built world.",
  },
};

function buildMinorCard(suit: Suit, number: number): TarotCard {
  const pip = numberToDisplayPip(number);
  const suitDisplay = suitToDisplayName(suit);
  const slug = `${numberToSlugPip(number)}-of-${suit}`;
  const name = `${pip} of ${suitDisplay}`;
  const sd = SUIT_DATA[suit];

  const description =
    number <= 10
      ? `The ${name} belongs to the ${suitDisplay} suit, which governs ${sd.domain}. As a ${sd.element} suit card, its energy is fundamentally oriented toward ${sd.themeWord}. This pip card carries the concentrated numerological energy of the number ${number} — ${getNumerologyDescription(number)} — expressed through the lens of ${sd.element}.`
      : `The ${name} is a court card of the ${suitDisplay} suit, representing a person, energy, or approach characterized by ${sd.element} qualities at the ${getPipTitle(number)} level of mastery. ${getCourierDescription(number, sd.element, suit)}`;

  return {
    slug,
    name,
    arcana: "minor",
    suit,
    number,
    symbol: SUIT_SYMBOLS[suit],
    keywords: PIP_UPRIGHT[number]
      ? extractKeywords(PIP_UPRIGHT[number][suit])
      : [sd.themeWord, "development", "energy"],
    uprightMeaning: PIP_UPRIGHT[number]?.[suit] ?? `The ${name} brings its ${sd.element} energy to the theme of ${sd.themeWord}.`,
    reversedMeaning: PIP_REVERSED[number]?.[suit] ?? `Reversed, the ${name} asks you to examine where ${sd.element} energy is blocked or misdirected.`,
    loveReading: PIP_LOVE[number]?.[suit] ?? `In love, the ${name} speaks to how ${sd.element} energy shapes your emotional connections.`,
    careerReading: PIP_CAREER[number]?.[suit] ?? `In career, the ${name} brings ${sd.element} energy to your professional world.`,
    spiritualReading: PIP_SPIRITUAL[number]?.[suit] ?? `Spiritually, the ${name} invites you to explore ${sd.element} as a spiritual teacher.`,
    description,
    element: sd.element,
  };
}

function getNumerologyDescription(n: number): string {
  const desc: Record<number, string> = {
    1: "pure potential and new beginnings",
    2: "duality, choice, and partnership",
    3: "creativity, expression, and expansion",
    4: "stability, structure, and foundation",
    5: "change, challenge, and transformation",
    6: "harmony, nurturing, and equilibrium",
    7: "reflection, assessment, and inner wisdom",
    8: "momentum, movement, and mastery",
    9: "near-completion, resilience, and culmination",
    10: "completion, transition, and cyclical ending",
  };
  return desc[n] ?? "complex energy";
}

function getPipTitle(n: number): string {
  if (n === 11) return "Page (student)";
  if (n === 12) return "Knight (seeker)";
  if (n === 13) return "Queen (mature feminine)";
  if (n === 14) return "King (mature masculine)";
  return "";
}

function getCourierDescription(n: number, element: string, suit: Suit): string {
  const suitContext: Record<Suit, string> = {
    wands: "This figure channels passion, creative drive, and entrepreneurial fire.",
    cups: "This figure channels emotional intelligence, intuition, and empathic sensitivity.",
    swords: "This figure channels intellectual clarity, honest communication, and the sword of discernment.",
    pentacles: "This figure channels practical wisdom, material mastery, and a deep respect for the physical world.",
  };
  const maturity: Record<number, string> = {
    11: `As a Page, they are a curious student of ${element} energy — enthusiastic and eager, but still learning their craft.`,
    12: `As a Knight, they pursue ${element} energy with passionate, sometimes single-minded dedication.`,
    13: `As a Queen, they have integrated ${element} energy into mature, compassionate, embodied wisdom.`,
    14: `As a King, they have mastered ${element} energy and now wield it with authority in service of a larger domain.`,
  };
  return `${suitContext[suit]} ${maturity[n] ?? ""}`;
}

function extractKeywords(text: string): string[] {
  const firstSentence = text.split(".")[0] ?? text;
  const words = firstSentence
    .toLowerCase()
    .replace(/[^a-z\s-]/g, "")
    .split(/\s+/)
    .filter((w) => w.length > 4)
    .slice(0, 5);
  return words.length > 0 ? words : ["energy", "growth", "awareness"];
}

// ─── Build all 56 Minor Arcana cards ─────────────────────────────────────────

const SUITS: ReadonlyArray<Suit> = ["wands", "cups", "swords", "pentacles"];

export const MINOR_ARCANA: ReadonlyArray<TarotCard> = SUITS.flatMap((suit) =>
  Array.from({ length: 14 }, (_, i) => buildMinorCard(suit, i + 1))
);

// ─── Combined deck ────────────────────────────────────────────────────────────

export const ALL_CARDS: ReadonlyArray<TarotCard> = [...MAJOR_ARCANA, ...MINOR_ARCANA];

export const CARD_INDEX: Record<string, number> = Object.fromEntries(
  ALL_CARDS.map((c, i) => [c.slug, i])
);

// ─── Lookup helpers ───────────────────────────────────────────────────────────

export function getCardBySlug(slug: string): TarotCard | null {
  const idx = CARD_INDEX[slug];
  return idx !== undefined ? (ALL_CARDS[idx] ?? null) : null;
}

export function getAllTarotSlugs(): ReadonlyArray<{ readonly card: string }> {
  return ALL_CARDS.map((c) => ({ card: c.slug }));
}

export function parseTarotSlug(card: string): TarotCard | null {
  return getCardBySlug(card);
}

// ─── SEO metadata ─────────────────────────────────────────────────────────────

export interface TarotPageMeta {
  readonly title: string;
  readonly metaDescription: string;
  readonly slug: string;
}

export function getTarotPageMeta(card: TarotCard): TarotPageMeta {
  const arcanaLabel = card.arcana === "major" ? "Major Arcana" : `${suitToDisplayName(card.suit!)} (Minor Arcana)`;
  return {
    title: `${card.name} Tarot Card Meaning — Upright, Reversed & Love`,
    metaDescription: `Discover the full meaning of the ${card.name} tarot card. Upright and reversed interpretations, love & relationship reading, career guidance, and spiritual insight from Stellara.`,
    slug: card.slug,
  };
}

// ─── Page content ─────────────────────────────────────────────────────────────

export interface TarotPageContent {
  readonly card: TarotCard;
  readonly meta: TarotPageMeta;
  readonly faqs: ReadonlyArray<{ readonly q: string; readonly a: string }>;
}

export function generateTarotPageContent(card: TarotCard): TarotPageContent {
  const meta = getTarotPageMeta(card);

  const faqs = [
    {
      q: `What does the ${card.name} tarot card mean?`,
      a: `The ${card.name} is a card of ${card.keywords.slice(0, 3).join(", ")}. ${card.uprightMeaning.split(".")[0]}.`,
    },
    {
      q: `What does the ${card.name} mean in a love reading?`,
      a: card.loveReading,
    },
    {
      q: `What does the ${card.name} reversed mean?`,
      a: card.reversedMeaning.split(".").slice(0, 2).join(".") + ".",
    },
    {
      q: `What does the ${card.name} mean for career?`,
      a: card.careerReading,
    },
    {
      q: `What is the spiritual meaning of the ${card.name}?`,
      a: card.spiritualReading,
    },
  ];

  return { card, meta, faqs };
}
