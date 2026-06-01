const boton_login = document.getElementById("boton_ingresar");
console.log("funciona");

boton_login.addEventListener("click", async () =>{
    
    const nombre = document.getElementById("input_nombre").value;
    const contraseña = document.getElementById("input_password").value;
    const respuesta = await fetch("/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            nombre,
            contraseña
        })
    })

    const datos = await respuesta.json();
    console.log(datos);
    if (datos.success){
        if(datos.rol === "admin"){
            window.location.href= "/admin";
        }
        else if(datos.rol === "docente"){
            window.location.href= "/docente";
        }
        else if(datos.rol === "estudiante"){
            window.location.href= "/estudiante";
        }
        else{
            console.log("no entro");
        }
    }
    else{
        console.log("no entro2");
    }
})