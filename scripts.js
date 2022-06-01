const productosParent = document.getElementById('products')
const inputArticulos = document.getElementById('numart')
const inputCosto = document.getElementById('cost')
const inputEnvio = document.getElementById('envio')
const inputGanacia = document.getElementById('ganancia')
const tablaProductos = document.getElementById('tpp')

let numArticulos
let costoTotal = 0
let envio = 0
let ganancia = 0

function calcPrecio() { 
  console.log('precio ') 
  let item = 'prod' + this.attributes['data-pzs'].value
  let costoPiezas = document.getElementById(item).value
  let costoUnitario = (costoPiezas/this.value)
  
  let precioVenta = costoUnitario * (1 + (ganancia/100))
  if (envio) {
    precioVenta += (envio/numArticulos)/this.value
  }
  console.log(precioVenta)
  let concatIdPrecio = 'precioU' + this.attributes['data-pzs'].value
  let concatIdCosto = 'costU' + this.attributes['data-pzs'].value
  const costoElemt = document.getElementById(concatIdCosto)
  const precioElemt = document.getElementById(concatIdPrecio)
  costoElemt.innerHTML = `$ ${costoUnitario.toFixed(1)}`
  precioElemt.innerHTML = `$ ${precioVenta.toFixed(1)}`  
}

inputArticulos.addEventListener('focusout', () => {
  numArticulos = inputArticulos.value

  if (numArticulos >= 1) {
    tablaProductos.removeAttribute('style')
    for (let articulo = 1; articulo <= numArticulos; articulo++) {
      productosParent.innerHTML += `
        <div class="row">
          <div class="cel">Productos ${articulo}<small>Descripción</small></div>
          <div class="cel">
            <label for="prod${articulo}">
              <input type="number" class="cost" id="prod${articulo}" name="prod${articulo}" min="1">
            </label>
          </div>
          <div class="cel">
            <label for="cup${articulo}">
              <input type="number" class="cant" data-pzs=${articulo} id="cup${articulo}" name="cup${articulo}" min="1">
            </label>
          </div>
          <div class="cel" id="costU${articulo}">$</div>
          <div class="cel" id="precioU${articulo}">$</div>
        </div>        
      `      
    }
    /*productosParent.innerHTML += `
      <div class="row totales">
        <div class="cel">Total</div>
        <div class="cel">$ 00</div>
        <div class="cel">00</div>
        <div class="cel">$ ++</div>
        <div class="cel">$ +++</div>
      </div>
    `*/
    const inputPiezas = document.querySelectorAll('[data-pzs]')
    inputPiezas.forEach(input => {
      console.log('addEvent')
      input.addEventListener('focusout', calcPrecio)
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

