// Oblig 2do semestre 2023 - Clases
class Sistema {
    constructor () {
        this.list_categorias = [];
        this.list_exp = [];
        this.list_compra = [];
    }
    nuevaCategoria(categroria) {
        this.list_categorias.push(categroria);
    }

    nuevaExperiencia(experiencia) {
        this.list_exp.push(experiencia);
    }

    nuevaCompra(compra) {
        this.list_compra.push(compra)
    }
}
class Categoria {
    constructor(nombre_cate, detalles_cate) {
        this.nombre = nombre_cate;
        this.detalles = detalles_cate;
    }
}
class Experiencias {
    constructor(titulo_exp, descripcion_exp, precio_exp, cantidad_exp, categoria_exp) {
        this.titulo = titulo_exp;
        this.descripcion = descripcion_exp;
        this.precio = precio_exp;
        this.cantidad = cantidad_exp;
        this.categoria = categoria_exp;
    }
}
class Compra {
    constructor(nombre_compr, mail_compra) {
        this.nombre = nombre_compr;
        this.mail = mail_compra;
    }
}