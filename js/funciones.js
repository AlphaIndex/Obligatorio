// Funciones  - obligatorio 2do semestre 2023
//Guillermo Soanes y Danna Gonzalez
window.addEventListener("load", inicio);
let miSistemas = new Sistema();

function inicio () {
    document.getElementById("idBotonAgregarCategoria").addEventListener("click", agregarCategorias);
    document.getElementById("idBotonAltaExperiencia").addEventListener("click", agregarExperiencia);
    document.getElementById("idBotonComprar").addEventListener("click", agregarCompra);
    document.getElementById("idBotonBajaCategoria").addEventListener("click", eliminarCategoria);
    document.getElementById("idBotonBajaExperiencia").addEventListener("click", eliminarExperiencias);
    document.getElementById("idOrdenPrecio").addEventListener("change", Reiniciar_compra);
    document.getElementById("idComboCategoriasIzquierda").addEventListener("change", Reiniciar_compra);
    document.getElementById("idCantidadPersonasCategoria").addEventListener("change", Reiniciar_compra);

}

function agregarCategorias() {
    let form = document.getElementById("idFormCategoria");
    if (form.reportValidity()) { //Valida que el formulario este completo
        let cat_nombre = document.getElementById("idNombreCategoria").value;
        let cat_detalles = document.getElementById("idDetallesCategoria").value;
        if (validarUnicidad("nombre", cat_nombre)) { 
            let categoria = new Categoria(cat_nombre, cat_detalles);
            miSistemas.nuevaCategoria(categoria);
            mostrarCategoria();
        }else {
            alert("El Nombre de esta categoría ya existe ingrese uno diferente");
        }
        habilitarBotonCategoria();
        crearListaCompras();
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
        let exp_categoria = miSistemas.encontrarCategoria(document.getElementById("idCategoriaExperiencia").selectedIndex);//devuelve el objeto categoria para luego incluir en la nueva experiencia 
        if (validarUnicidad("titulo", exp_titulo)) {
            let exp = new Experiencias (exp_titulo, exp_descripcion, exp_precio, exp_cantidad, exp_categoria);
            miSistemas.nuevaExperiencia(exp);
            mostrarExperiencia();
            crearTabla();
            exp_masCara();
        } else {
            alert("El Titulo de esta experiencia ya existe ingrese uno diferente");
        }
        habilitarBotonExperiencias();
        habilitarBotonCompra();
        form.reset();
    }
}

function agregarCompra() {
    let form = document.getElementById("idFormCompra");
    if (form.reportValidity()){
        let com_nombre = document.getElementById("idNombreComprador").value;
        let com_mail = document.getElementById("idMail").value; 
        let com_experiencia = miSistemas.darNombreExperiencia();//devuelve el objeto experiencia para luego incluir en la nueva compra
        let com_fecha = crearFecha();
        let compra = new Compra (com_nombre, com_mail, com_experiencia, com_fecha);
        miSistemas.nuevaCompra(compra);
        miSistemas.agregarcompra(compra);
        crearListaExpMasCompradas();
        crearListaCompras();
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
    let nodo = document.createElement(tipo);//crea una etiqueta 
    let nodoT = document.createTextNode(texto);//crea un nodo de texto
    nodo.appendChild(nodoT);//mete el texto dentro de la etiqueta
    nodo.value = texto;
    return nodo;
}

function eliminarCategoria() {
    let cate = document.getElementById("idComboCategoriasAbajo").selectedIndex;
    if (miSistemas.verificarExistenciaExp(cate)) {
        miSistemas.eliminarCategoria(cate);
        mostrarCategoria();
        habilitarBotonCategoria();
        crearListaCompras();
    }else {
        alert("Esa categoría no puede eliminarse porque esta en uso");
    }
}

function eliminarExperiencias() {
    let exp = document.getElementById("idComboBajaExperiencia").selectedIndex;//consigue la posiscion de la experiencia
    if (miSistemas.verificarExistenciaComp(exp)) {//Verifica que si existe una compra con esa expriencia
        miSistemas.eliminarExperiencias(exp);
        mostrarCategoria();
        habilitarBotonCategoria();
        mostrarExperiencia();
        crearTabla();
        habilitarBotonExperiencias();
        exp_masCara();
    }else {
        alert("Esa experiencia no puede eliminarse porque está en uso");
    }
}

function Reiniciar_compra(){
    document.getElementById("idCualExperiencia").innerHTML = "Experiencia: ";
    crearTabla();
    crearListaCompras();
    habilitarBotonCompra();
}

function crearTabla() {
    let tabla = document.getElementById("idTabla");
    tabla.innerHTML = "";
    let datos = reordenarExp();
    datos = miSistemas.filtrarCategoria(document.getElementById("idComboCategoriasIzquierda").selectedIndex,datos);//Filtra las experiencias por categoria
    if (document.getElementById("idCantidadPersonasCategoria").selectedIndex != 0) {
        datos = miSistemas.filtrarCantidadP(document.getElementById("idCantidadPersonasCategoria").selectedIndex - 1,datos);//Filtra por cantidad de personas
    }
    let fila;
    for (let i of datos) {
        let desc = addNodo("span", i.descripcion); //Crea un nodo span con la descripcion
        desc.setAttribute("class", "detallesTabla");//Le crea una clase al span para que esten en italica
        let img = selectImg(i.cantidad);
        if (((datos.indexOf(i)+1)%2) != 0) {
            fila = tabla.insertRow();
            let celda = fila.insertCell();
            if (datos.length-1 == datos.indexOf(i)){
                celda.setAttribute("colspan", "2");
                celda.setAttribute("class", "selected");
                let parrafo = document.getElementById("idCualExperiencia");
                parrafo.innerHTML = ""; 
                parrafo.innerHTML = "Experiencia: " + i.titulo;
                miSistemas.asignarValorTitulo(i);
            }
            //pintarUltimaExperiencia(i,celda)
            celda.innerHTML = i.titulo + "<br>";
            celda.appendChild(desc);
            celda.innerHTML += "<br>"+ "$" + i.precio;
            celda.appendChild(img);
            celda.addEventListener("click", 
            function () {
                if (document.getElementsByClassName("selected")[0] != undefined) {
                    document.getElementsByClassName("selected")[0].setAttribute("class","");
                    celda.setAttribute("class", "selected");
                    let parrafo = document.getElementById("idCualExperiencia");
                    parrafo.innerHTML = ""; 
                    parrafo.innerHTML = "Experiencia: " + i.titulo;
                    habilitarBotonCompra();
                    miSistemas.asignarValorTitulo(i);
                }else {
                    celda.setAttribute("class", "selected");
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
            celda2.innerHTML += "<br>"+ "$" + i.precio + "<br>";
            celda2.appendChild(img);
            //pintarUltimaExperiencia(i,celda2)
            if (datos.length-1 == datos.indexOf(i)){
                celda2.setAttribute("class", "selected");
                let parrafo = document.getElementById("idCualExperiencia");
                parrafo.innerHTML = ""; 
                parrafo.innerHTML = "Experiencia: " + i.titulo;
                miSistemas.asignarValorTitulo(i);
            }
            celda2.addEventListener("click", 
            function () {
                if (document.getElementsByClassName("selected") != undefined) {
                    document.getElementsByClassName("selected")[0].setAttribute("class","");
                    celda2.setAttribute("class", "selected");
                    let parrafo = document.getElementById("idCualExperiencia");
                    parrafo.innerHTML = ""; 
                    parrafo.innerHTML = "Experiencia: " + i.titulo;
                    habilitarBotonCompra();
                    miSistemas.asignarValorTitulo(i);
                }else {
                    celda2.setAttribute("class", "selected");
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

function crearListaCompras(){
    let listaCompras = miSistemas.darCompra();
    let categoria = document.getElementById("idComboCategoriasIzquierda").selectedIndex;
    if (miSistemas.filtrarCategoriaCompra(categoria, listaCompras).length != 0) {
        let parrafo_categoria = document.getElementById("idDetallesCualCategoria");
        parrafo_categoria.innerHTML = "Información detallada de la categoría " + miSistemas.encontrarCategoria(document.getElementById("idComboCategoriasIzquierda").selectedIndex).nombre;
    }else {
        let parrafo_categoria = document.getElementById("idDetallesCualCategoria");
        parrafo_categoria.innerHTML = "";
    }
    if (miSistemas.darCompra().length != 0){
        let cuerpo_lista = document.getElementById("idListaCompras");
        cuerpo_lista.innerHTML = "";
        let datos = miSistemas.darCompra();
        let filtrado = miSistemas.filtrarCategoriaCompra(document.getElementById("idComboCategoriasIzquierda").selectedIndex,datos);
        if (filtrado.length != 0) {
            for(let j of filtrado){
                let texto =  "Nombre: " + j.nombre + " Mail: " + j.mail + " Fecha: " + j.fecha;
                cuerpo_lista.appendChild(addNodo("li", texto));
            }
        }else {
            cuerpo_lista.appendChild(addNodo("li", "Sin datos"));
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
    if (cantidad == 0) {//Si la posicio es 0 es la imagen de una persona
        img = document.createElement("img");
        img.setAttribute("src", "img/uno.png"); 
    } else if(cantidad == 1){//Si la posicio es 1 es la imagen de dos persona
        img = document.createElement("img");
        img.setAttribute("src", "img/dos.png");
    }else { //Si la posicio es mayor a 1 es la imagen de mas de dos personas
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
if (miSistemas.list_categorias.length == 0) {//Habilita el boton dependiendo si existen categorias 
    document.getElementById("idBotonBajaCategoria").disabled = true; //Deshabilita el boton de bajas categorias
    document.getElementById("idBotonAltaExperiencia").disabled = true;

}else {
    document.getElementById("idBotonBajaCategoria").disabled = false; //Habilita el boton de bajas categorias
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

function crearFecha() {
    let hoy = new Date();
    let hora = hoy.getHours();
    let min = hoy.getMinutes();
    if(min<10){
	    min = "0" + min;//Si los minutos son menores a 10 le concatena un 0 a la izquierda
    }
    if(hora<10){
        hora = "0" + hora;
    }
    let ret = hoy.toLocaleDateString() + " Hora " + hora + ":" + min; //Pasa la fecha a formato d/m/a y concatena la hora
    return ret;
}

function exp_masCara() {
    let experiencias = miSistemas.darExperiencia();
    let mayorPrecio = -1;
    let experiencia_cara;
    if (miSistemas.darExperiencia().length > 0){
        for (let i of experiencias) {
            if (parseInt(mayorPrecio) < parseInt(i.precio)){
                mayorPrecio = i.precio;
                experiencia_cara = i.precio; 
            }
        }
        let parrafo = document.getElementById("idExperienciaMasCara");
        parrafo.innerHTML = "";
        parrafo.innerHTML = experiencia_cara;
    }else {
        let parrafo = document.getElementById("idExperienciaMasCara");
        parrafo.innerHTML = "";
        parrafo.innerHTML = "Sin datos";
    }
}

function crearListaExpMasCompradas(){
    let cuerpo_lista = document.getElementById("idExperienciasMasCompradas")
    cuerpo_lista.innerHTML = "";
    let datos = miSistemas.mayorcompra();
    for (let i of datos){
        let texto = i.titulo;
        cuerpo_lista.appendChild(addNodo("li", texto))
    }
}
 /*function pintarUltimaExperiencia(experienciaCel, celda){
    let ultPosicion = miSistemas.darExperiencia().length - 1;
    if (experienciaCel.titulo == miSistemas.encontrarExperiencia(ultPosicion).titulo) {
        celda.setAttribute("class", "selected")
        let parrafo = document.getElementById("idCualExperiencia");
        parrafo.innerHTML = ""; 
        parrafo.innerHTML = "Experiencia: " + experienciaCel.titulo;
        miSistemas.asignarValorTitulo(experienciaCel);
    } else {
        celda.setAttribute("class", "")
    }
}*/