const signUp = document.querySelector(".sign-up") 
const signIn = document.querySelector(".sign-in")

const body = document.querySelector(".main")

signIn.addEventListener("click", e => {
    const formSection = document.querySelector(".formSection")
    formSection.classList.add("fadeIn")
    formSection.classList.remove("fadeOut")
    formSection.style.display = "initial"
})

signUp.addEventListener("click", e => {
    const formSection = document.querySelector(".formSection")
    formSection.classList.add("fadeIn")
    formSection.classList.remove("fadeOut")
    formSection.style.display = "initial"
})

const returnArrow = document.querySelector(".returnArrow")
returnArrow.addEventListener("click", e => {
    const formSection = document.querySelector(".formSection")
    formSection.classList.remove("fadeIn")
    formSection.classList.add("fadeOut")
    setTimeout(() => {
        formSection.style.display = "none"
    }, 200)
})