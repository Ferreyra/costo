const productosParent = document.getElementById('products')
const inputArticulos = document.getElementById('numart')
const inputCosto = document.getElementById('cost')
const inputEnvio = document.getElementById('envio')
const inputGanacia = document.getElementById('porcentajeGanancia')
const tablaProductos = document.getElementById('tpp')
const guia = document.getElementById('txtGuia')

class Producto {
  constructor(nom, cost, cant, desc) {
  this.nombre = nom
  this.descripcion = desc
  this.costo = cost
  this.cantidad =cant
  }
  costUnit = 0.0
  precio = 0.0
  calcPrecio(ganancia, costEnv) {
    if (this.costo > 0 && this.cantidad > 0) {
      let gptj = ganancia/100
      this.costUnit = parseFloat((this.costo / this.cantidad).toFixed(2))
      gptj *= this.costUnit
      gptj += this.costUnit
      if (costEnv > 0)
        costEnv = costEnv/this.cantidad
      return parseFloat((costEnv + gptj).toFixed(1))
    }
  }
}

const listaPrecios = {
  numPoductos: number = 0,
  costo: float = 0,
  envio: float = 0,
  ganancia: number = 50,
  ganaciaVenta: float = 0,
  producto: [],
  calcGanancia() {
    if (this.producto.length > 0) {
      this.ganaciaVenta = 0
      this.producto.forEach(prod => {
        if (prod.costo && prod.cantidad)
          this.ganaciaVenta += (prod.calcPrecio(this.ganancia, this.envio/this.numPoductos) * prod.cantidad) - prod.costo
      })
      this.ganaciaVenta = parseFloat(this.ganaciaVenta.toFixed(1))
      this.ganaciaVenta = this.ganaciaVenta - this.envio
    }
  }
}

function cambPrecio(item, costoE, precioE) { 
  let idPrecio = 'precioU' + item
  let idCosto = 'costU' + item
  const costoElemt = document.getElementById(idCosto)
  const precioElemt = document.getElementById(idPrecio)
  costoElemt.innerHTML = `<span>Costo unitario</span>$ ${costoE}`
  precioElemt.innerHTML = `<span>Precio venta</span>$ ${precioE}`
}

function actulizarLista(refProd) {     
  if (refProd.target !== undefined)
    refProd = this
 
  let strId = String(refProd.attributes['id'].value)
  let item = parseInt(strId.substring(strId.length - 1))
  const productoSel = listaPrecios.producto[item - 1]

  let esCosto = strId.substring(0, 4) 
  if (esCosto === 'cost' && refProd.value) {
    productoSel.costo = parseFloat(refProd.value)
    if (productoSel.cantidad > 0) {
      productoSel.precio = productoSel.calcPrecio(listaPrecios.ganancia, listaPrecios.envio/listaPrecios.numPoductos)
      cambPrecio(item, productoSel.costUnit, productoSel.precio)
    }
  }
  if (esCosto === 'cant' && refProd.value) {
    productoSel.cantidad = parseFloat(refProd.value)
    if (productoSel.costo > 0) {
      productoSel.precio = productoSel.calcPrecio(listaPrecios.ganancia, listaPrecios.envio/listaPrecios.numPoductos)
      cambPrecio(item, productoSel.costUnit, productoSel.precio)
    }
  }

  const sumaCostos = listaPrecios.producto.reduce( (a, b) => a.costo + b.costo )
  console.log(sumaCostos)
  if (sumaCostos /*&& sumaCostos === listaPrecios.costo*/) {
    listaPrecios.calcGanancia()
    console.log('Ganancia', listaPrecios.ganaciaVenta)
    const gananciaElemt = document.getElementById('ganancia')
    gananciaElemt.style.display = 'grid'
    gananciaElemt.lastElementChild.textContent = `$ ${listaPrecios.ganaciaVenta}`
  }
}

function logKey(e) {
  if (e.key === "Enter" && this.value)
    actulizarLista(this)
}

function fProductos() {
  let nArticulos, ix = 0  
  if (listaPrecios.numPoductos > 0) {
    while (listaPrecios.numPoductos > inputArticulos.value) {
      listaPrecios.producto.pop()
      productosParent.children[listaPrecios.numPoductos].remove()
      listaPrecios.numPoductos--
    }
    if (listaPrecios.numPoductos < inputArticulos.value){
      nArticulos = inputArticulos.value - listaPrecios.numPoductos
      ix = parseInt(listaPrecios.numPoductos)
    }
  } else {
    nArticulos = inputArticulos.value
    tablaProductos.removeAttribute('style')
  }
  listaPrecios.numPoductos = inputArticulos.value
  if (nArticulos >= 1) {      
    guia.style.display = 'none'    
    for (let articulo = 1; articulo <= nArticulos; articulo++) {
      listaPrecios.producto.push(new Producto('Producto ' + (ix + articulo)))
      productosParent.innerHTML += `
        <div class="row">
          <div class="cel"><span>Producto</span><h4>Producto ${ix + articulo} <small>Descripción</small></h4></div>
          <div class="cel">
            <span>Costo</span>
            <label for="cost${ix + articulo}">
              <input type="number" class="cost" id="cost${ix + articulo}" name="cost${ix + articulo}" min="1">
            </label>
          </div>
          <div class="cel">
            <span>Cantidad</span>
            <label for="cant${ix + articulo}">
              <input type="number" class="cant" data-pzs=${ix + articulo} id="cant${ix + articulo}" name="cant${ix + articulo}" min="1">
            </label>
          </div>
          <div class="cel" id="costU${ix + articulo}"><span>Costo unitario</span>$</div>
          <div class="cel precio" id="precioU${ix + articulo}"><span>Precio venta</span>$</div>
        </div>        
      `
    }
    for (let xinp = 0; xinp < ix; xinp++) {
      let inputDato = document.getElementById('cost'+ (xinp + 1))
      inputDato.value = listaPrecios.producto[xinp].costo
      inputDato = document.getElementById('cant'+ (xinp + 1))
      inputDato.value = listaPrecios.producto[xinp].cantidad
    }
    for (let articulo = 1; articulo <= nArticulos; articulo++) {
      const inputsProduct = productosParent.children[ix + articulo].querySelectorAll('input')      
      inputsProduct.forEach( input => {
          input.addEventListener('focusout', actulizarLista)
          input.addEventListener('keyup', logKey)
      })
    }
  }  
}

inputArticulos.addEventListener('focusout', () => {
  if (inputArticulos.value)
    fProductos()
})
inputArticulos.addEventListener('keyup', (key) => {
  if (key.key === "Enter") 
    if (inputArticulos.value) {
      fProductos()
  }
})

inputCosto.addEventListener('focusout', () => {
  if (inputCosto.value)
    listaPrecios.costo = parseFloat(inputCosto.value)
})
inputCosto.addEventListener('keyup', (key) => {
  if (key.key === "Enter") 
    if (inputCosto.value)
      listaPrecios.costo = parseFloat(inputCosto.value)
})

inputEnvio.addEventListener('focusout', () => {
  if (inputEnvio.value)
    listaPrecios.envio = parseFloat(inputEnvio.value)
})

inputEnvio.addEventListener('keyup', (key) => {  
  if (key.key === "Enter") 
    if (inputEnvio.value) {      
      listaPrecios.envio = parseFloat(inputEnvio.value)
      const listPrcios = productosParent.getElementsByClassName('cant')
      if (listPrcios.length > 0) {
        for(let producto of listPrcios) {
          actulizarLista(producto)
        }
      }
    }
})

inputGanacia.addEventListener('focusout', () => {
  if (inputGanacia.value)
    listaPrecios.ganancia = inputGanacia.value
})

inputGanacia.addEventListener('keyup', (key) => {
  if (key.key === "Enter")
    if (inputGanacia.value) {    
      listaPrecios.ganancia = inputGanacia.value
      const listPrcios = productosParent.getElementsByClassName('cant')
      if (listPrcios.length > 0) {
        for(let producto of listPrcios) {
          actulizarLista(producto)
        }
      }
    }
})