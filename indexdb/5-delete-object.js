/*
* 1. Elimina un objeto usando un índice
* 2. Elimina un rango de objetos
* 3. Elimina un objeto basado en su clave
*/

// El código de creación se puede ver en el ejercicio 1 y 4
nameIndex.delete('agua1')
nameIndex.delete(IDBKeyRange('agua1', 'agua5'))
inventario.delete(1)



/**  Notas de la solución
 * 
 * Eliminar: 
 * store.delete(query)
 * index.delete(query)
 * 
*/
