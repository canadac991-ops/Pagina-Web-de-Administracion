const boton_login = document.getElementById("boton_ingresar");
console.log("funciona");
const input_n = document.getElementById("input_nombre");
const input_p = document.getElementById("input_password");
const error_n = document.getElementById("error_nombre");
const error_p = document.getElementById("error_contraseña");

input_n.addEventListener("input", () =>{
    error_n.innerText="";
})
input_p.addEventListener("input", () =>{
    error_p.innerText="";
})
boton_login.addEventListener("click", async () =>{
    
    const nombre = document.getElementById("input_nombre").value;
    const contraseña = document.getElementById("input_password").value;
    error_n.innerText="";
    error_p.innerText="";
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
            console.log("token no valido");
        }
    }
    else if(datos.error === "usuario incorrecto"){
        error_n.innerText= datos.error;
    }
    else if (datos.error === "contraseña incorrecta"){
        error_p.innerText= datos.error;
    }
})