const express = require('express');
const fs = require('fs');
const cors = require('cors');
const path = require('path');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
require("dotenv").config();

const app = express();

let contenido;
let reservaciones;
let filas;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")))
app.use(cookieParser());

const login = fs.readFileSync("public/paginas/login.html","utf8");
const principal = fs.readFileSync("public/paginas/principal.html","utf8");

let index;

app.get('/', (req, res) => {
res.send(login);    
})

app.post('/login'), (rez, res) => {
    const {nombre, contraseña} = req.body;
    
    const administrador = fs.readFileSync("public/administrador/administrador.json","utf8")
    const docente = fs.readFileSync("public/docentes/docentesjson","utf8")
    const estudiante = fs.readFileSync("public/estudiantes/estudiantes.json","utf8")

    //const administrador = parse.JSON


    const nombre_comprobante =  parse
    const contraseña_comprobante = 




        if(nombre === "admin" && contraseña === "1234"){
            const token = jwt.sign(
                { usuario: nombre},
                process.env.JWT_SECRET,
                { expiresIn: "6h"}
            );
        
            res.cookie("token", token);
            res.json({
                ok: true
            });
    
        }
        else {
            res.json({
                ok:false
            });
        }
}




















app.get('/administrador', (req, res) => {
    try{
    //const token = req.cookies.token;
    //jwt.verify(token, process.env.JWT_SECRET);
    
    const contenido = fs.readFileSync("public/paginas/administrador/inicio.html", "utf8");
    
    const final = principal.replace("{{CONTENIDO}}", contenido);

    res.send(final);
}
    catch(error){

    }
        res.send({})
})



app.get('/administracion', (req, res) => {
    try{
    const token = req.cookies.token;
    jwt.verify(token, process.env.JWT_SECRET);

    contenido = fs.readFileSync(
    "public/paginas/administracion.html",
    "utf8"
    );
    reservaciones = JSON.parse(contenido);
    filas = "";
    reservaciones.forEach((reserva) =>{
    filas += `
    <tr>
        <td>${reserva.id}</td>
        <td>${reserva.nombre}</td>
        <td>${reserva.apellido}</td>
        <td>${reserva.fecha}</td>
        <td>${reserva.tipo_habitacion}</td>
        <td>${reserva.telefono}</td>
        <td id="acciones">
        <img id="editar" class="editar botones"  src="editar.webp">
        <img id="borrar" class="borrar botones"  src="borrar.png">
        </td>
    </tr>
    `;
    });
    html = fs.readFileSync(
    "interfaces/dashboard.html", "utf-8"
    );
    html = html.replace("{{TABLA}}", filas);

    res.send(html);
    }
    catch(error){
        res.redirect("/");
        console.log("token invalido");
    }

})

app.post("/agregar", (req, res) => {
    const nuevaReserva = req.body;

    const data = fs.readFileSync("datos/reservas.json", "utf8");

    const reservas = JSON.parse(data);

    const ultimoId = reservas.length > 0
    ? reservas[reservas.length -1].id
    : 0;


    nuevaReserva.id = ultimoId +1;

    reservas.push(nuevaReserva);

    fs.writeFileSync("datos/reservas.json", JSON.stringify(reservas, null, 2));

    res.json({ mensaje : "Reserva agregada", reservas});
})

app.put("/editar", (req, res) => {

    const editar = req.body;

    const data = fs.readFileSync(
        "datos/reservas.json",
        "utf8"
    );

    const reservas = JSON.parse(data);

    const indice = reservas.findIndex(
        reserva => reserva.id === editar.id
    );

    if(indice === -1){

        return res.json({
            ok: false,
            mensaje: "ID no encontrado"
        });

    }

    reservas[indice] = {

        ...reservas[indice],

        nombre: editar.nombre,
        apellido: editar.apellido,
        fecha: editar.fecha,
        tipo_habitacion: editar.tipo_habitacion,
        telefono: editar.telefono
    };

    fs.writeFileSync(
        "datos/reservas.json",
        JSON.stringify(reservas, null, 2)
    );

    res.json({
        ok: true,
        mensaje: "Reserva editada"
    });

});


app.delete("/borrar", (req, res) => {

    const { id } = req.body;

    const data = fs.readFileSync(
        "datos/reservas.json",
        "utf8"
    );

    let reservas = JSON.parse(data);

    const existe = reservas.some(
        reserva => reserva.id === id
    );

    if(!existe){

        return res.json({
            ok: false,
            mensaje: "ID no encontrado"
        });

    }

    reservas = reservas.filter(
        reserva => reserva.id !== id
    );

    fs.writeFileSync(
        "datos/reservas.json",
        JSON.stringify(reservas, null, 2)
    );

    res.json({
        ok: true,
        mensaje: "Reserva eliminada"
    });

});





app.listen(process.env.PORT, () => {
    console.log('Servidor corriendo en el puerto 3000');
})