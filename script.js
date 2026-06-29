const productos = [
    {
        id: 1,
        nombre: "Granola Natural",
        precio: 2500,
        imagen: "img/granola.webp",
        categoria: "cereales"
    },
    {
        id: 2,
        nombre: "Mix de Frutos Secos",
        precio: 3200,
        imagen: "img/mixFrutosSecos.jpg",
        categoria: "snacks"
    },
    {
        id: 3,
        nombre: "Barrita de Cereal",
        precio: 900,
        imagen: "img/barritaDeCereal.webp",
        categoria: "snacks"
    }
];

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

const contenedorProductos = document.getElementById("contenedor-productos");

function mostrarProductos(lista = productos) {
    if (!contenedorProductos) return;

    contenedorProductos.innerHTML = "";

    lista.forEach(producto => {
        contenedorProductos.innerHTML += `
            <article class="producto-card">
                <img src="${producto.imagen}" alt="${producto.nombre}">
                <h3>${producto.nombre}</h3>
                <p class="producto-precio">$${producto.precio}</p>
                <button class="btn-agregar" data-id="${producto.id}">
                    Agregar al carrito
                </button>
            </article>
        `;
    });
}

mostrarProductos();

const buscador = document.getElementById("buscador");
const filtroCategoria = document.getElementById("filtro-categoria");

function filtrarProductos() {
    if (!contenedorProductos) return;

    const texto = buscador.value.toLowerCase();
    const categoria = filtroCategoria.value;

    let productosFiltrados = productos.filter(producto => {
        const coincideNombre = producto.nombre.toLowerCase().includes(texto);
        const coincideCategoria = categoria === "todos" || producto.categoria === categoria;

        return coincideNombre && coincideCategoria;
    });

    mostrarProductos(productosFiltrados);
}

if (buscador && filtroCategoria) {
    buscador.addEventListener("input", filtrarProductos);
    filtroCategoria.addEventListener("change", filtrarProductos);
}

function agregarAlCarrito(id) {
    const productoEncontrado = productos.find(producto => producto.id === id);

    carrito.push(productoEncontrado);

    localStorage.setItem("carrito", JSON.stringify(carrito));

    alert("Producto agregado al carrito");
}

if (contenedorProductos) {
    contenedorProductos.addEventListener("click", function(e) {
        if (e.target.classList.contains("btn-agregar")) {
            const idProducto = Number(e.target.dataset.id);
            agregarAlCarrito(idProducto);
        }
    });
}

const listaCarrito = document.getElementById("lista-carrito");
const totalCarrito = document.getElementById("total-carrito");

function mostrarCarrito() {
    if (!listaCarrito) return;

    listaCarrito.innerHTML = "";

    let total = 0;

    carrito.forEach((producto, index) => {
        total += producto.precio;

        listaCarrito.innerHTML += `
            <article class="producto-carrito">
                <img src="${producto.imagen}" alt="${producto.nombre}">

                <div class="info-producto">
                    <h3>${producto.nombre}</h3>
                    <p>$${producto.precio}</p>
                </div>

                <button class="btn-eliminar" data-index="${index}">
                    Eliminar
                </button>
            </article>
        `;
    });

    totalCarrito.textContent = `$${total}`;
}

function eliminarDelCarrito(index) {
    carrito.splice(index, 1);
    localStorage.setItem("carrito", JSON.stringify(carrito));
    mostrarCarrito();
}

if (listaCarrito) {
    listaCarrito.addEventListener("click", function(e) {
        if (e.target.classList.contains("btn-eliminar")) {
            const indexProducto = Number(e.target.dataset.index);
            eliminarDelCarrito(indexProducto);
        }
    });
}

mostrarCarrito();

const btnFinalizar = document.getElementById("finalizar-compra");

if (btnFinalizar) {
    btnFinalizar.addEventListener("click", function() {
        if (carrito.length === 0) {
            alert("El carrito está vacío");
            return;
        }

        alert("¡Compra finalizada con éxito! Gracias por tu compra.");

        carrito = [];

        localStorage.setItem("carrito", JSON.stringify(carrito));

        mostrarCarrito();
    });
}

const contenedorApi = document.getElementById("productos-api");

async function cargarProductosApi() {
    if (!contenedorApi) return;

    try {
        const respuesta = await fetch("https://dummyjson.com/products/category/groceries");
        const datos = await respuesta.json();

        console.log(datos);

        const productosApi = datos.products.slice(0, 4);

        productosApi.forEach(producto => {
            contenedorApi.innerHTML += `
                <article class="producto-card">
                    <img src="${producto.thumbnail}" alt="${producto.title}">
                    <h3>${producto.title}</h3>
                    <p class="producto-precio">$${producto.price}</p>
                    <p>${producto.description}</p>
                </article>
            `;
        });

    } catch (error) {
        contenedorApi.innerHTML = "<p>No se pudieron cargar los productos recomendados.</p>";
        console.log("Error al cargar la API:", error);
    }
}

cargarProductosApi();