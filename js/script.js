//Fetch de JSON Productos
async function traerProductos(){
    const respuesta = await fetch('./js/productos.json');
    const data = await respuesta.json();
    renderProductos(data);
    renderProximos(proximos);
    let cart = localStorage.getItem("cart");
    !cart && crearCarrito(data);
}

//Armado de Próximos Productos
class proximo{
    constructor(id, estilo, precio, descripcion, volumen){
        this.id = id;
        this.estilo = estilo;
        this.precio = precio;
        this.descripcion = descripcion;
        this.volumen = volumen;
    }
}

const proximos = [
    new proximo(1, 'Cyser', 900, 'Hidromiel estilo Melomel de Manzanas Rojas.', 750),
    new proximo(2, 'Highland', 900, 'Hidromiel con Té Blanco y flores de Brezo.', 750),
    new proximo(3, 'Driogtha', 1000, 'Destilado de Hidromiel Clásico de 45° Alc.', 200),
]

//Modal de ingreso
let log = document.querySelectorAll('.switch');
let nombreUser = document.getElementById('name');
let edadUser = document.getElementById('age');
let recordar = document.getElementById('recordarme');
let modalLog = document.getElementById('modalLogin');
let modal = new bootstrap.Modal(modalLog);

function guardarDatos(storage){
    let nombre = nombreUser.value;
    let edad = edadUser.value;
    const usuario = {
        'nombre': nombre,
        'edad': edad
    }
    storage === 'sessionStorage' && sessionStorage.setItem('usuario', JSON.stringify(usuario));
    storage === 'localStorage' && localStorage.setItem('usuario', JSON.stringify(usuario));
}

function borrarDatos(){
    localStorage.clear();
    sessionStorage.clear();
}

function recuperarUsuario(storage){
    let usuarioEnStorage = JSON.parse(storage.getItem('usuario'));
    return usuarioEnStorage;
}

function intro(usuario){
    nombreUsuario.innerHTML = `Hola <span>${usuario.nombre}</span>, bienvenido!`
}

function isLogged(usuario){
    if (usuario) {
        intro(usuario);
        traerProductos();
        mostrarCarrito(log, 'd-none')
    }
}

let btnLogin = document.getElementById('login');
btnLogin.addEventListener('click', () => {
    if (!nombreUser.value || !edadUser.value) {
        Swal.fire({
            title: 'Todos los datos son necesarios para ingresar!',
            icon: 'error',
            background: '#242323',
            color: '#FFFFF0',
        })
    }else if (edadUser.value < 18){
        Swal.fire({
            title: 'Tenés que ser mayor de 18 años para ingresar a la tienda.',
            icon: 'warning',
            background: '#242323',
            color: '#FFFFF0',
        })
    }else{
        modal.hide();
    traerProductos();
    mostrarCarrito(log, 'd-none')
    }
    if (recordar.checked){
        guardarDatos('localStorage');
        intro(recuperarUsuario(localStorage));
    }else{
        guardarDatos('sessionStorage');
        intro(recuperarUsuario(sessionStorage));
    }
});

let btnLogout = document.getElementById('btnLogout');
btnLogout.addEventListener('click', () => {
    borrarDatos();
    mostrarCarrito(log, 'd-none');
    location.reload()
});

isLogged(recuperarUsuario(localStorage));

//Agregado de Productos al Carrito
const agregarProducto = (index) =>{
    let cart = JSON.parse(localStorage.getItem('cart'));
    let cartContent = [];
    if(cart){
        for (const element of cart){
            element.id == index && element.cantidad ++;
            cartContent.push(element);
        }
    }
    localStorage.setItem('cart', JSON.stringify(cartContent));
}

//Eventos para agregar los Productos al carrito
const cargarEventos = () =>{
    let btnClass = document.getElementsByClassName('btnJs');
    for (let i = 0; i < btnClass.length; i++){
        let item = document.getElementsByClassName('btnJs')[i];
        item.addEventListener('click', ()=>{
            agregarProducto (item.id);
            Toastify({
                text: `Agregaste una botella con éxito a tu carrito!`,
                duration: 2000,
                className: "info",
                style: {
                    background: '#BA9C53',
                    color:'#242323',
                },
            }).showToast();
        });
    }
}

//Creación del carrito
const crearCarrito = (array) =>{
    let cart = [];
    for (const producto of array){
        cart.push({   
            id:producto.id,
            estilo:producto.estilo,
            precio:producto.precio,
            img:producto.img,
            volumen:producto.volumen,
            cantidad:0
        })
    }
    localStorage.setItem('cart', JSON.stringify(cart));
}

//Render de Productos
const renderProductos = (array) => {
    let divId = document.getElementById('productos')
    for (const element of array) {
        let div = document.createElement('div');
        div.className = 'tienda col-md-4 col-lg-3 m-4';
        div.innerHTML = `
		<article class="bgBlack py-4 textCenter">
			<h3>${element.estilo}</h3>
			<img src="${element.img}" alt="Botella de ${element.estilo} Trippelheim" class="rounded img-fluid">
			<p class="textIvory">Botella x ${element.volumen}ml - $${element.precio}</p>
            <button class="btnJs btn btnGold" id="${element.id}" type="button">Agregar al Carrito</button>
        </article>
        `
        divId.append(div)
    }
    cargarEventos();
}

//Render de Próximos
const renderProximos = (array) => {
    let divId = document.getElementById('proximos')
    for (const element of array) {
        let div = document.createElement('div');
        div.className = 'tienda col-md-4 col-lg-3 m-4';
        div.innerHTML = `
		<article class="bgBlack py-4 textCenter">
			<h3>${element.estilo}</h3>
			<p class="textIvory">${element.descripcion}</p>
			<p class="textIvory">Botella x ${element.volumen}ml - $${element.precio}</p>
        </article>
        `
        divId.append(div)
    }
}

//Vista dentro del Carrito
let toggle = document.querySelectorAll('.toggles');

function mostrarCarrito(array, clase) {
    array.forEach(element => {
        element.classList.toggle(clase);
    });
}

function resetCartDiv(id){
    document.getElementById(id).innerHTML = '';
}

//Botón para ver el carrito
let btnCarrito = document.getElementById('carrito');
btnCarrito.addEventListener('click', ()=>{
    renderCarrito();
    mostrarCarrito(toggle, 'd-none')
});

//Botón para volver del carrito
let btnCarritoBack = document.getElementById('carritoBack');
btnCarritoBack.addEventListener('click', ()=>{
    mostrarCarrito(toggle, 'd-none');
    resetCartDiv('contenidoCarrito');
});

//Botón Comprar
let btnComprar = document.getElementById('comprar');
btnComprar.addEventListener('click', ()=>{
    let usuario = JSON.parse(localStorage.getItem('usuario') || sessionStorage.getItem('usuario'));
    let carrito = JSON.parse(localStorage.getItem('cart'));
    let total = '';
    let compra = 0;
    for (const producto of carrito){
        total = compra+= (producto.precio * producto.cantidad);
    }
    Swal.fire({
        title: `El total de su compra es de $${total}.`,
        icon: 'warning',
        iconColor: '#BA9C53',
        text: `¿${usuario.nombre}, deseas continuar con la compra?`,
        background: '#242323',
        color: '#FFFFF0',
        showCancelButton: true,
        confirmButtonText: 'Sí',
        cancelButtonText: 'No'
    }).then((result)=>{
        if(result.isConfirmed){
            Swal.fire({
                title: `¡${usuario.nombre}, Muchas Gracias por tu Compra!`,
                icon: 'success',
                text: 'La compra se ha realizado con éxito!',
                background: '#242323',
                color: '#FFFFF0',
            }).then((result)=>{
                if (result.isConfirmed){
                    localStorage.removeItem('cart');
                    location.reload()
                }
            })
        }
    })
})

//Función para restar botellas
const quitarProducto = (index) =>{
    let cart = JSON.parse(localStorage.getItem('cart'));
    let cartContent = [];
    if(cart){
        for (const element of cart){
            element.id == index && element.cantidad --;
            cartContent.push(element);
        }
    }
    localStorage.setItem('cart', JSON.stringify(cartContent));
}

//Evento de borrado de botellas
const eventoBorrar = () =>{
    let btnClass = document.getElementsByClassName('btnJsDel');
    for (let i = 0; i < btnClass.length; i++){
        let item = document.getElementsByClassName('btnJsDel')[i];
        item.addEventListener('click', ()=>{
            quitarProducto (item.id);
            resetCartDiv('contenidoCarrito');
            renderCarrito();
            Toastify({
                text: `Eliminaste una botella con éxito de tu carrito!`,
                duration: 2000,
                className: "info",
                style: {
                    background: '#BA9C53',
                    color:'#242323',
                },
            }).showToast();
        });
    }
}

//Render de Productos dentro del carrito
const renderCarrito = () => {
    let divCarrito = document.getElementById('contenidoCarrito')
    let cart = JSON.parse(localStorage.getItem('cart'));
    for (const element of cart) {
        let div = document.createElement('div');
        if(element.cantidad > 0){
            div.className = 'tienda col-md-4 col-lg-3 m-4';
            div.innerHTML = `
            <article class="bgBlack py-4 textCenter">
                <h3>${element.estilo}</h3>
                <img src="${element.img}" alt="Botella de ${element.estilo} Trippelheim" class="rounded img-fluid">
                <p class="textIvory">Botella x ${element.volumen}ml - $${element.precio}</p>
                <p class="textIvory">Cantidad en el Carrito: ${element.cantidad}</p>
                <button class="btnJsDel btn btnGold" id="${element.id}" type="button">Quitar del Carrito</button>
            </article>
            `
            divCarrito.append(div)
        }
    }
    eventoBorrar();
}