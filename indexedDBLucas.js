let openRequest = indexedDB.open("task-list", 1)

function init(){
    
    openRequest.onupgradeneeded = e => {
        console.log("db created / upgraded")

        let db = openRequest.result

        if(db.objectStoreNames.contains("tasks")){
            db.deleteObjectStore("tasks")
        }
        
        let tasks = db.createObjectStore("tasks", {keyPath: "id"})
    }

    openRequest.onsuccess = e => {
        console.log("db open")
    }
}

init()

function addTask(){
    let  db = openRequest.result
    let tx = db.transaction("tasks", "readwrite")

    let store = tx.objectStore("tasks")

    let task = {nome: "lucas", id: 1}



    let request = store.add(task)

    request.onsuccess = e => {
        console.log("Task added to object store")
    }

    request.onerror = e => {
        console.log("Error", request.error)

        if(request.error.name == "ConstraintError"){
            console.log("Task with such id already exists")
        }
        else{
            console.log("Aborting transaction...")
            transaction.abort()
        }
    }
}

const addTaskButton = document.querySelector(".createNewTaskButton")

console.log(addTaskButton)

addTaskButton.addEventListener("click", () => {
    addTask()
})