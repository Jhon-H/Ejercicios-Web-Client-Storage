/**
 *
 * Agrega 5 productos al store "inventario". Luego, implementa una función que lea todos los productos y los muestre en la página.
 */

const ITEMS = [
  { name: 'libro', price: 32 },
  { name: 'gafas', price: 81 },
  { name: 'macbook', price: 232 },
  { name: 'agua', price: 2 }
]
const DB_NAME = 'productos'
const DB_VERSION = '1.0'

let openResponse = indexedDB.open(DB_NAME, DB_VERSION)

openResponse.onupgradeneeded = () => {
  let db = openResponse.result

  if (!db.objectStoreNames.contains('inventario')) {
    db.createObjectStore('inventario', {
      keyPath: 'id',
      autoIncrement: true
    })
  }
}

openResponse.onerror = () => {
  console.log('Error al crear la BD', openResponse.error)
}

openResponse.onsuccess = () => {
  let db = openResponse.result

  // Una transacción es un grupo de operaciones cuyos resultados están vinculados: todas deben ser exitosas o todas fallar.
  // Esta readonly y readwrite, la diferencia está en al eficiente de consulta
  // readwrite bloquea la bd hasta terminar

  let transaction = db.transaction('inventario', 'readwrite')
  const inventario = transaction.objectStore('inventario')

  ITEMS.forEach((item) => {
    // put -> agrega o edita
    // add -> solo agrega, si ya existe entonces falla
    let request = inventario.add(item)

    request.onsuccess = () => {
      console.log('Item agregado exitosamente', request.result)
    }

    request.onerror = (event) => {
      // Si una transacción falla, se aborta la transacción (y todas las operaciones realizadas se revierten)
      console.log('Fallo al agregar item ', request.result)

      if(request.error.name === 'ConstraintError') {
        console.log('Item con ese id ya existe, PERO no bvortemos')
        event.preventDefault(); // no abortar la transacción
        event.stopPropagation(); // dado que ya se maneja el error, no propagar
      }
    }
  })

  // Cuando se terminan todas las peticiones de la transaccion
  // Y cuando microtask queue (Ver event loop) está vacio, entonces se hace un commit automático

  //! No podemos hacer fetch o setTimeout, ni nada asincrono en la miad de la transacción
  //! IndexDB no esperará a que terminen 
}

//* Nota sobre propagación de eventos: request → transaction → database.
