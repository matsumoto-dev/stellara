/**
 * Zodiac compatibility data and content generation for SEO pages.
 * Covers all 144 sign × sign combinations.
 */

export type ZodiacSign =
  | "aries"
  | "taurus"
  | "gemini"
  | "cancer"
  | "leo"
  | "virgo"
  | "libra"
  | "scorpio"
  | "sagittarius"
  | "capricorn"
  | "aquarius"
  | "pisces";

export type Element = "fire" | "earth" | "air" | "water";
export type Quality = "cardinal" | "fixed" | "mutable";

export interface SignData {
  readonly name: ZodiacSign;
  readonly displayName: string;
  readonly symbol: string;
  readonly dates: string;
  readonly element: Element;
  readonly quality: Quality;
  readonly rulingPlanet: string;
  readonly traits: readonly string[];
  readonly strengths: readonly string[];
  readonly challenges: readonly string[];
  readonly loveStyle: string;
  readonly description: string;
}

export const SIGNS: ReadonlyArray<SignData> = [
  {
    name: "aries",
    displayName: "Aries",
    symbol: "♈",
    dates: "March 21 – April 19",
    element: "fire",
    quality: "cardinal",
    rulingPlanet: "Mars",
    traits: ["bold", "passionate", "independent", "pioneering", "courageous"],
    strengths: ["natural leader", "energetic", "enthusiastic", "direct"],
    challenges: ["impatient", "impulsive", "short-tempered"],
    loveStyle:
      "Aries loves passionately and pursues with relentless energy. They need a partner who can match their fire and respect their independence.",
    description:
      "Aries is the first sign of the zodiac — a trailblazer driven by Mars, the planet of action and desire. Bold, passionate, and fiercely independent, Aries charges into life with unmatched enthusiasm.",
  },
  {
    name: "taurus",
    displayName: "Taurus",
    symbol: "♉",
    dates: "April 20 – May 20",
    element: "earth",
    quality: "fixed",
    rulingPlanet: "Venus",
    traits: ["loyal", "sensual", "patient", "reliable", "determined"],
    strengths: ["dependable", "grounded", "affectionate", "practical"],
    challenges: ["stubborn", "possessive", "resistant to change"],
    loveStyle:
      "Taurus loves with deep loyalty and sensual devotion. They build relationships slowly but with lasting commitment, craving stability and physical connection.",
    description:
      "Taurus is ruled by Venus, the planet of love and beauty. Grounded in the earth element, Taurus builds a life of comfort, loyalty, and enduring pleasure — and they bring that same steadfast energy to every relationship.",
  },
  {
    name: "gemini",
    displayName: "Gemini",
    symbol: "♊",
    dates: "May 21 – June 20",
    element: "air",
    quality: "mutable",
    rulingPlanet: "Mercury",
    traits: ["curious", "witty", "adaptable", "expressive", "playful"],
    strengths: ["communicative", "versatile", "intellectually stimulating", "fun"],
    challenges: ["inconsistent", "indecisive", "scattered"],
    loveStyle:
      "Gemini falls in love with the mind first. They need mental stimulation, lively conversation, and a partner who can keep up with their ever-curious, ever-changing spirit.",
    description:
      "Gemini is ruled by Mercury, the messenger planet, giving them a gift for words, wit, and connection. As an air sign, they live in the realm of ideas — always curious, always adapting, and endlessly fascinating.",
  },
  {
    name: "cancer",
    displayName: "Cancer",
    symbol: "♋",
    dates: "June 21 – July 22",
    element: "water",
    quality: "cardinal",
    rulingPlanet: "the Moon",
    traits: ["nurturing", "intuitive", "empathetic", "protective", "sensitive"],
    strengths: ["deeply caring", "loyal", "emotionally intelligent", "intuitive"],
    challenges: ["moody", "overly sensitive", "clingy"],
    loveStyle:
      "Cancer loves with their whole heart, offering deep emotional safety and unwavering loyalty. They need a partner who values vulnerability and creates a true sense of home.",
    description:
      "Cancer is ruled by the Moon, making them the most emotionally attuned sign of the zodiac. As a water sign, they feel everything deeply — and their greatest gift is the nurturing shelter they offer those they love.",
  },
  {
    name: "leo",
    displayName: "Leo",
    symbol: "♌",
    dates: "July 23 – August 22",
    element: "fire",
    quality: "fixed",
    rulingPlanet: "the Sun",
    traits: ["charismatic", "generous", "loyal", "dramatic", "creative"],
    strengths: ["warm-hearted", "natural performer", "inspiring", "protective"],
    challenges: ["prideful", "attention-seeking", "domineering"],
    loveStyle:
      "Leo loves grandly and generously, making their partner feel like royalty. They need admiration in return — a relationship where both people shine.",
    description:
      "Leo is ruled by the Sun itself — radiant, warm, and magnetic. As a fixed fire sign, Leo burns with creative passion and a desire to live life at full intensity, inspiring everyone in their orbit.",
  },
  {
    name: "virgo",
    displayName: "Virgo",
    symbol: "♍",
    dates: "August 23 – September 22",
    element: "earth",
    quality: "mutable",
    rulingPlanet: "Mercury",
    traits: ["analytical", "practical", "devoted", "precise", "helpful"],
    strengths: ["reliable", "thoughtful", "intelligent", "hardworking"],
    challenges: ["critical", "overly anxious", "perfectionist"],
    loveStyle:
      "Virgo expresses love through service and attention to detail. They show up consistently, notice what others miss, and dedicate themselves fully to the people they care about.",
    description:
      "Virgo is ruled by Mercury, channeling that planet's analytical precision into a deep desire to understand and improve the world. As an earth sign, Virgo builds love with careful intention — every act of care is a love letter.",
  },
  {
    name: "libra",
    displayName: "Libra",
    symbol: "♎",
    dates: "September 23 – October 22",
    element: "air",
    quality: "cardinal",
    rulingPlanet: "Venus",
    traits: ["diplomatic", "charming", "idealistic", "social", "fair-minded"],
    strengths: ["balanced", "gracious", "romantic", "a natural mediator"],
    challenges: ["indecisive", "avoidant of conflict", "people-pleasing"],
    loveStyle:
      "Libra is the sign of partnership — they come alive in relationships and seek a deep, balanced union. Romance, beauty, and harmony are their love languages.",
    description:
      "Libra is ruled by Venus and governs the realm of relationships. As an air sign, Libra approaches love intellectually and aesthetically — always seeking the perfect balance between self and other.",
  },
  {
    name: "scorpio",
    displayName: "Scorpio",
    symbol: "♏",
    dates: "October 23 – November 21",
    element: "water",
    quality: "fixed",
    rulingPlanet: "Pluto",
    traits: ["intense", "perceptive", "passionate", "magnetic", "secretive"],
    strengths: ["deeply loyal", "transformative", "psychologically insightful", "powerful"],
    challenges: ["jealous", "controlling", "slow to forgive"],
    loveStyle:
      "Scorpio loves with total intensity and demands the same in return. They seek soul-level connection — nothing surface, nothing casual. When they commit, it's for life.",
    description:
      "Scorpio is ruled by Pluto, the planet of transformation and depth. As a fixed water sign, Scorpio dives beneath the surface of everything — seeking truth, power, and the kind of love that changes you forever.",
  },
  {
    name: "sagittarius",
    displayName: "Sagittarius",
    symbol: "♐",
    dates: "November 22 – December 21",
    element: "fire",
    quality: "mutable",
    rulingPlanet: "Jupiter",
    traits: ["adventurous", "optimistic", "philosophical", "free-spirited", "honest"],
    strengths: ["enthusiastic", "open-minded", "inspiring", "generous"],
    challenges: ["commitment-averse", "blunt", "restless"],
    loveStyle:
      "Sagittarius loves freely and adventurously. They need a partner who is their equal in curiosity and independence — someone who expands their world rather than limiting it.",
    description:
      "Sagittarius is ruled by Jupiter, the planet of expansion and wisdom. As a mutable fire sign, Sagittarius moves through life like an arrow — forward, purposeful, and always seeking the next horizon.",
  },
  {
    name: "capricorn",
    displayName: "Capricorn",
    symbol: "♑",
    dates: "December 22 – January 19",
    element: "earth",
    quality: "cardinal",
    rulingPlanet: "Saturn",
    traits: ["ambitious", "disciplined", "responsible", "strategic", "patient"],
    strengths: ["reliable", "determined", "practical", "a long-term thinker"],
    challenges: ["emotionally reserved", "work-obsessed", "rigid"],
    loveStyle:
      "Capricorn builds love the same way they build everything — slowly, carefully, and to last. They show devotion through loyalty, provision, and consistent presence.",
    description:
      "Capricorn is ruled by Saturn, the planet of structure and time. As a cardinal earth sign, Capricorn is the architect of the zodiac — always building toward something meaningful, including lasting love.",
  },
  {
    name: "aquarius",
    displayName: "Aquarius",
    symbol: "♒",
    dates: "January 20 – February 18",
    element: "air",
    quality: "fixed",
    rulingPlanet: "Uranus",
    traits: ["innovative", "humanitarian", "independent", "intellectual", "eccentric"],
    strengths: ["visionary", "open-minded", "loyal to their values", "original"],
    challenges: ["emotionally detached", "unpredictable", "contrarian"],
    loveStyle:
      "Aquarius loves on their own terms — deeply committed to the right person, but unwilling to sacrifice their freedom or individuality. They need a partner who is also their intellectual equal and co-conspirator.",
    description:
      "Aquarius is ruled by Uranus, the planet of revolution and awakening. As a fixed air sign, Aquarius is the visionary of the zodiac — always three steps ahead, always asking 'what if?' about love and life alike.",
  },
  {
    name: "pisces",
    displayName: "Pisces",
    symbol: "♓",
    dates: "February 19 – March 20",
    element: "water",
    quality: "mutable",
    rulingPlanet: "Neptune",
    traits: ["empathetic", "dreamy", "artistic", "compassionate", "intuitive"],
    strengths: ["deeply understanding", "romantic", "spiritually attuned", "selfless"],
    challenges: ["escapist", "overly idealistic", "boundary-less"],
    loveStyle:
      "Pisces loves with boundless compassion and romantic idealism. They seek a soul-deep union and offer unconditional love — but need a partner who won't take advantage of their giving nature.",
    description:
      "Pisces is ruled by Neptune, the planet of dreams and transcendence. As the last sign of the zodiac, Pisces carries all the emotional wisdom of the signs before it — offering a love that is tender, deep, and otherworldly.",
  },
];

export const SIGN_INDEX: Record<ZodiacSign, number> = {
  aries: 0,
  taurus: 1,
  gemini: 2,
  cancer: 3,
  leo: 4,
  virgo: 5,
  libra: 6,
  scorpio: 7,
  sagittarius: 8,
  capricorn: 9,
  aquarius: 10,
  pisces: 11,
};

/** Compute overall compatibility score (1–5) based on angular separation. */
function computeScore(idxA: number, idxB: number): number {
  const diff = Math.min(Math.abs(idxA - idxB), 12 - Math.abs(idxA - idxB));
  // Aspect scoring: trine=5, sextile=4, conjunction/opposition=3, square/quincunx=2
  const table: Record<number, number> = {
    0: 3, // conjunction
    1: 2, // semi-sextile
    2: 4, // sextile
    3: 2, // square
    4: 5, // trine
    5: 2, // quincunx
    6: 3, // opposition
  };
  return table[diff] ?? 3;
}

/** Element-based relationship description. */
function getElementDynamic(elA: Element, elB: Element): string {
  if (elA === elB) {
    const descriptions: Record<Element, string> = {
      fire: "two fire signs meet, the chemistry is immediate and electric. You understand each other's drive and passion instinctively, though you may need to take turns leading.",
      earth:
        "two earth signs connect, there is a natural sense of stability and shared values. You build something real together — slowly, deliberately, and with lasting results.",
      air: "two air signs come together, intellectual sparks fly. Conversation flows effortlessly, ideas multiply, and the mental bond is strong. The challenge is grounding your connection in the physical world.",
      water:
        "two water signs merge, the emotional depth is extraordinary. You intuit each other's feelings without words, creating a bond that is healing, intense, and profoundly intimate.",
    };
    return `When ${descriptions[elA]}`;
  }
  const pairs: Partial<Record<string, string>> = {
    "fire-air":
      "Fire and air are natural allies. Air fans fire's flames — your connection is stimulating, lively, and full of mutual encouragement. Fire brings passion; air brings perspective.",
    "air-fire":
      "Air and fire create a dynamic, energizing bond. You challenge each other to grow, communicate openly, and pursue life with enthusiasm. This is a pairing that rarely runs out of things to say or do.",
    "earth-water":
      "Earth and water are a deeply compatible pairing. Water nourishes the earth, and earth gives water form and direction. Together, you create something stable, nurturing, and emotionally rich.",
    "water-earth":
      "Water and earth share a natural affinity. Your connection is grounded yet emotionally alive — you build security together while honoring the depth of feeling that water brings to the table.",
    "fire-earth":
      "Fire and earth can be a challenging but growth-oriented pairing. Fire's spontaneity can unsettle earth's need for stability, while earth's caution may feel limiting to fire. The reward for working through this tension is a relationship that is both passionate and enduring.",
    "earth-fire":
      "Earth and fire bring very different energies to the table. Earth seeks consistency; fire seeks adventure. But when both partners honor the other's nature, this contrast creates a powerful balance — grounding passion, and igniting practicality.",
    "fire-water":
      "Fire and water can be a steamy but delicate pairing. Fire's boldness and water's emotional depth can produce intense attraction, but without care, steam becomes conflict. The key is learning to honor each other's fundamental nature.",
    "water-fire":
      "Water and fire create a dynamic of emotional intensity and passionate action. Water softens fire's edges; fire inspires water to take bold steps. This relationship requires tenderness and courage in equal measure.",
    "air-earth":
      "Air and earth approach life from different angles. Air thinks in abstractions; earth thinks in concrete realities. This pairing can create wonderful balance — or frustrating disconnection. The key is mutual respect for each other's way of processing the world.",
    "earth-air":
      "Earth and air are an intriguing contrast. Earth brings stability and practicality; air brings ideas and adaptability. When this pairing works, it produces a relationship that is both grounded and intellectually alive.",
    "air-water":
      "Air and water can struggle to find common ground. Air processes through logic; water processes through emotion. You may sometimes feel like you're speaking different languages — but the effort to truly understand each other can be deeply rewarding.",
    "water-air":
      "Water and air bring heart and mind into dialogue. Water's emotional intuition and air's intellectual approach can complement each other beautifully — if both partners remain curious about the other's inner world.",
  };
  const key = `${elA}-${elB}`;
  return pairs[key] ?? "These two signs bring complementary energies that, with understanding, can create a uniquely balanced relationship.";
}

export interface CompatibilityData {
  readonly sign1: SignData;
  readonly sign2: SignData;
  readonly score: number;
  readonly slug: string;
  readonly title: string;
  readonly metaDescription: string;
}

export function getCompatibilityData(sign1: ZodiacSign, sign2: ZodiacSign): CompatibilityData {
  const s1 = SIGNS[SIGN_INDEX[sign1]];
  const s2 = SIGNS[SIGN_INDEX[sign2]];
  const score = computeScore(SIGN_INDEX[sign1], SIGN_INDEX[sign2]);
  const slug = `${sign1}-and-${sign2}`;
  const stars = "★".repeat(score) + "☆".repeat(5 - score);

  return {
    sign1: s1,
    sign2: s2,
    score,
    slug,
    title: `${s1.displayName} and ${s2.displayName} Compatibility — What the Stars Reveal`,
    metaDescription: `Discover ${s1.displayName} and ${s2.displayName} compatibility ${stars}. Explore their emotional bond, communication style, love potential, and what the cosmos says about this pairing.`,
  };
}

export interface CompatibilityPageContent {
  readonly intro: string;
  readonly elementDynamic: string;
  readonly emotionalSection: string;
  readonly communicationSection: string;
  readonly loveSection: string;
  readonly strengthsSection: string;
  readonly challengesSection: string;
  readonly tipsSection: string;
  readonly faqs: ReadonlyArray<{ readonly q: string; readonly a: string }>;
}

export function generateCompatibilityContent(
  s1: SignData,
  s2: SignData,
  score: number
): CompatibilityPageContent {
  const scoreLabel =
    score === 5
      ? "one of the most naturally harmonious pairings in the zodiac"
      : score === 4
        ? "a highly compatible and mutually enriching match"
        : score === 3
          ? "a pairing of magnetic tension and complementary potential"
          : "a challenging but potentially transformative connection";

  const intro = `${s1.displayName} (${s1.dates}) and ${s2.displayName} (${s2.dates}) form ${scoreLabel}. ${s1.displayName} is a ${s1.quality} ${s1.element} sign ruled by ${s1.rulingPlanet}, while ${s2.displayName} is a ${s2.quality} ${s2.element} sign guided by ${s2.rulingPlanet}. Together, they weave a story written in the stars — one of ${s1.traits[0]} meeting ${s2.traits[0]}, and ${s1.traits[1]} encountering ${s2.traits[1]}. Whether you are exploring a new connection or deepening a long bond, the cosmos has much to say about this pairing.`;

  const elementDynamic = getElementDynamic(s1.element, s2.element);

  const emotionalScore = score >= 4 ? "exceptionally deep" : score === 3 ? "nuanced and evolving" : "a place of genuine growth";
  const emotionalSection = `Emotionally, ${s1.displayName} and ${s2.displayName} create ${emotionalScore} terrain. ${s1.displayName}'s ${s1.element} nature means they process feelings through ${s1.element === "fire" ? "action and expression" : s1.element === "earth" ? "quiet consistency and physical presence" : s1.element === "air" ? "conversation and intellectual understanding" : "deep intuition and emotional attunement"}. ${s2.displayName}, guided by ${s2.element}, tends toward ${s2.element === "fire" ? "passionate, immediate emotional responses" : s2.element === "earth" ? "steady, reliable emotional expression" : s2.element === "air" ? "a more detached but thoughtful emotional processing" : "oceanic emotional depth and empathy"}. When these two learn to honor their different emotional languages, the result is a bond that feels both safe and alive.`;

  const communicationSection = `Communication between ${s1.displayName} and ${s2.displayName} reflects their ${s1.quality} and ${s2.quality} natures. ${s1.displayName} tends to be ${s1.quality === "cardinal" ? "direct and initiative-taking" : s1.quality === "fixed" ? "deliberate and firm in their views" : "adaptable and willing to shift perspectives"} in conversation. ${s2.displayName} brings ${s2.quality === "cardinal" ? "a similarly decisive energy" : s2.quality === "fixed" ? "an unwavering commitment to their viewpoint" : "flexibility and openness to new ideas"}. ${score >= 4 ? "Their conversational styles tend to complement each other, creating dialogue that is both stimulating and productive." : score === 3 ? "There may be moments of miscommunication, but with patience and curiosity, they discover a shared language." : "They may sometimes find themselves talking past each other, but this friction can spark deeper honesty if both are willing to listen."}`;

  const loveSection = `In love, ${s1.displayName} ${s1.loveStyle.toLowerCase().split(".")[0]}. ${s2.displayName} ${s2.loveStyle.toLowerCase().split(".")[0]}. ${score >= 4 ? `This creates a beautiful dynamic where both partners feel seen, valued, and inspired. The physical and emotional chemistry between ${s1.displayName} and ${s2.displayName} tends to develop naturally and deepen over time.` : score === 3 ? `This pairing brings a powerful magnetic attraction — often intense and memorable — though sustaining that spark requires intentional effort from both sides.` : `The attraction is real, but the path to lasting romance requires both partners to stretch beyond their comfort zones. When they do, the love they build is more resilient for having been tested.`}`;

  const strengthsSection = `The greatest strengths this pairing brings: ${s1.displayName} contributes ${s1.strengths[0]} and ${s1.strengths[1]}, while ${s2.displayName} adds ${s2.strengths[0]} and ${s2.strengths[1]}. Together, they ${score >= 4 ? "create a relationship where each person's best qualities are amplified rather than diminished." : score === 3 ? "balance each other in ways that neither expected — their differences become assets when framed as complementary rather than conflicting." : "have an opportunity to develop traits they don't naturally possess, growing into fuller versions of themselves through the encounter."}`;

  const challengesSection = `Every pairing has its shadows. ${s1.displayName}'s tendency to be ${s1.challenges[0]} can create friction with ${s2.displayName}'s inclination toward ${s2.challenges[0]}. ${score <= 2 ? `These differences are amplified by the elemental tension between ${s1.element} and ${s2.element} — a tension that, while challenging, contains the seeds of profound mutual understanding.` : score === 3 ? `Awareness of these patterns is the first step. Most conflicts can be traced back to unspoken needs or differing love languages rather than fundamental incompatibility.` : `Fortunately, their natural compatibility means these challenges rarely reach crisis point. A little self-awareness goes a long way for this pairing.`}`;

  const tipsSection = `For ${s1.displayName} and ${s2.displayName} to thrive: First, ${s1.displayName} should honor ${s2.displayName}'s need for ${s2.element === "earth" ? "stability and predictability" : s2.element === "water" ? "emotional depth and security" : s2.element === "fire" ? "spontaneity and recognition" : "intellectual freedom and space"}. Second, ${s2.displayName} should appreciate ${s1.displayName}'s expression of ${s1.element === "earth" ? "steady devotion and practical care" : s1.element === "water" ? "emotional attunement and intuition" : s1.element === "fire" ? "passion and directness" : "ideas and curiosity"}. Third, both partners benefit from direct, vulnerable communication — the stars show potential, but it's the two of you who make the magic.`;

  const faqs = [
    {
      q: `Are ${s1.displayName} and ${s2.displayName} compatible?`,
      a: `${s1.displayName} and ${s2.displayName} have a compatibility score of ${score} out of 5. They are ${scoreLabel}. Like all zodiac pairings, individual birth charts, life experience, and emotional maturity play important roles in determining true compatibility.`,
    },
    {
      q: `What attracts ${s1.displayName} to ${s2.displayName}?`,
      a: `${s1.displayName} is often drawn to ${s2.displayName}'s ${s2.traits[0]} and ${s2.traits[2]} qualities. There is a sense that ${s2.displayName} offers something ${s1.displayName} genuinely values — whether that is stability, excitement, depth, or lightness.`,
    },
    {
      q: `What are the biggest challenges for ${s1.displayName} and ${s2.displayName}?`,
      a: `The main challenges arise from ${s1.displayName}'s ${s1.challenges[0]} tendencies and ${s2.displayName}'s ${s2.challenges[0]} patterns. These can create friction, but awareness and open communication transform most of these challenges into growth opportunities.`,
    },
    {
      q: `Can ${s1.displayName} and ${s2.displayName} have a long-term relationship?`,
      a: `Absolutely. ${score >= 4 ? `Their natural compatibility makes long-term love very achievable. The stars strongly support this pairing in commitment.` : score === 3 ? `With mutual respect and willingness to meet each other halfway, ${s1.displayName} and ${s2.displayName} can build something genuinely lasting.` : `While this requires more intentional effort than naturally harmonious pairings, the depth they can reach together makes the work deeply worthwhile.`}`,
    },
    {
      q: `What is the best thing about a ${s1.displayName}–${s2.displayName} relationship?`,
      a: `The best thing is the way they each bring out dimensions of the other that might not emerge otherwise. ${s1.displayName} brings ${s1.strengths[0]}; ${s2.displayName} brings ${s2.strengths[0]}. Together, they are more than the sum of their parts.`,
    },
  ];

  return {
    intro,
    elementDynamic,
    emotionalSection,
    communicationSection,
    loveSection,
    strengthsSection,
    challengesSection,
    tipsSection,
    faqs,
  };
}

/** All 144 valid slug pairs for generateStaticParams. */
export function getAllCompatibilitySlugs(): ReadonlyArray<{ readonly pair: string }> {
  const params: { pair: string }[] = [];
  for (const s1 of SIGNS) {
    for (const s2 of SIGNS) {
      params.push({ pair: `${s1.name}-and-${s2.name}` });
    }
  }
  return params;
}

/** Parse a slug like "aries-and-taurus" into [ZodiacSign, ZodiacSign] or null. */
export function parseCompatibilitySlug(pair: string): [ZodiacSign, ZodiacSign] | null {
  const match = pair.match(/^([a-z]+)-and-([a-z]+)$/);
  if (!match) return null;
  const a = match[1] as ZodiacSign;
  const b = match[2] as ZodiacSign;
  if (!(a in SIGN_INDEX) || !(b in SIGN_INDEX)) return null;
  return [a, b];
}
