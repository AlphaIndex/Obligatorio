// Funciones  - obligatorio 2do semestre 2023
window.addEventListener("load", inicio);
let miSistemas = new Sistema();

function inicio () {
    document.getElementById("idBotonAgregarCategoria").addEventListener("click", agregarCategorias);
    document.getElementById("idBotonAltaExperiencia").addEventListener("click", agregarExperiencia);
    document.getElementById("idBotonComprar").addEventListener("click", agregarCompra);
    document.getElementById("idBotonBajaCategoria").addEventListener("click", eliminarCategoria);
    document.getElementById("idBotonBajaExperiencia").addEventListener("click", eliminarExperiencias)
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
            document.getElementById("idBotonBajaCategoria").disabled = false;
            document.getElementById("idBotonAltaExperiencia").disabled = false;  
        }else {
            alert("El Nombre de esta categoria ya existe ingrese uno diferente");
        }
        form.reset();
    }
} 

function agregarExperiencia() {
    let form = document.getElementById("idFormExperiencia");
    if (form.reportValidity()){
        let exp_titulo = document.getElementById("idTituloExperiencia").value;
        let exp_descripcion = document.getElementById("idDescripcionExperiencia").value;
        let exp_precio = document.getElementById("idPrecioExperiencia").value;
        let exp_cantidad = document.getElementById("idCantidadPersonasExperiencia").value;
        let exp_categoria = document.getElementById("idCategoriaExperiencia").value;
        if (validarUnicidad("titulo", exp_titulo)) {
            let exp = new Experiencias (exp_titulo, exp_descripcion, exp_precio, exp_cantidad, exp_categoria);
            miSistemas.nuevaExperiencia(exp);
            mostrarExperiencia();
            document.getElementById("idBotonBajaExperiencia").disabled = false;
        } else {
            alert("El Titulo de esta experiencia ya existe ingrese uno diferente");
        }
        form.reset();
    }
}

function agregarCompra() {
    let form = document.getElementById("idFormCompra");
    if (form.reportValidity()){
        let com_nombre = document.getElementById("idNombreComprador").value;
        let com_mail = document.getElementById("idMail").value;
        let compra = new Compra (com_nombre, com_mail);
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
    miSistemas.eliminarCategoria(cate);
    mostrarCategoria();
}
function eliminarExperiencias() {
    let exp = document.getElementById("idComboBajaExperiencia").selectedIndex;
    miSistemas.eliminarExperiencias(exp);
    mostrarExperiencia();
}
function mostrarTabla() {

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