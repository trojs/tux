/* eslint-disable no-param-reassign */
let started = false

/**
 * @param {HTMLAudioElement} music
 * @returns {void}
 */
export function playMusic (music) {
  if (!started && music instanceof HTMLAudioElement) {
    music.volume = 0.5
    music.play()
    started = true
  }
}

// Listen for the first user interaction to start music
window.addEventListener('keydown', playMusic, { once: true })
window.addEventListener('mousedown', playMusic, { once: true })
