/**
 * Implementa una función que permita buscar un producto en "inventario" por su clave primaria (ID).
 *  Muestra el producto encontrado en la página.
 */

const DB_NAME = 'productos'
const DB_VERSION = '1.0'
const ITEMS = [
  { name: 'libro', price: 32 },
  { name: 'gafas', price: 81 },
  { name: 'macbook', price: 232 },
  { name: 'agua', price: 2 },
  { name: 'agua1', price: 2 },
  { name: 'agua2', price: 2 },
  { name: 'agua3', price: 2 },
  { name: 'agua4', price: 2 },
  { name: 'agua5', price: 2 },
  { name: 'agua6', price: 2 },
  { name: 'agua7', price: 2 },
  { name: 'agua8', price: 2 },
  { name: 'agua9', price: 2 }
]

const initializeStorage = () => {
  indexedDB.deleteDatabase(DB_NAME)
  const openRequest = indexedDB.open(DB_NAME, DB_VERSION)

  openRequest.onupgradeneeded = () => {
    const db = openRequest.result

    if (!db.objectStoreNames.contains('inventario')) {
      db.createObjectStore('inventario', {
        keyPath: 'id',
        autoIncrement: true
      })
    }
  }

  openRequest.onerror = () => {
    console.log('Error', openRequest.error)
  }

  openRequest.onsuccess = () => {
    const db = openRequest.result

    const transaction = db.transaction('inventario', 'readwrite')
    const inventario = transaction.objectStore('inventario')

    // Agregar items
    ITEMS.forEach((item) => {
      inventario.add(item)
    })
  }
}

const searchItem = (itemKey) => {
  const openRequest = indexedDB.open(DB_NAME, DB_VERSION)

  openRequest.onsuccess = () => {
    const db = openRequest.result
    const transaction = db.transaction('inventario')
    const inventario = transaction.objectStore('inventario')

    console.log(
      `########## Buscando valor de item con key = ${itemKey} ##########`
    )
    console.log(
      'Nota: Se esta buscando por la clave definida al crear el store -> id'
    )

    inventario.get(itemKey).onsuccess = (event) => {
      console.log(event.target?.result ?? 'ITEM NO EXISTE')
    }
  }
}

const generalSearchs = () => {
  const openRequest = indexedDB.open(DB_NAME, DB_VERSION)

  openRequest.onsuccess = () => {
    const db = openRequest.result
    const transaction = db.transaction('inventario')
    const inventario = transaction.objectStore('inventario')

    console.log('########## Busquedas generales ##########')

    inventario.get(1).onsuccess = (event) =>
      console.log('Valor de objeto con clave 1', event.target?.result)

    inventario.getKey(1).onsuccess = (event) =>
      console.log('Clave de objeto con clave 1: ', event.target?.result)

    inventario.getAll().onsuccess = (event) =>
      console.log('Todos los items: ', event.target?.result)

    inventario.getAllKeys(IDBKeyRange.bound(3, 5, true, true)).onsuccess = (
      event
    ) =>
      console.log(
        'Todos las keys de items con claves entre 3 y 5 (sin incluir = 4)',
        event.target?.result
      )

    inventario.getAll(IDBKeyRange.bound(3, 5)).onsuccess = (event) =>
      console.log(
        'Todos los valores de items con claves entre 3 y 5 (incluidas)',
        event.target?.result
      )

    inventario.getAll(IDBKeyRange.lowerBound(6)).onsuccess = (event) =>
      console.log('Todos los valores con keys >= a 6', event.target?.result)

    inventario.count().onsuccess = (event) =>
      console.log('Todos los items', event.target?.result)
  }
}

const createLayout = () => {
  const inputSearch = document.createElement('input')
  inputSearch.setAttribute('placeholder', 'Buscar...')
  inputSearch.setAttribute('id', 'search')

  const button = document.createElement('button')
  button.innerText = 'Buscar'

  button.addEventListener('click', () => {
    const input = document.querySelector('#search')
    if (!input) return

    const inputQuery = isNaN(Number(input.value))
      ? input.value
      : Number(input.value)

    searchItem(inputQuery)
  })

  const button2 = document.createElement('button')
  button2.innerText = 'Buscar - Generales'
  button2.addEventListener('click', generalSearchs)

  document.body.appendChild(inputSearch)
  document.body.appendChild(button)
  document.body.appendChild(button2)
}

document.addEventListener('DOMContentLoaded', () => {
  createLayout()
  initializeStorage()
})

/** Notas de solución:
 *
 * Tipo de queries por key:
 * - get(query): Busca el primer valor, por clave o rango
 * - getAll(query, count): Busca todos los valores, limite de [count]
 * - getKey(query): Busca la primera clave que satisface la consulta
 * - getKeyAll(query, consulta): Busca la odas las claves que satisfacen la consulta
 * - count(query): Indica cuantas claves satisfacen la consulta
 *
 *
 * Consulta por rangos
 * IDBKeyRange.bound(lower, upper, [lowerOpen], [upperOpne]): Entre lower y upper
 * IDBKeyRange.lowerBound(lower, [open]): Todos los >= (o >) de lower
 * IDBKeyRange.upperBound(upper, [open]): Todos los <= (o <) de upper
 */
