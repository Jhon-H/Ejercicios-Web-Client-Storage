/**
 * Reto:
 * 1. Abrir varias pestañas con la misma página
 * 2. Agregar items a localstorage (Tab 1)
 * 3. Ir a Tab 2, sin recargar, debemos poder ver los items agregados en Tab 1
 *
 * Notas:
 * - Util en casos donde necesitamos sincronizar, por ejemplo, un carrito
 */

const generateId = () => {
  return Math.round(Math.random() * 1000)
}

const addItemToLocalStorage = (newItem) => {
  const oldItems = JSON.parse(localStorage.getItem('items')) ?? []
  oldItems.push(newItem)
  localStorage.setItem('items', JSON.stringify(oldItems))
}

const addItem = () => {
  const id = generateId()
  addItemToLocalStorage(id)
  renderItem(id)
}

const renderItem = (id) => {
  const list = document.querySelector('#list')
  const newItem = document.createElement('p')

  newItem.innerText = id
  list.appendChild(newItem)
}

const clearContent = () => {
  const list = document.querySelector('#list')
  if (list) list.innerHTML = ''
}

const loadLocalStorage = () => {
  clearContent()
  const items = JSON.parse(localStorage.getItem('items')) ?? []
  items.forEach(renderItem)
}

const renderLayoutContent = () => {
  const list = document.createElement('ul')
  list.setAttribute('id', 'list')
  document.body.appendChild(list)

  const addItemBtn = document.createElement('button')
  addItemBtn.innerText = 'Agregar Item'
  addItemBtn.addEventListener('click', addItem)
  document.body.appendChild(addItemBtn)
}

window.addEventListener('DOMContentLoaded', () => {
  renderLayoutContent()
  loadLocalStorage()

  // Add another localStorage key-item, for testing porpouses
  localStorage.setItem('no-used', 'blablabla')
})

//* !!!!!!!! Esto es lo importante para el reto
window.addEventListener('storage', (event) => {
  if (event.key === 'items') {
    //* Items modificados por otras tabs, sincronizar!!
    console.log({ event })
    loadLocalStorage()
  }
})

/** Notas solución
 * - Usar evento storage para detectar cuando se modifica localStorage/sessionStorage
 * - Ref: https://developer.mozilla.org/en-US/docs/Web/API/Window/storage_event
 * - Algo importante a considerar, es que el evento solo se lanza si otro contexto o documento,
 *  modifican el storage. Es decir, el evento no se ejecturá en la misma tab donde se agregó el item
 * - Con event.key podemos validar si se modificó la key que necesitamos
 */
