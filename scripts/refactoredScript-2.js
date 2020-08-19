// add new task button to use when calling create task function
var newTaskButton = document.querySelector(".botaoAdicionarTarefa")

// container tasks to use when appending childs
var containerTasks = document.querySelector(".container")




// create div function
    // add classes
function createDiv(){
    var newDiv = document.createElement("div")
    newDiv.classList.add("containerTarefa")
    return newDiv
}


// create ul function
    // add classes
function createUl(){
    var newUl = document.createElement("ul")
    newUl.classList.add("tarefa")
    return newUl
}

// create img function
    // add classes
function createImg(){
    var newImg = document.createElement("img")
    newImg.classList.add("imagemMelancia")
    newImg.src = "../images/melancia-fechada.svg"
    return newImg
}


// create li function
    // add classes

function createLi(userInput){
    var newLi = document.createElement("li")
    newLi.classList.add("tarefa-li")
    newLi.textContent = userInput
    return newLi
}


// create button conclude function
    // add classes

function createConcludeButton(){
    var newConcludeButton = document.createElement("button")
    newConcludeButton.classList.add("botaoConcluir")
    newConcludeButton.textContent = "concluído"

    return newConcludeButton
}



// create button delete function
    // add classes
function createDeleteButton(){
    var newDeleteButton = document.createElement("button")
    newDeleteButton.classList.add("botaoDeletar")
    newDeleteButton.textContent = "deletar"
    return newDeleteButton
}

// marcar e desmarcar feature
class Tasks{
    constructor(){
        this.status = 0
    }
}


function createNewTask(){

    var userInput = document.querySelector(".inputAdicionarTarefa")
    var userInputValue = userInput.value

    
    const newDiv = createDiv()
    const newUl = createUl()
    const newImg = createImg()
    const newLi = createLi(userInputValue)

    const newConcludeButton = createConcludeButton()
    const newDeleteButton = createDeleteButton()

    containerTasks.appendChild(newDiv)
    newDiv.appendChild(newUl)
    newUl.appendChild(newImg)
    newUl.appendChild(newLi)

    newDiv.appendChild(newConcludeButton)
    newDiv.appendChild(newDeleteButton)

    // marcar e desmarcar feature
    const task = new Tasks()

    function concludeTask(){
        if(task.status == 0){
            newLi.style.textDecoration = "line-through"
            newImg.src = "../images/melancia-aberta.svg"

            newConcludeButton.textContent = "não concluído"

            task.status = 1
        }
        else if(task.status == 1){
            newLi.style.textDecoration = "none"
            newImg.src = "../images/melancia-fechada.svg"

            newConcludeButton.textContent = "concluído"

            task.status = 0
        }
    }

    newConcludeButton.addEventListener("click", concludeTask)



    function deleteTask(){
        newDiv.remove()
    }

    newDeleteButton.addEventListener("click", deleteTask)

    
    userInput.value = ""
    userInput.focus()

}

newTaskButton.addEventListener("click", createNewTask)



var userInput = document.querySelector(".inputAdicionarTarefa")
userInput.addEventListener("keyup", (event) => {
    if(event.keyCode === 13){
        createNewTask()
    }
})



// CREATES EXEMPLE TASK
function createExempleTask(){
    createNewTask()
    var task = document.querySelector("li")
    task.textContent = "comprar melancia na feira"
}

createExempleTask()