import "./index.css"

const root = document.documentElement
const btn = document.getElementById("themeToggle")
const btnLabel = document.getElementById("themeToggleLabel")
const btnIcon = document.getElementById("themeToggleIcon")
const profileImage = document.getElementById("profileImage")
const spotifyIcon = document.getElementById("spotifyIcon")
const KEY = "theme"
const BASE_URL = import.meta.env.BASE_URL

function applyTheme(theme) {
  root.classList.toggle("dark", theme === "dark")
  updateThemeButton(theme)
  applyThemeAssets(theme)
}

function updateThemeButton(theme) {
  if (!btn || !btnLabel) return

  const nextModeLabel = theme === "dark" ? "" : ""
  btnLabel.textContent = nextModeLabel
  if (btnIcon) {
    btnIcon.src =
      theme === "dark"
        ? `${BASE_URL}assets/icon/lightMode.png`
        : `${BASE_URL}assets/icon/darkMode.png`
  }
  btn.setAttribute("aria-label", `${nextModeLabel}`)
}

function swapImageByTheme(element, theme) {
  if (!element) return
  const nextSrc = theme === "dark" ? element.dataset.darkSrc : element.dataset.lightSrc
  if (nextSrc) {
    element.src = nextSrc
  }
}

function applyThemeAssets(theme) {
  swapImageByTheme(profileImage, theme)
  swapImageByTheme(spotifyIcon, theme)
}

function getInitialTheme() {
  const saved = localStorage.getItem(KEY)
  if (saved === "dark" || saved === "light") return saved
  return "dark"
}

let theme = getInitialTheme()
applyTheme(theme)

btn?.addEventListener("click", () => {
  theme = theme === "dark" ? "light" : "dark"
  localStorage.setItem(KEY, theme)
  applyTheme(theme)
})
