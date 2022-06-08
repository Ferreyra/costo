const productosParent = document.getElementById('products')
const inputArticulos = document.getElementById('numart')
const inputCosto = document.getElementById('cost')
const inputEnvio = document.getElementById('envio')
const inputGanacia = document.getElementById('ganancia')
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
      this.costUnit = this.costo / this.cantidad
      if (costEnv > 0)
        costEnv = costEnv/this.cantidad
      return costEnv + this.costUnit * (1 + (ganancia/100))
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
        this.ganaciaVenta += (prod.calcPrecio(this.ganancia, this.envio/prod.cantidad) * prod.cantidad) - prod.costo
      })
    }
  }
}

function cambPrecio(item, costoE, precioE) { 
  let idPrecio = 'precioU' + item
  let idCosto = 'costU' + item
  const costoElemt = document.getElementById(idCosto)
  const precioElemt = document.getElementById(idPrecio)
  costoElemt.innerHTML = `$ ${costoE.toFixed(1)}`
  precioElemt.innerHTML = `$ ${precioE.toFixed(1)}`
 }

function actulizarLista(refProd) {     
  if (refProd.target !== undefined)
    refProd = this

  let strId = String(refProd.attributes['id'].value)
  let item = parseInt(strId.substring(strId.length - 1))
  const productoSel = listaPrecios.producto[item - 1]

  let esCosto = strId.substring(0, 4) 
  if (esCosto === 'cost') {
    productoSel.costo = refProd.value
    if (productoSel.cantidad > 0) {
      productoSel.precio = productoSel.calcPrecio(listaPrecios.ganancia, listaPrecios.envio/listaPrecios.numPoductos)
      cambPrecio(item, productoSel.costUnit, productoSel.precio)
    }
  }
  if (esCosto === 'cant') {
    productoSel.cantidad = refProd.value
    if (productoSel.costo > 0) {
      productoSel.precio = productoSel.calcPrecio(listaPrecios.ganancia, listaPrecios.envio/listaPrecios.numPoductos)
      cambPrecio(item, productoSel.costUnit, productoSel.precio)
    }
  }  
}

function logKey(e) {
  if (e.keyCode === 13)
    if (this.value)
      actulizarLista(this)
}

inputArticulos.addEventListener('focus', () => {
  const childConunt = productosParent.childElementCount
  if (childConunt > 1) {
    tablaProductos.style.display = 'none'
    for (let index = childConunt-1; index > 1; --index) {
      if (productosParent.children[index].attributes['class'].value == 'row')
        productosParent.children[index].remove()
    }    
  }
})

inputArticulos.addEventListener('focusout', () => {
  if (inputArticulos.value) {
    listaPrecios.numPoductos = inputArticulos.value

    for (let index = 0; index < listaPrecios.numPoductos; index++) {
      listaPrecios.producto.push(new Producto('Producto ' + (index + 1)))    
    }

    if (listaPrecios.numPoductos >= 1) {
      tablaProductos.removeAttribute('style')
      guia.style.display = 'none'
      for (let articulo = 1; articulo <= listaPrecios.numPoductos; articulo++) {
        productosParent.innerHTML += `
          <div class="row">
            <div class="cel"><span>Producto</span><h4>Producto ${articulo} <small>Descripción</small></h4></div>
            <div class="cel">
              <span>Costo</span>
              <label for="cost${articulo}">
                <input type="number" class="cost" id="cost${articulo}" name="cost${articulo}" min="1">
              </label>
            </div>
            <div class="cel">
              <span>Cantidad</span>
              <label for="cant${articulo}">
                <input type="number" class="cant" data-pzs=${articulo} id="cant${articulo}" name="cant${articulo}" min="1">
              </label>
            </div>
            <div class="cel" id="costU${articulo}"><span>Costo unitario</span>$</div>
            <div class="cel precio" id="precioU${articulo}"><span>Precio venta</span>$</div>
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
      const inputsProduct = productosParent.querySelectorAll('input')    
      inputsProduct.forEach(input => {
        input.addEventListener('focusout', actulizarLista)
        input.addEventListener('keyup', logKey)
      });
    }
  }
})

inputCosto.addEventListener('focusout', () => {
  if (inputCosto.value)
    listaPrecios.costo = inputCosto.value
})

inputEnvio.addEventListener('focusout', () => {
  if (inputGanacia.value)
    listaPrecios.envio = inputEnvio.value
})

inputEnvio.addEventListener('keyup', (key) => {
  if (key.key === "Enter")
    if (inputEnvio.value) {
      listaPrecios.envio = inputEnvio.value
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