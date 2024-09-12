(async () => {
  try {
    let response = await fetch('./js/carrito.json');
    data = await response.json();
    recibirData(data);
    activarBoton(data);
  } catch (err) {
    console.error('Error al recibir los productos', { message: 'error' });
  }
})();

let carrito = document.getElementById('carrito__compras');
let carritoID = [];
let productosActualizados = localStorage.getItem('Productos-Actualizados') ? JSON.parse(localStorage.getItem('Productos-Actualizados')) : [];
const overlay = document.getElementById('overlay');
const overlayContainer = document.querySelector('.overlay__container');
const containerTotal = document.querySelector('.container__total');
let vaciar = document.getElementById('vaciar'); 
let iconCart=document.getElementById('icon-cart')
let botones;

function crearBotones() {
  let boton = document.createElement('button');
  boton.innerHTML = 'Agregar';
  boton.classList.add('botones__agregar');
  return boton;
}

function recibirData(datos) {
  for (let i = 1; i < datos.length; i++) {
    const contenedorDiv = document.createElement('div');
    contenedorDiv.classList.add('tarjeta');
    let color = document.createElement('p');
    let precio = document.createElement('p');

    contenedorDiv.innerHTML += `
      <h2 class="titulo__tarjeta">${datos[i].nombre}</h2>
      <img class="imagenes__tarjeta" src="${datos[i].imagen}" alt="">
    `;
    color.textContent = 'Color: ' + datos[i].color;
    precio.textContent = '$' + datos[i].precio;
    color.classList.add('color__tarjeta');
    precio.classList.add('precio');
    
    botones = crearBotones();
    botones.dataset.id = i;
    contenedorDiv.appendChild(color);
    contenedorDiv.appendChild(precio);
    contenedorDiv.appendChild(botones);
    
    carrito.append(contenedorDiv);
  }

  carritoID = datos.map((elemento, index) => {
    elemento.id = index;
    return { ...elemento };
  });

  actualizarValorTotal();
}

function activarBoton(data) {
  let botones = Array.from(document.querySelectorAll('.botones__agregar'));

  botones.forEach((button) => {
    button.addEventListener('click', () => {
      let botonClickeado = Number(button.dataset.id);
      let productoSeleccionado = carritoID.find(elemento => elemento.id === botonClickeado);

      if (productoSeleccionado) {
        let productoExistente = productosActualizados.find(el => el.id === botonClickeado);

        if (productoExistente) {
          productoExistente.cantidad++; 
          iconCart.innerHTML=productoExistente.cantidad
        } else {
          productoSeleccionado.cantidad = 1; 
          iconCart.innerHTML=1
          productosActualizados.push({ ...productoSeleccionado });
        }

        localStorage.setItem('Productos-Actualizados', JSON.stringify(productosActualizados));
        actualizarOverlay();
        actualizarValorTotal();
      }
    });
  });
}

function actualizarOverlay() {
  overlayContainer.innerHTML = ''; // Limpiar el contenido del overlay antes de añadir los productos actualizados

  if (productosActualizados.length === 0) {
    // Mostrar mensaje si no hay productos en el carrito
    overlayContainer.innerHTML = 'Carrito Vacio☹️'; 
    iconCart.innerHTML=0
    
    
    containerTotal.style.display = 'none';
  } else {
    productosActualizados.forEach((producto) => {
      overlayContainer.innerHTML += `
        <div class="overlay__flex">
            <div class="overlay__tarjeta-1">
              <h2 class="imagen__nombre">${producto.nombre}</h2>
              <img class="imagen__producto" src="${producto.imagen}" alt="">
              <p class="imagen__precio">Precio unitario: $${producto.precio}</p>
               <span class="cantidad">Stock:${producto.stock}</span>
             
            </div>
          <div class="overlay__tarjeta-2"> 
             <span class="cantidad">Cantidad: ${producto.cantidad}</span>
            
              <div class="contenedor__botonera">
                <button type="button" class="agregar__boton" data-id="${producto.id}">Agregar</button>
                <button type="button" class="eliminar__boton" data-id="${producto.id}">Eliminar</button> 
              </div>
            
          </div>

        </div>
      `;
    }); 



    // Añadir eventos a los nuevos botones de agregar y eliminar
    document.querySelectorAll('.agregar__boton').forEach(botonAgregar => {
      botonAgregar.addEventListener('click', () => {
        let idProducto = Number(botonAgregar.dataset.id);
        let producto = productosActualizados.find(p => p.id === idProducto);
        if (producto) {
          producto.cantidad++; 
          iconCart.innerHTML=producto.cantidad
          localStorage.setItem('Productos-Actualizados', JSON.stringify(productosActualizados));
          actualizarOverlay(); // Actualizar el overlay para reflejar los cambios
          actualizarValorTotal(); // Actualizar el valor total en la vista
        }
      });
    });
    document.querySelectorAll('.eliminar__boton').forEach(botonEliminar => {
      botonEliminar.addEventListener('click', () => {
        let idProducto = Number(botonEliminar.dataset.id);
        let producto = productosActualizados.find(p => p.id === idProducto);
        if (producto) {
          if (producto.cantidad > 1) {
            producto.cantidad--; 
            iconCart.innerHTML=producto.cantidad 

            if(producto.cantidad<1){ 
              iconCart.innerHTML=0

            }
          } else {
            // Eliminar el producto del array si la cantidad llega a cero
            productosActualizados = productosActualizados.filter(p => p.id !== idProducto); 
            console.log(productosActualizados)
          }
          localStorage.setItem('Productos-Actualizados', JSON.stringify(productosActualizados));
          actualizarOverlay(); // Actualizar el overlay para reflejar los cambios
          actualizarValorTotal(); // Actualizar el valor total en la vista
        }
      });
    });
  }

  overlay.style.display = 'flex';
}


 

function actualizarValorTotal() {
  let total = productosActualizados.reduce((acc, prod) => acc + (prod.precio * prod.cantidad), 0);
  document.querySelector('.valor__total').textContent = `Valor total: $${total}`; 
  return total
}

vaciar.addEventListener('click', vaciarCarrito);

function vaciarCarrito() {
  if (productosActualizados.length > 0) {
    if (confirm('¿Está seguro que desea vaciar el carrito?')) {
      overlayContainer.innerHTML = 'Carrito Vacio ☹️';
      containerTotal.style.display = 'none';
      productosActualizados = [];
      carritoID = []; 
      localStorage.setItem('Productos-Actualizados', JSON.stringify(productosActualizados));
    
      setTimeout(() => {
        window.location.reload();
      }, 700);
    }
  }
}

document.getElementById('icon-overlay').addEventListener('click', () => {
  overlay.style.display = 'none';
});
