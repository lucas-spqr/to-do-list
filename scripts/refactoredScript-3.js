// add new task button to use when calling create task function
const newTaskButton = document.querySelector(".createNewTaskButton")

// container tasks to use when appending childs
const containerTasks = document.querySelector(".mainContainer")

// object for task status transition
const task = {
    status: 0
}


// main function that creates tasks
function createTask(){

    // input to use when creating tasks
    const input = document.querySelector(".createNewTaskInput")
    const inputValue = input.value

    
    // creates section
    function createSection(){
        return document.createElement("section")
    }
    
    
    // creates section divs and return as an object
    function createSectionDivs(){
        return divs = {
            divImage: document.createElement("div"),
            divTask: document.createElement("div"),
            divConcludeButton: document.createElement("div"),
            divDeleteButton: document.createElement("div")
        }
    }
    

    // creates conclude button
    function createConcludeButton(){
        return document.createElement("button")
    }
    // declares conclude button
    const concludeButton = createConcludeButton()
    
    
    // creates delete button
    function createDeleteButton(){
        return document.createElement("button")
    }
    // declares delete button
    const deleteButton = createDeleteButton()
    
    
    // declares section and subelements:
        // divImage
        // divTask
        // divConcludeButton
        // divDeleteButton
    const section = createSection()
    const divImage = createSectionDivs().divImage
    const divTask = createSectionDivs().divTask
    const divConcludeButton = createSectionDivs().divConcludeButton
    const divDeleteButton = createSectionDivs().divDeleteButton 
    
    
    // creates image
    function createImage(){
        const newImage = document.createElement("img")
        newImage.src = "./source/images/melancia-fechada.svg"
        return newImage
    }
    // declares image
    const newImage = createImage()
    

    // creates task (p)
    function createP(){
        return document.createElement("p")
    }
    // declares task (p)
    const newTask = createP()
    
    
    // set text contents
        // task content
        // conclude button content
        // conclude delete content
    function setTextContent(){
        newTask.textContent = inputValue
        concludeButton.textContent = "concluído"
        deleteButton.textContent = "deletar"
        
    }
    // calls function
    setTextContent()


    // sets classes to styling
    function setClasses(){
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
    // calls function
    setClasses()
    
    
    // appends elements to section
    function appendElementsToSection(){
        containerTasks.appendChild(section)
        section.appendChild(divImage)
        divImage.appendChild(newImage)
        
        section.appendChild(divTask)
        divTask.appendChild(newTask)

        section.appendChild(divConcludeButton)
        divConcludeButton.appendChild(concludeButton)

        section.appendChild(divDeleteButton)
        divDeleteButton.appendChild(deleteButton)
    }
    // calls function
    appendElementsToSection()


    // checks task status to make appropriate changes 
    function concludeTaskStatus(){

        if(task.status == 0){
            newTask.style.textDecoration = "line-through"

            newTask.style.textDecorationColor = "var(--verde-escuro)"

            newImage.src = "../source/images/melancia-aberta.svg"

            concludeButton.textContent = "não concluído"

            task.status = 1
        }
        else{
            newTask.style.textDecoration = "initial"

            newImage.src = "../source/images/melancia-fechada.svg"

            concludeButton.textContent = "concluído"

            task.status = 0
        }
    }
    concludeButton.addEventListener("click", concludeTaskStatus)



    // deletes section
    function deleteTask(){
        section.remove()
    }
    deleteButton.addEventListener("click", deleteTask)


    // creates temporary input to edit task
    function editInput(){
        const editingInput = document.createElement("input")
        editingInput.classList.add("editingInput")
        editingInput.value = newTask.textContent

        newTask.style.display = "none"
        divTask.appendChild(editingInput)

        editingInput.focus()

        editingInput.addEventListener("keyup", (event)=> {
            if(event.keyCode == 13){
                const editedInputValue = editingInput.value

                newTask.textContent = editedInputValue

                newTask.style.display = "initial"

                editingInput.remove()
            }
        })
        
    }
    newTask.addEventListener("click", editInput)


    // cleaning and focusing input
    input.value = ""
    input.focus()
}





// gets create new task button 
// connects function to button
const createNewTaskButton = document.querySelector(".createNewTaskButton") 
createNewTaskButton.addEventListener("click", 
() => {

    // gets new task input
    const inputAtual = document.querySelector(".createNewTaskInput")

    // blocks empty tasks
    if(!inputAtual.value == ""){
    createTask()
    }
})



// gets new task input
// connects function to "Enter" key pressing
const input = document.querySelector(".createNewTaskInput")
input.addEventListener("keyup", (event) => {

    // blocks empty tasks
    if(event.keyCode == 13){
        if(!input.value == ""){
            createTask()
            }
    }

})




/*CREATES EXAMPLE TASK  */
function createExampleTask(){
    input.value = "comprar melancia na feira"
    createTask()
}
createExampleTask()