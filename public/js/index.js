const botones = document.querySelectorAll(".botones")

botones.forEach((boton) =>{
    
    boton.addEventListener("click", () => {
        boton.classList.add(".active");
    })
});