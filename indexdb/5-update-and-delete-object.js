// Delete

nameIndex.delete('agua1')
nameIndex.delete(IDBKeyRange('agua1', 'agua5'))
inventario.delete(1)



/**  Notas de la solución
 * 
 * Eliminar: 
 * store.delete(query)
 * index.delete(query)
 * 
 * Actualizar:
 * 
 * 
*/