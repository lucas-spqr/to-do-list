const $ = document.querySelector.bind(document)

class Task{
    constructor(){
        this.newTaskButton = $(".createNewTaskButton")
        this.containerTasks = $(".mainContainer")
        this.createNewTaskButton = $(".createNewTaskButton")

        this.inputForEnter = $(".createNewTaskInput")
        this.status = 0
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

    concludeTaskStatus(newTask, newImage, concludeButton){
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
    }

    deleteTask(section){
        section.remove()
    }

    editInput(newTask, divTask){
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
            }
        })

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


        this.setTextContent(newTask, inputValue, concludeButton, deleteButton)

        this.setClasses(section, divImage, newImage, divTask, newTask, divConcludeButton, concludeButton, divDeleteButton, deleteButton)

        this.appendElementsToSection(section, divImage, newImage, divTask, newTask, divConcludeButton, concludeButton, divDeleteButton, deleteButton)

        concludeButton.addEventListener("click", () =>
            this.concludeTaskStatus(newTask, newImage, concludeButton)
            )

        deleteButton.addEventListener("click", () => 
            this.deleteTask(section)
            )

        newTask.addEventListener("click", () => {
            this.editInput(newTask, divTask)
        })

        input.value = ""
        input.focus()
    }
}


const task = new Task()

task.createNewTaskButton.addEventListener("click", () => {
    const inputAtual = $(".createNewTaskInput")

    if(!inputAtual.value == ""){
        task.createTask()
    }
}) 

task.inputForEnter.addEventListener("keyup", (event) => {
    const inputAtual = $(".createNewTaskInput")

    if(event.keyCode == 13){
        if(!inputAtual.value ==""){
            task.createTask()
        }
    }
})

    

/* CREATES EXAMPLE TASK */
function createExampleTask(){
    task.inputForEnter.value = "comprar melancia na feira"
    task.createTask()
}
createExampleTask()