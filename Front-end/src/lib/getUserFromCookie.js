export function getUserFromCookie() {
  const match = document.cookie.match(/(^| )userInfo=([^;]+)/)
  if (!match) return null

  try {
    return JSON.parse(decodeURIComponent(match[2]))
  } catch (err) {
    console.error("Failed to parse userInfo cookie:", err)
    return null
  }
}
