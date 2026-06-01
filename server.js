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





app.get('/', (req, res) => {
    index = fs.readFileSync("public/paginas/login.html", "utf8")
    res.send(index);    
})



app.post('/login', (req, res) => {
    const {nombre, contraseña} = req.body;

    const usuarios = JSON.parse(fs.readFileSync("public/entidades/usuarios.json", "utf8"));
    const usuario = usuarios.find(
        u => u.nombre === nombre
    );
    console.log(nombre);
    console.log(usuario);
    if(!usuario){
    return res.send({
        error: "Usuario no encontrado"
    });
}

    if(usuario.password === contraseña){
        const token = jwt.sign(
            {   id: usuario.id,
                rol: usuario.rol
            },
            process.env.JWT_SECRET,
            { expiresIn: "4h"}
        );
    
        res.cookie("token", token);
        res.json({
            rol: usuario.rol,
            success: true
        });

    }
    else {
        res.json({
            success:false
        });
    }
})

app.get('/admin', (req, res) => {
    try{
    const datos = jwt.verify(
        req.cookies.token,
        process.env.JWT_SECRET
    )
    const admin = fs.readFileSync("public/paginas/admin.html", "utf8")
    const replace = fs.readFileSync("public/paginas/admin/inicio.html", "utf8")
    const final = admin.replace("{{CONTENIDO}}", replace);
    res.send(final);
    }
    catch(error){
        res.redirect("/");
    }
})

app.get('/docente', (req, res) => {
    try{
    const datos = jwt.verify(
        req.cookies.token,
        process.env.JWT_SECRET
    )
    const docente = fs.readFileSync("public/paginas/docente.html", "utf8")
    const replace = fs.readFileSync("public/paginas/admin/inicio.html", "utf8")
    const final = docente.replace("{{CONTENIDO}}", replace);
    res.send(final);
    }
    catch(error){
        res.redirect("/");
    }
})

app.get('/estudiante', (req, res) => {
    try{
    const datos = jwt.verify(
        req.cookies.token,
        process.env.JWT_SECRET
    )
    const estudiante = fs.readFileSync("public/paginas/estudiante.html", "utf8")
    const replace = fs.readFileSync("public/paginas/admin/inicio.html", "utf8")
    const final = estudiante.replace("{{CONTENIDO}}", replace);
    res.send(final);
    }
    catch(error){
        res.redirect("/");
    }
})












app.get('/dashboard', (req, res) => {
    try{
    const token = req.cookies.token;
    jwt.verify(token, process.env.JWT_SECRET);

    contenido = fs.readFileSync(
    "datos/reservas.json",
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