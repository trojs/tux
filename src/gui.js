const canvas = document.createElement('canvas')
const ctx = canvas.getContext('2d')
canvas.width = 800
canvas.height = 600
canvas.style.backgroundColor = '#000000'
canvas.style.border = '1px solid black'
document.body.appendChild(canvas)

export {
  canvas,
  ctx
}
