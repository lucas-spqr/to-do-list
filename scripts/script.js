const $ = document.querySelector.bind(document)


const fetchedItems = [] // colocar isso no constructor
let fetchedStatus = []

class Task {
    constructor() {
        this.newTaskButton = $(".createNewTaskButton")
        this.containerTasks = $(".mainContainer")
        this.createNewTaskButton = $(".createNewTaskButton")

        this.inputForEnter = $(".createNewTaskInput")

        this.status = 0

        this.id = 0
        this.creationDate

        this.createDatabase()

        this.fetchObjectStore()

        setTimeout(this.createFetchedItems, 200)

        this.lastItemIndex = 0

        this.statusList = [] //
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
        let taskStatus
        let updateMessage = "Task object status updated"

        let statusRequest = indexedDB.open("task-list", 1)
        statusRequest.onsuccess = e => {
            let db = statusRequest.result
            let tx = db.transaction("tasks", "readonly")
            let store = tx.objectStore("tasks")
            let query = store.get(objectTask.taskID)
            query.onsuccess = e => {
                taskStatus = query.result.taskStatus

                if(taskStatus == 0){
                    newTask.style.textDecoration = "line-through"
                    newTask.style.textDecorationColor = "var(--verde-escuro)"
                    newImage.src = "../source/images/melancia-aberta.svg"
                    concludeButton.textContent = "não concluído"
                    taskStatus = 1
                }
                else if(taskStatus == 1){
                    newTask.style.textDecoration = "initial"
                    newImage.src = "../source/images/melancia-fechada.svg"
                    concludeButton.textContent = "concluído"
                    taskStatus = 0
                }
        
                task.changeStatusStore(objectTask)
                objectTask.taskStatus = taskStatus

                console.log(updateMessage)
            }

            tx.oncomplete = e => db.close()
        }
    }

    deleteTask(section) {
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
                console.log("Task content updated")
                task.editContentStore(objectTask)

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

    createDatabase(){
        let openRequest = indexedDB.open("task-list", 1)
        openRequest.onupgradeneeded = e => {
            let db = openRequest.result
            if(!db.objectStoreNames.contains("tasks")){
                let store = db.createObjectStore("tasks", {keyPath: "taskID"})
                store.createIndex("by_status", "taskStatus")
                console.log("database created")
            }
        }

        openRequest.onsuccess = e => {
            let db = openRequest.result
            console.log("database opened")
            db.close()
        }
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

            let lista = []
            let index = 0
            
            fetchedItems.forEach(item => {
                input.value = item.taskContent
                lista.push(item.taskStatus)
                task.createTask(lista[index])
                store.delete(item.taskID)
                index += 1
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

    changeStatusStore(taskObject){
        let changeStatusRequest = indexedDB.open("task-list", 1)
        changeStatusRequest.onsuccess = e => {
            let db = changeStatusRequest.result
            let tx = db.transaction("tasks", "readwrite")
            let store = tx.objectStore("tasks")

            store.put(taskObject)
            console.log("Task object status updated on store")

            tx.oncomplete = e => {
                db.close()
            }
        }
    }

    fetchLastItem(){
        let fetchLastItemRequest = indexedDB.open("task-list", 1)
        fetchLastItemRequest.onsuccess = e => {
            let db = fetchLastItemRequest.result
            let tx = db.transaction("tasks", "readonly")
            let store = tx.objectStore("tasks")
            let cursor = store.openCursor()

            cursor.onsuccess = e => {
                let item = cursor.result
                if(item){
                    this.lastItemIndex += 1
                    item.continue()
                }
            }

            tx.oncomplete = e => db.close()
        }
    }

    fetchID(){
        let fetchIDRequest = indexedDB.open("task-list", 1)
        fetchIDRequest.onsuccess = e => {
            let db = fetchIDRequest.result
            let tx = db.transaction("tasks", "readonly")
            let store = tx.objectStore("tasks")
            let query = store.get[this.lastItemIndex]
            
            if(query !== undefined){
                this.id += query.taskID + 1
            }
        }
    }

    deleteOnStore(taskObject){
        let deleteResquest = indexedDB.open("task-list", 1)
        deleteResquest.onsuccess = e => {
            let db = deleteResquest.result
            let tx = db.transaction("tasks", "readwrite")
            let store = tx.objectStore("tasks")
            store.delete(taskObject.taskID)
            console.log("Task deleted on store")
            tx.oncomplete = e => db.close()
        }
    }

    editContentStore(taskObject){
        let editContentStore = indexedDB.open("task-list", 1)
        editContentStore.onsuccess = e => {
            let db = editContentStore.result
            let tx = db.transaction("tasks", "readwrite")
            let store = tx.objectStore("tasks")
            store.put(taskObject)
            tx.oncomplete = e => {
                db.close()
                console.log("Task content updated on store")
            }
        }
    }


    fetchStatusLayout(status, newImage, newTask, concludeButton){
        if(status == 1){
            newImage.src = "./source/images/melancia-aberta.svg"
            newTask.style.textDecoration = "line-through"
            newTask.style.textDecorationColor = "var(--verde-escuro)"
            newImage.src = "../source/images/melancia-aberta.svg"
            concludeButton.textContent = "não concluído"
            this.status = status
        }
    }

    createTask(status=0){
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

        concludeButton.addEventListener("click", () =>{
            this.concludeTaskStatus(newTask, newImage, concludeButton, taskObject)
            }
        )

        deleteButton.addEventListener("click", () => {
            this.deleteTask(section, taskObject)
            this.deleteOnStore(taskObject)
        })

        newTask.addEventListener("click", () => {
            this.editInput(newTask, divTask, taskObject)
        })

        this.setDate()

        this.fetchStatusLayout(status, newImage, newTask, concludeButton)

        let taskObject = this.createObject(newTask, this.id, this.status, this.creationDate)

        this.autoincrementID()

        this.fetchLastItem()
        this.fetchID()

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



/* function createsExempleTask(){
    const input = $(".createNewTaskInput")
    input.value = "comprar melancia na feira"
    task.createTask()
}
createsExempleTask() */


// CÓDIGO FUNCIONAL:
    // TASKS ADICIONADAS NA STORE
    // TASK ID AUTOMATICAMENTE ATUALIZADO
    // TASK DELETADAS NA STORE
    // NÃO CRIAR A TASK DE EXEMPLO!

    // CONSERTAR:
        // (X) TRAZER STATUS DA STORE PARA AS TASKS CRIADAS APÓS O FETCH
        // (X) MUDAR O STATUS NA STORE AO MUDÁ-LO VISUALMENTE
        // (X) MUDAR O CONTENT NA STORE AO MUDÁ-LO VISUALMENTE