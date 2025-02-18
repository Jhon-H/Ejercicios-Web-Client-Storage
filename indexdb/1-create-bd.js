/**
 * Crea una base de datos llamada "productos" con una store llamada "inventario".
 */

const DB_NAME = 'productos'
const DB_VERSION = '1.0'
const openRequest = indexedDB.open(DB_NAME, DB_VERSION)

openRequest.onupgradeneeded = () => {
  console.log("Inicializando base de datos 'productos'")

  // Solo podemos crear stores en onupgradeneeded
  let db = openRequest.result
  if (!db.objectStoreNames.contains('inventario')) {
    db.createObjectStore('inventario', {
      keyPath: 'id',
      autoIncrement: true
    })
  }
}

openRequest.onerror = (error) => {
  console.log('Error', openRequest.error)
}

openRequest.onsuccess = () => {
  let db = openRequest.result
  console.log('Inicialización exitosa')
  console.log({ db })

  // El navegador tiene version X instala, pero hay una versión en el códig mayor a X
  // Se debe actualizar para poder instalar la nueva versión
  db.onversionchange = () => {
    db.close()
    alert('Recarga para actualizar la version de BD')
  }
}
