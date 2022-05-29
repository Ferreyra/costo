const productosParent = document.getElementById('products')
const inputArticulos = document.getElementById('numart')
const inputCosto = document.getElementById('cost')
const inputEnvio = document.getElementById('envio')
const inputGanacia = document.getElementById('ganancia')

let numArticulos
let costoTotal = 0
let envio = 0
let ganancia = 0

function precio() {  
  let item = 'prod' + this.attributes[1].value
  let costoPiezas = document.getElementById(item).value
  let precioUnitario = (costoPiezas/this.value)
  let precioVenta = precioUnitario * (1 + (ganancia/100))
  if (envio) {
    precioVenta += (envio/numArticulos)/this.value
  }
  const precioElem = document.createElement('h4')
  precioElem.innerHTML = `
    <h4>Precio unitario: ${precioUnitario} \t Precio de venta: <strong>${precioVenta}</strong>
  `
  this.parentElement.appendChild(precioElem)
}

inputArticulos.addEventListener('focusout', () => {
  numArticulos = inputArticulos.value

  if (numArticulos >= 1) {
    for (let articulo = 1; articulo <= numArticulos; articulo++) {
      productosParent.innerHTML += `
        <div>
          <h4>Producto ${articulo}</h4>
          <label for="prod${articulo}">Costo total:</label>
          <input type="number" id="prod${articulo}" name="prod${articulo}" min="1" required>
          <label for="cup${articulo}">Cantidad (piezas/litros):</label>
          <input type="number" data-pzs=${articulo} id="cup${articulo}" name="cup${articulo}" min="1" required>
        </div>
      `      
    }
    const inputPiezas = document.querySelectorAll('[data-pzs]')
    inputPiezas.forEach(input => {
      input.addEventListener('focusout', precio)
    });
  }
})

inputCosto.addEventListener('focusout', () => {  
  costoTotal = inputCosto.value
})

inputEnvio.addEventListener('focusout', () => {
  envio = inputEnvio.value
})

inputGanacia.addEventListener('focusout', () => {
  ganancia = inputGanacia.value
})

