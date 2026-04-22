
function modoOscuro() {
    document.body.classList.toggle("modo-oscuro");
}

function mostrarAlerta() {
    alert("¡Gracias por visitar!");
}

function funPaginaCargada(){
    let valorRecordar = localStorage.getItem("valorRecordar");
    if(valorRecordar=="SI"){
        let divHome = document.getElementById("divHome");
        divHome.hidden=false;

        let divLogin = document.getElementById("divLogin");
        divLogin.hidden=true;
    }
}

function funBtnLogin() { 
    let userInput = document.getElementById("inputUser").value;
    let valorPass = document.getElementById("inputPass").value;

    let usuarioAlmacenado = localStorage.getItem("valorReUser");
    let passwordAlmacenado = localStorage.getItem("valorRePass");

    if(userInput==usuarioAlmacenado){
        if(valorPass==passwordAlmacenado){
            const checkbox = document.getElementById('inputRecordar');
            localStorage.setItem("valorRecordar", checkbox.checked ? "SI" : "NO");

            document.getElementById("divHome").hidden = false;
            document.getElementById("divLogin").hidden = true;
        } else {
            window.alert("PASS INCORRECTO");
        }
    } else {
        window.alert("USUARIO INCORRECTO");
    }
}

function funBtnRegister(){
    document.getElementById("divRegister").hidden=false;
    document.getElementById("divLogin").hidden=true;
}

function funBtnAceptar(){
    let valorReUser = document.getElementById("inputReUser").value;
    let valorRePass = document.getElementById("inputRePass").value;
    let valorRe2Pass = document.getElementById("inputRePass2").value;

    if(valorRePass==valorRe2Pass){
        localStorage.setItem("valorReUser", valorReUser);
        localStorage.setItem("valorRePass", valorRePass);
        funBtnCancelar();
    } else {
        window.alert("PASS NO COINCIDEN");
    }
}

function funBtnCancelar(){
    document.getElementById("divRegister").hidden=true;
    document.getElementById("divLogin").hidden=false;
}

window.onload = function() {
    const fechaElem = document.getElementById("fecha");
    if(fechaElem) fechaElem.innerText = new Date().toLocaleDateString();
}

function toggleMenu() {
    const menu = document.getElementById("menuDesplegable");
    if(menu) menu.classList.toggle("mostrar");
}

window.onscroll = function() {
    const barra = document.getElementById("barraScroll");
    if(!barra) return;
    let scroll = document.documentElement.scrollTop;
    let total = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    let porcentaje = (scroll / total) * 100;
    barra.style.width = porcentaje + "%";
};

const imagenes = ["assets/1.jpg","assets/2.jpg","assets/3.jpg"];
let index = 0;

function siguiente(){
    index++;
    if(index >= imagenes.length) index = 0;
    document.getElementById("imgSlider").src = imagenes[index];
}

function anterior(){
    index--;
    if(index < 0) index = imagenes.length - 1;
    document.getElementById("imgSlider").src = imagenes[index];
}

let recetas = []; 
let recetasJS = [
    { nombre: "Pasta rápida", descripcion: "Pasta con tomate en 10 min." },
    { nombre: "Tortilla francesa", descripcion: "Solo 2 huevos y sal." }
];
let recetasJSON = []; 

async function cargarRecetasJSON() {
    try {
        const res = await fetch("recetas.json");
        recetasJSON = await res.json();
    } catch (error) {
        console.log("Error al cargar JSON:", error);
        recetasJSON = [];
    }

    let guardadas = [];
    if(localStorage.getItem("recetas")){
        guardadas = JSON.parse(localStorage.getItem("recetas"));
    }

    recetas = guardadas.concat(recetasJS, recetasJSON);

    cargarRecetas();
}

function cargarRecetas() {
    const contenedor = document.getElementById("listaRecetas");
    if(!contenedor) return;

    contenedor.innerHTML = "";

    recetas.forEach((r, i) => {
        const div = document.createElement("div");
        div.innerHTML = `
            <h3>${r.nombre}</h3>
            <p>${r.descripcion}</p>
            <button onclick="eliminarReceta(${i})">Eliminar</button>
        `;
        contenedor.appendChild(div);
    });

    localStorage.setItem("recetas", JSON.stringify(recetas));
}

function eliminarReceta(i){
    recetas.splice(i, 1);
    cargarRecetas();
}

function filtrarRecetas() {
    let texto = document.getElementById("buscar").value.toLowerCase();

    let filtradas = recetas.filter(r =>
        r.nombre.toLowerCase().includes(texto)
    );

    const contenedor = document.getElementById("listaRecetas");
    if(!contenedor) return;

    contenedor.innerHTML = "";

    filtradas.forEach((r, i) => {
        const div = document.createElement("div");
        div.innerHTML = `
            <h3>${r.nombre}</h3>
            <p>${r.descripcion}</p>
            <button onclick="eliminarReceta(${i})">Eliminar</button>
        `;
        contenedor.appendChild(div);
    });
}

const formulario = document.getElementById("formAgregar");
if(formulario){
    formulario.addEventListener("submit", function(e){
        e.preventDefault();
        let nombre = document.getElementById("nombre").value;
        let descripcion = document.getElementById("descripcion").value;

        recetas.unshift({nombre, descripcion});
        localStorage.setItem("recetas", JSON.stringify(recetas));

        cargarRecetas();
        formulario.reset();
        document.getElementById("mensajeForm").innerText = "¡Receta añadida!";
    });
}

const area = document.getElementById("descripcion");
if(area){
    area.addEventListener("input", function(){
        document.getElementById("contador").innerText = 
            area.value.length + " / 200 caracteres";
    });
}

window.addEventListener("load", () => {
    funPaginaCargada(); 
    cargarRecetasJSON(); 
});
