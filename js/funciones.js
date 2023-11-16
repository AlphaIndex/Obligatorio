// Funciones  - obligatorio 2do semestre 2023
window.addEventListener("load", inicio);
let miSistemas = new Sistema();

function inicio () {
    document.getElementById("idBotonAgregarCategoria").addEventListener("click", agregarCategorias);
    document.getElementById("idBotonAltaExperiencia").addEventListener("click", agregarExperiencia);
    document.getElementById("idBotonComprar").addEventListener("click", agregarCompra);
    document.getElementById("idBotonBajaCategoria").addEventListener("click", eliminarCategoria);
    document.getElementById("idBotonBajaExperiencia").addEventListener("click", eliminarExperiencias);
    document.getElementById("idOrdenPrecio").addEventListener("change", crearTabla);
    document.getElementById("idComboCategoriasIzquierda").addEventListener("change", crearTabla);
    document.getElementById("idCantidadPersonasCategoria").addEventListener("change", crearTabla);

}

function agregarCategorias() {
    let form = document.getElementById("idFormCategoria");
    if (form.reportValidity()) {
        let cat_nombre = document.getElementById("idNombreCategoria").value;
        let cat_detalles = document.getElementById("idDetallesCategoria").value;
        if (validarUnicidad("nombre", cat_nombre)) {
            let categoria = new Categoria(cat_nombre, cat_detalles);
            miSistemas.nuevaCategoria(categoria);
            mostrarCategoria();
        }else {
            alert("El Nombre de esta categoria ya existe ingrese uno diferente");
        }
        habilitarBotonCategoria();
        form.reset();
    }
} 

function agregarExperiencia() {
    let form = document.getElementById("idFormExperiencia");
    if (form.reportValidity()){
        let exp_titulo = document.getElementById("idTituloExperiencia").value;
        let exp_descripcion = document.getElementById("idDescripcionExperiencia").value;
        let exp_precio = document.getElementById("idPrecioExperiencia").value;
        let exp_cantidad = document.getElementById("idCantidadPersonasExperiencia").selectedIndex;
        let exp_categoria = miSistemas.encontrarCategoria(document.getElementById("idCategoriaExperiencia").selectedIndex);
        if (validarUnicidad("titulo", exp_titulo)) {
            let exp = new Experiencias (exp_titulo, exp_descripcion, exp_precio, exp_cantidad, exp_categoria);
            miSistemas.nuevaExperiencia(exp);
            mostrarExperiencia();
            crearTabla();
        } else {
            alert("El Titulo de esta experiencia ya existe ingrese uno diferente");
        }
        habilitarBotonExperiencias();
        document.getElementById("idCualExperiencia").innerHTML = "Experiencia: ";
        habilitarBotonCompra();
        form.reset();
    }
}

function agregarCompra() {
    let form = document.getElementById("idFormCompra");
    if (form.reportValidity()){
        let com_nombre = document.getElementById("idNombreComprador").value;
        let com_mail = document.getElementById("idMail").value; 
        let com_experiencia = miSistemas.darNombreExperiencia();
        let compra = new Compra (com_nombre, com_mail, com_experiencia);
        miSistemas.nuevaCompra(compra);
        form.reset(); 
    }
}

function mostrarCategoria() {
    let cateAlta = document.getElementById("idComboCategoriasIzquierda");
    let cateBaja = document.getElementById("idComboCategoriasAbajo");
    let cateExp = document.getElementById("idCategoriaExperiencia");
    cateAlta.innerHTML = "";
    cateBaja.innerHTML = "";
    cateExp.innerHTML = "";
    let datos = miSistemas.darCategoria();
    for(let i of datos) {
        cateAlta.appendChild(addNodo("option", i.nombre));
        cateBaja.appendChild(addNodo("option", i.nombre));
        cateExp.appendChild(addNodo("option", i.nombre));
    }
}

function mostrarExperiencia() {
    let cateAlta = document.getElementById("idComboBajaExperiencia");
    cateAlta.innerHTML = "";
    let datos = miSistemas.darExperiencia();
    for(let i of datos) {
        cateAlta.appendChild(addNodo("option", i.titulo));
    }
}

function addNodo(tipo, texto) {
    let nodo = document.createElement(tipo);
    let nodoT = document.createTextNode(texto);
    nodo.appendChild(nodoT);
    nodo.value = texto;
    return nodo;
}

function eliminarCategoria() {
    let cate = document.getElementById("idComboCategoriasAbajo").selectedIndex;
    if (miSistemas.verificarExistencia(cate)) {
        miSistemas.eliminarCategoria(cate);
    }else {
        alert("Esa categoria no puede eliminarse porque esta en uso");
    }
    mostrarCategoria();
    habilitarBotonCategoria();
}
function eliminarExperiencias() {
    let exp = document.getElementById("idComboBajaExperiencia").selectedIndex;
    miSistemas.eliminarExperiencias(exp);
    mostrarExperiencia();
    crearTabla();
    habilitarBotonExperiencias();
}
function crearTabla() {
    let tabla = document.getElementById("idTabla");
    tabla.innerHTML = "";
    let datos = reordenarExp();
    datos = miSistemas.filtrarCategoria(document.getElementById("idComboCategoriasIzquierda").selectedIndex,datos);
    if (document.getElementById("idCantidadPersonasCategoria").selectedIndex != 0) {
        datos = miSistemas.filtrarCantidadP(document.getElementById("idCantidadPersonasCategoria").selectedIndex - 1,datos);
    }
    let fila;
    for (let i of datos) {
        let desc = addNodo("span", i.descripcion);
        desc.setAttribute("class", "detallesTabla");
        let img = selectImg(i.cantidad);
        if (((datos.indexOf(i)+1)%2) != 0) {
            fila = tabla.insertRow();
            let celda = fila.insertCell();
            if (datos.length-1 == datos.indexOf(i)){
                celda.setAttribute("colspan", "2");
            }
            celda.innerHTML = i.titulo + "<br>";
            celda.appendChild(desc);
            celda.innerHTML += "<br>"+ i.precio;
            celda.appendChild(img);
            celda.addEventListener("click", 
            function () {
                if (document.getElementsByClassName("celdaTabla")[0] != undefined) {
                    document.getElementsByClassName("celdaTabla")[0].setAttribute("class","");
                    celda.setAttribute("class", "celdaTabla");
                    let parrafo = document.getElementById("idCualExperiencia");
                    parrafo.innerHTML = ""; 
                    parrafo.innerHTML = "Experiencia: " + i.titulo;
                    habilitarBotonCompra();
                    miSistemas.asignarValorTitulo(i);
                }else {
                    celda.setAttribute("class", "celdaTabla");
                    let parrafo = document.getElementById("idCualExperiencia");
                    parrafo.innerHTML = ""; 
                    parrafo.innerHTML = "Experiencia: " + i.titulo;
                    habilitarBotonCompra();
                    miSistemas.asignarValorTitulo(i);
                }                
            }
            )
        }else {
            let celda2 = fila.insertCell();
            celda2.innerHTML = i.titulo + "<br>";
            celda2.appendChild(desc);
            celda2.innerHTML += "<br>"+ i.precio + "<br>";
            celda2.appendChild(img);
            celda2.addEventListener("click", 
            function () {
                if (document.getElementsByClassName("celdaTabla") != undefined) {
                    document.getElementsByClassName("celdaTabla")[0].setAttribute("class","");
                    celda2.setAttribute("class", "celdaTabla");
                    let parrafo = document.getElementById("idCualExperiencia");
                    parrafo.innerHTML = ""; 
                    parrafo.innerHTML = "Experiencia: " + i.titulo;
                    habilitarBotonCompra();
                    miSistemas.asignarValorTitulo(i);
                }else {
                    celda2.setAttribute("class", "celdaTabla");
                    let parrafo = document.getElementById("idCualExperiencia");
                    parrafo.innerHTML = ""; 
                    parrafo.innerHTML = "Experiencia: " + i.titulo;
                    habilitarBotonCompra();
                    miSistemas.asignarValorTitulo(i);
                }                
            }
            )
        }
    }

}

function validarUnicidad(tipo, valor) {
    let validacion = true;
    if (tipo == "titulo"){
        let titulos_exp = miSistemas.darExperiencia();
        for (let i = 0; i < titulos_exp.length && validacion; i++) {
            if (valor == titulos_exp[i].titulo) {
                validacion = false;
            }
        }
    }else {
        let nombreCate = miSistemas.darCategoria();
        for (let i = 0; i < nombreCate.length && validacion; i++) {
            if (valor == nombreCate[i].nombre) {
                validacion = false;
            }
        }
    } 
    return validacion;
}
function selectImg(cantidad){
    let img;
    if (cantidad == 0) {
        img = document.createElement("img");
        img.setAttribute("src", "img/uno.png"); 
    } else if(cantidad == 1){
        img = document.createElement("img");
        img.setAttribute("src", "img/dos.png");
    }else {
        img = document.createElement("img");
        img.setAttribute("src", "img/muchos.png");
    }
    return img;
}
function reordenarExp(){
    let orden;
    if (document.getElementById("idOrdenPrecio").selectedIndex == 0){
        orden = miSistemas.ordenarExpCreciente();
    }else{
        orden = miSistemas.ordenarExpDecreciente();
    }
    return orden;
}
function habilitarBotonCategoria(){
if (miSistemas.list_categorias.length == 0) {
    document.getElementById("idBotonBajaCategoria").disabled = true;
    document.getElementById("idBotonAltaExperiencia").disabled = true;

}else {
    document.getElementById("idBotonBajaCategoria").disabled = false;
    document.getElementById("idBotonAltaExperiencia").disabled = false;
}
}
function habilitarBotonExperiencias(){
    if (miSistemas.list_exp.length == 0) {
        document.getElementById("idBotonBajaExperiencia").disabled = true;
    }else {
        document.getElementById("idBotonBajaExperiencia").disabled = false;
    }
}
function habilitarBotonCompra(){
    if (document.getElementById("idCualExperiencia").innerHTML == "Experiencia: ") {
        document.getElementById("idBotonComprar").disabled = true;
    }else {
        document.getElementById("idBotonComprar").disabled = false;
    }
}
