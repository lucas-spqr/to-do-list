
var palette = document.querySelector(".palette")
palette.addEventListener("click", 
(event) => 
    {
        var header = document.querySelector("header")
        var buttons = document.querySelectorAll("button")

        var color = event.toElement.value
        header.style.backgroundColor = `${color}`
        buttons.forEach(button => button.style.backgroundColor = `${color}`)

    }
)

