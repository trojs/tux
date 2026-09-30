/* eslint-disable no-param-reassign */
let started = false

/**
 * @param {HTMLAudioElement} music
 * @returns {void}
 */
export function playMusic (music) {
  if (!started && typeof HTMLAudioElement !== 'undefined' && music instanceof HTMLAudioElement) {
    music.volume = 0.5
    void Promise.resolve(music.play()).catch(() => {})
    started = true
  }
}
