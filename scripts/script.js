const $ = document.querySelector.bind(document)

// LINHA ======> 297

// CRIAR FUNÇÃO QUE FAZ ISSO ABAIXO:
// criando a database e object store
    // a partir de agora, todas as transações devem fazer um 
    // request para abrir a db e, no fim, fechá-la
const openRequest = indexedDB.open("task-list", 1)
openRequest.onupgradeneeded = e => {
    let db = openRequest.result

    if(!db.objectStoreNames.contains("tasks")){
        let store =  db.createObjectStore("tasks", {keyPath: "taskID"})
        let statusIndex = store.createIndex("by_status", "taskStatus")
    }
    db.close()
}

const fetchedItems = []

class Task {
    constructor() {
        this.newTaskButton = $(".createNewTaskButton")
        this.containerTasks = $(".mainContainer")
        this.createNewTaskButton = $(".createNewTaskButton")

        this.inputForEnter = $(".createNewTaskInput")

        this.status = 0

        this.id = 0
        this.creationDate

        this.fetchObjectStore()

        setTimeout(this.createFetchedItems, 1000)
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

    concludeTaskStatus(newTask, newImage, concludeButton, objectTask, taskObjectID, taskObjectStatus) {
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

        objectTask.taskStatus = this.status
        console.log(objectTask)

        task.changeStatusStore(taskObjectID, taskObjectStatus)
    }

    deleteTask(section, task) {
        section.remove()
        console.log(`Task deletada visualmente com sucesso!`)
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

                objectTask.taskContent = newTask.textContent
                console.log(objectTask)
            }
        })
    }

    autoincrementID() {
        this.id += 1
    }

    createObject(newTask, id, status, date) {
        return {
            taskContent: newTask.textContent,
            taskID: id,
            taskStatus: status,
            taskDate: date
        }
    }

    resetStatus() {
        this.status = 0
    }

    setDate() {
        this.creationDate = new Date()
    }

    fetchObjectStore(){
        let fetchRequest = indexedDB.open("task-list", 1)
        fetchRequest.onsuccess = e => {
            let db = fetchRequest.result
            let tx = db.transaction("tasks", "readonly")
            let store = tx.objectStore("tasks")
            let cursor = store.openCursor()

            cursor.onsuccess = e => {
                let items = cursor.result
                if(items){
                    fetchedItems.push(items.value)
                    items.continue()
                }
            }

            tx.oncomplete = e => {
                console.log("Fetched from object store:")
                console.log(fetchedItems)
                db.close()
            }
        }
    }

    createFetchedItems(){
        let createFetchedRequest = indexedDB.open("task-list")
        const input = $(".createNewTaskInput")

        createFetchedRequest.onsuccess = e => {
            let db = createFetchedRequest.result
            let tx = db.transaction("tasks", "readwrite")
            let store = tx.objectStore("tasks")
            
            fetchedItems.forEach(item => {
                input.value = item.taskContent
                task.createTask()
                store.delete(item.taskID) // pensar, no futuro, em store.clear()
            })

            tx.oncomplete = e => {
                db.close()
            }
        }
    }

    addToStore(taskObject){
        let addToStoreRequest = indexedDB.open("task-list", 1)
        addToStoreRequest.onsuccess = e => {
            let db = addToStoreRequest.result
            let tx = db.transaction("tasks", "readwrite")
            let store = tx.objectStore("tasks")
            store.add(taskObject)

            tx.oncomplete = e => {
                db.close()
            }
        }
    }

    changeStatusStore(taskID, taskStatus){
        let changeStatusRequest = indexedDB.open("task-list", 1)
        changeStatusRequest.onsuccess = e => {
            let db = changeStatusRequest.result
            let tx = db.transaction("tasks", "readwrite")
            let store = tx.objectStore("tasks")
            
            let query = store.get(taskID)
            query.onsuccess = e => {
                let item = query.result
                console.log(item)
                item.taskStatus = taskStatus
            }

            tx.oncomplete = e => {
                db.close()
            }
        }
    }

    createTask(){
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

        this.resetStatus()

        this.setTextContent(newTask, inputValue, concludeButton, deleteButton)

        this.setClasses(section, divImage, newImage, divTask, newTask, divConcludeButton, concludeButton, divDeleteButton, deleteButton)

        this.appendElementsToSection(section, divImage, newImage, divTask, newTask, divConcludeButton, concludeButton, divDeleteButton, deleteButton)

        concludeButton.addEventListener("click", () =>
            this.concludeTaskStatus(newTask, newImage, concludeButton, taskObject, taskObject.taskID, taskObject.taskStatus)
        )

        deleteButton.addEventListener("click", () => {
            this.deleteTask(section, taskObject)
        })

        newTask.addEventListener("click", () => {
            this.editInput(newTask, divTask, taskObject)
        })

        this.setDate()

        let taskObject = this.createObject(newTask, this.id, this.status, this.creationDate)

        this.autoincrementID() // query on object store to update this.ID
        // and start new tasks with the ID update 

        this.addToStore(taskObject)

        input.value = ""
        input.focus()
    }
}


const task = new Task()



task.createNewTaskButton.addEventListener("click", () => {
    const inputAtual = $(".createNewTaskInput")

    if (!inputAtual.value == "") { 
        task.createTask()
    }
})


task.inputForEnter.addEventListener("keyup", (event) => {
    const inputAtual = $(".createNewTaskInput")

    if (event.keyCode == 13) {
        if (!inputAtual.value == "") {
            task.createTask()
        }
    }
})

function createsExempleTask(){
    const input = $(".createNewTaskInput")
    input.value = "comprar melancia na feira"
    task.createTask()
}
createsExempleTask()



