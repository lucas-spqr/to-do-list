const $ = document.querySelector.bind(document)

class Task {
    constructor() {
        this.newTaskButton = $(".createNewTaskButton")
        this.containerTasks = $(".mainContainer")
        this.createNewTaskButton = $(".createNewTaskButton")

        this.inputForEnter = $(".createNewTaskInput")

        this.status = 0

        this.id = 0
        this.creationDate
    }

    createSection() {
        return document.createElement("section")
    }

    createSectionDivs() {
        return {
            divImage: document.createElement("div"),
            divTask: document.createElement("div"),
            divConcludeButton: document.createElement("div"),
            divDeleteButton: document.createElement("div")
        }
    }

    createConcludeButton() {
        return document.createElement("button")
    }

    createDeleteButton() {
        return document.createElement("button")
    }

    createImage() {
        const newImage = document.createElement("img")
        newImage.src = "./source/images/melancia-fechada.svg"
        return newImage
    }

    createP() {
        return document.createElement("p")
    }

    setTextContent(newTask, inputValue, concludeButton, deleteButton) {
        newTask.textContent = inputValue
        concludeButton.textContent = "concluído"
        deleteButton.textContent = "deletar"
    }

    setClasses(section, divImage, newImage, divTask, newTask, divConcludeButton, concludeButton, divDeleteButton, deleteButton) {
        section.classList.add("grid-container")

        divImage.classList.add("divImage")
        newImage.classList.add("image")

        divTask.classList.add("divTask")
        newTask.classList.add("task")

        divConcludeButton.classList.add("divConcludeButton")
        concludeButton.classList.add("concludeButton")

        divDeleteButton.classList.add("divDeleteButton")
        deleteButton.classList.add("deleteButton")
    }

    appendElementsToSection(section, divImage, newImage, divTask, newTask, divConcludeButton, concludeButton, divDeleteButton, deleteButton) {

        this.containerTasks.appendChild(section)
        section.appendChild(divImage)
        divImage.appendChild(newImage)

        section.appendChild(divTask)
        divTask.appendChild(newTask)

        section.appendChild(divConcludeButton)
        divConcludeButton.appendChild(concludeButton)

        section.appendChild(divDeleteButton)
        divDeleteButton.appendChild(deleteButton)
    }

    concludeTaskStatus(newTask, newImage, concludeButton, objectTask) {
        if (this.status == 0) {
            newTask.style.textDecoration = "line-through"
            newTask.style.textDecorationColor = "var(--verde-escuro)"
            newImage.src = "../source/images/melancia-aberta.svg"
            concludeButton.textContent = "não concluído"

            this.status = 1
        }
        else {
            newTask.style.textDecoration = "initial"
            newImage.src = "../source/images/melancia-fechada.svg"
            concludeButton.textContent = "concluído"

            this.status = 0
        }

        // changing object task status to new status
        objectTask.taskStatus = this.status
        console.log(objectTask)
    }

    deleteTask(section, objectTask) {
        section.remove()

        console.log(`Task apagada com sucesso!`)

        // criar aqui comando pra apagar o objectTask da database
        console.log(`Object apagado: ${objectTask}`)
    }

    editInput(newTask, divTask, objectTask) {
        const editingInput = document.createElement("input")
        editingInput.classList.add("editingInput")
        editingInput.value = newTask.textContent

        newTask.style.display = "none"
        divTask.appendChild(editingInput)

        editingInput.focus()

        editingInput.addEventListener("keyup", (event) => {
            if (event.keyCode == 13) {
                newTask.textContent = editingInput.value
                newTask.style.display = "initial"
                editingInput.remove()

                // changing task object to new text content after edit
                objectTask.taskContent = newTask.textContent
                console.log(objectTask)
            }
        })
    }

    // increment task id
    autoincrementID() {
        this.id += 1
    }

    // create object function
    createObject(newTask, id, status, date) {
        return {
            taskContent: newTask.textContent,
            taskID: id,
            taskStatus: status,
            taskDate: date
        }
    }

    createTaskOnObjectStore(task){
        let request = indexedDB.open("task-list", 1)
        
        request.onsuccess = e => {
            let db = request.result
            let tx = db.transaction("tasks", "readwrite")
            let store = tx.objectStore("tasks")

            store.add(task)
        }
    }

    deleteTaskOnObjectStore(task){
        let request = indexedDB.open("task-list", 1)
        
        request.onsuccess = e => {
            let db = request.result
            let tx = db.transaction("tasks", "readwrite")
            let store = tx.objectStore("tasks")

            store.delete(task.taskID)
        }
    }

    fetchTasksFromObjectStore(){
        let request = indexedDB.open("task-list", 1)
        

        request.onsuccess = e => {
            let db = request.result
            let tx = db.transaction("tasks", "readwrite")
            let store = tx.objectStore("tasks")
            let cursor = store.openCursor()

            if(cursor){
                let key = cursor.key
                let value = cursor.value
                console.log(key, value)
                cursor.continue()
            }
            else{
                console.log("no more tasks")
            }
        }
    }

    // reseta o status para que não herde do anterior
    resetStatus() {
        this.status = 0
    }

    setDate() {
        this.creationDate = new Date()
    }

    createTask() {
        const input = $(".createNewTaskInput")
        const inputValue = input.value

        const concludeButton = this.createConcludeButton()
        const deleteButton = this.createDeleteButton()
        const section = this.createSection()
        const divImage = this.createSectionDivs().divImage
        const divTask = this.createSectionDivs().divTask
        const divConcludeButton = this.createSectionDivs().divConcludeButton
        const divDeleteButton = this.createSectionDivs().divDeleteButton

        const newImage = this.createImage()
        const newTask = this.createP()

        // reseting task status to 0
        this.resetStatus()

        this.setTextContent(newTask, inputValue, concludeButton, deleteButton)

        this.setClasses(section, divImage, newImage, divTask, newTask, divConcludeButton, concludeButton, divDeleteButton, deleteButton)

        this.appendElementsToSection(section, divImage, newImage, divTask, newTask, divConcludeButton, concludeButton, divDeleteButton, deleteButton)

        concludeButton.addEventListener("click", () =>
            this.concludeTaskStatus(newTask, newImage, concludeButton, taskObject)
        )

        deleteButton.addEventListener("click", () => {
            this.deleteTask(section)
            this.deleteTaskOnObjectStore(taskObject)
        })

        newTask.addEventListener("click", () => {
            this.editInput(newTask, divTask, taskObject)
        })

        this.setDate()

        let openRequest = indexedDB.open("task-list", 1)

        openRequest.onupgradeneeded = e => {
            let db = openRequest.result
            db.createObjectStore("tasks", {keyPath: "taskID"})
            console.log("database created / updated")
        }
        
        openRequest.onsuccess = e => {
            let db = openRequest.result
            console.log("database opened")
        }

        // criando objeto com as propriedades:
            // taskContent
            // taskID
            // taskDate
            // taskStatus
        const taskObject = this.createObject(newTask, this.id, this.status, this.creationDate)

        this.createTaskOnObjectStore(taskObject)

        this.fetchTasksFromObjectStore()

        this.autoincrementID()

        input.value = ""
        input.focus()

        return taskObject
    }
}


const task = new Task()
task.createTask()
/* 
task.createNewTaskButton.addEventListener("click", () => {
    const inputAtual = $(".createNewTaskInput")

    if (!inputAtual.value == "") {
        // chamando a função e passando o retorno para taskObject
        let taskObject = task.createTask()

        addTaskToObjectStore(taskObject)
    }
})

task.inputForEnter.addEventListener("keyup", (event) => {
    const inputAtual = $(".createNewTaskInput")

    if (event.keyCode == 13) {
        if (!inputAtual.value == "") {
            // chamando a função e passando o retorno para taskObject
            let taskObject = task.createTask()

            addTaskToObjectStore(taskObject)
        }
    }
})


const openRequest = indexedDB.open("task-list", 1)

function init() {
    openRequest.onupgradeneeded = e => {
        console.log("db created / upgraded")

        let db = openRequest.result

        if (db.objectStoreNames.contains("tasks")) {
            db.deleteObjectStore("tasks")
        }

        let tasks = db.createObjectStore("tasks", { keyPath: "taskID" })

        let index = tasks.createIndex("by_status", "taskStatus")
    }

    openRequest.onsuccess = e => {
        console.log("db open")
    }
}

init()

function addTaskToObjectStore(task) {

    let db = openRequest.result
    let tx = db.transaction("tasks", "readwrite")

    let store = tx.objectStore("tasks")

    let request = store.add(task)

    request.onsuccess = e => {
        console.log("Task added to object store")
    }

    request.onerror = e => {
        console.log("Error", request.error)

        if (request.error.name == "ConstraintError") {
            console.log("Task with such id already exists")
        }
        else {
            console.log("Aborting transaction...")
            transaction.abort()
        }
    }
} */

/* CREATES EXAMPLE TASK  
function createExampleTask() {
    task.inputForEnter.value = "comprar melancia na feira"

    // chamando a função e passando o retorno para taskObject
    let taskObject = task.createTask()

    // criando uma transação pra exemple task
    openRequest.onsuccess = e =>{

        let db = openRequest.result
        let exempleTX = db.transaction("tasks", "readwrite")

        let store = exempleTX.objectStore("tasks")
        store.add(taskObject)
    }
}
createExampleTask()
*/


// FUNCIONOU
    // AO INICIALIZAR O SERVER PRA FETCH STORED TASKS
    // TENTAR ABRIR O BANCO A CADA CRIAÇÃO DE TAREFA
    // A CADA EDIÇÃO DE TAREFA (MUDAR CONTENT NO DB)
    // AO CONCLUIR UMA TAREFA (MUDAR STATUS NO DB)
    // AO DELETAR UMA TAREFA (APAGAR NO DB)


/*     
let open = indexedDB.open("task-list", 1)

open.onsuccess = e => {
    let db = openRequest.result
    let tx = db.transaction("tasks", "readwrite")
    let store = tx.objectStore("tasks")
    store.add({content: "testando outra abertura no banco",
                taskStatus: 2,
                taskID: 20     })
}

 */