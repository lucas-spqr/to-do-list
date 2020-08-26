// request that deletes database (Promise)
/* let deleteRequest = indexedDB.deleteDatabase("task-list") */
// onsucess => on Promise resolved
//deleteRequest.onsuccess = e => console.log(deleteRequest.readyState)
// onerror => on Promise rejected
/* deleteRequest.onerror = e => console.log(deleteRequest.readyState) */



// request (Promise) for open db (object that contains created db)
// onsucess, returns: IDBOpenDBRequest => {object}
let openRequest = indexedDB.open("task-list", 2)


// database is ready but outdated or initializes new db
openRequest.onupgradeneeded = e => {

    // "openRequest.result" => database
    let db = openRequest.result

    // deleting object store if it already exists
    if(db.objectStoreNames.contains("tasks")){
        db.deleteObjectStore("tasks")
    }

    // creating new object store (IDBObjectStore)
    // setting keyOptions ("keyPath", "autoIncrement")
        // setting keyPath: "status" (index by property of object stored as value in objectStore)
        // there can't be more than one object with same value property used as keyPath ("id" in this case)
    let tasks = db.createObjectStore("tasks", {keyPath: "id"})

    // creating an index (IDBIndex)
        // settting index name ("by_status")
        // orders objects stored by keyPath (object property) provided ("status")
    let index = tasks.createIndex("by_status", "status")
    
    
}


// on success (Promise) => request opening worked
// openRequest.result (IDBOpenDBRequest property) => IDBDatabase (db object) {object}
openRequest.onsuccess = e => {
    console.log("db successfully opened")
    console.log("database => ",openRequest.result)

    // "openRequest.result" => database (IDBDatabase)
    let db = openRequest.result

    // "onversionchange" event triggers when there's a tab opened with and older version of db while allows a second tab with the new version
    db.onversionchange = function(){
        db.close()
        alert("Database is outdated, please reload the page")
    }

    // creating a db transaction (Promise) that wrappers any object store transaction
    let transaction = db.transaction("tasks", "readwrite")

    // getting an object store to operate on it
    let store = transaction.objectStore("tasks")

    // value to put on object store
    let task = {status: 1, content: "comprar melão", id: 11}

    // request (Promise) to add object in store
    let request = store.add(task)

    // capturing request (Promise) sucess/error
        // request.result => value keyPath
    request.onsuccess = e => {
        console.log("Task added to the store", request.result)
    }

    request.onerror = e => {

        console.log("Error", request.error)

        // capturing same keyPath object error an handling
        if(request.error.name == "ConstraintError"){
            console.log("Task with such id already exists")
        }
        else{
            console.log("Aborting transaction...")
            transaction.abort()
        }
    }

    // handles "transaction.abort()" event
    transaction.onabort = e => console.log("Error", transaction.error)


    // capturing finished and saved transaction
    transaction.oncomplete = e => console.log("Transaction finished")

    // request searching by "key" => return and IDBDatabase object
        // IDBDatabase.result => value searched for
    let query = store.get(1)
    // on request sucess
    query.onsuccess = e => console.log(query.result)


    // searching in a object store index
    let index = store.index("by_status")
    // request query
    let indexQuery = index.getAll(0)
    // capturing request result
    indexQuery.onsuccess = function(){
        if(indexQuery.result !== undefined){
            console.log("Tasks found:", indexQuery.result)
        }
        else{
            console.log("No tasks found")
        }
    }

}

// on error (Promise) => request opening failed
openRequest.onerror = e => console.log("Error",openRequest.error)

// triggers when client has connection with outdated db version while a newer version gets on
// handled in "db.onversionchange" with "db.close()"
openRequest.onblocked = e => console.log("db is outdated and access request was blocked")

