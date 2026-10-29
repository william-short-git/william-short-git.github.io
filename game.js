/**
 * LEXICON ROGUELIKE - High-Dopamine ADHD Reading Arcade
 * Zero-backend, pure HTML5 + Tailwind + Vanilla JS
 * 
 * Features:
 * - Extensible Registry Architecture (Easily add themes, relics, word packs, skins)
 * - Italian Brainrots: Ballerina Cappuccina, Tralalero Tralala, Tung Tung Tung Sahur, Strawberry Elephant
 * - Fixed Card Initialization Bug: Cards always exist on start & persist seamlessly across refresh
 * - Voice doesn't read word until Relic / Boss Chest prompt closes
 * - Nerfed Damage Multipliers for balanced, engaging progression
 * - Clean, legible wave text without harsh blurry outlines
 * - Responsive auto-expanding cards so words never overflow
 * - Main Menu with Start, Shop, and Custom Word List menus
 * - XP System with frequent early level-ups (prevents >5 hits to kill)
 * - Word Progression: 10 levels per set, difficulty increases every 5 waves
 * - Coins only from Boss Chests (10-50 coins, health potion & unique relics)
 * - 3-Card audio listening loop with text-to-speech replay
 * - Player damage increases happen ONLY through relics
 * - Monsters do damage when player picks the wrong card
 * - Player heals 10% max HP every 3 consecutive correct cards
 */

// ============================================================================
// 1. EXTENSIBLE GAME CONFIG & REGISTRIES
// Adding new Themes, Relics, Word Packs, or Skins is as simple as adding an entry!
// ============================================================================

const BASE_PLAYER_DAMAGE = 2500;

// THEMES REGISTRY (Add any enemy theme here!)
const THEMES_REGISTRY = {
  brainrot: {
    id: 'brainrot',
    name: '🇮🇹 Italian Brainrot',
    badge: '🇮🇹 BRAINROT',
    description: 'Battle Ballerina Cappuccina, Tralalero Tralala, Tung Tung Tung Sahur, and Strawberry Elephant!',
    monsters: [
      { name: "Ballerina Cappuccina", image: "assets/monsters/teacup_ballerina.png", baseHp: 4000, attack: 2 },
      { name: "Tralalero Tralala", image: "assets/monsters/shark_shoes.png", baseHp: 4800, attack: 2 },
      { name: "Tung Tung Tung Sahur", image: "assets/monsters/tung_tung.png", baseHp: 5500, attack: 2 },
      { name: "Strawberry Elephant", image: "assets/monsters/strawberry_elephant.jpg", baseHp: 6200, attack: 2 },
      { name: "Ballerina Cappuccina Turbo", image: "assets/monsters/teacup_ballerina.png", baseHp: 7000, attack: 3 },
      { name: "Tralalero Tralala Nike", image: "assets/monsters/shark_shoes.png", baseHp: 7500, attack: 2 },
      { name: "Tung Tung Tung Sahur Mazza", image: "assets/monsters/tung_tung.png", baseHp: 8000, attack: 3 },
      { name: "Strawberry Elephant Selvaggio", image: "assets/monsters/strawberry_elephant.jpg", baseHp: 8500, attack: 3 }
    ],
    bosses: [
      { name: "👑 GIGA BALLERINA CAPPUCCINA (BOSS)", image: "assets/monsters/teacup_ballerina.png", baseHp: 11000, attack: 3 },
      { name: "👑 RE TRALALERO TRALALA (BOSS)", image: "assets/monsters/shark_shoes.png", baseHp: 13000, attack: 4 },
      { name: "👑 TITAN TUNG TUNG TUNG SAHUR (BOSS)", image: "assets/monsters/tung_tung.png", baseHp: 15000, attack: 4 },
      { name: "👑 MEGA STRAWBERRY ELEPHANT (BOSS)", image: "assets/monsters/strawberry_elephant.jpg", baseHp: 17000, attack: 4 },
      { name: "👑 SUPREMO TRALALERO TRALALA (BOSS)", image: "assets/monsters/shark_shoes.png", baseHp: 19000, attack: 5 }
    ]
  },
  classic: {
    id: 'classic',
    name: '👾 Classic Arcade',
    badge: '👾 CLASSIC',
    description: 'Retro emoji monsters and arcade titans.',
    monsters: [
      { name: "Giggle Slime", emoji: "🟢", baseHp: 4000, attack: 2 },
      { name: "Bubble Goblin", emoji: "👺", baseHp: 4800, attack: 2 },
      { name: "Neon Bunny", emoji: "🐰", baseHp: 5500, attack: 2 },
      { name: "Zap Bat", emoji: "🦇", baseHp: 6200, attack: 2 },
      { name: "Choco Bear", emoji: "🐻", baseHp: 7000, attack: 3 },
      { name: "Pixel Kitty", emoji: "🐱", baseHp: 7500, attack: 2 },
      { name: "Spiky Turtle", emoji: "🐢", baseHp: 8000, attack: 3 },
      { name: "Cosmic Dino", emoji: "🦖", baseHp: 8500, attack: 3 }
    ],
    bosses: [
      { name: "KING CHONKUS", emoji: "👑🦁", baseHp: 11000, attack: 3 },
      { name: "GIGA CYBORG SHARK", emoji: "🦈🤖", baseHp: 13000, attack: 4 },
      { name: "LORD OF COOKIES", emoji: "🍪👑", baseHp: 15000, attack: 4 },
      { name: "RAINBOW HYDRA", emoji: "🐲🌈", baseHp: 17000, attack: 4 },
      { name: "MEGA ROBO-TITAN", emoji: "🦾🤖", baseHp: 19000, attack: 5 }
    ]
  }
};

// RELICS REGISTRY (Declarative stats for easy balancing & expansion)
const RELICS_REGISTRY = {
  ruby_blade: {
    id: "ruby_blade",
    name: "Ruby Blade",
    icon: "🗡️",
    rarity: "Rare",
    color: "from-red-500 to-rose-600",
    description: "+20% Player Attack Damage!",
    damageMultiplier: 0.20
  },
  titan_hammer: {
    id: "titan_hammer",
    name: "Titan Hammer",
    icon: "🔨",
    rarity: "Epic",
    color: "from-amber-500 to-orange-600",
    description: "+35% Player Attack Damage!",
    damageMultiplier: 0.35
  },
  inferno_dagger: {
    id: "inferno_dagger",
    name: "Inferno Dagger",
    icon: "🔥",
    rarity: "Rare",
    color: "from-orange-500 to-red-600",
    description: "Adds +600 flat Fire Damage to every attack!",
    flatDamage: 600
  },
  critical_glasses: {
    id: "critical_glasses",
    name: "Critical Glasses",
    icon: "👓",
    rarity: "Rare",
    color: "from-amber-400 to-yellow-500",
    description: "15% chance to land a 1.8x Critical Hit!",
    critChance: 0.15,
    critMultiplier: 1.8
  },
  thunder_wand: {
    id: "thunder_wand",
    name: "Thunder Wand",
    icon: "⚡",
    rarity: "Epic",
    color: "from-cyan-400 to-blue-600",
    description: "15% chance to zap with 2.2x Lightning Damage!",
    thunderChance: 0.15,
    thunderMultiplier: 2.2
  },
  dopamine_blaster: {
    id: "dopamine_blaster",
    name: "Dopamine Blaster",
    icon: "🚀",
    rarity: "Legendary",
    color: "from-fuchsia-500 to-purple-600",
    description: "Every 5-streak unleashes a 2.5x Firework Barrage!",
    streakBarrageMultiplier: 2.5
  },
  vampire_fang: {
    id: "vampire_fang",
    name: "Vampire Fang",
    icon: "🧛",
    rarity: "Epic",
    color: "from-purple-500 to-indigo-600",
    description: "Heals 1 HP on every correct word, regardless of streak!",
    healOnCorrect: 1
  },
  titan_heart: {
    id: "titan_heart",
    name: "Titan Heart",
    icon: "💖",
    rarity: "Legendary",
    color: "from-rose-500 to-pink-600",
    description: "+4 Player Max HP & instantly heals to full health!",
    maxHpBonus: 4,
    healToFull: true
  },
  rainbow_crayon: {
    id: "rainbow_crayon",
    name: "Rainbow Crayon",
    icon: "🖍️",
    rarity: "Rare",
    color: "from-emerald-400 to-teal-600",
    description: "Vowels naturally glow in bright rainbow colors for instant reading!",
    rainbowVowels: true
  }
};

// WORD TIERS REGISTRY (10 Levels per Set, increases difficulty every 5 waves)
const WORD_TIERS_REGISTRY = {
  tier1: {
    id: 'tier1',
    name: "Tier 1: CVC Short Vowels",
    maxWave: 5,
    words: ['CAT', 'DOG', 'SUN', 'BAT', 'PIG', 'CUP', 'HAT', 'FOX', 'BUG', 'RUN', 'BED', 'MAP', 'HOP', 'BOX', 'PEN', 'NET', 'VAN', 'TUB', 'LIP', 'PIN']
  },
  tier2: {
    id: 'tier2',
    name: "Tier 2: 4-Letter Blends & Digraphs",
    maxWave: 10,
    words: ['FROG', 'CRAB', 'SHIP', 'FISH', 'DUCK', 'STAR', 'SLAM', 'PLUG', 'DRUM', 'CLAP', 'STOP', 'NEST', 'JUMP', 'MILK', 'FLAG', 'BELL', 'RING', 'KING', 'SWIM', 'LAMP']
  },
  tier3: {
    id: 'tier3',
    name: "Tier 3: Vowel Teams & Silent E",
    maxWave: 15,
    words: ['TRAIN', 'BRAIN', 'SHARK', 'CLOUD', 'SMILE', 'FLAME', 'BRAVE', 'SWEET', 'DREAM', 'LIGHT', 'NIGHT', 'STAND', 'PLANT', 'BRICK', 'TRUCK', 'SNAKE', 'GRAPE', 'SPOON', 'QUEEN', 'GREEN']
  },
  tier4: {
    id: 'tier4',
    name: "Tier 4: 2-Syllable Phonics",
    maxWave: 20,
    words: ['DRAGON', 'ROCKET', 'SUNSET', 'PLANET', 'SILVER', 'MONSTER', 'GOLDEN', 'WIZARD', 'FOREST', 'CASTLE', 'SUPER', 'MAGNET', 'HELMET', 'PENCIL', 'POCKET', 'RABBIT', 'BUTTON', 'WINTER', 'SUMMER', 'BASKET']
  },
  tier5: {
    id: 'tier5',
    name: "Tier 5: Epic Multi-Syllable",
    maxWave: 25,
    words: ['CHAMPION', 'TREASURE', 'THUNDER', 'BLIZZARD', 'VICTORY', 'KINGDOM', 'DIAMOND', 'RAINBOW', 'EXPLORE', 'CRYSTAL', 'TORNADO', 'HORIZON', 'JOURNEY', 'PHOENIX']
  },
  tier6: {
    id: 'tier6',
    name: "Tier 6: Master Vocabulary",
    maxWave: Infinity,
    words: ['ADVENTURE', 'ASTRONAUT', 'DINOSAUR', 'FANTASTIC', 'LIGHTNING', 'POWERFUL', 'SUPERHERO', 'DISCOVERY', 'BRILLIANT', 'WONDERFUL', 'UNIVERSE', 'SPECTACULAR']
  }
};

// PRE-EXISTING WORD PACKS (Protected — cannot be deleted!)
const BUILTIN_PACKS_REGISTRY = {
  animals: {
    id: 'animals',
    name: '🐾 Cute Animals',
    icon: '🦁',
    isCustom: false,
    words: ['FROG', 'DUCK', 'FISH', 'BEAR', 'LION', 'BIRD', 'WOLF', 'CRAB', 'SLOTH', 'DEER', 'GOAT', 'MOUSE']
  },
  food: {
    id: 'food',
    name: '🍕 Yummy Food',
    icon: '🍕',
    isCustom: false,
    words: ['CAKE', 'MILK', 'PIZZA', 'CHIP', 'CORN', 'APPLE', 'BEAN', 'SOUP', 'RICE', 'TACO', 'BREAD', 'GRAPE']
  },
  action: {
    id: 'action',
    name: '⚡ Super Actions',
    icon: '⚡',
    isCustom: false,
    words: ['JUMP', 'RUN', 'FLY', 'SLAM', 'DASH', 'KICK', 'CLAP', 'SPIN', 'BLAST', 'GLOW', 'PUNCH', 'LEAP']
  },
  space: {
    id: 'space',
    name: '🚀 Cosmic Space',
    icon: '🚀',
    isCustom: false,
    words: ['STAR', 'MOON', 'SHIP', 'SUN', 'MARS', 'BEAM', 'ALIEN', 'NOVA', 'ORBIT', 'COMET', 'LASER', 'ROCKET']
  }
};
const WORD_PACKS_REGISTRY = BUILTIN_PACKS_REGISTRY;

// CARD SKINS REGISTRY (Buyable with boss coins in Shop)
const CARD_SKINS_REGISTRY = {
  neon: {
    id: 'neon',
    name: 'Neon Arcade',
    icon: '🕹️',
    price: 0,
    cssClass: 'card-theme-neon'
  },
  gold: {
    id: 'gold',
    name: '👑 Gold VIP',
    icon: '👑',
    price: 45,
    cssClass: 'card-theme-gold'
  },
  cosmic: {
    id: 'cosmic',
    name: '🌌 Cosmic Galaxy',
    icon: '🌌',
    price: 60,
    cssClass: 'card-theme-cosmic'
  },
  cyber: {
    id: 'cyber',
    name: '⚡ Cyber Matrix',
    icon: '⚡',
    price: 75,
    cssClass: 'card-theme-cyber'
  },
  candy: {
    id: 'candy',
    name: '🍬 Candy Pop',
    icon: '🍬',
    price: 50,
    cssClass: 'card-theme-candy'
  },
  pixel: {
    id: 'pixel',
    name: '👾 Retro Pixel',
    icon: '👾',
    price: 65,
    cssClass: 'card-theme-pixel'
  }
};

// Developer / Modding API: Easily register custom modules at runtime!
window.LexiconAPI = {
  registerTheme: (theme) => { THEMES_REGISTRY[theme.id] = theme; },
  registerRelic: (relic) => { RELICS_REGISTRY[relic.id] = relic; },
  registerWordPack: (pack) => { WORD_PACKS_REGISTRY[pack.id] = pack; },
  registerCardSkin: (skin) => { CARD_SKINS_REGISTRY[skin.id] = skin; }
};

// ============================================================================
// 2. RUNTIME ENGINE STATE
// ============================================================================

const gameState = {
  currentView: 'menu', // 'menu' or 'game'
  wave: 1,
  playerLevel: 1,
  playerXp: 0,
  playerHp: 20,
  playerMaxHp: 20,
  streak: 0,
  score: 0,
  highScore: 0,
  coins: 0,
  activeRelics: [],
  unlockedPacks: [],
  activePacks: [],
  activeBuiltinPacks: [],
  customPacks: [
    {
      id: 'custom_spelling_1',
      name: 'My Spelling Words',
      icon: '📝',
      words: ['SPIDER', 'ROCKET', 'DRAGON', 'FRIEND'],
      isActive: true,
      isCustom: true
    }
  ],
  customWordsFocus: true,
  onlyCustomWords: false,
  momShopItems: [
    { id: 'mom_item_1', name: 'Ice Cream Treat', icon: '🍦', price: 40 },
    { id: 'mom_item_2', name: '30 Mins Video Games', icon: '🎮', price: 60 },
    { id: 'mom_item_3', name: 'Movie Night Choice', icon: '🎬', price: 75 },
    { id: 'mom_item_4', name: '15 Mins Stay Up Late', icon: '🛌', price: 50 }
  ],
  kidInventory: [],
  customWords: [],
  unlockedCardSkins: ['neon'],
  equippedCardSkin: 'neon',
  monsterTheme: 'brainrot', // Default: Italian Brainrot Memes
  soundEnabled: true,
  ttsEnabled: true,
  autoSpeak: true
};

let currentMonster = {
  name: "Ballerina Cappuccina",
  image: "assets/monsters/teacup_ballerina.png",
  emoji: null,
  hp: 4000,
  maxHp: 4000,
  attackPower: 2,
  level: 1,
  isBoss: false
};

// Active target word and 3 card choices
let currentWord = null;
let currentChoices = [];
let isCombatLocked = false;
let pendingChestLoot = null;

// ============================================================================
// 3. XP & LEVEL-UP PROGRESSION
// ============================================================================

function getXpNeededForLevel(level) {
  return Math.floor(70 * Math.pow(level, 1.25));
}

function addPlayerXp(amount) {
  gameState.playerXp += amount;
  let needed = getXpNeededForLevel(gameState.playerLevel);

  if (gameState.playerXp >= needed) {
    gameState.playerXp -= needed;
    gameState.playerLevel++;
    sounds.playFanfare();
    fx.addConfettiCelebration(60);
    showToast(`🌟 LEVEL UP! You reached Level ${gameState.playerLevel}!`, 'success');
    showRelicLevelUpScreen();
  }

  updateUI();
}

// ============================================================================
// 4. PROCEDURAL WEB AUDIO SYNTHESIZER
// ============================================================================

class SoundEngine {
  constructor() {
    this.ctx = null;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playHit() {
    if (!gameState.soundEnabled) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(280, t);
    osc.frequency.exponentialRampToValueAtTime(70, t + 0.12);

    gain.gain.setValueAtTime(0.3, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.12);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.12);
  }

  playCrit() {
    if (!gameState.soundEnabled) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, t + i * 0.03);

      gain.gain.setValueAtTime(0.18, t + i * 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.03 + 0.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t + i * 0.03);
      osc.stop(t + i * 0.03 + 0.2);
    });
  }

  playMonsterAttack() {
    if (!gameState.soundEnabled) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(140, t);
    osc.frequency.exponentialRampToValueAtTime(40, t + 0.25);

    gain.gain.setValueAtTime(0.4, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.25);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.25);
  }

  playPlayerHurt() {
    if (!gameState.soundEnabled) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(180, t);
    osc.frequency.linearRampToValueAtTime(80, t + 0.15);

    gain.gain.setValueAtTime(0.35, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.15);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.15);
  }

  playBonk() {
    if (!gameState.soundEnabled) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, t);
    osc.frequency.linearRampToValueAtTime(140, t + 0.18);
    osc.frequency.linearRampToValueAtTime(280, t + 0.32);

    gain.gain.setValueAtTime(0.25, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.32);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.32);
  }

  playHeal() {
    if (!gameState.soundEnabled) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    [440, 554.37, 659.25, 880].forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t + idx * 0.06);

      gain.gain.setValueAtTime(0.22, t + idx * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.06 + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t + idx * 0.06);
      osc.stop(t + idx * 0.06 + 0.35);
    });
  }

  playCoin() {
    if (!gameState.soundEnabled) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(987.77, t);
    osc.frequency.setValueAtTime(1318.51, t + 0.08);

    gain.gain.setValueAtTime(0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.25);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.25);
  }

  playShopBuy() {
    if (!gameState.soundEnabled) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    [783.99, 1046.50, 1318.51, 1567.98].forEach((f, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(f, t + i * 0.05);
      gain.gain.setValueAtTime(0.2, t + i * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.01, t + i * 0.05 + 0.2);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t + i * 0.05);
      osc.stop(t + i * 0.05 + 0.2);
    });
  }

  playFanfare() {
    if (!gameState.soundEnabled) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const notes = [
      { f: 523.25, d: 0.15, off: 0 },
      { f: 523.25, d: 0.15, off: 0.15 },
      { f: 523.25, d: 0.15, off: 0.3 },
      { f: 659.25, d: 0.2, off: 0.45 },
      { f: 783.99, d: 0.2, off: 0.65 },
      { f: 1046.50, d: 0.5, off: 0.85 }
    ];

    notes.forEach((n) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(n.f, t + n.off);
      gain.gain.setValueAtTime(0.22, t + n.off);
      gain.gain.exponentialRampToValueAtTime(0.01, t + n.off + n.d);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t + n.off);
      osc.stop(t + n.off + n.d);
    });
  }
}

const sounds = new SoundEngine();

// ============================================================================
// 5. SPEECH SYNTHESIS ENGINE (TTS)
// ============================================================================

function isRelicOrChestModalOpen() {
  const relicModal = document.getElementById('relic-modal');
  const chestModal = document.getElementById('boss-chest-modal');
  return (relicModal && !relicModal.classList.contains('hidden')) ||
         (chestModal && !chestModal.classList.contains('hidden'));
}

function speakTargetWord(word) {
  if (isRelicOrChestModalOpen()) return;
  if (!gameState.ttsEnabled || !('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(word.toLowerCase());
  utterance.rate = 0.80;
  utterance.pitch = 1.12;
  utterance.lang = 'en-US';

  const voices = window.speechSynthesis.getVoices();
  const englishVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Samantha') || v.name.includes('Google') || v.name.includes('Alex')));
  if (englishVoice) {
    utterance.voice = englishVoice;
  }

  const speakerBtn = document.getElementById('btn-speak-word');
  if (speakerBtn) {
    speakerBtn.classList.add('soundwave-pulse');
    utterance.onend = () => speakerBtn.classList.remove('soundwave-pulse');
    utterance.onerror = () => speakerBtn.classList.remove('soundwave-pulse');
  }

  window.speechSynthesis.speak(utterance);
}

// ============================================================================
// 6. CANVAS 2D PARTICLE SYSTEM
// ============================================================================

class ParticleSystem {
  constructor() {
    this.canvas = document.getElementById('fx-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.loop();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  addHitSparks(x, y, count = 16, isCrit = false) {
    const colors = isCrit
      ? ['#facc15', '#f43f5e', '#38bdf8', '#ffffff', '#a855f7']
      : ['#4ade80', '#22c55e', '#facc15', '#ffffff'];

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * (isCrit ? 9 : 6) + 3;
      this.particles.push({
        type: 'spark',
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 5 + 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1,
        decay: Math.random() * 0.04 + 0.02
      });
    }
  }

  addMonsterSlash(x, y) {
    const colors = ['#ef4444', '#dc2626', '#f87171', '#991b1b'];
    for (let i = 0; i < 20; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 8 + 4;
      this.particles.push({
        type: 'spark',
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed + 2,
        size: Math.random() * 6 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1,
        decay: 0.035
      });
    }
  }

  addCoinExplosion(x, y, count = 28) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 9 + 4;
      this.particles.push({
        type: 'coin',
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 4,
        gravity: 0.35,
        size: Math.random() * 12 + 10,
        rotation: Math.random() * Math.PI,
        vRot: (Math.random() - 0.5) * 0.3,
        color: '#fbbf24',
        alpha: 1,
        life: 0,
        maxLife: 70
      });
    }
  }

  addConfettiCelebration(count = 65) {
    const colors = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#facc15'];
    for (let i = 0; i < count; i++) {
      this.particles.push({
        type: 'confetti',
        x: Math.random() * this.canvas.width,
        y: -20,
        vx: (Math.random() - 0.5) * 4,
        vy: Math.random() * 4 + 3,
        size: Math.random() * 8 + 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * Math.PI,
        vRot: (Math.random() - 0.5) * 0.15,
        alpha: 1,
        life: 0,
        maxLife: 150
      });
    }
  }

  addHealingHearts(x, y, count = 8) {
    for (let i = 0; i < count; i++) {
      this.particles.push({
        type: 'heart',
        x: x + (Math.random() - 0.5) * 60,
        y: y + (Math.random() - 0.5) * 30,
        vx: (Math.random() - 0.5) * 2,
        vy: -(Math.random() * 2.5 + 2),
        size: Math.random() * 10 + 18,
        alpha: 1,
        decay: 0.02
      });
    }
  }

  loop() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];

      if (p.type === 'spark') {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;
        this.ctx.save();
        this.ctx.globalAlpha = Math.max(0, p.alpha);
        this.ctx.fillStyle = p.color;
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.restore();
      } else if (p.type === 'coin') {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.rotation += p.vRot;
        p.life++;
        if (p.life > p.maxLife) p.alpha -= 0.04;

        this.ctx.save();
        this.ctx.globalAlpha = Math.max(0, p.alpha);
        this.ctx.translate(p.x, p.y);
        this.ctx.rotate(p.rotation);
        this.ctx.fillStyle = '#f59e0b';
        this.ctx.beginPath();
        this.ctx.ellipse(0, 0, p.size, p.size * 0.7, 0, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.fillStyle = '#fef08a';
        this.ctx.beginPath();
        this.ctx.ellipse(0, 0, p.size * 0.7, p.size * 0.45, 0, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.restore();
      } else if (p.type === 'confetti') {
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.vRot;
        p.life++;
        if (p.life > p.maxLife) p.alpha -= 0.03;

        this.ctx.save();
        this.ctx.globalAlpha = Math.max(0, p.alpha);
        this.ctx.translate(p.x, p.y);
        this.ctx.rotate(p.rotation);
        this.ctx.fillStyle = p.color;
        this.ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        this.ctx.restore();
      } else if (p.type === 'heart') {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;

        this.ctx.save();
        this.ctx.globalAlpha = Math.max(0, p.alpha);
        this.ctx.font = `${p.size}px sans-serif`;
        this.ctx.fillText('💖', p.x, p.y);
        this.ctx.restore();
      }

      if (p.alpha <= 0) {
        this.particles.splice(i, 1);
      }
    }

    requestAnimationFrame(() => this.loop());
  }
}

let fx = null;

// ============================================================================
// 7. DAMAGE FORMULA & MONSTER HP BALANCING
// Uses RELICS_REGISTRY for declarative, modular relic effects!
// ============================================================================

function formatNumber(num) {
  if (num >= 1e12) return (num / 1e12).toFixed(2) + "T";
  if (num >= 1e9) return (num / 1e9).toFixed(2) + "B";
  if (num >= 1e6) return (num / 1e6).toFixed(2) + "M";
  if (num >= 1e3) return (num / 1e3).toFixed(1) + "K";
  return Math.floor(num).toLocaleString();
}

function formatFullNumber(num) {
  return Math.floor(num).toLocaleString();
}

function calculatePlayerDamage() {
  let damage = BASE_PLAYER_DAMAGE;
  let multiplier = 1.0;
  let flatBonus = 0;
  let isCrit = false;
  let isThunder = false;
  let isDopamine = false;

  // Process equipped relics from registry
  gameState.activeRelics.forEach((relicId) => {
    const relic = RELICS_REGISTRY[relicId];
    if (!relic) return;

    if (relic.damageMultiplier) multiplier += relic.damageMultiplier;
    if (relic.flatDamage) flatBonus += relic.flatDamage;

    if (relic.critChance && Math.random() < relic.critChance) {
      multiplier *= relic.critMultiplier;
      isCrit = true;
    }

    if (relic.thunderChance && Math.random() < relic.thunderChance) {
      multiplier *= relic.thunderMultiplier;
      isThunder = true;
    }

    if (relic.streakBarrageMultiplier && ((gameState.streak + 1) % 5 === 0)) {
      multiplier *= relic.streakBarrageMultiplier;
      isDopamine = true;
    }
  });

  const variance = 0.95 + Math.random() * 0.10;
  const finalDamage = Math.floor((damage * multiplier + flatBonus) * variance);

  return {
    damage: finalDamage,
    isCrit,
    isThunder,
    isDopamine
  };
}

function calculateMonsterHp(wave) {
  const isBoss = (wave % 5 === 0);
  let hp = 0;
  if (isBoss) {
    hp = Math.floor(10000 + (Math.floor(wave / 5) - 1) * 1500);
  } else {
    hp = Math.floor(4000 + (wave - 1) * 400);
  }

  // Guaranteed: never require more than 5 hits to defeat at baseline!
  return Math.min(hp, isBoss ? 12500 : 9000);
}

// ============================================================================
// 8. WORD POOL & 3-CARD GENERATION
// Guaranteed card generation with auto-expand sizing!
// ============================================================================

function getCurrentTierInfo(wave) {
  for (const tierKey in WORD_TIERS_REGISTRY) {
    const tier = WORD_TIERS_REGISTRY[tierKey];
    if (wave <= tier.maxWave) {
      return tier;
    }
  }
  return WORD_TIERS_REGISTRY.tier6;
}

function getActiveCustomWords() {
  const words = [];
  if (Array.isArray(gameState.customPacks)) {
    gameState.customPacks.forEach(pack => {
      if (pack.isActive && Array.isArray(pack.words)) {
        pack.words.forEach(w => {
          const clean = String(w).trim().toUpperCase();
          if (clean && !words.includes(clean)) {
            words.push(clean);
          }
        });
      }
    });
  }
  return words;
}

function getActiveBuiltinWords() {
  const words = [];
  const activeIds = Array.isArray(gameState.activeBuiltinPacks) ? gameState.activeBuiltinPacks : [];
  activeIds.forEach(packId => {
    const pack = BUILTIN_PACKS_REGISTRY[packId];
    if (pack && Array.isArray(pack.words)) {
      words.push(...pack.words);
    }
  });
  return [...new Set(words)];
}

function getActiveWordPool() {
  const customWords = getActiveCustomWords();
  if (gameState.onlyCustomWords && customWords.length > 0) {
    return customWords;
  }

  const tierInfo = getCurrentTierInfo(gameState.wave);
  let words = [...tierInfo.words];

  words = words.concat(getActiveBuiltinWords());
  words = words.concat(customWords);

  return [...new Set(words)];
}

function generateNewRound(shouldSpeak = true) {
  const customWords = getActiveCustomWords();
  const builtinWords = getActiveBuiltinWords();
  const tierWords = getCurrentTierInfo(gameState.wave).words;
  const generalPool = [...new Set([...tierWords, ...builtinWords])];

  // EXCLUSIVE SPELLING WORDS MODE: Disable all other words besides custom words!
  if (gameState.onlyCustomWords) {
    if (customWords.length > 0) {
      // Target word picked 100% strictly from custom spelling words!
      let newTarget = currentWord;
      let attempts = 0;
      while ((newTarget === currentWord || !newTarget) && attempts < 25) {
        newTarget = customWords[Math.floor(Math.random() * customWords.length)];
        attempts++;
      }
      currentWord = newTarget || customWords[0];

      // Distractors strictly from other custom words so player is never confused by outside words
      const otherCustom = customWords.filter(w => w !== currentWord);
      let distractor1, distractor2;

      if (otherCustom.length >= 2) {
        const shuffled = [...otherCustom].sort(() => 0.5 - Math.random());
        distractor1 = shuffled[0];
        distractor2 = shuffled[1];
      } else if (otherCustom.length === 1) {
        distractor1 = otherCustom[0];
        distractor2 = generalPool.find(w => w !== currentWord && w !== distractor1) || 'STAR';
      } else {
        distractor1 = generalPool[0] || 'STAR';
        distractor2 = generalPool[1] || 'MOON';
      }

      currentChoices = [currentWord, distractor1, distractor2].sort(() => 0.5 - Math.random());
      render3ChoiceCards();
      saveGameData();

      if (shouldSpeak && gameState.autoSpeak && !isRelicOrChestModalOpen() && gameState.currentView === 'game') {
        setTimeout(() => {
          if (!isRelicOrChestModalOpen() && gameState.currentView === 'game') {
            speakTargetWord(currentWord);
          }
        }, 300);
      }
      return;
    } else {
      showToast('⚠️ No active spelling words! Add words in Vocab Packs or turn off Exclusive Mode.', 'hint');
    }
  }

  // Standard Mode: Guarantee custom words priority when custom pack(s) are active!
  let pickFromCustom = false;
  if (customWords.length > 0) {
    if (gameState.customWordsFocus) {
      // 100% priority in Focus Mode!
      pickFromCustom = true;
    } else {
      // 75% chance even outside Focus Mode so custom words always appear frequently
      pickFromCustom = Math.random() < 0.75;
    }
  }

  let targetCandidatePool = (pickFromCustom && customWords.length > 0) ? customWords : generalPool;
  if (!targetCandidatePool || targetCandidatePool.length === 0) {
    targetCandidatePool = tierWords;
  }

  // Select target word (avoid immediate repeat if candidate pool has > 1 word)
  let newTarget = currentWord;
  let attempts = 0;
  while ((newTarget === currentWord || !newTarget) && attempts < 25) {
    newTarget = targetCandidatePool[Math.floor(Math.random() * targetCandidatePool.length)];
    attempts++;
  }
  currentWord = newTarget || targetCandidatePool[0] || 'CAT';

  // Build distractors for the 3 choice cards
  const otherCustom = customWords.filter(w => w !== currentWord);
  const otherGeneral = generalPool.filter(w => w !== currentWord);
  const allOtherCandidates = [...new Set([...otherCustom, ...otherGeneral])].sort(() => 0.5 - Math.random());

  const distractor1 = allOtherCandidates[0] || (currentWord === 'DOG' ? 'CAT' : 'DOG');
  const distractor2 = allOtherCandidates[1] || (currentWord === 'SUN' ? 'BAT' : 'SUN');

  currentChoices = [currentWord, distractor1, distractor2].sort(() => 0.5 - Math.random());

  render3ChoiceCards();
  saveGameData();

  if (shouldSpeak && gameState.autoSpeak && !isRelicOrChestModalOpen() && gameState.currentView === 'game') {
    setTimeout(() => {
      if (!isRelicOrChestModalOpen() && gameState.currentView === 'game') {
        speakTargetWord(currentWord);
      }
    }, 300);
  }
}

// Cards dynamically expand and scale typography so words never overflow!
function render3ChoiceCards() {
  const container = document.getElementById('word-choices-container');
  if (!container) return;

  container.innerHTML = '';
  const skin = CARD_SKINS_REGISTRY[gameState.equippedCardSkin] || CARD_SKINS_REGISTRY.neon;
  const isRainbow = gameState.activeRelics.includes('rainbow_crayon');
  const vowels = ['A', 'E', 'I', 'O', 'U'];

  // Safety fallback if currentChoices was uninitialized
  if (!currentChoices || currentChoices.length < 3) {
    generateNewRound(false);
    return;
  }

  currentChoices.forEach((word) => {
    const card = document.createElement('button');

    // Dynamic typography scaling based on word length
    let fontSizeClass = 'text-2xl sm:text-4xl';
    let trackingClass = 'tracking-wider';
    let paddingClass = 'py-3.5 sm:py-5 px-3 sm:px-4';

    if (word.length >= 10) {
      fontSizeClass = 'text-sm sm:text-lg';
      trackingClass = 'tracking-tight';
      paddingClass = 'py-2.5 sm:py-3.5 px-2 sm:px-3';
    } else if (word.length >= 7) {
      fontSizeClass = 'text-base sm:text-2xl';
      trackingClass = 'tracking-normal';
      paddingClass = 'py-3 sm:py-4 px-2.5 sm:px-3';
    } else if (word.length >= 5) {
      fontSizeClass = 'text-xl sm:text-3xl';
      trackingClass = 'tracking-wide';
      paddingClass = 'py-3.5 sm:py-4.5 px-3';
    }

    card.className = `word-choice-card ${skin.cssClass} flex-1 min-w-0 ${paddingClass} rounded-2xl flex items-center justify-center font-lexend ${fontSizeClass} font-black ${trackingClass} transition-all duration-150 shadow-md text-center overflow-hidden`;

    let wordHtml = '';
    for (let char of word) {
      if (isRainbow && vowels.includes(char)) {
        wordHtml += `<span class="text-amber-300 font-black filter drop-shadow inline-block">${char}</span>`;
      } else {
        wordHtml += `<span class="inline-block">${char}</span>`;
      }
    }
    card.innerHTML = wordHtml;

    card.onclick = () => handleCardChoice(word, card);
    container.appendChild(card);
  });
}

// ============================================================================
// 9. COMBAT LOOP: CARD CHOICES (HIT / WRONG)
// ============================================================================

function handleCardChoice(chosenWord, cardElement) {
  if (isCombatLocked) return;
  // Guard against clicking or pressing number keys on an already-wrong card
  if (!cardElement || cardElement.disabled || cardElement.classList.contains('card-wrong-anim')) return;
  sounds.init();

  if (chosenWord === currentWord) {
    handleCorrectChoice(cardElement);
  } else {
    handleWrongChoice(cardElement);
  }
}

function handleCorrectChoice(cardElement) {
  isCombatLocked = true;
  cardElement.classList.add('card-correct-anim');

  const { damage, isCrit, isThunder, isDopamine } = calculatePlayerDamage();

  gameState.streak++;

  // Healing Logic: 10% heal every 3 in a row
  let healed = false;
  let totalHeal = 0;

  if (gameState.streak % 3 === 0) {
    const tenPercentHeal = Math.max(1, Math.round(gameState.playerMaxHp * 0.10));
    totalHeal += tenPercentHeal;
    healed = true;
  }

  if (gameState.activeRelics.includes('vampire_fang')) {
    totalHeal += 1;
    healed = true;
  }

  if (healed) {
    gameState.playerHp = Math.min(gameState.playerMaxHp, gameState.playerHp + totalHeal);
    sounds.playHeal();
    showHealingEffect(totalHeal);
  }

  if (isThunder || isDopamine) {
    sounds.playCrit();
    triggerScreenShake('huge');
  } else if (isCrit) {
    sounds.playCrit();
    triggerScreenShake('md');
  } else {
    sounds.playHit();
    triggerScreenShake('sm');
  }

  triggerMonsterHurt();

  const monsterRect = document.getElementById('monster-card').getBoundingClientRect();
  const hitX = monsterRect.left + monsterRect.width / 2 + (Math.random() - 0.5) * 60;
  const hitY = monsterRect.top + monsterRect.height / 2 + (Math.random() - 0.5) * 60;
  fx.addHitSparks(hitX, hitY, isCrit || isThunder ? 24 : 14, isCrit || isThunder);

  let dmgLabel = `💥 ${formatFullNumber(damage)}`;
  let dmgColor = 'text-yellow-300';
  if (isDopamine) {
    dmgLabel = `🚀 BARRAGE! ${formatFullNumber(damage)}!`;
    dmgColor = 'text-fuchsia-400';
  } else if (isThunder) {
    dmgLabel = `⚡ THUNDER! ${formatFullNumber(damage)}!`;
    dmgColor = 'text-cyan-300';
  } else if (isCrit) {
    dmgLabel = `🔥 CRIT! ${formatFullNumber(damage)}!`;
    dmgColor = 'text-amber-400';
  }
  spawnFloatingNumber(hitX, hitY, dmgLabel, dmgColor);

  currentMonster.hp = Math.max(0, currentMonster.hp - damage);
  updateMonsterUI();

  // Award hit XP (+15 XP for every correct word!)
  addPlayerXp(15);

  if (currentMonster.hp <= 0) {
    handleMonsterDefeat();
  } else {
    setTimeout(() => {
      generateNewRound(true);
      isCombatLocked = false;
    }, 450);
  }
}

function handleWrongChoice(cardElement) {
  if (!cardElement || cardElement.disabled || cardElement.classList.contains('card-wrong-anim')) return;
  cardElement.disabled = true;
  cardElement.classList.add('card-wrong-anim');
  sounds.playBonk();
  gameState.streak = 0;

  const avatar = document.getElementById('monster-avatar');
  if (avatar) {
    avatar.classList.remove('monster-attack-anim', 'animate-float');
    void avatar.offsetWidth;
    avatar.classList.add('monster-attack-anim');
    setTimeout(() => {
      avatar.classList.remove('monster-attack-anim');
      avatar.classList.add('animate-float');
    }, 550);
  }

  setTimeout(() => {
    sounds.playMonsterAttack();
    sounds.playPlayerHurt();
    triggerScreenShake('md');

    const playerRect = document.getElementById('player-stats-card').getBoundingClientRect();
    const slashX = playerRect.left + playerRect.width / 2;
    const slashY = playerRect.top + playerRect.height / 2;
    fx.addMonsterSlash(slashX, slashY);

    const damageDealt = currentMonster.attackPower || 2;
    gameState.playerHp = Math.max(0, gameState.playerHp - damageDealt);
    spawnFloatingNumber(slashX, slashY, `-${damageDealt} HP! 🩸`, 'text-rose-400');
    updateUI();

    if (gameState.playerHp <= 0) {
      handleGameOver();
      return;
    }

    if (!isRelicOrChestModalOpen()) {
      speakTargetWord(currentWord);
    }
    showToast(`Oops! Listen again and try another card! 🎧`, 'hint');
  }, 220);
}

// ============================================================================
// 10. MONSTER DEFEAT & BOSS CHEST REWARDS
// ============================================================================

function handleMonsterDefeat() {
  triggerScreenShake('huge');

  const avatar = document.getElementById('monster-avatar');
  if (avatar) {
    avatar.classList.remove('animate-float', 'monster-hurt-anim');
    avatar.classList.add('monster-defeat-anim');
  }

  const rect = document.getElementById('monster-card').getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  const isBoss = currentMonster.isBoss;

  const earnedXp = isBoss ? 120 : 40;
  const earnedScore = Math.floor(currentMonster.maxHp / 10);
  gameState.score += earnedScore;
  if (gameState.score > gameState.highScore) {
    gameState.highScore = gameState.score;
  }

  spawnFloatingNumber(centerX, centerY - 20, `+${earnedXp} XP ⭐`, 'text-cyan-300');
  addPlayerXp(earnedXp);

  saveGameData();
  updateUI();

  if (isBoss) {
    fx.addConfettiCelebration(80);
    setTimeout(() => {
      openBossChestModal();
    }, 700);
  } else {
    setTimeout(() => {
      gameState.wave++;
      checkDifficultyTransition();
      spawnMonsterForWave(gameState.wave);
      generateNewRound(true);
      isCombatLocked = false;
      updateUI();
    }, 650);
  }
}

function checkDifficultyTransition() {
  if (gameState.wave === 6) {
    showToast('🆙 TIER 2 UNLOCKED: 4-Letter Blends & Digraphs! 🌟', 'info');
  } else if (gameState.wave === 11) {
    showToast('🌍 WORLD 2 UNLOCKED: Vowel Teams & Silent E! 🚀', 'success');
  } else if (gameState.wave === 16) {
    showToast('🏰 TIER 4 UNLOCKED: 2-Syllable Phonics! ⚔️', 'info');
  } else if (gameState.wave === 21) {
    showToast('🌌 WORLD 3 UNLOCKED: Epic Master Words! 👑', 'success');
  }
}

// ============================================================================
// 11. BOSS TREASURE CHEST OPENING SEQUENCE
// ============================================================================

function openBossChestModal() {
  if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  sounds.playFanfare();

  const coinsReward = Math.floor(Math.random() * 41) + 10; // 10 to 50 coins
  const potionHeal = 10;

  const availableKeys = Object.keys(RELICS_REGISTRY).filter(
    (key) => !gameState.activeRelics.includes(key)
  );
  let relicChoices = [];
  if (availableKeys.length >= 3) {
    relicChoices = [...availableKeys].sort(() => 0.5 - Math.random()).slice(0, 3);
  } else if (availableKeys.length > 0) {
    relicChoices = [...availableKeys];
  } else {
    relicChoices = ['ruby_blade'];
  }

  pendingChestLoot = {
    coins: coinsReward,
    heal: potionHeal,
    relicChoices: relicChoices
  };

  const modal = document.getElementById('boss-chest-modal');
  const chestUnopened = document.getElementById('chest-unopened-view');
  const chestOpened = document.getElementById('chest-opened-view');

  chestUnopened.classList.remove('hidden');
  chestOpened.classList.add('hidden');
  modal.classList.remove('hidden');
}

function unlockBossChest() {
  sounds.playCoin();
  const chestIcon = document.getElementById('chest-click-icon');
  if (chestIcon) {
    chestIcon.classList.add('chest-rumble');
  }

  setTimeout(() => {
    fx.addCoinExplosion(window.innerWidth / 2, window.innerHeight / 2, 40);
    fx.addConfettiCelebration(70);

    const chestUnopened = document.getElementById('chest-unopened-view');
    const chestOpened = document.getElementById('chest-opened-view');

    chestUnopened.classList.add('hidden');
    chestOpened.classList.remove('hidden');

    document.getElementById('chest-coins-amount').textContent = `+${pendingChestLoot.coins} 🪙`;

    const relicContainer = document.getElementById('chest-relic-options');
    relicContainer.innerHTML = '';

    pendingChestLoot.relicChoices.forEach((relicId) => {
      const relic = RELICS_REGISTRY[relicId];
      const card = document.createElement('div');
      card.className = `relic-card bg-slate-900 border-3 border-yellow-400 rounded-2xl p-3 flex flex-col items-center text-center cursor-pointer transition-all hover:scale-105 active:scale-95 bg-gradient-to-b ${relic.color}/30`;
      card.innerHTML = `
        <div class="text-4xl mb-1">${relic.icon}</div>
        <div class="font-lilita text-base text-yellow-300">${relic.name}</div>
        <p class="text-[11px] text-slate-200 mt-1 mb-2 flex-1">${relic.description}</p>
        <button class="w-full py-1.5 bg-gradient-to-r from-emerald-400 to-green-500 text-slate-950 font-black rounded-xl text-xs font-lilita">
          TAKE RELIC ⚡
        </button>
      `;

      card.onclick = () => claimChestReward(relicId);
      relicContainer.appendChild(card);
    });
  }, 750);
}

function claimChestReward(selectedRelicId) {
  gameState.coins += pendingChestLoot.coins;
  gameState.playerHp = Math.min(gameState.playerMaxHp, gameState.playerHp + pendingChestLoot.heal);

  if (selectedRelicId && !gameState.activeRelics.includes(selectedRelicId)) {
    gameState.activeRelics.push(selectedRelicId);
    if (selectedRelicId === 'titan_heart') {
      gameState.playerMaxHp += 4;
      gameState.playerHp = gameState.playerMaxHp;
    }
  }

  sounds.playShopBuy();
  document.getElementById('boss-chest-modal').classList.add('hidden');

  gameState.wave++;
  checkDifficultyTransition();
  spawnMonsterForWave(gameState.wave);
  generateNewRound(false);
  isCombatLocked = false;
  saveGameData();
  updateUI();

  showToast(`Collected Chest Loot: +${pendingChestLoot.coins} Coins & Health Potion! 🎁`, 'success');

  // Voice speaks word only AFTER chest prompt closes!
  if (gameState.autoSpeak && gameState.currentView === 'game') {
    setTimeout(() => {
      speakTargetWord(currentWord);
    }, 450);
  }
}

// ============================================================================
// 12. LEVEL-UP RELIC SELECTION
// ============================================================================

function showRelicLevelUpScreen() {
  if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  sounds.playFanfare();

  const modal = document.getElementById('relic-modal');
  const container = document.getElementById('relic-choices-container');
  const title = document.getElementById('relic-modal-title');

  title.textContent = `⭐ LEVEL ${gameState.playerLevel} REACHED! CHOOSE A RELIC ⭐`;
  container.innerHTML = '';

  const availableKeys = Object.keys(RELICS_REGISTRY).filter(
    (key) => !gameState.activeRelics.includes(key)
  );

  let choices = [];
  if (availableKeys.length >= 3) {
    choices = [...availableKeys].sort(() => 0.5 - Math.random()).slice(0, 3);
  } else if (availableKeys.length > 0) {
    choices = [...availableKeys];
  } else {
    choices = ['ruby_blade'];
  }

  choices.forEach((relicId) => {
    const relic = RELICS_REGISTRY[relicId];
    const card = document.createElement('div');
    card.className = `relic-card bg-slate-800 border-4 border-purple-500 rounded-3xl p-5 flex flex-col items-center text-center cursor-pointer transition-all duration-200 transform hover:border-yellow-400 hover:scale-105 active:scale-95 bg-gradient-to-b ${relic.color}/20`;

    card.innerHTML = `
      <div class="text-6xl mb-3 filter drop-shadow-md animate-bounce">${relic.icon}</div>
      <div class="inline-block px-3 py-1 bg-yellow-400 text-slate-900 rounded-full font-black text-xs uppercase mb-2 tracking-wider font-lilita">
        ${relic.rarity}
      </div>
      <h3 class="text-2xl font-black text-white mb-2 font-lilita arcade-text-sm tracking-wide">
        ${relic.name}
      </h3>
      <p class="text-slate-200 text-sm font-semibold mb-4 leading-snug flex-1">
        ${relic.description}
      </p>
      <button class="w-full py-3 bg-gradient-to-r from-emerald-400 to-green-500 text-slate-950 font-black rounded-2xl text-lg font-lilita border-2 border-emerald-300 shadow-md">
        EQUIP RELIC ⚡
      </button>
    `;

    card.onclick = () => selectLevelUpRelic(relicId);
    container.appendChild(card);
  });

  modal.classList.remove('hidden');
}

function selectLevelUpRelic(relicId) {
  if (!gameState.activeRelics.includes(relicId)) {
    gameState.activeRelics.push(relicId);
  }

  if (relicId === 'titan_heart') {
    gameState.playerMaxHp += 4;
    gameState.playerHp = gameState.playerMaxHp;
  }

  sounds.playCoin();
  document.getElementById('relic-modal').classList.add('hidden');
  saveGameData();
  updateUI();
  showToast(`Equipped ${RELICS_REGISTRY[relicId].name}! Damage & Power Up! 🔥`, 'success');

  // ONLY speak target word after relic prompt closes!
  if (gameState.autoSpeak && gameState.currentView === 'game') {
    setTimeout(() => {
      speakTargetWord(currentWord);
    }, 400);
  }
}

// ============================================================================
// 13. MONSTER SPAWNER & THEMES
// Accurate Italian Brainrots: Ballerina Cappuccina, Tralalero Tralala, Tung Tung Tung Sahur, Strawberry Elephant
// ============================================================================

function spawnMonsterForWave(wave) {
  const isBoss = (wave % 5 === 0);
  const hp = calculateMonsterHp(wave);

  const theme = THEMES_REGISTRY[gameState.monsterTheme] || THEMES_REGISTRY.brainrot;
  let template;

  if (isBoss) {
    const bossIdx = (Math.floor(wave / 5) - 1) % theme.bosses.length;
    template = theme.bosses[bossIdx];
  } else {
    const monsterIdx = (wave - 1) % theme.monsters.length;
    template = theme.monsters[monsterIdx];
  }

  currentMonster = {
    name: template.name,
    emoji: template.emoji || null,
    image: template.image || null,
    hp: hp,
    maxHp: hp,
    attackPower: isBoss ? 4 : 2,
    level: wave,
    isBoss: isBoss
  };

  updateMonsterUI();
}

function updateMonsterUI() {
  const nameEl = document.getElementById('monster-name');
  const avatarContainer = document.getElementById('monster-avatar-container');
  const hpFill = document.getElementById('monster-hp-fill');
  const hpText = document.getElementById('monster-hp-text');
  const bossBadge = document.getElementById('boss-badge');

  if (nameEl) nameEl.textContent = currentMonster.name;

  if (avatarContainer) {
    if (currentMonster.image) {
      avatarContainer.innerHTML = `<img id="monster-avatar" src="${currentMonster.image}" class="monster-img animate-float select-none transition-transform" alt="${currentMonster.name}">`;
    } else {
      avatarContainer.innerHTML = `<div id="monster-avatar" class="text-6xl sm:text-7xl select-none filter drop-shadow-2xl animate-float transition-transform">${currentMonster.emoji || '🟢'}</div>`;
    }
  }

  if (bossBadge) {
    if (currentMonster.isBoss) {
      bossBadge.classList.remove('hidden');
    } else {
      bossBadge.classList.add('hidden');
    }
  }

  if (hpFill && hpText) {
    const pct = Math.max(0, Math.min(100, (currentMonster.hp / currentMonster.maxHp) * 100));
    hpFill.style.width = `${pct}%`;
    hpText.textContent = `${formatNumber(currentMonster.hp)} / ${formatNumber(currentMonster.maxHp)}`;

    if (pct > 50) {
      hpFill.className = 'h-full bg-gradient-to-r from-emerald-400 to-green-500 rounded-full transition-all duration-200 hp-bar-striped';
    } else if (pct > 25) {
      hpFill.className = 'h-full bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full transition-all duration-200 hp-bar-striped';
    } else {
      hpFill.className = 'h-full bg-gradient-to-r from-red-500 to-rose-600 rounded-full transition-all duration-200 hp-bar-striped';
    }
  }
}

function toggleMonsterTheme() {
  gameState.monsterTheme = (gameState.monsterTheme === 'brainrot') ? 'classic' : 'brainrot';
  sounds.playCoin();
  saveGameData();
  spawnMonsterForWave(gameState.wave);
  updateThemeButtonUI();
  const theme = THEMES_REGISTRY[gameState.monsterTheme];
  showToast(`🎭 Theme set to: ${theme.name}!`, "info");
}

function updateThemeButtonUI() {
  const theme = THEMES_REGISTRY[gameState.monsterTheme] || THEMES_REGISTRY.brainrot;
  const btnSettings = document.getElementById('btn-toggle-theme');
  if (btnSettings) btnSettings.textContent = `🎭 Theme: ${theme.name}`;

  const btnHeader = document.getElementById('btn-header-theme');
  if (btnHeader) btnHeader.textContent = theme.badge;
}

// ============================================================================
// 14. MAIN MENU & VIEW CONTROLS (BUG FIXED: CARDS ALWAYS RENDER!)
// ============================================================================

function showMainMenu() {
  gameState.currentView = 'menu';
  // Always reset the wave number and run combat state when going to the main menu
  gameState.wave = 1;
  gameState.streak = 0;
  gameState.playerHp = gameState.playerMaxHp;
  gameState.activeRelics = [];
  gameState.playerLevel = 1;
  gameState.playerXp = 0;

  spawnMonsterForWave(1);
  generateNewRound(false);

  saveGameData();

  document.getElementById('main-menu-view').classList.remove('hidden');
  document.getElementById('game-battle-view').classList.add('hidden');
  updateMainMenuStats();
  updateUI();
}

function startGame() {
  sounds.init();
  sounds.playCoin();
  gameState.currentView = 'game';
  document.getElementById('main-menu-view').classList.add('hidden');
  document.getElementById('game-battle-view').classList.remove('hidden');
  updateUI();

  // FIX: Always ensure 3 valid choice cards exist!
  if (!currentWord || !currentChoices || currentChoices.length < 3) {
    generateNewRound(true);
  } else {
    render3ChoiceCards();
    if (gameState.autoSpeak && !isRelicOrChestModalOpen()) {
      setTimeout(() => speakTargetWord(currentWord), 350);
    }
  }
}

function updateMainMenuStats() {
  const waveBadge = document.getElementById('menu-best-wave');
  if (waveBadge) waveBadge.textContent = 'Wave 1';

  const coinsEl = document.getElementById('menu-total-coins');
  if (coinsEl) coinsEl.textContent = formatNumber(gameState.coins);

  const levelEl = document.getElementById('menu-player-level');
  if (levelEl) levelEl.textContent = `Level 1`;

  const startBtn = document.getElementById('btn-main-start');
  if (startBtn) {
    startBtn.innerHTML = `<span>▶️</span> START ADVENTURE`;
  }

  // Update Inventory Badge on Main Menu
  normalizeKidInventory();
  const invCount = getTotalInventoryCount();
  const menuInvBadge = document.getElementById('menu-inventory-badge');
  if (menuInvBadge) {
    if (invCount > 0) {
      menuInvBadge.textContent = invCount;
      menuInvBadge.classList.remove('hidden');
    } else {
      menuInvBadge.classList.add('hidden');
    }
  }
}

// ============================================================================
// 15. SHOP & CUSTOM WORD LIST MODALS
// ============================================================================

function openShopModal() {
  // Only accessible from the Main Menu
  if (gameState.currentView !== 'menu') return;
  renderShop();
  document.getElementById('shop-modal').classList.remove('hidden');
}

function closeShopModal() {
  document.getElementById('shop-modal').classList.add('hidden');
  updateMainMenuStats();
  updateUI();
}

function openCustomWordsModal() {
  // Only accessible from the Main Menu
  if (gameState.currentView !== 'menu') return;
  renderCustomWordsEditor();
  document.getElementById('custom-words-modal').classList.remove('hidden');
}

function closeCustomWordsModal() {
  document.getElementById('custom-words-modal').classList.add('hidden');
  updateUI();
}

function renderShop() {
  renderCardSkinsShop();
  const coinsDisplay = document.getElementById('shop-coins-display');
  if (coinsDisplay) coinsDisplay.textContent = formatNumber(gameState.coins);
}

// ============================================================================
// VOCABULARY & CUSTOM PACK MANAGEMENT
// ============================================================================

function createCustomPack(name, icon = '📝') {
  const cleanName = (name || '').trim();
  if (!cleanName) {
    showToast('Please type a name for the new pack!', 'hint');
    return;
  }

  const newPack = {
    id: 'custom_' + Date.now(),
    name: cleanName,
    icon: icon || '📝',
    words: [],
    isActive: true,
    isCustom: true
  };

  if (!Array.isArray(gameState.customPacks)) {
    gameState.customPacks = [];
  }

  gameState.customPacks.unshift(newPack);
  sounds.playCoin();
  saveGameData();
  renderCustomWordsEditor();
  showToast(`Created pack "${newPack.name}"! Add words below ✨`, 'success');
}

function deleteCustomPack(packId) {
  // CRITICAL REQUIREMENT: Pre-installed game packs CANNOT be deleted!
  if (BUILTIN_PACKS_REGISTRY[packId]) {
    showToast('Pre-installed game packs cannot be deleted!', 'hint');
    return;
  }

  const idx = gameState.customPacks.findIndex(p => p.id === packId);
  if (idx !== -1) {
    const packName = gameState.customPacks[idx].name;
    gameState.customPacks.splice(idx, 1);
    sounds.playBonk();
    saveGameData();
    renderCustomWordsEditor();
    if (gameState.currentView === 'game') {
      generateNewRound(false);
    }
    showToast(`Deleted custom pack "${packName}" 🗑️`, 'info');
  }
}

function toggleCustomPack(packId) {
  const pack = gameState.customPacks.find(p => p.id === packId);
  if (pack) {
    pack.isActive = !pack.isActive;
    sounds.playCoin();
    saveGameData();
    renderCustomWordsEditor();
    if (gameState.currentView === 'game') {
      generateNewRound(false);
    }
    showToast(`Pack "${pack.name}" is now ${pack.isActive ? 'ACTIVE in battle' : 'INACTIVE'}!`, 'info');
  }
}

function toggleBuiltinPack(packId) {
  const pack = BUILTIN_PACKS_REGISTRY[packId];
  if (!pack) return;

  if (!Array.isArray(gameState.activeBuiltinPacks)) {
    gameState.activeBuiltinPacks = [];
  }

  if (gameState.activeBuiltinPacks.includes(packId)) {
    gameState.activeBuiltinPacks = gameState.activeBuiltinPacks.filter(id => id !== packId);
  } else {
    gameState.activeBuiltinPacks.push(packId);
  }

  sounds.playCoin();
  saveGameData();
  renderCustomWordsEditor();
  if (gameState.currentView === 'game') {
    generateNewRound(false);
  }
  const isActive = gameState.activeBuiltinPacks.includes(packId);
  showToast(`Pack "${pack.name}" is now ${isActive ? 'ACTIVE in battle' : 'INACTIVE'}!`, 'info');
}

function addWordToCustomPack(packId, rawText) {
  const pack = gameState.customPacks.find(p => p.id === packId);
  if (!pack) return;

  const parts = (rawText || '').split(/[,;\n]+/).map(s => s.trim()).filter(Boolean);
  if (parts.length === 0) return;

  let addedCount = 0;
  parts.forEach(part => {
    const cleaned = part.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 14);
    if (cleaned && !pack.words.includes(cleaned)) {
      pack.words.push(cleaned);
      addedCount++;
    }
  });

  if (addedCount > 0) {
    sounds.playCoin();
    saveGameData();
    renderCustomWordsEditor();
    if (gameState.currentView === 'game') {
      generateNewRound(false);
    }
    showToast(`Added ${addedCount} word(s) to "${pack.name}"! ✨`, 'success');
  } else {
    showToast('Word already in pack or invalid letters!', 'hint');
  }
}

function removeWordFromCustomPack(packId, wordIndex) {
  const pack = gameState.customPacks.find(p => p.id === packId);
  if (pack && pack.words && pack.words[wordIndex] !== undefined) {
    pack.words.splice(wordIndex, 1);
    saveGameData();
    renderCustomWordsEditor();
    if (gameState.currentView === 'game') {
      generateNewRound(false);
    }
  }
}

function submitAddWord(packId) {
  const input = document.getElementById(`input-add-${packId}`);
  if (input) {
    const val = input.value.trim();
    if (val) {
      addWordToCustomPack(packId, val);
      input.value = '';
    }
  }
}

function renderCustomWordsEditor() {
  // Sync Focus Toggle
  const focusCheckbox = document.getElementById('toggle-custom-focus');
  if (focusCheckbox) {
    focusCheckbox.checked = gameState.customWordsFocus !== false;
  }

  // Sync Pack Count Badge
  const countBadge = document.getElementById('custom-packs-count-badge');
  if (countBadge) {
    countBadge.textContent = `${gameState.customPacks.length} custom pack${gameState.customPacks.length === 1 ? '' : 's'}`;
  }

  // 1. Render User Custom Packs
  const customList = document.getElementById('custom-packs-list-container');
  if (customList) {
    customList.innerHTML = '';
    if (!gameState.customPacks || gameState.customPacks.length === 0) {
      customList.innerHTML = `
        <div class="p-4 bg-slate-900/60 rounded-2xl border border-dashed border-purple-500/40 text-center text-slate-400 text-xs italic">
          No custom packs yet! Type a name in the box above to create your first spelling pack.
        </div>
      `;
    } else {
      gameState.customPacks.forEach((pack) => {
        const card = document.createElement('div');
        card.className = `p-3.5 sm:p-4 rounded-2xl border-2 transition-all flex flex-col gap-2.5 shadow-md ${
          pack.isActive 
            ? 'bg-slate-900/90 border-emerald-400/80 shadow-emerald-950/40' 
            : 'bg-slate-900/60 border-slate-700/80 opacity-75'
        }`;

        // Top Header Row
        const headerRow = document.createElement('div');
        headerRow.className = 'flex flex-wrap items-center justify-between gap-2 border-b border-purple-500/20 pb-2';
        headerRow.innerHTML = `
          <div class="flex items-center gap-2">
            <span class="text-2xl">${pack.icon || '📝'}</span>
            <div>
              <h4 class="font-lilita text-base sm:text-lg text-white leading-tight">${pack.name}</h4>
              <span class="text-[11px] text-cyan-300 font-bold">${pack.words.length} word${pack.words.length === 1 ? '' : 's'}</span>
            </div>
          </div>
          <div class="flex items-center gap-1.5 ml-auto">
            <button onclick="toggleCustomPack('${pack.id}')" class="px-2.5 py-1.5 rounded-xl font-lilita text-xs font-bold transition-all cursor-pointer ${
              pack.isActive 
                ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950' 
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-600'
            }">
              ${pack.isActive ? '🟢 ACTIVE IN BATTLE' : '⚪ INACTIVE'}
            </button>
            <button onclick="if(confirm('Delete pack \\'${pack.name}\\'?')) deleteCustomPack('${pack.id}')" title="Delete custom pack" class="px-2.5 py-1.5 bg-rose-900/80 hover:bg-rose-700 active:scale-95 text-rose-200 border border-rose-500/50 rounded-xl font-lilita text-xs shadow flex items-center gap-1 cursor-pointer">
              🗑️
            </button>
          </div>
        `;
        card.appendChild(headerRow);

        // Word Input Row
        const inputRow = document.createElement('div');
        inputRow.className = 'flex gap-2';
        inputRow.innerHTML = `
          <input id="input-add-${pack.id}" type="text" placeholder="Add word(s) (e.g. TIGER, or comma-separated)..." maxlength="100" class="flex-1 px-3 py-1.5 bg-slate-950 border border-purple-400/60 rounded-xl text-white font-lexend font-bold text-xs uppercase focus:outline-none focus:border-yellow-400" onkeydown="if(event.key==='Enter') submitAddWord('${pack.id}')">
          <button onclick="submitAddWord('${pack.id}')" class="btn-chunky btn-attack px-3.5 py-1.5 text-slate-950 font-black font-lilita rounded-xl text-xs whitespace-nowrap cursor-pointer">
            ➕ ADD
          </button>
        `;
        card.appendChild(inputRow);

        // Word Chips Box
        const chipsBox = document.createElement('div');
        chipsBox.className = 'flex flex-wrap gap-1.5 p-2 bg-slate-950/70 rounded-xl border border-purple-500/20 max-h-[120px] overflow-y-auto';
        if (pack.words.length === 0) {
          chipsBox.innerHTML = '<span class="text-[11px] text-slate-400 italic">No words in this pack yet. Type a word above and click ➕ ADD!</span>';
        } else {
          pack.words.forEach((word, wIdx) => {
            const chip = document.createElement('div');
            chip.className = 'inline-flex items-center gap-1 px-2.5 py-1 bg-purple-900/80 border border-purple-400/60 rounded-full text-xs font-bold text-white shadow';
            chip.innerHTML = `
              <span>${word}</span>
              <button onclick="removeWordFromCustomPack('${pack.id}', ${wIdx})" class="text-rose-400 hover:text-rose-200 font-black ml-1 cursor-pointer" title="Remove word">✕</button>
            `;
            chipsBox.appendChild(chip);
          });
        }
        card.appendChild(chipsBox);

        customList.appendChild(card);
      });
    }
  }

  // 2. Render Built-in Pre-existing Packs (NO DELETE BUTTON)
  const builtinList = document.getElementById('builtin-packs-list-container');
  if (builtinList) {
    builtinList.innerHTML = '';
    const activeBuiltin = Array.isArray(gameState.activeBuiltinPacks) ? gameState.activeBuiltinPacks : [];

    Object.values(BUILTIN_PACKS_REGISTRY).forEach((pack) => {
      const isActive = activeBuiltin.includes(pack.id);
      const card = document.createElement('div');
      card.className = `p-3 rounded-2xl border-2 transition-all flex flex-col justify-between gap-2 shadow ${
        isActive 
          ? 'bg-slate-900/90 border-yellow-400/80' 
          : 'bg-slate-900/50 border-slate-700/70 opacity-75'
      }`;

      card.innerHTML = `
        <div class="flex items-center justify-between gap-2">
          <div class="flex items-center gap-2">
            <span class="text-2xl">${pack.icon}</span>
            <div>
              <h4 class="font-lilita text-sm sm:text-base text-white leading-tight">${pack.name}</h4>
              <span class="text-[10px] text-slate-400 font-bold">${pack.words.length} words (Built-in)</span>
            </div>
          </div>
          <button onclick="toggleBuiltinPack('${pack.id}')" class="px-2.5 py-1 rounded-xl font-lilita text-xs font-bold transition-all cursor-pointer ${
            isActive 
              ? 'bg-yellow-400 hover:bg-yellow-300 text-slate-950' 
              : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-600'
          }">
            ${isActive ? '🟢 ACTIVE' : '⚪ INACTIVE'}
          </button>
        </div>
        <div class="flex flex-wrap gap-1 mt-1 p-1.5 bg-slate-950/60 rounded-xl border border-slate-800">
          ${pack.words.map(w => `<span class="px-1.5 py-0.5 bg-slate-800/80 rounded text-[10px] font-bold text-slate-300">${w}</span>`).join('')}
        </div>
      `;

      builtinList.appendChild(card);
    });
  }
}

// Window exports for inline onclick handlers
window.createCustomPack = createCustomPack;
window.deleteCustomPack = deleteCustomPack;
window.toggleCustomPack = toggleCustomPack;
window.toggleBuiltinPack = toggleBuiltinPack;
window.addWordToCustomPack = addWordToCustomPack;
window.removeWordFromCustomPack = removeWordFromCustomPack;
window.submitAddWord = submitAddWord;
window.openCustomWordsModal = openCustomWordsModal;
window.closeCustomWordsModal = closeCustomWordsModal;

// ============================================================================
// 16. MOM SHOP & KID'S INVENTORY SYSTEM
// ============================================================================

const PRESET_MOM_EMOJIS = [
  '🍦', '🎮', '🍕', '🎬', '🛹', '🛌', '🚴', '🎁', 
  '🍩', '🏊', '🎨', '🧸', '🧁', '📱', '🎟️', '🍔', 
  '🍫', '📚', '⭐', '🎈'
];

let currentMomShopTab = 'shop';
let pendingRedeemInvId = null;

// Helper: Normalize Kid's Inventory to group items with quantity
function normalizeKidInventory() {
  if (!Array.isArray(gameState.kidInventory)) {
    gameState.kidInventory = [];
    return;
  }
  const grouped = [];
  gameState.kidInventory.forEach(item => {
    if (!item) return;
    const qty = Math.max(1, parseInt(item.quantity) || 1);
    const existing = grouped.find(g => 
      (g.shopItemId && item.shopItemId && g.shopItemId === item.shopItemId) || 
      (g.name && item.name && g.name.trim().toLowerCase() === item.name.trim().toLowerCase())
    );
    if (existing) {
      existing.quantity = (existing.quantity || 1) + qty;
      if (!existing.icon && item.icon) existing.icon = item.icon;
    } else {
      item.quantity = qty;
      if (!item.id) item.id = 'inv_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4);
      grouped.push(item);
    }
  });
  gameState.kidInventory = grouped;
}

// Helper: Get total count of all inventory items (sum of quantities)
function getTotalInventoryCount() {
  if (!Array.isArray(gameState.kidInventory)) return 0;
  return gameState.kidInventory.reduce((acc, item) => acc + (Math.max(1, parseInt(item.quantity) || 1)), 0);
}

function openMomShopModal(defaultTab = 'shop') {
  // Only accessible from the Main Menu
  if (gameState.currentView !== 'menu') return;
  currentMomShopTab = defaultTab;
  switchMomShopTab(defaultTab);
  renderMomShop();
  document.getElementById('mom-shop-modal').classList.remove('hidden');
}

function closeMomShopModal() {
  document.getElementById('mom-shop-modal').classList.add('hidden');
  updateUI();
  updateMainMenuStats();
}

function switchMomShopTab(tabName) {
  currentMomShopTab = tabName;
  const tabShop = document.getElementById('mom-shop-view-shop');
  const tabInv = document.getElementById('mom-shop-view-inv');
  const tabEditor = document.getElementById('mom-shop-view-editor');

  const btnShop = document.getElementById('tab-btn-mom-shop');
  const btnInv = document.getElementById('tab-btn-mom-inv');
  const btnEditor = document.getElementById('tab-btn-mom-editor');

  [btnShop, btnInv, btnEditor].forEach(b => {
    if (b) {
      b.classList.remove('bg-gradient-to-r', 'from-pink-500', 'to-rose-600', 'text-white', 'shadow');
      b.classList.add('text-slate-400');
    }
  });

  if (tabShop) tabShop.classList.add('hidden');
  if (tabInv) tabInv.classList.add('hidden');
  if (tabEditor) tabEditor.classList.add('hidden');

  if (tabName === 'shop') {
    if (tabShop) tabShop.classList.remove('hidden');
    if (btnShop) {
      btnShop.classList.remove('text-slate-400');
      btnShop.classList.add('bg-gradient-to-r', 'from-pink-500', 'to-rose-600', 'text-white', 'shadow');
    }
  } else if (tabName === 'inv') {
    if (tabInv) tabInv.classList.remove('hidden');
    if (btnInv) {
      btnInv.classList.remove('text-slate-400');
      btnInv.classList.add('bg-gradient-to-r', 'from-pink-500', 'to-rose-600', 'text-white', 'shadow');
    }
  } else if (tabName === 'editor') {
    if (tabEditor) tabEditor.classList.remove('hidden');
    if (btnEditor) {
      btnEditor.classList.remove('text-slate-400');
      btnEditor.classList.add('bg-gradient-to-r', 'from-pink-500', 'to-rose-600', 'text-white', 'shadow');
    }
  }

  renderMomShop();
}

function renderMomShop() {
  const coinsDisplay = document.getElementById('mom-shop-coins-display');
  if (coinsDisplay) coinsDisplay.textContent = formatNumber(gameState.coins);

  normalizeKidInventory();
  const invCount = getTotalInventoryCount();
  const invTabCount = document.getElementById('inv-tab-count');
  if (invTabCount) invTabCount.textContent = invCount;

  const menuInvBadge = document.getElementById('menu-inventory-badge');
  if (menuInvBadge) {
    if (invCount > 0) {
      menuInvBadge.textContent = invCount;
      menuInvBadge.classList.remove('hidden');
    } else {
      menuInvBadge.classList.add('hidden');
    }
  }

  renderMomShopItemsList();
  renderMomInventoryList();
  renderMomEditorList();
  renderMomPresetEmojis();
}

function renderMomShopItemsList() {
  const container = document.getElementById('mom-shop-items-grid');
  if (!container) return;

  container.innerHTML = '';
  const items = Array.isArray(gameState.momShopItems) ? gameState.momShopItems : [];

  if (items.length === 0) {
    container.innerHTML = `
      <div class="col-span-full p-6 bg-slate-900/60 rounded-2xl border border-dashed border-pink-500/40 text-center text-slate-400 text-xs sm:text-sm">
        No shop items created yet! Click <strong>"MOM'S CONTROLS"</strong> above to add reward items your kid can exchange coins for.
      </div>
    `;
    return;
  }

  items.forEach((item) => {
    const canAfford = gameState.coins >= item.price;
    const card = document.createElement('div');
    card.className = `p-3.5 sm:p-4 rounded-2xl border-2 transition-all flex flex-col justify-between gap-3 shadow-lg ${
      canAfford 
        ? 'bg-slate-900/90 border-pink-400/80 hover:border-yellow-400' 
        : 'bg-slate-900/60 border-slate-700/80 opacity-75'
    }`;

    card.innerHTML = `
      <div class="flex items-center gap-3">
        <div class="text-4xl sm:text-5xl filter drop-shadow-md animate-float">${item.icon || '🎁'}</div>
        <div class="flex-1 min-w-0">
          <h4 class="font-lilita text-base sm:text-lg text-white leading-tight truncate">${item.name}</h4>
          <div class="flex items-center gap-1 mt-1 font-lilita text-sm text-yellow-300">
            <span>🪙</span>
            <span>${item.price} Coins</span>
          </div>
        </div>
      </div>
      <button onclick="buyMomShopItem('${item.id}')" class="btn-chunky w-full py-2 px-3 rounded-xl font-lilita text-xs sm:text-sm font-black transition-all cursor-pointer ${
        canAfford 
          ? 'bg-gradient-to-r from-emerald-400 to-green-500 hover:from-emerald-300 text-slate-950 shadow-md' 
          : 'bg-slate-700 text-slate-400 cursor-not-allowed'
      }">
        ${canAfford ? `EXCHANGE 🪙 ${item.price}` : `NEED ${item.price - gameState.coins} MORE 🪙`}
      </button>
    `;

    container.appendChild(card);
  });
}

function buyMomShopItem(itemId) {
  const items = Array.isArray(gameState.momShopItems) ? gameState.momShopItems : [];
  const item = items.find(i => i.id === itemId);
  if (!item) return;

  if (gameState.coins >= item.price) {
    gameState.coins -= item.price;
    if (!Array.isArray(gameState.kidInventory)) gameState.kidInventory = [];
    normalizeKidInventory();

    const existing = gameState.kidInventory.find(inv => 
      (inv.shopItemId && inv.shopItemId === item.id) || 
      (inv.name && inv.name.trim().toLowerCase() === item.name.trim().toLowerCase())
    );

    if (existing) {
      existing.quantity = (existing.quantity || 1) + 1;
      existing.name = item.name;
      existing.icon = item.icon || existing.icon;
    } else {
      gameState.kidInventory.unshift({
        id: 'inv_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
        shopItemId: item.id,
        name: item.name,
        icon: item.icon || '🎁',
        quantity: 1,
        purchasedAt: Date.now()
      });
    }

    if (sounds) {
      sounds.playShopBuy();
      sounds.playFanfare();
    }
    if (fx) fx.addConfettiCelebration(60);
    saveGameData();
    renderMomShop();
    updateUI();
    updateMainMenuStats();
    showToast(`🎁 Exchanged for ${item.name}! Added to your Inventory!`, 'success');
  } else {
    showToast(`Need ${item.price - gameState.coins} more coins! Defeat monsters to earn coins! 🪙`, 'hint');
  }
}

function renderMomInventoryList() {
  const container = document.getElementById('mom-inv-items-grid');
  if (!container) return;

  normalizeKidInventory();
  container.innerHTML = '';
  const inv = Array.isArray(gameState.kidInventory) ? gameState.kidInventory : [];

  if (inv.length === 0) {
    container.innerHTML = `
      <div class="col-span-full p-6 bg-slate-900/60 rounded-2xl border border-dashed border-purple-500/40 text-center text-slate-400 text-xs sm:text-sm space-y-1">
        <div class="text-3xl mb-1">🎒</div>
        <p class="font-bold text-slate-300">Your inventory is empty!</p>
        <p class="text-xs text-slate-400">Earn coins by reading words & defeating bosses, then exchange them in the Reward Shop!</p>
      </div>
    `;
    return;
  }

  inv.forEach((invItem) => {
    const qty = Math.max(1, parseInt(invItem.quantity) || 1);
    const card = document.createElement('div');
    card.className = 'p-3.5 sm:p-4 rounded-2xl border-2 border-yellow-400/80 bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 shadow-xl flex flex-col justify-between gap-3 cursor-pointer transform hover:scale-[1.02] active:scale-95 transition-all';
    card.onclick = () => openRedeemModal(invItem.id);

    const qtyPill = `
      <div class="inline-flex items-center gap-1 px-2.5 py-0.5 bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 rounded-full font-black text-xs sm:text-sm font-lilita shadow">
        <span>📦</span> <span>x${qty}</span>
      </div>
    `;

    card.innerHTML = `
      <div class="flex items-center gap-3">
        <div class="text-4xl sm:text-5xl filter drop-shadow-md animate-float">${invItem.icon || '🎁'}</div>
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 flex-wrap mb-1">
            <span class="inline-block px-2 py-0.5 bg-emerald-500/20 border border-emerald-400/50 text-emerald-300 rounded-full font-black text-[10px] uppercase font-lilita">
              READY TO REDEEM
            </span>
            ${qtyPill}
          </div>
          <h4 class="font-lilita text-base sm:text-lg text-white leading-tight truncate">${invItem.name}</h4>
          <span class="text-[10px] sm:text-xs text-slate-300">${qty > 1 ? `You own ${qty} of these! Tap to redeem one.` : 'Tap to show Mom & redeem!'}</span>
        </div>
      </div>
      <button class="btn-chunky w-full py-2 px-3 rounded-xl font-lilita text-xs sm:text-sm font-black bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 shadow-md flex items-center justify-center gap-1.5 cursor-pointer">
        <span>✨</span> <span>TAP TO REDEEM WITH MOM</span> <span class="bg-slate-950/20 px-1.5 py-0.5 rounded font-black text-xs">x${qty}</span>
      </button>
    `;

    container.appendChild(card);
  });
}

function openRedeemModal(invId) {
  normalizeKidInventory();
  const inv = Array.isArray(gameState.kidInventory) ? gameState.kidInventory : [];
  const item = inv.find(i => i.id === invId);
  if (!item) return;

  pendingRedeemInvId = invId;

  const iconEl = document.getElementById('redeem-item-icon');
  const nameEl = document.getElementById('redeem-item-name');
  if (iconEl) iconEl.textContent = item.icon || '🎁';

  const qty = Math.max(1, parseInt(item.quantity) || 1);
  if (nameEl) {
    if (qty > 1) {
      nameEl.innerHTML = `${item.name} <span class="text-xs sm:text-sm text-yellow-300 block font-lexend font-bold mt-1">(Redeeming 1 of ${qty} owned)</span>`;
    } else {
      nameEl.textContent = item.name;
    }
  }

  document.getElementById('redeem-modal').classList.remove('hidden');
}

function confirmRedeemItem() {
  if (!pendingRedeemInvId) return;

  normalizeKidInventory();
  const inv = Array.isArray(gameState.kidInventory) ? gameState.kidInventory : [];
  const idx = inv.findIndex(i => i.id === pendingRedeemInvId);
  if (idx !== -1) {
    const item = inv[idx];
    const currentQty = Math.max(1, parseInt(item.quantity) || 1);

    if (currentQty > 1) {
      item.quantity = currentQty - 1;
    } else {
      inv.splice(idx, 1);
    }

    if (sounds) sounds.playFanfare();
    if (fx) fx.addConfettiCelebration(80);
    saveGameData();

    document.getElementById('redeem-modal').classList.add('hidden');
    pendingRedeemInvId = null;

    renderMomShop();
    updateUI();
    updateMainMenuStats();
    showToast(`🎉 Redeemed "${item.name}"! Enjoy your reward!`, 'success');
  }
}

function cancelRedeemModal() {
  document.getElementById('redeem-modal').classList.add('hidden');
  pendingRedeemInvId = null;
}

function renderMomPresetEmojis() {
  const container = document.getElementById('mom-preset-emojis-container');
  if (!container) return;

  container.innerHTML = '';
  PRESET_MOM_EMOJIS.forEach((emoji) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'w-8 h-8 flex items-center justify-center bg-slate-800 hover:bg-slate-700 active:scale-90 rounded-lg text-lg transition-all cursor-pointer';
    btn.textContent = emoji;
    btn.onclick = () => {
      const inputIcon = document.getElementById('input-mom-item-icon');
      if (inputIcon) inputIcon.value = emoji;
    };
    container.appendChild(btn);
  });
}

function renderMomEditorList() {
  const container = document.getElementById('mom-editor-items-list');
  if (!container) return;

  container.innerHTML = '';
  const items = Array.isArray(gameState.momShopItems) ? gameState.momShopItems : [];

  if (items.length === 0) {
    container.innerHTML = '<span class="text-xs text-slate-400 italic">No shop items yet. Create one above!</span>';
    return;
  }

  items.forEach((item) => {
    const row = document.createElement('div');
    row.className = 'flex items-center justify-between p-2.5 bg-slate-950/80 rounded-xl border border-slate-800 gap-2';

    const infoDiv = document.createElement('div');
    infoDiv.className = 'flex items-center gap-2.5 min-w-0';

    const iconSpan = document.createElement('span');
    iconSpan.className = 'text-2xl';
    iconSpan.textContent = item.icon || '🎁';

    const textDiv = document.createElement('div');
    textDiv.className = 'min-w-0';

    const nameDiv = document.createElement('div');
    nameDiv.className = 'font-lilita text-sm text-white truncate';
    nameDiv.textContent = item.name;

    const priceDiv = document.createElement('div');
    priceDiv.className = 'text-[11px] text-yellow-300 font-bold';
    priceDiv.textContent = `🪙 ${item.price} Coins`;

    textDiv.appendChild(nameDiv);
    textDiv.appendChild(priceDiv);
    infoDiv.appendChild(iconSpan);
    infoDiv.appendChild(textDiv);

    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'flex items-center gap-1.5 flex-shrink-0';

    const editBtn = document.createElement('button');
    editBtn.className = 'px-2.5 py-1 bg-indigo-700 hover:bg-indigo-600 active:scale-95 text-white rounded-lg text-xs font-lilita cursor-pointer transition-all';
    editBtn.textContent = '✏️ Edit';
    editBtn.onclick = () => editMomShopItem(item.id);

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'px-2.5 py-1 bg-rose-900 hover:bg-rose-800 active:scale-90 text-rose-200 rounded-lg text-xs font-lilita cursor-pointer transition-all';
    deleteBtn.textContent = '🗑️';
    deleteBtn.title = 'Delete Reward';
    deleteBtn.onclick = (e) => {
      e.stopPropagation();
      if (confirm(`Delete "${item.name}" from Mom Shop?`)) {
        deleteMomShopItem(item.id);
      }
    };

    actionsDiv.appendChild(editBtn);
    actionsDiv.appendChild(deleteBtn);

    row.appendChild(infoDiv);
    row.appendChild(actionsDiv);
    container.appendChild(row);
  });
}

function saveMomShopItemFromForm() {
  const idInput = document.getElementById('input-mom-item-id');
  const nameInput = document.getElementById('input-mom-item-name');
  const iconInput = document.getElementById('input-mom-item-icon');
  const priceInput = document.getElementById('input-mom-item-price');

  if (!nameInput || !priceInput) return;

  const name = nameInput.value.trim();
  const icon = (iconInput ? iconInput.value.trim() : '') || '🎁';
  const price = Math.max(5, parseInt(priceInput.value) || 50);
  const existingId = idInput ? idInput.value : '';

  if (!name) {
    showToast('Please type a name for the reward!', 'hint');
    return;
  }

  if (!Array.isArray(gameState.momShopItems)) gameState.momShopItems = [];

  if (existingId) {
    const idx = gameState.momShopItems.findIndex(i => i.id === existingId);
    if (idx !== -1) {
      gameState.momShopItems[idx].name = name;
      gameState.momShopItems[idx].icon = icon;
      gameState.momShopItems[idx].price = price;
      showToast(`Updated "${name}" in Mom Shop! ✨`, 'success');
    }
  } else {
    const newItem = {
      id: 'mom_' + Date.now(),
      name,
      icon,
      price
    };
    gameState.momShopItems.push(newItem);
    showToast(`Added "${name}" to Mom Shop! 💖`, 'success');
  }

  resetMomShopForm();
  sounds.playCoin();
  saveGameData();
  renderMomShop();
}

function editMomShopItem(itemId) {
  const items = Array.isArray(gameState.momShopItems) ? gameState.momShopItems : [];
  const item = items.find(i => i.id === itemId);
  if (!item) return;

  const idInput = document.getElementById('input-mom-item-id');
  const nameInput = document.getElementById('input-mom-item-name');
  const iconInput = document.getElementById('input-mom-item-icon');
  const priceInput = document.getElementById('input-mom-item-price');
  const formTitle = document.getElementById('mom-editor-form-title');
  const saveBtn = document.getElementById('btn-save-mom-item');
  const cancelBtn = document.getElementById('btn-cancel-edit-mom-item');

  if (idInput) idInput.value = item.id;
  if (nameInput) {
    nameInput.value = item.name;
    nameInput.focus();
  }
  if (iconInput) iconInput.value = item.icon || '🎁';
  if (priceInput) priceInput.value = item.price;

  if (formTitle) formTitle.innerHTML = '<span>✏️</span> Edit Mom Shop Reward';
  if (saveBtn) saveBtn.textContent = '💾 SAVE REWARD CHANGES';
  if (cancelBtn) cancelBtn.classList.remove('hidden');
}

function resetMomShopForm() {
  const idInput = document.getElementById('input-mom-item-id');
  const nameInput = document.getElementById('input-mom-item-name');
  const iconInput = document.getElementById('input-mom-item-icon');
  const priceInput = document.getElementById('input-mom-item-price');
  const formTitle = document.getElementById('mom-editor-form-title');
  const saveBtn = document.getElementById('btn-save-mom-item');
  const cancelBtn = document.getElementById('btn-cancel-edit-mom-item');

  if (idInput) idInput.value = '';
  if (nameInput) nameInput.value = '';
  if (iconInput) iconInput.value = '🍦';
  if (priceInput) priceInput.value = '50';

  if (formTitle) formTitle.innerHTML = '<span>➕</span> Add New Mom Shop Reward';
  if (saveBtn) saveBtn.textContent = '➕ ADD REWARD TO SHOP';
  if (cancelBtn) cancelBtn.classList.add('hidden');
}

function deleteMomShopItem(itemId) {
  const items = Array.isArray(gameState.momShopItems) ? gameState.momShopItems : [];
  const idx = items.findIndex(i => i.id === itemId);
  if (idx !== -1) {
    const name = items[idx].name;
    items.splice(idx, 1);
    if (sounds) sounds.playBonk();

    const idInput = document.getElementById('input-mom-item-id');
    if (idInput && idInput.value === itemId) {
      resetMomShopForm();
    }

    saveGameData();
    renderMomShop();
    showToast(`Removed "${name}" from Mom Shop 🗑️`, 'info');
  }
}

function toggleOnlyCustomWords(forceState = null) {
  if (forceState !== null) {
    gameState.onlyCustomWords = forceState;
  } else {
    gameState.onlyCustomWords = !gameState.onlyCustomWords;
  }

  saveGameData();
  updateUI();

  if (gameState.currentView === 'game') {
    generateNewRound(false);
  }

  if (gameState.onlyCustomWords) {
    const count = getActiveCustomWords().length;
    showToast(`🎯 Only Spelling Words Mode ON! Disabled all other words (${count} words active).`, 'success');
  } else {
    showToast('Standard Mode: Default words enabled.', 'info');
  }
}

// Window exports
window.openMomShopModal = openMomShopModal;
window.closeMomShopModal = closeMomShopModal;
window.switchMomShopTab = switchMomShopTab;
window.buyMomShopItem = buyMomShopItem;
window.openRedeemModal = openRedeemModal;
window.confirmRedeemItem = confirmRedeemItem;
window.cancelRedeemModal = cancelRedeemModal;
window.editMomShopItem = editMomShopItem;
window.deleteMomShopItem = deleteMomShopItem;
window.toggleOnlyCustomWords = toggleOnlyCustomWords;

function renderCardSkinsShop() {
  const container = document.getElementById('shop-card-skins-list');
  if (!container) return;

  container.innerHTML = '';
  Object.values(CARD_SKINS_REGISTRY).forEach((skin) => {
    const isUnlocked = gameState.unlockedCardSkins.includes(skin.id);
    const isEquipped = gameState.equippedCardSkin === skin.id;

    const card = document.createElement('div');
    card.className = `p-3 rounded-2xl flex flex-col justify-between items-center text-center border-3 ${skin.cssClass} transition-all`;

    let actionBtnHtml = '';
    if (!isUnlocked) {
      const canAfford = gameState.coins >= skin.price;
      actionBtnHtml = `
        <button onclick="buyCardSkin('${skin.id}')" class="w-full mt-2 py-1.5 px-2 rounded-xl font-lilita text-xs text-slate-950 font-bold ${canAfford ? 'bg-yellow-400 hover:bg-yellow-300' : 'bg-slate-600 opacity-60 cursor-not-allowed'}">
          🪙 ${skin.price} Coins
        </button>
      `;
    } else if (isEquipped) {
      actionBtnHtml = `
        <div class="w-full mt-2 py-1.5 px-2 rounded-xl font-lilita text-xs font-black bg-emerald-500 text-slate-950">
          ✓ EQUIPPED
        </div>
      `;
    } else {
      actionBtnHtml = `
        <button onclick="equipCardSkin('${skin.id}')" class="w-full mt-2 py-1.5 px-2 rounded-xl font-lilita text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white">
          EQUIP SKIN
        </button>
      `;
    }

    card.innerHTML = `
      <div class="text-3xl mb-1">${skin.icon}</div>
      <h4 class="font-lilita text-base">${skin.name}</h4>
      <div class="text-[11px] font-lexend font-bold opacity-80 my-1">PREVIEW</div>
      ${actionBtnHtml}
    `;

    container.appendChild(card);
  });
}

function buyCardSkin(skinId) {
  const skin = CARD_SKINS_REGISTRY[skinId];
  if (!skin) return;

  if (gameState.coins >= skin.price) {
    gameState.coins -= skin.price;
    gameState.unlockedCardSkins.push(skinId);
    gameState.equippedCardSkin = skinId;
    sounds.playShopBuy();
    saveGameData();
    renderShop();
    render3ChoiceCards();
    updateUI();
    showToast(`Equipped ${skin.name} Card Skin! 🃏`, 'success');
  } else {
    showToast(`Need ${skin.price - gameState.coins} more coins! 🪙`, 'hint');
  }
}

function equipCardSkin(skinId) {
  if (gameState.unlockedCardSkins.includes(skinId)) {
    gameState.equippedCardSkin = skinId;
    sounds.playCoin();
    saveGameData();
    renderCardSkinsShop();
    render3ChoiceCards();
    showToast(`Equipped ${CARD_SKINS_REGISTRY[skinId].name}! ✨`, 'info');
  }
}

// ============================================================================
// 16. VISUAL JUICE & FEEDBACK HELPERS
// ============================================================================

function triggerScreenShake(intensity = 'sm') {
  const container = document.getElementById('game-app');
  if (!container) return;

  container.classList.remove('shake-sm', 'shake-md', 'shake-huge');
  void container.offsetWidth;

  if (intensity === 'sm') container.classList.add('shake-sm');
  else if (intensity === 'md') container.classList.add('shake-md');
  else if (intensity === 'huge') container.classList.add('shake-huge');

  setTimeout(() => {
    container.classList.remove('shake-sm', 'shake-md', 'shake-huge');
  }, 480);
}

function triggerMonsterHurt() {
  const avatar = document.getElementById('monster-avatar');
  if (!avatar) return;

  avatar.classList.remove('monster-hurt-anim');
  void avatar.offsetWidth;
  avatar.classList.add('monster-hurt-anim');

  setTimeout(() => {
    avatar.classList.remove('monster-hurt-anim');
  }, 360);
}

function showHealingEffect(amount = 2) {
  const hpEl = document.getElementById('player-hp-bar');
  if (hpEl) {
    hpEl.classList.add('animate-heart-pop');
    setTimeout(() => hpEl.classList.remove('animate-heart-pop'), 400);
  }

  const rect = document.getElementById('player-stats-card').getBoundingClientRect();
  fx.addHealingHearts(rect.left + rect.width / 2, rect.top + 20, 8);
  spawnFloatingNumber(rect.left + rect.width / 2, rect.top, `+${amount} HP! 💖`, "text-rose-400");
}

function spawnFloatingNumber(x, y, text, colorClass = 'text-yellow-300') {
  const el = document.createElement('div');
  el.className = `floating-dmg arcade-text text-3xl sm:text-4xl font-extrabold ${colorClass}`;
  el.textContent = text;
  el.style.left = `${x}px`;
  el.style.top = `${y}px`;

  document.body.appendChild(el);

  setTimeout(() => {
    if (el && el.parentNode) {
      el.parentNode.removeChild(el);
    }
  }, 1000);
}

function showToast(message, type = 'info') {
  const toast = document.getElementById('game-toast');
  if (!toast) return;

  toast.textContent = message;
  toast.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-full font-bold text-sm sm:text-base shadow-2xl transition-all duration-300 pointer-events-none arcade-text-sm border-2';

  if (type === 'hint') {
    toast.classList.add('bg-blue-600', 'text-yellow-200', 'border-yellow-400');
  } else if (type === 'success') {
    toast.classList.add('bg-emerald-600', 'text-white', 'border-emerald-300');
  } else {
    toast.classList.add('bg-purple-700', 'text-white', 'border-purple-400');
  }

  toast.style.opacity = '1';
  toast.style.transform = 'translate(-50%, 0) scale(1)';

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translate(-50%, -15px) scale(0.9)';
  }, 2600);
}

// ============================================================================
// 17. UI BINDINGS & UPDATES
// ============================================================================

function updateUI() {
  const waveEl = document.getElementById('current-wave-badge');
  const worldIndex = Math.floor((gameState.wave - 1) / 10) + 1;
  const waveInSet = ((gameState.wave - 1) % 10) + 1;
  if (waveEl) waveEl.textContent = `WORLD ${worldIndex} • WAVE ${waveInSet}/10`;

  const tierEl = document.getElementById('current-tier-display');
  if (tierEl) {
    if (gameState.onlyCustomWords) {
      const customCount = getActiveCustomWords().length;
      tierEl.textContent = `🎯 Spelling List Only (${customCount} Words)`;
      tierEl.className = 'text-[11px] sm:text-xs text-amber-300 font-lexend font-bold tracking-wide mt-0.5 drop-shadow-sm text-center animate-pulse';
    } else {
      const tierInfo = getCurrentTierInfo(gameState.wave);
      tierEl.textContent = tierInfo.name;
      tierEl.className = 'text-[11px] sm:text-xs text-yellow-300 font-lexend font-bold tracking-wide mt-0.5 drop-shadow-sm text-center';
    }
  }

  // Sync Exclusive Spelling Words Toggle
  const btnToggleOnlyCustom = document.getElementById('btn-toggle-only-custom');
  if (btnToggleOnlyCustom) {
    if (gameState.onlyCustomWords) {
      btnToggleOnlyCustom.textContent = '🟢 ON (SPELLING ONLY)';
      btnToggleOnlyCustom.className = 'btn-chunky px-3 py-1.5 rounded-xl font-lilita text-xs font-bold transition-all cursor-pointer bg-emerald-500 text-slate-950 shadow';
    } else {
      btnToggleOnlyCustom.textContent = '⚪ OFF';
      btnToggleOnlyCustom.className = 'btn-chunky px-3 py-1.5 rounded-xl font-lilita text-xs font-bold transition-all cursor-pointer bg-slate-700 text-slate-300 border border-slate-600';
    }
  }

  const toggleOnlyCustomVocab = document.getElementById('toggle-only-custom-vocab');
  if (toggleOnlyCustomVocab) {
    toggleOnlyCustomVocab.checked = gameState.onlyCustomWords === true;
  }

  // Sync Inventory Badges & Mom Shop Coins
  normalizeKidInventory();
  const invCount = getTotalInventoryCount();
  const menuInvBadge = document.getElementById('menu-inventory-badge');
  if (menuInvBadge) {
    if (invCount > 0) {
      menuInvBadge.textContent = invCount;
      menuInvBadge.classList.remove('hidden');
    } else {
      menuInvBadge.classList.add('hidden');
    }
  }
  const momCoinsDisplay = document.getElementById('mom-shop-coins-display');
  if (momCoinsDisplay) momCoinsDisplay.textContent = formatNumber(gameState.coins);

  const coinsEl = document.getElementById('coins-display');
  if (coinsEl) coinsEl.textContent = formatNumber(gameState.coins);

  const scoreEl = document.getElementById('score-display');
  if (scoreEl) scoreEl.textContent = formatNumber(gameState.score);

  const highScoreEl = document.getElementById('highscore-display');
  if (highScoreEl) highScoreEl.textContent = formatNumber(gameState.highScore);

  const levelBadge = document.getElementById('player-level-badge');
  if (levelBadge) levelBadge.textContent = `LVL ${gameState.playerLevel}`;

  const xpNeeded = getXpNeededForLevel(gameState.playerLevel);
  const xpPct = Math.max(0, Math.min(100, (gameState.playerXp / xpNeeded) * 100));
  const xpFill = document.getElementById('player-xp-fill');
  const xpText = document.getElementById('player-xp-text');
  if (xpFill) xpFill.style.width = `${xpPct}%`;
  if (xpText) xpText.textContent = `${gameState.playerXp} / ${xpNeeded} XP`;

  const streakEl = document.getElementById('streak-display');
  if (streakEl) {
    streakEl.textContent = `🔥 ${gameState.streak}`;
    if (gameState.streak >= 3) {
      streakEl.className = 'text-yellow-300 font-black animate-pulse';
    } else {
      streakEl.className = 'text-white font-bold';
    }
  }

  const hpFill = document.getElementById('player-hp-fill');
  const hpText = document.getElementById('player-hp-text');
  if (hpFill && hpText) {
    const hpPct = Math.max(0, Math.min(100, (gameState.playerHp / gameState.playerMaxHp) * 100));
    hpFill.style.width = `${hpPct}%`;
    hpText.textContent = `${gameState.playerHp} / ${gameState.playerMaxHp} HP`;
  }

  const streakProgressEl = document.getElementById('streak-heal-indicator');
  if (streakProgressEl) {
    const hitsNeeded = 3 - (gameState.streak % 3);
    if (hitsNeeded === 3 && gameState.streak > 0) {
      streakProgressEl.textContent = '💖 Healed 10% HP! Keep going!';
    } else {
      streakProgressEl.textContent = `💖 ${hitsNeeded} in a row to heal 10% HP!`;
    }
  }

  renderRelicsBar();
  updateThemeButtonUI();
}

function renderRelicsBar() {
  const container = document.getElementById('active-relics-list');
  if (!container) return;

  container.innerHTML = '';
  if (gameState.activeRelics.length === 0) {
    container.innerHTML = '<span class="text-xs text-slate-400 italic">Level up or open boss chests to earn relics!</span>';
    return;
  }

  gameState.activeRelics.forEach((relicId) => {
    const relic = RELICS_REGISTRY[relicId];
    if (!relic) return;

    const badge = document.createElement('div');
    badge.className = 'flex items-center gap-1.5 px-3 py-1 bg-slate-800/90 border-2 border-purple-400 rounded-2xl shadow cursor-pointer transform hover:scale-105 active:scale-95 transition-all';
    badge.title = relic.description;
    badge.innerHTML = `
      <span class="text-lg">${relic.icon}</span>
      <span class="text-xs font-black text-white font-lilita hidden sm:inline">${relic.name}</span>
    `;

    badge.onclick = () => {
      showToast(`${relic.name}: ${relic.description}`, 'info');
    };

    container.appendChild(badge);
  });
}

function handleGameOver() {
  isCombatLocked = true;
  const modal = document.getElementById('game-over-modal');
  if (modal) {
    modal.classList.remove('hidden');
  }
}

function revivePlayer() {
  const cost = 25;
  if (gameState.coins >= cost) {
    gameState.coins -= cost;
    gameState.playerHp = gameState.playerMaxHp;
    document.getElementById('game-over-modal').classList.add('hidden');
    isCombatLocked = false;
    saveGameData();
    updateUI();
    generateNewRound(true);
    showToast('Revived with full health! Go get them! 💖', 'success');
  } else {
    showToast(`Need ${cost - gameState.coins} more coins to revive! Click Return to Main Menu.`, 'hint');
  }
}

// ============================================================================
// 18. PERSISTENCE (SAVES WORDS & CARDS SO REFRESH NEVER BREAKS)
// ============================================================================

function saveGameData() {
  try {
    const dataToSave = {
      wave: gameState.wave,
      playerLevel: gameState.playerLevel,
      playerXp: gameState.playerXp,
      playerHp: gameState.playerHp,
      playerMaxHp: gameState.playerMaxHp,
      streak: gameState.streak,
      score: gameState.score,
      highScore: gameState.highScore,
      coins: gameState.coins,
      activeRelics: gameState.activeRelics,
      unlockedPacks: gameState.unlockedPacks,
      activePacks: gameState.activePacks,
      activeBuiltinPacks: gameState.activeBuiltinPacks,
      customPacks: gameState.customPacks,
      customWordsFocus: gameState.customWordsFocus,
      onlyCustomWords: gameState.onlyCustomWords,
      momShopItems: gameState.momShopItems,
      kidInventory: gameState.kidInventory,
      customWords: getActiveCustomWords(),
      unlockedCardSkins: gameState.unlockedCardSkins,
      equippedCardSkin: gameState.equippedCardSkin,
      monsterTheme: gameState.monsterTheme,
      soundEnabled: gameState.soundEnabled,
      ttsEnabled: gameState.ttsEnabled,
      autoSpeak: gameState.autoSpeak,
      savedWord: currentWord,
      savedChoices: currentChoices
    };
    localStorage.setItem('lexicon_roguelike_save', JSON.stringify(dataToSave));
  } catch (err) {
    console.warn("LocalStorage save warning:", err);
  }
}

function loadSaveData() {
  try {
    const raw = localStorage.getItem('lexicon_roguelike_save');
    if (raw) {
      const saved = JSON.parse(raw);
      // Main menu always resets wave to 1
      gameState.wave = 1;
      gameState.playerLevel = saved.playerLevel || 1;
      gameState.playerXp = saved.playerXp || 0;
      gameState.playerMaxHp = saved.playerMaxHp || 20;
      gameState.playerHp = Math.min(saved.playerHp || 20, gameState.playerMaxHp);
      gameState.streak = saved.streak || 0;
      gameState.score = saved.score || 0;
      gameState.highScore = saved.highScore || 0;
      gameState.coins = saved.coins || 0;
      gameState.activeRelics = Array.isArray(saved.activeRelics) ? saved.activeRelics : [];
      gameState.unlockedPacks = Array.isArray(saved.unlockedPacks) ? saved.unlockedPacks : [];
      gameState.activePacks = Array.isArray(saved.activePacks) ? saved.activePacks : [];

      gameState.activeBuiltinPacks = Array.isArray(saved.activeBuiltinPacks)
        ? saved.activeBuiltinPacks
        : (Array.isArray(saved.activePacks) ? saved.activePacks : []);

      gameState.customWordsFocus = saved.customWordsFocus !== false;
      gameState.onlyCustomWords = saved.onlyCustomWords === true;

      if (Array.isArray(saved.momShopItems)) {
        gameState.momShopItems = saved.momShopItems;
      }
      if (Array.isArray(saved.kidInventory)) {
        gameState.kidInventory = saved.kidInventory;
        normalizeKidInventory();
      }

      if (Array.isArray(saved.customPacks) && saved.customPacks.length > 0) {
        gameState.customPacks = saved.customPacks;
      } else if (Array.isArray(saved.customWords) && saved.customWords.length > 0) {
        // Automatic backward-compatible migration from old single list into custom pack
        gameState.customPacks = [{
          id: 'custom_' + Date.now(),
          name: 'My Spelling Words',
          icon: '✏️',
          words: saved.customWords.map(w => String(w).toUpperCase().trim()),
          isActive: true,
          isCustom: true
        }];
      } else {
        // Fresh initial custom pack
        gameState.customPacks = [{
          id: 'custom_spelling_1',
          name: 'My Spelling Words',
          icon: '📝',
          words: ['SPIDER', 'ROCKET', 'DRAGON', 'FRIEND'],
          isActive: true,
          isCustom: true
        }];
      }

      gameState.customWords = getActiveCustomWords();
      gameState.unlockedCardSkins = Array.isArray(saved.unlockedCardSkins) ? saved.unlockedCardSkins : ['neon'];
      gameState.equippedCardSkin = saved.equippedCardSkin || 'neon';
      gameState.monsterTheme = saved.monsterTheme || 'brainrot';
      if (typeof saved.soundEnabled === 'boolean') gameState.soundEnabled = saved.soundEnabled;
      if (typeof saved.ttsEnabled === 'boolean') gameState.ttsEnabled = saved.ttsEnabled;
      if (typeof saved.autoSpeak === 'boolean') gameState.autoSpeak = saved.autoSpeak;

      if (saved.savedWord) currentWord = saved.savedWord;
      if (Array.isArray(saved.savedChoices) && saved.savedChoices.length >= 3) {
        currentChoices = saved.savedChoices;
      }
    }
  } catch (err) {
    console.warn("LocalStorage load error:", err);
  }
}

function resetGame() {
  gameState.wave = 1;
  gameState.playerLevel = 1;
  gameState.playerXp = 0;
  gameState.playerMaxHp = 20;
  gameState.playerHp = 20;
  gameState.streak = 0;
  gameState.score = 0;
  gameState.activeRelics = [];
  currentWord = null;
  currentChoices = [];
  saveGameData();
  spawnMonsterForWave(1);
  generateNewRound(false);
  updateUI();
  updateMainMenuStats();
  showToast("New Run Started from Wave 1! 🌟", "info");
}

// ============================================================================
// 19. INITIALIZATION & EVENT BINDINGS
// ============================================================================

function initGame() {
  loadSaveData();
  fx = new ParticleSystem();
  bindUIEvents();

  spawnMonsterForWave(gameState.wave);

  // FIX: Ensure valid 3 choices exist immediately on boot
  if (!currentWord || !currentChoices || currentChoices.length < 3) {
    generateNewRound(false);
  } else {
    render3ChoiceCards();
  }

  updateUI();
  showMainMenu();
}

function bindUIEvents() {
  // Main Menu Navigation
  const btnMainStart = document.getElementById('btn-main-start');
  if (btnMainStart) btnMainStart.onclick = startGame;

  const btnMainShop = document.getElementById('btn-main-shop');
  if (btnMainShop) btnMainShop.onclick = openShopModal;

  const btnMainMomShop = document.getElementById('btn-main-mom-shop');
  if (btnMainMomShop) btnMainMomShop.onclick = () => openMomShopModal('shop');

  const btnMainCustomWords = document.getElementById('btn-main-custom-words');
  if (btnMainCustomWords) btnMainCustomWords.onclick = openCustomWordsModal;

  const btnMainSettings = document.getElementById('btn-main-settings');
  if (btnMainSettings) {
    btnMainSettings.onclick = () => document.getElementById('settings-modal').classList.remove('hidden');
  }

  // Header Shortcuts
  const btnReturnMenu = document.getElementById('btn-return-menu');
  if (btnReturnMenu) btnReturnMenu.onclick = showMainMenu;

  // Speaker / Microphone Replay Button
  const btnSpeak = document.getElementById('btn-speak-word');
  if (btnSpeak) {
    btnSpeak.onclick = () => {
      speakTargetWord(currentWord);
      triggerScreenShake('sm');
    };
  }

  // Theme Toggles
  const btnHeaderTheme = document.getElementById('btn-header-theme');
  if (btnHeaderTheme) btnHeaderTheme.onclick = toggleMonsterTheme;

  const btnToggleTheme = document.getElementById('btn-toggle-theme');
  if (btnToggleTheme) btnToggleTheme.onclick = toggleMonsterTheme;

  // Shop Close
  const btnCloseShop = document.getElementById('btn-close-shop');
  if (btnCloseShop) btnCloseShop.onclick = closeShopModal;

  // Shop shortcuts to Vocab Packs
  const btnShopOpenVocab = document.getElementById('btn-shop-open-vocab');
  if (btnShopOpenVocab) {
    btnShopOpenVocab.onclick = () => {
      closeShopModal();
      openCustomWordsModal();
    };
  }

  // Custom Words / Vocab Modal Close
  const btnCloseCustomWords = document.getElementById('btn-close-custom-words');
  if (btnCloseCustomWords) btnCloseCustomWords.onclick = closeCustomWordsModal;

  // Create New Pack Form bindings
  const btnCreatePack = document.getElementById('btn-create-pack');
  const inputPackName = document.getElementById('input-new-pack-name');
  const selectPackIcon = document.getElementById('select-new-pack-icon');

  function handleCreatePackSubmit() {
    if (inputPackName) {
      const name = inputPackName.value.trim();
      const icon = selectPackIcon ? selectPackIcon.value : '📝';
      if (name) {
        createCustomPack(name, icon);
        inputPackName.value = '';
      } else {
        showToast('Please type a name for your new pack!', 'hint');
      }
    }
  }

  if (btnCreatePack) btnCreatePack.onclick = handleCreatePackSubmit;
  if (inputPackName) {
    inputPackName.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handleCreatePackSubmit();
    });
  }

  // Focus Mode Checkbox
  const toggleFocus = document.getElementById('toggle-custom-focus');
  if (toggleFocus) {
    toggleFocus.onchange = (e) => {
      gameState.customWordsFocus = e.target.checked;
      saveGameData();
      showToast(gameState.customWordsFocus ? '🎯 Focus Mode ON: Prioritizing custom words!' : 'Focus Mode OFF: Mixing words evenly.', 'info');
      if (gameState.currentView === 'game') {
        generateNewRound(false);
      }
    };
  }

  // Boss Chest Open Tap
  const chestClickArea = document.getElementById('chest-click-area');
  if (chestClickArea) chestClickArea.onclick = unlockBossChest;

  // Audio Toggles
  const btnSound = document.getElementById('btn-toggle-sound');
  if (btnSound) {
    btnSound.onclick = () => {
      gameState.soundEnabled = !gameState.soundEnabled;
      btnSound.textContent = gameState.soundEnabled ? '🔊 Sound: ON' : '🔇 Sound: OFF';
      sounds.init();
      saveGameData();
    };
  }

  const btnAutoSpeak = document.getElementById('btn-toggle-autospeak');
  if (btnAutoSpeak) {
    btnAutoSpeak.onclick = () => {
      gameState.autoSpeak = !gameState.autoSpeak;
      btnAutoSpeak.textContent = gameState.autoSpeak ? '🗣️ Auto-Speak: ON' : '🗣️ Auto-Speak: OFF';
      saveGameData();
    };
  }

  // Settings Modal
  const btnOpenSettings = document.getElementById('btn-open-settings');
  const modalSettings = document.getElementById('settings-modal');
  const btnCloseSettings = document.getElementById('btn-close-settings');

  if (btnOpenSettings && modalSettings) {
    btnOpenSettings.onclick = () => modalSettings.classList.remove('hidden');
  }
  if (btnCloseSettings && modalSettings) {
    btnCloseSettings.onclick = () => modalSettings.classList.add('hidden');
  }

  // Game Over Buttons: Revive with 25 coins OR Return to Main Menu
  const btnReviveCoins = document.getElementById('btn-revive-coins');
  const btnGameOverMenu = document.getElementById('btn-game-over-menu');
  if (btnReviveCoins) btnReviveCoins.onclick = () => revivePlayer();
  if (btnGameOverMenu) {
    btnGameOverMenu.onclick = () => {
      document.getElementById('game-over-modal').classList.add('hidden');
      isCombatLocked = false;
      showMainMenu();
    };
  }

  // Mom Shop Modal Events
  const btnCloseMomShop = document.getElementById('btn-close-mom-shop');
  if (btnCloseMomShop) btnCloseMomShop.onclick = closeMomShopModal;

  const tabBtnMomShop = document.getElementById('tab-btn-mom-shop');
  if (tabBtnMomShop) tabBtnMomShop.onclick = () => switchMomShopTab('shop');

  const tabBtnMomInv = document.getElementById('tab-btn-mom-inv');
  if (tabBtnMomInv) tabBtnMomInv.onclick = () => switchMomShopTab('inv');

  const tabBtnMomEditor = document.getElementById('tab-btn-mom-editor');
  if (tabBtnMomEditor) tabBtnMomEditor.onclick = () => switchMomShopTab('editor');

  const btnSaveMomItem = document.getElementById('btn-save-mom-item');
  if (btnSaveMomItem) btnSaveMomItem.onclick = saveMomShopItemFromForm;

  const btnCancelEditMomItem = document.getElementById('btn-cancel-edit-mom-item');
  if (btnCancelEditMomItem) btnCancelEditMomItem.onclick = resetMomShopForm;

  // Quick Price Helper Buttons
  document.querySelectorAll('.btn-quick-price').forEach(b => {
    b.onclick = () => {
      const priceInput = document.getElementById('input-mom-item-price');
      if (priceInput) priceInput.value = b.dataset.price;
    };
  });

  // Redeem Modal Events
  const btnConfirmRedeem = document.getElementById('btn-confirm-redeem');
  if (btnConfirmRedeem) btnConfirmRedeem.onclick = confirmRedeemItem;

  const btnCancelRedeem = document.getElementById('btn-cancel-redeem');
  if (btnCancelRedeem) btnCancelRedeem.onclick = cancelRedeemModal;

  // Exclusive Spelling Words (Disable All Other Words) Toggles
  const btnToggleOnlyCustom = document.getElementById('btn-toggle-only-custom');
  if (btnToggleOnlyCustom) {
    btnToggleOnlyCustom.onclick = () => toggleOnlyCustomWords();
  }

  const toggleOnlyCustomVocab = document.getElementById('toggle-only-custom-vocab');
  if (toggleOnlyCustomVocab) {
    toggleOnlyCustomVocab.onchange = (e) => toggleOnlyCustomWords(e.target.checked);
  }

  // Keyboard Shortcuts
  window.addEventListener('keydown', (e) => {
    if (gameState.currentView !== 'game') return;
    if (isRelicOrChestModalOpen()) return;
    if (!document.getElementById('settings-modal').classList.contains('hidden')) return;
    if (!document.getElementById('shop-modal').classList.contains('hidden')) return;
    if (!document.getElementById('mom-shop-modal').classList.contains('hidden')) return;
    if (!document.getElementById('redeem-modal').classList.contains('hidden')) return;
    if (!document.getElementById('game-over-modal').classList.contains('hidden')) return;
    if (!document.getElementById('custom-words-modal').classList.contains('hidden')) return;

    if (e.code === 'Space' || e.key === 's' || e.key === 'S') {
      e.preventDefault();
      speakTargetWord(currentWord);
    } else if (e.key === '1' || e.key === '2' || e.key === '3') {
      const idx = parseInt(e.key) - 1;
      const cards = document.querySelectorAll('.word-choice-card');
      // BUG FIX: Ignore keyboard input if the card is disabled or marked wrong!
      if (cards[idx] && !cards[idx].disabled && !cards[idx].classList.contains('card-wrong-anim')) {
        cards[idx].click();
      }
    }
  });
}

// Start game when DOM is ready
window.addEventListener('DOMContentLoaded', () => {
  initGame();

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch((err) => {
      console.log('SW registration note:', err);
    });
  }
});
