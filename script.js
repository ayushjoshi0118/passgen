/**
 * KeyCraft Password Generator
 * Pure Vanilla JavaScript (Beginner-Friendly & Modular)
 */

// =============================================================================
// 1. Character Sets Definition
// =============================================================================
const CHAR_SETS = {
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  numbers: "0123456789",
  symbols: "!@#$%^&*()_+-=[]{}|;:,.<>?"
};

// =============================================================================
// 2. DOM Elements Cache
// =============================================================================
const passwordDisplay = document.getElementById("password-display");
const copyBtn = document.getElementById("copy-btn");
const refreshBtn = document.getElementById("refresh-btn");
const generateBtn = document.getElementById("generate-btn");

const lengthSlider = document.getElementById("length-slider");
const lengthDisplay = document.getElementById("length-display");

const optUppercase = document.getElementById("opt-uppercase");
const optLowercase = document.getElementById("opt-lowercase");
const optNumbers = document.getElementById("opt-numbers");
const optSymbols = document.getElementById("opt-symbols");
const warningMsg = document.getElementById("warning-msg");

const strengthContainer = document.querySelector(".strength-container");
const strengthLabel = document.getElementById("strength-label");
const strengthMeter = document.getElementById("strength-meter");

// Array of all checkbox inputs for easier batch operations
const checkboxes = [optUppercase, optLowercase, optNumbers, optSymbols];

// Timeout handle for copy feedback reset
let copyTimeoutId = null;

// =============================================================================
// 3. Cryptographically Secure Random Utilities
// =============================================================================

/**
 * Returns a cryptographically secure random integer between 0 (inclusive)
 * and max (exclusive).
 * 
 * Note for beginners: We use `window.crypto.getRandomValues()` instead of 
 * `Math.random()` because it generates non-predictable, cryptographically 
 * safe numbers ideal for security and password generation.
 */
function getSecureRandomInt(max) {
  const randomBuffer = new Uint32Array(1);
  window.crypto.getRandomValues(randomBuffer);
  return randomBuffer[0] % max;
}

/**
 * Randomly picks one character from a given string.
 */
function getRandomChar(charString) {
  const index = getSecureRandomInt(charString.length);
  return charString[index];
}

/**
 * Shuffles an array in place using the Fisher-Yates algorithm
 * powered by cryptographically secure random values.
 */
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = getSecureRandomInt(i + 1);
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// =============================================================================
// 4. Password Generation Logic
// =============================================================================

/**
 * Main password generation function.
 * Gathers user settings, ensures at least one character from each selected
 * character set is included, and fills the remaining length randomly.
 */
function generatePassword() {
  const length = parseInt(lengthSlider.value, 10);

  // Determine active character sets
  const activeSets = [];
  if (optUppercase.checked) activeSets.push(CHAR_SETS.uppercase);
  if (optLowercase.checked) activeSets.push(CHAR_SETS.lowercase);
  if (optNumbers.checked) activeSets.push(CHAR_SETS.numbers);
  if (optSymbols.checked) activeSets.push(CHAR_SETS.symbols);

  // Validation: If no character types are selected, show warning
  if (activeSets.length === 0) {
    warningMsg.classList.add("show");
    passwordDisplay.value = "";
    updateStrength(0, 0);
    return;
  }

  // Hide warning if valid
  warningMsg.classList.remove("show");

  const passwordChars = [];

  // Step A: Guarantee at least one character from each selected category
  activeSets.forEach(set => {
    passwordChars.push(getRandomChar(set));
  });

  // Step B: Build combined pool of all allowed characters
  const combinedPool = activeSets.join("");

  // Step C: Fill the rest of the password length from the combined pool
  for (let i = passwordChars.length; i < length; i++) {
    passwordChars.push(getRandomChar(combinedPool));
  }

  // Step D: Shuffle the characters so guaranteed characters aren't always at the start
  const finalPassword = shuffleArray(passwordChars).join("");

  // Step E: Render output and update strength rating
  passwordDisplay.value = finalPassword;
  calculateAndRenderStrength(finalPassword, length, activeSets.length);
}

// =============================================================================
// 5. Password Strength Calculation
// =============================================================================

/**
 * Calculates strength score based on length and variety of character sets.
 * Maps score to 4 tiers:
 *   1 = Very Weak
 *   2 = Weak
 *   3 = Medium
 *   4 = Strong
 */
function calculateAndRenderStrength(password, length, varietyCount) {
  let score = 0;

  // Length points
  if (length >= 8) score += 1;
  if (length >= 12) score += 1;
  if (length >= 16) score += 1;
  if (length >= 24) score += 1;

  // Character variety points
  score += varietyCount;

  // Map total score (ranging from ~2 to 8) to 1 - 4 levels
  let level = 1;
  if (score >= 7) {
    level = 4; // Strong
  } else if (score >= 5) {
    level = 3; // Medium
  } else if (score >= 3) {
    level = 2; // Weak
  } else {
    level = 1; // Very Weak
  }

  updateStrength(level);
}

/**
 * Updates UI styling for the password strength meter and text label.
 */
function updateStrength(level) {
  // Remove existing strength classes
  strengthContainer.classList.remove("strength-1", "strength-2", "strength-3", "strength-4");

  const labels = {
    0: "None",
    1: "Very Weak",
    2: "Weak",
    3: "Medium",
    4: "Strong"
  };

  if (level > 0) {
    strengthContainer.classList.add(`strength-${level}`);
  }

  strengthLabel.textContent = labels[level] || "None";
  strengthMeter.setAttribute("aria-valuenow", level);
}

// =============================================================================
// 6. Copy to Clipboard Functionality
// =============================================================================

/**
 * Copies the generated password to the user's clipboard and
 * provides immediate visual feedback.
 */
async function copyToClipboard() {
  const password = passwordDisplay.value;
  if (!password) return;

  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(password);
    } else {
      // Fallback for older browsers
      passwordDisplay.select();
      document.execCommand("copy");
    }

    // Trigger visual feedback (checkmark icon + tooltip)
    copyBtn.classList.add("copied");

    if (copyTimeoutId) clearTimeout(copyTimeoutId);
    copyTimeoutId = setTimeout(() => {
      copyBtn.classList.remove("copied");
    }, 2000);

  } catch (err) {
    console.error("Failed to copy password:", err);
  }
}

// =============================================================================
// 7. Event Listeners & UI Binding
// =============================================================================

/**
 * Updates the slider track background so the portion to the left of the thumb
 * is highlighted with the primary theme color.
 */
function updateSliderProgress() {
  const min = parseInt(lengthSlider.min, 10) || 8;
  const max = parseInt(lengthSlider.max, 10) || 32;
  const val = parseInt(lengthSlider.value, 10);
  const percentage = ((val - min) / (max - min)) * 100;
  lengthSlider.style.background = `linear-gradient(to right, #6366f1 ${percentage}%, #1e293b ${percentage}%)`;
}

// Update slider value display, track progress, and re-generate on slide
lengthSlider.addEventListener("input", (e) => {
  lengthDisplay.textContent = e.target.value;
  updateSliderProgress();
  generatePassword();
});

// Re-generate password when any checkbox option is changed
checkboxes.forEach(checkbox => {
  checkbox.addEventListener("change", () => {
    // Check if at least one checkbox is checked
    const anyChecked = checkboxes.some(box => box.checked);
    if (!anyChecked) {
      // If user unchecked the last box, warn them
      warningMsg.classList.add("show");
      passwordDisplay.value = "";
      updateStrength(0);
    } else {
      warningMsg.classList.remove("show");
      generatePassword();
    }
  });
});

// Generate button click
generateBtn.addEventListener("click", () => {
  generatePassword();
});

// Refresh button click with quick icon rotation animation
refreshBtn.addEventListener("click", () => {
  refreshBtn.classList.add("spin-anim");
  generatePassword();
  setTimeout(() => {
    refreshBtn.classList.remove("spin-anim");
  }, 400);
});

// Copy button click
copyBtn.addEventListener("click", copyToClipboard);

// Copy on clicking the password input field directly
passwordDisplay.addEventListener("click", () => {
  if (passwordDisplay.value) {
    copyToClipboard();
  }
});

// =============================================================================
// 8. Initialization
// =============================================================================

// Generate an initial password when the page loads
document.addEventListener("DOMContentLoaded", () => {
  lengthDisplay.textContent = lengthSlider.value;
  updateSliderProgress();
  generatePassword();
});
