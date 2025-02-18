/**
 * Reto:
 * 1. Mostrar un modal luego de 15 segundos de inactividad}
 * 2. Detectar cuando el usuario regresa y eliminar modal
 *
 * Notas:
 * - Util para modales de "inactividad" o "mostrar contenido actualizado"
 */

const INACTIVITY_SECONDS = 10
const INACTIVITY_MILLISECONDS = INACTIVITY_SECONDS * 1000
let timeoutId = null

const createInitialLayout = () => {
  document.body.innerText = `Para ver la alerta, no interactues con esta página por ${INACTIVITY_SECONDS} segundos`
}

const showInactivityAlert = () => {
  const dialog = document.createElement('dialog')
  dialog.open = true
  dialog.innerText = 'Detectamos inactividad en el sitio'
  document.body.appendChild(dialog)
}

const removeInactivityAlert = () => {
  const dialog = document.querySelector('dialog')
  if (dialog) dialog.remove()
}

const resetInactivity = () => {
  removeInactivityAlert()

  timeoutId = setTimeout(() => {
    showInactivityAlert()
  }, INACTIVITY_MILLISECONDS)
}

document.addEventListener('DOMContentLoaded', () => {
  createInitialLayout()
  clearTimeout(timeoutId)
  resetInactivity()

  document.addEventListener('mousemove', (event) => {
    clearTimeout(timeoutId)
    resetInactivity()
  })
})

/** Notas de solucion
 * - Para una detección de inactividad más robusta, se debería usar otros métodos como keydown o clik
 */
