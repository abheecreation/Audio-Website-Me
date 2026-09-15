import { ScriptScene, VoiceOption, StyleOption, ScriptPreset } from '../types';

export const INITIAL_SINHALA_SCENES: ScriptScene[] = [
  {
    id: 1,
    title: "1. Intro & Childhood Memories",
    subtitle: "ආරම්භය සහ Project IGI හඳුන්වාදීම",
    content: `යාලුවනේ... අද අපි පටන් ගන්නෙ, මගේ childhood memories වල තියෙන iconic tactical shooting game එකක්... Project IGI – I'm Going In.

මේ game එකේ අපි play කරන්නෙ David Jones කියන former SAS operative කෙනෙක්ව.

ඒ කියන්නෙ මේක නිකන් enemyලාට shoot කරගෙන ඉස්සරහට යන සාමාන්‍ය shooting game එකක් නෙමෙයි.

මේකෙ stealth, strategy, weapons, surveillance... මේ හැම දෙයක්ම use කරලා mission එක complete කරන්න වෙනවා.

ඉතින් අද අපේ ගමන පටන් ගන්නෙ Project IGI එකේ පළවෙනි mission එකෙන්.`,
  },
  {
    id: 2,
    title: "2. Mission 1 Background & Infiltration",
    subtitle: "Operation එකේ background එක සහ Infiltration",
    content: `Mission එක start වෙනවත් එක්කම අපිට මුලින්ම ලැබෙන්නෙ මේ operation එකේ background එක.

අපේ main target එක තමයි, මේ military facility එක ඇතුළේ සිද්ධ වෙන operation එක ගැන information gather කරගෙන ඉස්සරහට යන එක.

මේ වෙලාවේ game එක අපිව location එකට ඇතුළත් කරන්නේ direct combat එකකට නෙමෙයි.

ඒ වෙනුවට, environment එක observe කරලා, enemiesලාගේ positions හඳුනාගෙන, තමන් යන්න ඕන route එක තීරණය කරගෙන ඉස්සරහට යන්න තමයි අවධානය දෙන්නෙ.

ඒක තමයි Project IGI එකේ ලස්සනම දෙයක්.`,
  },
  {
    id: 3,
    title: "3. Map Scanning & Binoculars Tactics",
    subtitle: "සිතියම කියවීම සහ දුරදක්නය භාවිතය",
    content: `ඔයාට පේනවා ඇති, මේ game එකේ map එකෙන් අපිට area එක ගැන හොඳ understanding එකක් ගන්න පුළුවන්.

අපිට ඉස්සරහට තියෙන buildings, roads, enemy positions වගේ දේවල් identify කරගෙන move වෙන්න පුළුවන්.

ඒ වගේම David Jones ළඟ තියෙන binoculars එක මෙහෙම missions වලදි ගොඩක් වැදගත්.

මොකද enemy කෙනෙක් දැක්කා කියලා straight away fire කරන එක හැම වෙලාවෙම හොඳම option එක නෙමෙයි.

මුලින් area එක scan කරන්න.

Enemyලා කීදෙනෙක් ඉන්නවද බලන්න.

ඒ අයගේ positions identify කරන්න.

ඊට පස්සේ තමයි attack කරන්නද, නැත්තම් stealth එකෙන් pass වෙන්නද කියලා තීරණය කරන්න ඕනෙ.`,
  },
  {
    id: 4,
    title: "4. Enemy Patrols & Tactical Decision",
    subtitle: "Enemy Patrols සහ රහසිගත ක්‍රමෝපාය",
    content: `දැන් තමයි mission එක ටිකක් interesting වෙන්න පටන් ගන්නෙ.

අපි facility එකට closer වෙනකොට enemy patrols හම්බවෙනවා.

මෙතනදි player කෙනෙක් විදිහට අපිට තීරණය කරන්න වෙනවා...

දුරින් ඉඳන් target එකකට eliminate කරනවද?

නැත්තම් enemy patrol එක avoid කරලා ඉස්සරහට යනවද?

Project IGI එකේ shooting mechanics අද තියෙන modern games තරම් smooth නැති වුණත්, මේ game එකේ tension එක හොඳටම feel වෙනවා.

විශේෂයෙන්ම enemyලාට alert වුණාම situation එක ඉක්මනට වෙනස් වෙන්න පුළුවන්.

ඒ නිසා weapon එක අරගෙන ඉස්සරහට දුවනවට වඩා, environment එක use කරන එක තමයි ගොඩක් වෙලාවට smart move එක.`,
  },
  {
    id: 5,
    title: "5. Run-and-Gun vs Tactical Patience",
    subtitle: "ඉවසීම සහ Environment Cover භාවිතය",
    content: `දැන් අපි mission objective එකට තවත් ලං වෙලා.

මේ වෙලාවේ game එක අපිට slowly කියලා දෙන්නෙ Project IGI කියන්නෙ run-and-gun shooter එකක් නෙමෙයි කියන එක.

ඔයාට ammo තියෙනවා කියලා හැම enemy කෙනෙක්වම kill කරන්න ඕනෙ නෑ.

ඔයාට තියෙන information එක use කරලා safest route එක හොයාගන්න ඕනෙ.

මේ mission එකේදී environment එක තමයි අපේ biggest advantage එක.

එක් පැත්තකින් enemy guards patrol කරනවා.

අනිත් පැත්තෙන් buildings සහ objects cover එකක් විදිහට use කරන්න පුළුවන්.

ඒ නිසා speed එකට වඩා, patience එක තමයි මෙතන වැදගත්.`,
  },
  {
    id: 6,
    title: "6. Atmosphere & Nostalgia",
    subtitle: "මිලිටරි ආකල්පය සහ ක්‍රීඩාවේ සුවිශේෂී බව",
    content: `මට personally මේ පළවෙනි mission එකේ හොඳම දෙයක් තමයි atmosphere එක.

Game එක technically අද බලද්දි old වගේ පේන්න පුළුවන්.

Graphics simple.

Animations limited.

Gunplay එකත් modern FPS games එක්ක compare කරන්න බෑ.

හැබැයි ඒ හැම දෙයක්ම තිබුණත්, mission එක play කරනකොට ලැබෙන military operation feeling එක තාමත් තියෙනවා.

Map එකක තනිවෙලා objective එකක් complete කරන්න යන feeling එක Project IGI එකේ ගොඩක් strong.

ඒක තමයි මේ game එක අදටත් මතක හිටින හේතුවක්.`,
  },
  {
    id: 7,
    title: "7. Mission Accomplished & Lessons",
    subtitle: "පළමු මෙහෙයුම අවසන් කිරීමේ පාඩම",
    content: `අන්තිමේදී, අපේ objective එක complete කරගෙන mission එක finish කරන්න පුළුවන්.

පළවෙනි mission එක technically ලොකු challenge එකක් නෙමෙයි.

හැබැයි මේකේ importance එක තියෙන්නෙ player කෙනාව Project IGI gameplay style එකට introduce කරන එක.

Map එක කියවන්න.

Enemy positions හඳුනාගන්න.

Weapons use කරන්න.

Cover එකෙන් move වෙන්න.

ඒ වගේම තමන්ගේ decisions ගැන think කරන්න.

මේ හැම දෙයක්ම ඉස්සරහ missions වලට foundation එක දානවා.`,
  },
  {
    id: 8,
    title: "8. Closing Quote & Mission 2 Preview",
    subtitle: "සුපිරි උපුටනය සහ දෙවැනි මෙහෙයුමට ඇරයුම",
    content: `ඉතින් මේ තමයි Project IGI – I'm Going In එකේ පළවෙනි mission එක.

මිනිත්තු කිහිපයක් ඇතුළත game එක අපිට කියලා දෙන ලොකුම lesson එක තමයි...

'Every enemy doesn't need a bullet... sometimes, the best weapon is your strategy.'

මේක Project IGI complete review එකක් නම්, මේ තමයි අපේ පළවෙනි පියවර.

ඊළඟ mission එකෙන් David Jones ගේ operation එක තවත් dangerous වෙන්න පටන් ගන්නවා.

ඒ නිසා අපි ඊළඟ mission එකටත් යමු.`,
  },
];

export const INITIAL_ENGLISH_SCENES: ScriptScene[] = [
  {
    id: 1,
    title: "1. Intro & Nostalgic Memories",
    subtitle: "Welcome to Project IGI: I'm Going In",
    content: `Hey everyone! Today, we're diving back into one of the most legendary tactical stealth shooters from our childhood... Project IGI: I'm Going In.

In this game, we step into the combat boots of David Jones, a former British SAS operative dispatched deep behind enemy lines.

Make no mistake: this is not your ordinary run-and-gun shooter. Survival demands patience, surveillance, cold calculation, and razor-sharp strategy. Let's begin with Mission 1: Trainyard Infiltration.`,
  },
  {
    id: 2,
    title: "2. The Objective & Surveillance",
    subtitle: "Intel Gathering in Hostile Territory",
    content: `Right as the mission kicks off, HQ feeds us our operational intelligence. Our primary objective is to infiltrate the secure military facility and recover classified data regarding stolen warheads.

Notice how the game refuses to throw us into mindless direct gunfights. Instead, it places us outside the perimeter fence, forcing us to observe the patrol routes, spot sniper towers, and formulate our plan. That tactical freedom is what made IGI iconic.`,
  },
  {
    id: 3,
    title: "3. Recon & Binoculars Protocol",
    subtitle: "Patience Before Pulling the Trigger",
    content: `Scanning the terrain with your satellite map and tactical binoculars is essential. In Project IGI, opening fire the second you spot an enemy guard is the quickest way to sound the alarm and summon endless backup.

Count the sentries. Note their line of sight. Identify the quiet blind spots between the storage depots. Only then decide whether to take the shot or ghost through untouched.`,
  },
  {
    id: 4,
    title: "4. The Philosophy of Stealth",
    subtitle: "Strategy Over Raw Firepower",
    content: `As we push closer into the perimeter, tension peaks. The bullet mechanics might be classic retro, but the stakes feel real and unforgiving. One slip-up, one alarm siren, and the entire base turns hostile.

Remember the golden rule of David Jones: every enemy doesn't need a bullet. Sometimes, the most lethal weapon in your inventory is your patience and quiet positioning.`,
  },
  {
    id: 5,
    title: "5. Mission 1 Accomplished",
    subtitle: "Exfiltration and Next Operations",
    content: `With the computer records secured and the security grid bypassed, Mission 1 is officially in the books. It sets the foundational tone for the entire campaign.

Next up, David Jones is heading deeper into the Soviet weapon complexes, where things get significantly more dangerous. Stay tuned, drop a like, and let's roll into Mission 2!`,
  },
];

export const VOICE_OPTIONS: VoiceOption[] = [
  {
    id: "Puck",
    name: "Puck (Gamer / Energetic)",
    description: "Lively, high-energy commentary with crisp cadence",
    gender: "male",
    vibe: "Streamer / YouTube Gamer",
    recommendedFor: ["si", "en"],
  },
  {
    id: "Charon",
    name: "Charon (Tactical Commander)",
    description: "Deep, commanding, cinematic military voice",
    gender: "male",
    vibe: "Tactical Operative / Action Briefing",
    recommendedFor: ["si", "en"],
  },
  {
    id: "Fenrir",
    name: "Fenrir (Special Forces)",
    description: "Grit, intensity, and hardened action delivery",
    gender: "male",
    vibe: "Action Veteran / Combat",
    recommendedFor: ["si", "en"],
  },
  {
    id: "Kore",
    name: "Kore (HQ Radio Dispatch)",
    description: "Calm, articulate, clear and professional operator",
    gender: "female",
    vibe: "Tactical HQ Dispatch / Analyst",
    recommendedFor: ["si", "en"],
  },
  {
    id: "Zephyr",
    name: "Zephyr (Storyteller)",
    description: "Warm, engaging, podcast and documentary tone",
    gender: "female",
    vibe: "Documentary / Narrative Voice",
    recommendedFor: ["si", "en"],
  },
  {
    id: "Aoede",
    name: "Aoede (Cinematic & Dramatic)",
    description: "Rich theatrical cadence for trailers and intros",
    gender: "female",
    vibe: "Cinematic Trailer / Drama",
    recommendedFor: ["si", "en"],
  },
  {
    id: "Orus",
    name: "Orus (Authoritative Baritone)",
    description: "Mature, solid, informative broadcast presentation",
    gender: "male",
    vibe: "Broadcast / Tech Review",
    recommendedFor: ["si", "en"],
  },
  {
    id: "Leto",
    name: "Leto (Friendly & Conversational)",
    description: "Natural everyday speech for tutorials and vlogs",
    gender: "female",
    vibe: "Casual Vlog / Explainer",
    recommendedFor: ["si", "en"],
  },
];

export const STYLE_OPTIONS: StyleOption[] = [
  {
    id: "gaming_si",
    name: "Sinhala Gaming Commentary",
    sinhalaName: "යූටියුබ් ගේමින් විවරණය",
    description: "Enthusiastic and engaging gamer style for YouTube gameplay videos",
    sinhalaDescription: "උද්යෝගිමත් යූටියුබ් ක්‍රීඩා විවරණ ශෛලිය",
    promptPrefix: "Speak in an enthusiastic, engaging, lively Sinhala gaming commentary tone like a popular YouTube gamer",
    language: "si",
  },
  {
    id: "tactical_si",
    name: "Tactical Briefing (Sinhala)",
    sinhalaName: "මිලිටරි උපදෙස් / රහසිගත ක්‍රියාන්විතය",
    description: "Calm, focused, serious tactical stealth operative tone",
    sinhalaDescription: "සන්සුන්, සැලසුම් සහගත රහසිගත හමුදා මෙහෙයුම් හඬ",
    promptPrefix: "Speak in a calm, serious, focused, tactical military operative tone in Sinhala",
    language: "si",
  },
  {
    id: "nostalgic_si",
    name: "Nostalgic Retro Review (Sinhala)",
    sinhalaName: "මතකයන් ආවර්ජනය (Nostalgic)",
    description: "Warm, reflective gamer remembering childhood gaming memories",
    sinhalaDescription: "කුඩා කළ සොඳුරු මතකයන් ආවර්ජනය කරන ලෙන්ගතු හඬ",
    promptPrefix: "Speak warmly, reflectively and fondly in Sinhala like an experienced gamer sharing cherished nostalgic childhood memories",
    language: "si",
  },
  {
    id: "gaming_en",
    name: "English Gaming Review & Walkthrough",
    sinhalaName: "ඉංග්‍රීසි Gaming විවරණය",
    description: "Dynamic, punchy commentary for gameplay reviews and walkthroughs",
    sinhalaDescription: "යූටියුබ් වීඩියෝ සඳහා වේගවත්, ප්‍රබෝධමත් ඉංග්‍රීසි හඬ",
    promptPrefix: "Speak in an enthusiastic, engaging, punchy English gaming commentary tone suitable for YouTube gaming channels",
    language: "en",
  },
  {
    id: "tactical_en",
    name: "Tactical Military Intel (English)",
    sinhalaName: "ඉංග්‍රීසි මිලිටරි මෙහෙයුම් හඬ",
    description: "Deep, authoritative operative briefing for stealth & combat",
    sinhalaDescription: "හමුදා බුද්ධි අංශ හා මෙහෙයුම් උපදෙස් සඳහා ගැඹුරු හඬ",
    promptPrefix: "Speak in a steady, authoritative, tactical military operative briefing style in English",
    language: "en",
  },
  {
    id: "cinematic_en",
    name: "Cinematic Movie Trailer (English)",
    sinhalaName: "සිනමාපට ට්‍රේලර් ශෛලිය (Cinematic)",
    description: "Dramatic pacing with heavy pauses and epic weight",
    sinhalaDescription: "චිත්‍රපට හෝ වීඩියෝ ට්‍රේලර් සඳහා නාට්‍යමය ගාම්භීර හඬ",
    promptPrefix: "Speak in a dramatic, epic cinematic trailer voiceover cadence with intense pauses and theatrical weight",
    language: "en",
  },
  {
    id: "podcast_all",
    name: "Podcast & Documentary Narrator",
    sinhalaName: "වාර්තාමය හා පොඩ්කාස්ට් ශෛලිය",
    description: "Clear, conversational, well-paced storytelling delivery",
    sinhalaDescription: "පැහැදිලි, ආකර්ශනීය වාර්තාමය කථන විලාසය",
    promptPrefix: "Speak in a clear, warm, conversational podcast and storytelling narrator voice",
    language: "all",
  },
  {
    id: "natural_all",
    name: "Natural / Neutral Voice",
    sinhalaName: "ස්වභාවික සරල හඬ (Natural)",
    description: "Clean articulation with standard pacing and no special styling",
    sinhalaDescription: "අමතර වෙනස්කම් නොමැති ස්වභාවික පැහැදිලි කියවීම",
    promptPrefix: "",
    language: "all",
  },
];

export const SCRIPT_PRESETS: ScriptPreset[] = [
  {
    id: "igi_sinhala",
    title: "Project IGI - Mission 1 (Sinhala)",
    sinhalaTitle: "Project IGI - පළමු මෙහෙයුම (සිංහල සම්පූර්ණ විවරණය)",
    language: "si",
    description: "Complete 8-part Sinhala tactical gaming review of Project IGI Mission 1",
    scenes: INITIAL_SINHALA_SCENES.map((s) => ({
      title: s.title,
      subtitle: s.subtitle,
      content: s.content,
    })),
  },
  {
    id: "igi_english",
    title: "Project IGI - Mission 1 (English)",
    sinhalaTitle: "Project IGI - Walkthrough & Tactical Review (English)",
    language: "en",
    description: "5-part English tactical retro review of Project IGI Mission 1",
    scenes: INITIAL_ENGLISH_SCENES.map((s) => ({
      title: s.title,
      subtitle: s.subtitle,
      content: s.content,
    })),
  },
];

// Helper to parse uploaded text into structured scenes automatically
export function parseTextIntoScenes(
  rawText: string,
  fileName = "Uploaded Script"
): ScriptScene[] {
  const text = rawText.replace(/\r\n/g, "\n").trim();
  if (!text) return [];

  // Check if text is divided by --- or === or ***
  const dividerRegex = /\n\s*(?:---+|===+|\*\*\*+)\s*\n/;
  if (dividerRegex.test(text)) {
    const rawParts = text.split(dividerRegex).map((p) => p.trim()).filter(Boolean);
    if (rawParts.length > 1) {
      return rawParts.map((part, index) => {
        const lines = part.split("\n").map((l) => l.trim()).filter(Boolean);
        const titleLine = lines[0] && lines[0].length < 60 ? lines[0] : `Scene ${index + 1}`;
        return {
          id: index + 1,
          title: titleLine.replace(/^["'#*-]+|["'#*-]+$/g, "").trim() || `Scene ${index + 1}`,
          subtitle: `කොටස ${index + 1} (${fileName})`,
          content: part,
        };
      });
    }
  }

  // Check if text has numbered sections like "1.", "Scene 1", "Section 1", "පියවර 1"
  const sectionSplitter = /\n(?=(?:Scene\s+\d+|Section\s+\d+|Mission\s+\d+|\d+\.\s+|කොටස\s+\d+|Scene\s*[A-Z]))/i;
  const sectionParts = text.split(sectionSplitter).map((p) => p.trim()).filter(Boolean);
  if (sectionParts.length > 1) {
    return sectionParts.map((part, index) => {
      const lines = part.split("\n").map((l) => l.trim()).filter(Boolean);
      const title = lines[0] && lines[0].length < 70 ? lines[0] : `Scene ${index + 1}`;
      return {
        id: index + 1,
        title: title.replace(/^["'#*-]+|["'#*-]+$/g, "").trim(),
        subtitle: `කොටස ${index + 1}`,
        content: part,
      };
    });
  }

  // Otherwise split by double newlines into meaningful paragraphs
  const paragraphs = text.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
  if (paragraphs.length > 1) {
    return paragraphs.map((para, index) => ({
      id: index + 1,
      title: `Scene ${index + 1}`,
      subtitle: `ඡේදය ${index + 1} (${fileName})`,
      content: para,
    }));
  }

  // Single scene fallback
  return [
    {
      id: 1,
      title: fileName.replace(/\.[^/.]+$/, "") || "Scene 1",
      subtitle: "සම්පූර්ණ පිටපත (Full Document)",
      content: text,
    },
  ];
}
