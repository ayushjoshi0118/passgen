<div align="center">

  <h1>🔑 KeyCraft — Password Generator</h1>

  <p><strong>A simple, modern, cryptographically secure password generator built with vanilla HTML, CSS, and JavaScript.</strong></p>

  <p>
    <a href="#features">Features</a> •
    <a href="#live-demo">Live Demo</a> •
    <a href="#quick-start">Quick Start</a> •
    <a href="#project-structure">Project Structure</a> •
    <a href="#how-it-works">How It Works</a> •
    <a href="#deployment">Deployment</a> •
    <a href="#license">License</a>
  </p>

  <p>
    <img src="https://img.shields.io/badge/Language-HTML5%20%7C%20CSS3%20%7C%20JS-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="Vanilla Stack" />
    <img src="https://img.shields.io/badge/Dependencies-0-brightgreen?style=for-the-badge" alt="Zero Dependencies" />
    <img src="https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge" alt="License: MIT" />
    <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=for-the-badge" alt="PRs Welcome" />
  </p>

</div>

---

## ✨ Features

- 🔐 **Cryptographically Secure Entropy**: Generates truly randomized passwords using the browser's native `window.crypto.getRandomValues()` API (no predictable `Math.random()`).
- 📏 **Adjustable Password Length**: Smooth slider allowing lengths from **8 to 32 characters** with real-time numeric indicator and track highlight.
- 🎛️ **Granular Character Toggles**:
  - Uppercase letters (`A-Z`)
  - Lowercase letters (`a-z`)
  - Numbers (`0-9`)
  - Special symbols (`!@#$%^&*...`)
- 🛡️ **Guaranteed Diversity**: Guarantees that at least one character from each checked option is included, followed by a Fisher-Yates shuffle.
- 📋 **One-Click Copy to Clipboard**: Instant copy with visual checkmark feedback and a floating tooltip notification.
- 📊 **Dynamic Password Strength Meter**: Evaluates length and variety into a 4-tier color-coded indicator (*Very Weak*, *Weak*, *Medium*, *Strong*).
- 🌙 **Modern Dark Theme Design**: Glassmorphic card styling, ambient background glow, accessible focus rings, and full mobile responsiveness.
- ⚡ **Zero Dependencies & Zero Build Steps**: No frameworks, node modules, bundlers, or backend required. Ready to run directly in any browser.

---

## 🌐 Live Demo

You can easily host this project using **GitHub Pages**:
1. Fork or push this repository to GitHub.
2. Go to **Settings** > **Pages**.
3. Under **Branch**, select `main` and root `/`, then click **Save**.
4. Your site will be live at:
   `https://<your-username>.github.io/<repository-name>/`

---

## 🚀 Quick Start

### 1. Clone the repository
```bash
git clone https://github.com/<your-username>/passgen.git
cd passgen
```

### 2. Run locally
Since this is a 100% client-side web application, you can simply open `index.html` in your favorite web browser:

- **Windows (PowerShell)**:
  ```powershell
  Start-Process "index.html"
  ```
- **macOS**:
  ```bash
  open index.html
  ```
- **Linux**:
  ```bash
  xdg-open index.html
  ```

Or use the **Live Server** extension in VS Code.

---

## 📁 Project Structure

```text
passgen/
├── index.html        # Semantic HTML5 markup, SVG icons, and SEO metadata
├── style.css         # Modern dark theme styling, variables & responsive layout
├── script.js         # Cryptographic generation, clipboard copy & strength calculation
├── .gitignore        # Git ignore rules for clean repository tracking
├── LICENSE           # Open-source MIT License
└── README.md         # Documentation & guide
```

---

## 🧠 How It Works

### 1. Cryptographically Secure Randomness
Standard `Math.random()` in JavaScript is pseudo-random and not secure for generating passwords or tokens. KeyCraft uses `window.crypto.getRandomValues()`:

```javascript
function getSecureRandomInt(max) {
  const randomBuffer = new Uint32Array(1);
  window.crypto.getRandomValues(randomBuffer);
  return randomBuffer[0] % max;
}
```

### 2. Guaranteed Character Inclusion & Shuffling
When options like *Numbers* or *Symbols* are enabled, a purely random generator might occasionally omit them by random chance in shorter lengths. KeyCraft prevents this:
1. Picks at least one character from each enabled set.
2. Fills the remaining length from the merged character pool.
3. Shuffles the whole array using the **Fisher-Yates algorithm** with secure random integers so that the guaranteed characters are thoroughly mixed.

### 3. Client-Side Only
All password generation occurs entirely inside your local browser tab. No passwords or inputs are ever sent over a network.

---

## 🛠️ Built With

- **HTML5**: Semantic structure and embedded SVG vector icons.
- **CSS3**: CSS Custom Properties, Flexbox, CSS Grid, Glassmorphism, and responsive breakpoints.
- **Vanilla JavaScript (ES6+)**: Web Crypto API, Clipboard API, and DOM event listeners.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!
Feel free to check out the [issues page](https://github.com) if you would like to contribute.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
