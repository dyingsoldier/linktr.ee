import "./index.css"

const root = document.documentElement
const btn = document.getElementById("themeToggle")
const btnLabel = document.getElementById("themeToggleLabel")
const btnIcon = document.getElementById("themeToggleIcon")
const profileImage = document.getElementById("profileImage")
const spotifyIcon = document.getElementById("spotifyIcon")
const KEY = "theme"
const BASE_URL = import.meta.env.BASE_URL
const imageLoadCache = new Map()

function resolveAssetPath(path) {
  if (!path) return ""
  return path.startsWith("http") || path.startsWith("/") ? path : `${BASE_URL}${path}`
}

function preloadImage(src) {
  const resolvedSrc = resolveAssetPath(src)
  if (!resolvedSrc) return Promise.resolve()
  if (imageLoadCache.has(resolvedSrc)) return imageLoadCache.get(resolvedSrc)

  const img = new Image()
  const loadPromise = new Promise((resolve, reject) => {
    img.onload = async () => {
      try {
        if (img.decode) await img.decode()
      } catch {}
      resolve(resolvedSrc)
    }
    img.onerror = reject
  })

  img.src = resolvedSrc
  imageLoadCache.set(resolvedSrc, loadPromise)
  return loadPromise
}

function setProfileImageLoading(isLoading) {
  profileImage?.parentElement?.classList.toggle("is-loading", isLoading)
}

function preloadThemeAssets() {
  const assets = [
    profileImage?.dataset.lightSrc,
    profileImage?.dataset.darkSrc,
    spotifyIcon?.dataset.lightSrc,
    spotifyIcon?.dataset.darkSrc,
    "assets/icon/lightMode.png",
    "assets/icon/darkMode.png",
  ]

  assets.filter(Boolean).forEach((src) => {
    preloadImage(src).catch(() => {})
  })
}

function applyTheme(theme) {
  root.classList.toggle("dark", theme === "dark")
  updateThemeButton(theme)
  applyThemeAssets(theme)
}

function updateThemeButton(theme) {
  if (!btn || !btnLabel) return

  const nextModeLabel = theme === "dark" ? "Ativar modo claro" : "Ativar modo escuro"
  btnLabel.textContent = nextModeLabel
  if (btnIcon) {
    btnIcon.src =
      theme === "dark"
        ? resolveAssetPath("assets/icon/lightMode.png")
        : resolveAssetPath("assets/icon/darkMode.png")
  }
  btn.setAttribute("aria-label", `${nextModeLabel}`)
}

async function swapImageByTheme(element, theme, { showLoading = false } = {}) {
  if (!element) return
  const nextSrc = theme === "dark" ? element.dataset.darkSrc : element.dataset.lightSrc
  const resolvedSrc = resolveAssetPath(nextSrc)
  if (!resolvedSrc || element.src.endsWith(resolvedSrc)) return

  let loadingTimer
  if (showLoading) {
    loadingTimer = setTimeout(() => setProfileImageLoading(true), 80)
  }

  try {
    await preloadImage(resolvedSrc)
  } catch {} finally {
    clearTimeout(loadingTimer)
  }

  element.src = resolvedSrc
  if (showLoading) {
    setProfileImageLoading(false)
  }
}

function applyThemeAssets(theme, options) {
  swapImageByTheme(profileImage, theme, { showLoading: options?.showLoading })
  swapImageByTheme(spotifyIcon, theme)
}

function getInitialTheme() {
  const saved = localStorage.getItem(KEY)
  if (saved === "dark" || saved === "light") return saved
  return "dark"
}

let theme = getInitialTheme()
applyTheme(theme)
preloadThemeAssets()

btn?.addEventListener("click", () => {
  theme = theme === "dark" ? "light" : "dark"
  localStorage.setItem(KEY, theme)
  root.classList.toggle("dark", theme === "dark")
  updateThemeButton(theme)
  applyThemeAssets(theme, { showLoading: true })
})
