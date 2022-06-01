const productosParent = document.getElementById('products')
const inputArticulos = document.getElementById('numart')
const inputCosto = document.getElementById('cost')
const inputEnvio = document.getElementById('envio')
const inputGanacia = document.getElementById('ganancia')
const tablaProductos = document.getElementById('tpp')
const guia = document.getElementById('txtGuia')

let numArticulos
let articulosIngredados = 0
let costoTotal = 0
let envio = 0
let ganancia = 0

function calcPrecio(refProd) {   
  if (refProd.target !== undefined)
    refProd = this   
  let item = 'prod' + refProd.attributes['data-pzs'].value
  let costoPiezas = document.getElementById(item).value
// TODO: validar costoPiezas 
  let costoUnitario = (costoPiezas/refProd.value)  
  let precioVenta = costoUnitario * (1 + (ganancia/100))
  if (envio) 
    precioVenta += (envio/numArticulos)/refProd.value
  
  let idPrecio = 'precioU' + refProd.attributes['data-pzs'].value
  let idCosto = 'costU' + refProd.attributes['data-pzs'].value

  const costoElemt = document.getElementById(idCosto)
  const precioElemt = document.getElementById(idPrecio)
  costoElemt.innerHTML = `$ ${costoUnitario.toFixed(1)}`
  precioElemt.innerHTML = `$ ${precioVenta.toFixed(1)}`


  const precioElements = document.getElementsByClassName('cel precio')
  let sumaPrecios = 0
  for (const precioElement of precioElements) {
    if (precioElement.textContent !== "$") {
      let strP = precioElement.textContent.split(' ')
      console.log(parseFloat(strP[1]))
      sumaPrecios += parseFloat(strP[1]) * refProd.value
    }
  }
  console.log('suma precios:', sumaPrecios)

  const costoElements = document.getElementsByClassName('cost')
  let sumaCostos = 0
  for (const costoIngresado of costoElements) {
    if (costoIngresado.value)
      sumaCostos += parseFloat(costoIngresado.value)
  }
  console.log(sumaCostos)
  console.log('ganancia:', sumaPrecios -  sumaCostos)
}

function logKey(e) {
  if (e.keyCode === 13)
    if (this.value)
      calcPrecio(this)
}

inputArticulos.addEventListener('focus', () => {
  const childConunt = productosParent.childElementCount
  if (childConunt > 2) {
    for (let index = childConunt-1; index > 1; --index) {
      if (productosParent.children[index].attributes['class'].value == 'row')
        productosParent.children[index].remove()
    }    
  }
})

inputArticulos.addEventListener('focusout', () => {
  numArticulos = inputArticulos.value

  if (numArticulos >= 1) {
    tablaProductos.removeAttribute('style')
    guia.style.display = 'none'
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
          <div class="cel precio" id="precioU${articulo}">$</div>
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
      input.addEventListener('focusout', calcPrecio)
      input.addEventListener('keyup', logKey)
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

