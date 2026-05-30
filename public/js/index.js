const botones = document.querySelectorAll(".botones")

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