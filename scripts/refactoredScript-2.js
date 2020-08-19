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
// edit task feature
// identification feature
class Tasks{
    constructor(){
        this.conclusionTaskStatus = 0
        this.editTaskStatus = 0
        this.id = 0
    }

    incrementId(){
        return this.id += 1
    }
}

// For features
const task = new Tasks()

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

    // Setting an "id" class for every task
    newLi.classList.add(`${task.id}`)
    // Incrementing "id"
    task.incrementId()


    function concludeTask(){
        if(task.conclusionTaskStatus == 0){
            newLi.style.textDecoration = "line-through"
            newImg.src = "../images/melancia-aberta.svg"

            newConcludeButton.textContent = "não concluído"

            task.conclusionTaskStatus = 1
        }
        else if(task.conclusionTaskStatus == 1){
            newLi.style.textDecoration = "none"
            newImg.src = "../images/melancia-fechada.svg"

            newConcludeButton.textContent = "concluído"

            task.conclusionTaskStatus = 0
        }
    }

    newConcludeButton.addEventListener("click", concludeTask)



    function deleteTask(){
        newDiv.remove()
    }

    newDeleteButton.addEventListener("click", deleteTask)

    function editTaskContent(){
        task.editTaskStatus == 0

        // criando input de edição
        const editInput = document.createElement("input")

        // para estilização no CSS
        editInput.classList.add("editingInput")

        // adicionando o value do input de edição como o valor do texto da li clicada
        editInput.value = newLi.textContent

        // adicionando o input na ul
        newUl.appendChild(editInput)

        // sumindo com a li enquanto existe a edição
        newLi.style.display = "none"

        editInput.focus()

        editInput.addEventListener("keyup", (event)=> {
            if(event.keyCode === 13){
                // capturando o value do input já editado
                const editedInputValue = editInput.value

                // mudando o texto da li para o valor do input editado
                newLi.textContent = editedInputValue

                // voltando com o display inicial da li
                newLi.style.display = "initial"

                // removendo o input de edição
                editInput.remove()
            }
        })        
  
    }

    newLi.addEventListener("click", editTaskContent)
    



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