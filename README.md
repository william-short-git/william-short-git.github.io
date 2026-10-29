# ⚔️ Lexicon Roguelike 📖

> A high-dopamine, endless-wave phonics & reading roguelike game designed specifically for children with ADHD, inspired by fast-paced Roblox simulator aesthetics (like *Pet Simulator 99*).

🌐 **Play Online:** [https://william-short-git.github.io](https://william-short-git.github.io)

---

## 🎮 Core Features

* **Engaging Phonics Progression:**
  * 10 levels per set across increasing difficulty tiers (CVC short vowels, consonant blends & digraphs, long vowel teams, and multi-syllable challenge words).
* **3-Choice Battle Encounters:**
  * Clean, high-contrast, dyslexia-friendly typography ([Lexend](https://fonts.google.com/specimen/Lexend) & [Lilita One](https://fonts.google.com/specimen/Lilita+One)).
  * Speech synthesis audio with crystal-clear pronunciation of target words.
  * Zero-punishment soft fails: incorrect answers shake comically without penalizing health or causing frustration.
* **Roguelike Progression & Boss Battles:**
  * Draft powerful relics upon leveling up (e.g. *Vampire Fang*, *Critical Glasses*, *Hyper Potion*, *Magnet Ring*).
  * Defeat bosses every 5th wave to unlock high-yield Treasure Chests packed with coins and potions.
* **Mom Shop & Kid's Inventory System:**
  * Parents can create and manage custom real-world rewards (e.g., *Ice Cream Treat*, *Video Game Time*, *Movie Night Choice*) with custom prices and preset emoji icons.
  * Children exchange coins earned by reading to purchase rewards into their Inventory.
  * Items stack neatly with quantity tracking (`x3`).
  * Tap-to-redeem flow: kids show their screen to Mom and tap **"Redeem Reward"** to claim with celebratory confetti and sound effects.
* **Custom Spelling Lists & Exclusive Mode:**
  * Create custom vocabulary packs for school spelling homework.
  * **"Only Spelling Words"** setting disables all built-in tier words, drawing 100% of quiz cards strictly from the child's active spelling list.
* **Meme Themes & Arcade Juice:**
  * Switch between the hilarious **Italian Brainrot** meme cast (*Ballerina Cappuccina*, *Tralalero Tralala*, *Tung Tung Tung Sahur*, *Strawberry Elephant*) and **Classic Fantasy Monsters**.
  * Floating damage counters, screen shake, CSS particle explosions, and Web Audio API synthesized arcade sounds.
* **Zero Backend & Offline PWA Support:**
  * Single-page Progressive Web App installable on iOS, Android, macOS, and Windows.
  * 100% offline-ready via Service Worker cache and `localStorage` persistence.

---

## 🛠️ Tech Stack

* **Frontend:** HTML5, Tailwind CSS, Vanilla JavaScript (ES6+)
* **Audio:** Procedural Web Audio API synth + SpeechSynthesis API (no heavy MP3 assets)
* **Fonts:** Lexend & Lilita One (Google Fonts)
* **Storage:** Browser `localStorage`
* **Hosting:** GitHub Pages

---

## 📄 License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.
