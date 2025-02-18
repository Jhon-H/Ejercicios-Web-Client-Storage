/**
 * Agrega un índice para la propiedad name en el store "inventario".
 * Implementa una función que permita buscar productos por nombre utilizando este índice.
 * Implementar función que permite buscar por tags
 */

const DB_NAME = 'productos'
const DB_VERSION = '1.0'
const ITEMS = [
  { name: 'libro', price: 32, tags: ['lectura', 'educación'] },
  { name: 'gafas', price: 81, tags: ['accesorios', 'moda'] },
  { name: 'macbook', price: 232, tags: ['tecnología', 'computadoras'] },
  { name: 'agua', price: 2, tags: ['bebida', 'agua', 'salud'] },
  { name: 'agua', price: 23, tags: ['bebida', 'agua'] },
  { name: 'agua', price: 34, tags: ['bebida'] },
  { name: 'agua', price: 45, tags: ['salud'] },
  { name: 'agua', price: 56664, tags: ['lujo', 'agua'] },
  { name: 'agua1', price: 2, tags: ['bebida', 'agua', 'económico'] },
  { name: 'agua2', price: 2, tags: ['bebida', 'agua', 'económico'] },
  { name: 'agua3', price: 2, tags: ['bebida', 'agua'] },
  { name: 'agua4', price: 2, tags: ['agua', 'salud'] },
  { name: 'agua5', price: 2, tags: ['bebida', 'económico'] },
  { name: 'agua6', price: 2, tags: ['agua', 'salud'] },
  { name: 'agua7', price: 2, tags: ['bebida', 'económico'] },
  { name: 'agua8', price: 2, tags: ['bebida', 'económico'] },
  { name: 'agua9', price: 2, tags: ['bebida', 'agua', 'económico'] }
]

const initializeStorage = () => {
  indexedDB.deleteDatabase(DB_NAME)
  const openRequest = indexedDB.open(DB_NAME, DB_VERSION)

  openRequest.onupgradeneeded = () => {
    const db = openRequest.result

    if (!db.objectStoreNames.contains('inventario')) {
      const inventario = db.createObjectStore('inventario', {
        keyPath: 'id',
        autoIncrement: true
      })

      //* El indice se debe crear en onupgradeneeded
      inventario.createIndex('item_name', 'name')
      inventario.createIndex('tags', 'tags', { multiEntry: true })
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

const searchItemByName = (itemName) => {
  const openRequest = indexedDB.open(DB_NAME, DB_VERSION)
  openRequest.onsuccess = () => {
    const db = openRequest.result

    const inventario = db.transaction('inventario').objectStore('inventario')
    const nameIndex = inventario.index('item_name')

    // Aplican las mismas busquedas que en "3-search-by-keys.js"
    nameIndex.getAll(itemName).onsuccess = (event) => {
      console.log(`Buscando ${itemName}`, event.target?.result)
    }
  }
}

const generalSearchs = () => {
  const openRequest = indexedDB.open(DB_NAME, DB_VERSION)
  openRequest.onsuccess = () => {
    const db = openRequest.result

    const inventario = db.transaction('inventario').objectStore('inventario')
    const tagsIndex = inventario.index('tags')

    // Toma el array de tags como valores individuales (por el multientry: true)
    // Esto permite buscar dentro de este array, y no tratarlo como un solo elemento
    tagsIndex.getAll('bebida').onsuccess = (event) => {
      console.log(`Buscando items con tag "bebida"`, event.target?.result)
    }
  }
}

const createLayout = () => {
  const inputSearch = document.createElement('input')
  inputSearch.setAttribute('placeholder', 'Buscar...')
  inputSearch.setAttribute('id', 'search')

  const alert = document.createElement('p')
  alert.innerText =
    'Intentando buscando "agua", hay varios objetos con este nombre'

  const button = document.createElement('button')
  button.innerText = 'Buscar'

  button.addEventListener('click', () => {
    const input = document.querySelector('#search')
    if (!input) return
    searchItemByName(input.value)
  })

  const button2 = document.createElement('button')
  button2.innerText = 'Buscar - Generales'
  button2.addEventListener('click', generalSearchs)

  document.body.appendChild(inputSearch)
  document.body.appendChild(button)
  document.body.appendChild(button2)
  document.body.appendChild(alert)
}

document.addEventListener('DOMContentLoaded', () => {
  createLayout()
  initializeStorage()
})

/** Notas de la solución
 *
 * Se debe crear un indice para buscar por campos que nos sean la key definida
 *
 * store.creatIndex(name, keypath, [options])
 *
 * options:
 * - unique: No podrán existir objetos con el mismo valor en keypath (ejemplo: 2 objetos con name = 'agua')
 * - multientry: Manejar indices como arreglo (Ver ejemplo en código)
 */
