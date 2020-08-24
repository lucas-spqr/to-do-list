
const request = indexedDB.open("task-list", 3)
let db

const object = {content: "comprar caju", status: 20}

request.onupgradeneeded = function () {
    // The database did not previously exist, so create object stores and indexes.
    const db = request.result;

    if (db.objectStoreNames.contains("task-list")) {
        db.deleteObjectStore("task-list")
    }

    var store = db.createObjectStore("task-list", { autoIncrement: true })

    // Populate with initial data.
    store.put({ status: 0, content: "cereja" })
    store.put({ status: 1, content: "uva" })
    store.put({ status: 1, content: "maçã" })
    store.put(object)


    async function pesquisa() {
        let query = store.get(1)

        query.onsuccess = e => {
            console.log(query.result)
        }
    }

    pesquisa()


}

request.onsuccess = function () {
    db = request.result
}


