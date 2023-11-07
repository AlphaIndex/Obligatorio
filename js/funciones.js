// Funciones  - obligatorio 2do semestre 2023
window.addEventListener("load", inicio);
let miSistemas = new Sistema();

function inicio () {
    document.getElementById("idBotonAgregarCategoria").addEventListener("click", agregarCategorias);
}
function agregarCategorias() {
    let from = document.getElementById("idFormCategoria");
    if (from.reportValidity()) {
        let cat_nombre = document.getElementById("idNombreCategoria").value;
        let cat_detalles = document.getElementById("idDetallesCategoria").value;
        let categoria = new Categoria(cat_nombre, cat_detalles);
        miSistemas.nuevaCategoria(categoria);
        from.reset();
    }
} 
function agregarExperiencia() {
    let form = document.getElementById("idFormExperiencia");
    if (form.reportValidity()){
        let exp_titulo = document.getElementById("idTituloExperiencia");
        let exp_descripcion = document.getElementById("idDescripcionExperiencia");
        let exp_precio = document.getElementById("idPrecioExperiencia");
        let exp_cantidad = document.getElementById("idCantidadPersonasExperiencia");
        let exp_categoria = document.getElementById("idCategoriaExperiencia");
        let exp = new Experiencias (exp_titulo, exp_descripcion, exp_precio, exp_cantidad, exp_categoria);
        miSistemas.nuevaExperiencia(exp);
        form.reset();
    }
}
function agregarCompra() {
    let form = document.getElementById("idFormCompra");
    if (form.reportValidity()){
        let com_nombre = document.getElementById("idNombreComprador");
        let com_mail = document.getElementById("idMail");
        let compra = new Compra (com_nombre, com_mail);
        miSistemas.nuevaCompra(compra);
        form.reset();
    }
}