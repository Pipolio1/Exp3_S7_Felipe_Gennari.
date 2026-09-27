import { formatearPrecio } from '../utils/formato';

/**
 * Tarjeta de un producto del catálogo (componente card de Bootstrap).
 * Muestra imagen, nombre, descripción corta, precio normal tachado,
 * precio de oferta destacado y el botón "Agregar al carrito".
 *
 * @param {Object} props
 * @param {{id: number, nombre: string, descripcion: string, precio: number, precioOferta: number, imagen: string, alt: string, categoria: string}} props.producto
 * @param {(producto: Object) => void} props.onAgregar Callback al hacer click en "Agregar al carrito".
 */
function TarjetaProducto({ producto, onAgregar }) {
  // Renderizado condicional: el precio normal tachado y la etiqueta
  // "¡Oferta!" solo se muestran cuando el producto tiene precio de oferta.
  const tieneOferta = Number.isFinite(producto.precioOferta) && producto.precioOferta < producto.precio;
  const precioFinal = tieneOferta ? producto.precioOferta : producto.precio;

  return (
    <div className="col-12 col-md-6 col-lg-4">
      <article className="card card-producto h-100 position-relative">
        {tieneOferta && <span className="etiqueta-oferta">¡Oferta!</span>}
        <img src={producto.imagen} alt={producto.alt} className="card-img-top" loading="lazy" />
        <div className="card-body d-flex flex-column">
          <h3 className="card-title fs-5">{producto.nombre}</h3>
          <p className="card-text">{producto.descripcion}</p>
          <p className="card-text mt-auto">
            {tieneOferta && (
              <>
                Precio normal: <span className="precio-normal">{formatearPrecio(producto.precio)}</span>
                <br />
              </>
            )}
            Precio oferta: <span className="precio-oferta">{formatearPrecio(precioFinal)}</span>
          </p>
          {/* Evento onClick: agrega el producto al carrito con su precio final */}
          <button
            type="button"
            className="btn btn-gamer"
            onClick={() => onAgregar({ nombre: producto.nombre, precio: precioFinal })}
          >
            Agregar al carrito
          </button>
        </div>
      </article>
    </div>
  );
}

export default TarjetaProducto;
