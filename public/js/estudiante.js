const botones = document.querySelectorAll(".botones")
botones[0].classList.add("active");
botones.forEach((boton) =>{
    
    boton.addEventListener("click", () => {

        botones.forEach((remove) =>{
            if (remove != boton){
            remove.classList.remove("active");
            }
        });

        boton.classList.add("active");

    })
});