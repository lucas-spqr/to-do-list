const $ = document.querySelector.bind(document)

class Task{
    constructor(){
        this.newTaskButton = $(".createNewTaskButton")
        this.containerTasks = $(".mainContainer")
        this.createNewTaskButton = $(".createNewTaskButton")

        this.inputForEnter = $(".createNewTaskInput")

        this.status = 0

        this.id = 0
        this.creationDate
    }

    createSection(){
        return document.createElement("section")
    }

    createSectionDivs(){
        return {
            divImage: document.createElement("div"),
            divTask: document.createElement("div"),
            divConcludeButton: document.createElement("div"),
            divDeleteButton: document.createElement("div")
        }
    }

    createConcludeButton(){
        return document.createElement("button")
    }

    createDeleteButton(){
        return document.createElement("button")
    }

    createImage(){
        const newImage = document.createElement("img")
        newImage.src = "./source/images/melancia-fechada.svg"
        return newImage
    }

    createP(){
        return document.createElement("p")
    }

    setTextContent(newTask, inputValue, concludeButton, deleteButton){
        newTask.textContent = inputValue
        concludeButton.textContent = "concluído"
        deleteButton.textContent = "deletar"
    }

    setClasses(section, divImage, newImage, divTask, newTask, divConcludeButton, concludeButton, divDeleteButton, deleteButton){
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

    appendElementsToSection(section, divImage, newImage, divTask, newTask, divConcludeButton, concludeButton, divDeleteButton, deleteButton){

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

    concludeTaskStatus(newTask, newImage, concludeButton, objectTask){
        if(this.status == 0){
            newTask.style.textDecoration = "line-through"
            newTask.style.textDecorationColor = "var(--verde-escuro)"
            newImage.src = "../source/images/melancia-aberta.svg"
            concludeButton.textContent = "não concluído"

            this.status = 1
        }
        else{
            newTask.style.textDecoration = "initial"
            newImage.src = "../source/images/melancia-fechada.svg"
            concludeButton.textContent = "concluído"

            this.status = 0
        }
        
        // changing object task status to new status
        objectTask.taskStatus = this.status
        console.log(objectTask)
    }

    deleteTask(section, objectTask){
        section.remove()

        console.log(`Task apagada com sucesso!`)

        // criar aqui comando pra apagar o objectTask da database
        console.log(`Object apagado: ${objectTask}`)
    }

    editInput(newTask, divTask, objectTask){
        const editingInput = document.createElement("input")
        editingInput.classList.add("editingInput")
        editingInput.value = newTask.textContent

        newTask.style.display = "none"
        divTask.appendChild(editingInput)

        editingInput.focus()

        editingInput.addEventListener("keyup", (event) => {
            if(event.keyCode == 13){
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
    autoincrementID(){
        this.id += 1
    }

    // create object function
    createObject(newTask, id, date, status){
        return {
            taskContent: newTask.textContent,
            taskID: id,
            taskDate: date,
            taskStatus: status
        }
    }

    // reseta o status para que não herde do anterior
    resetStatus(){
        this.status = 0        
    }

    setDate(){
        this.creationDate = new Date()
    }

   /*  saveObjectOnLocalStorage(taskID, taskObject){

        if(localStorage.getItem)

        localStorage.setItem("task id", taskID)

        localStorage.setItem("task content", taskObject.taskContent)

        localStorage.setItem("task date", taskObject.taskDate)

        localStorage.setItem("task status", taskObject.taskStatus)
    } */

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

        // reseting task status to 0
        this.resetStatus()

        this.setTextContent(newTask, inputValue, concludeButton, deleteButton)

        this.setClasses(section, divImage, newImage, divTask, newTask, divConcludeButton, concludeButton, divDeleteButton, deleteButton)

        this.appendElementsToSection(section, divImage, newImage, divTask, newTask, divConcludeButton, concludeButton, divDeleteButton, deleteButton)

        concludeButton.addEventListener("click", () =>
            this.concludeTaskStatus(newTask, newImage, concludeButton, taskObject)
            )

        deleteButton.addEventListener("click", () => 
            this.deleteTask(section)
            )

        newTask.addEventListener("click", () => {
            this.editInput(newTask, divTask, taskObject)
        })

        this.setDate()

        // criando objeto com as propriedades:
            // task content
            // task id
            // task date
            // task status
        const taskObject = this.createObject(newTask, this.id, this.creationDate, this.status)


        this.autoincrementID()

        /* this.saveObjectOnLocalStorage(this.id, taskObject) */

/*         console.log(taskObject)
 */
        input.value = ""
        input.focus()

        return taskObject
    }
}


const task = new Task()

const taskList = []

task.createNewTaskButton.addEventListener("click", () => {
    const inputAtual = $(".createNewTaskInput")

    if(!inputAtual.value == ""){
        // chamando a função e passando o retorno para taskObject
        let taskObject = task.createTask()

        // adicionando o objeto retornado a uma lista de tasks
        taskList.push(taskObject)

        // imprimindo a lista de tasks
        console.log(taskList)
    }
}) 

task.inputForEnter.addEventListener("keyup", (event) => {
    const inputAtual = $(".createNewTaskInput")

    if(event.keyCode == 13){
        if(!inputAtual.value ==""){
            // chamando a função e passando o retorno para taskObject
            let taskObject = task.createTask()

            // adicionando o objeto retornado a uma lista de tasks
            taskList.push(taskObject)

            // imprimindo a lista de tasks
            console.log(taskList)
        }
    }
})

    

/* CREATES EXAMPLE TASK */
function createExampleTask(){
    task.inputForEnter.value = "comprar melancia na feira"

    // chamando a função e passando o retorno para taskObject
    let taskObject = task.createTask()

    // adicionando o objeto retornado a uma lista de tasks
    taskList.push(taskObject)

    // imprimindo a lista de tasks
    console.log(taskList)



}
createExampleTask()




function createStoredTask(){
    const lista = [{taskContent: "testando"}]

    lista.forEach( taskOnList => {
        let inputForStoredTask = $(".createNewTaskInput")

        inputForStoredTask.value = taskOnList.taskContent

        task.createTask()

        taskList.push(taskOnList)
    })
}

createStoredTask()