/* ============================================================
   Gaming House — Componente principal App (Semana 7, React)
   Autor: Felipe Gennari — PFY2201 Desarrollo Frontend I

   Centraliza el estado de la aplicación con el hook useState:
   - productos: catálogo cargado desde el JSON local (fetch + useEffect).
   - carrito: ítems agregados, persistidos en localStorage (useEffect).
   - categoria / terminoBusqueda: filtros activos del catálogo.
   - mensaje: aviso dinámico mostrado bajo el carrusel.
   ============================================================ */

import { useEffect, useState } from 'react';

import Header from './components/Header';
import Navbar from './components/Navbar';
import Carrusel from './components/Carrusel';
import Mensaje from './components/Mensaje';
import ListaProductos from './components/ListaProductos';
import Carrito from './components/Carrito';
import Noticias from './components/Noticias';
import Footer from './components/Footer';

/** Clave de localStorage donde se guarda el carrito entre sesiones. */
const CLAVE_CARRITO = 'gaminghouse_carrito';

/** Ruta del catálogo JSON local (servido desde la carpeta public/). */
const RUTA_PRODUCTOS = `${import.meta.env.BASE_URL}data/productos.json`;

/**
 * Lee y valida el carrito guardado en localStorage.
 * Se usa como inicializador perezoso de useState para que la
 * lectura ocurra una sola vez, al montar la aplicación.
 * @returns {{nombre: string, precio: number}[]} Ítems válidos guardados.
 */
function leerCarritoGuardado() {
  try {
    const guardado = JSON.parse(localStorage.getItem(CLAVE_CARRITO));

    if (Array.isArray(guardado)) {
      return guardado.filter((producto) => producto
        && typeof producto.nombre === 'string'
        && Number.isFinite(Number(producto.precio)));
    }
  } catch (error) {
    console.error('No se pudo restaurar el carrito desde localStorage:', error);
  }

  return [];
}

/**
 * Componente raíz de la aplicación: gestiona el estado global y
 * compone los componentes funcionales de cada sección de la página.
 */
function App() {
  // ---------- Estados principales (hook useState) ----------
  const [productos, setProductos] = useState([]);
  const [estadoCarga, setEstadoCarga] = useState('cargando'); // 'cargando' | 'ok' | 'error'
  const [carrito, setCarrito] = useState(leerCarritoGuardado);
  const [categoria, setCategoria] = useState('todas');
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  const [mensaje, setMensaje] = useState({
    texto: 'Interactividad cargada: busca productos, filtra por categoría o agrega items al carrito.',
    tipo: 'info',
  });

  /**
   * Carga el catálogo desde el JSON local con la Fetch API.
   * Se define fuera del useEffect para reutilizarla en el
   * botón "Reintentar" del estado de error.
   */
  async function cargarProductos() {
    setEstadoCarga('cargando');

    try {
      const respuesta = await fetch(RUTA_PRODUCTOS);

      if (!respuesta.ok) {
        throw new Error(`Error HTTP: ${respuesta.status}`);
      }

      const datos = await respuesta.json();

      // Valida y normaliza los productos antes de guardarlos en el
      // estado: descarta entradas malformadas y limpia los textos.
      const productosValidos = Array.isArray(datos)
        ? datos
            .filter((producto) => producto
              && typeof producto.nombre === 'string'
              && typeof producto.descripcion === 'string'
              && typeof producto.imagen === 'string'
              && typeof producto.categoria === 'string'
              && Number.isFinite(Number(producto.precio)))
            .map((producto) => ({
              id: producto.id,
              nombre: producto.nombre.trim(),
              descripcion: producto.descripcion.trim(),
              precio: Number(producto.precio),
              precioOferta: Number.isFinite(Number(producto.precioOferta))
                ? Number(producto.precioOferta)
                : null,
              imagen: producto.imagen.trim(),
              alt: typeof producto.alt === 'string' && producto.alt.trim() !== ''
                ? producto.alt.trim()
                : `Imagen de ${producto.nombre.trim()}`,
              categoria: producto.categoria.trim().toLowerCase(),
            }))
            .filter((producto) => producto.nombre !== '' && producto.imagen !== '')
        : [];

      if (productosValidos.length === 0) {
        throw new Error('El archivo JSON no contiene productos válidos.');
      }

      setProductos(productosValidos);
      setEstadoCarga('ok');
    } catch (error) {
      console.error('Error al cargar productos:', error);
      setEstadoCarga('error');
      setMensaje({
        texto: 'No se pudo cargar el catálogo de productos. Revisa tu conexión e intenta nuevamente.',
        tipo: 'error',
      });
    }
  }

  // ---------- Efectos (hook useEffect) ----------

  // Carga del catálogo una sola vez, al montar la aplicación.
  useEffect(() => {
    cargarProductos();
  }, []);

  // Persistencia: guarda el carrito en localStorage cada vez que cambia,
  // para que sobreviva a recargas o cierres del navegador.
  useEffect(() => {
    try {
      localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito));
    } catch (error) {
      console.error('No se pudo guardar el carrito en localStorage:', error);
    }
  }, [carrito]);

  // ---------- Manejadores de eventos ----------

  /**
   * Agrega un producto al carrito y muestra un mensaje de éxito.
   * @param {{nombre: string, precio: number}} producto Producto seleccionado.
   */
  function agregarAlCarrito(producto) {
    setCarrito((carritoActual) => [...carritoActual, producto]);
    setMensaje({ texto: `${producto.nombre} agregado al carrito.`, tipo: 'exito' });
  }

  /**
   * Elimina el ítem del carrito en la posición indicada.
   * @param {number} indice Posición del ítem dentro del carrito.
   */
  function quitarDelCarrito(indice) {
    setCarrito((carritoActual) => {
      const quitado = carritoActual[indice];
      setMensaje({ texto: `${quitado.nombre} eliminado del carrito.`, tipo: 'info' });
      return carritoActual.filter((_, i) => i !== indice);
    });
  }

  /**
   * Aplica el filtro por categoría elegido en la navbar.
   * @param {string} nuevaCategoria Categoría seleccionada ('todas' o una del catálogo).
   */
  function filtrarPorCategoria(nuevaCategoria) {
    setCategoria(nuevaCategoria);
    setTerminoBusqueda('');
    setMensaje({
      texto: nuevaCategoria === 'todas'
        ? 'Mostrando todas las categorías.'
        : `Mostrando la categoría "${nuevaCategoria}".`,
      tipo: 'info',
    });
    document.getElementById('productos')?.scrollIntoView({ behavior: 'smooth' });
  }

  /**
   * Aplica la búsqueda enviada desde el formulario de la navbar.
   * @param {string} termino Texto ingresado por el usuario.
   */
  function buscarProductos(termino) {
    const terminoLimpio = termino.trim().toLowerCase();
    setTerminoBusqueda(terminoLimpio);

    if (terminoLimpio === '') {
      setMensaje({ texto: 'Mostrando todos los productos disponibles.', tipo: 'info' });
      return;
    }

    const coincidencias = productos.filter((producto) =>
      `${producto.nombre} ${producto.descripcion}`.toLowerCase().includes(terminoLimpio)
    );

    setMensaje(
      coincidencias.length > 0
        ? { texto: `Se encontraron ${coincidencias.length} producto(s) para "${terminoLimpio}".`, tipo: 'exito' }
        : { texto: `No se encontraron productos para "${terminoLimpio}".`, tipo: 'error' }
    );
  }

  // ---------- Datos derivados del estado ----------

  // Categorías únicas del catálogo para el menú desplegable.
  const categorias = [...new Set(productos.map((producto) => producto.categoria))];

  // Productos visibles tras aplicar el filtro de categoría y la búsqueda.
  const productosVisibles = productos.filter((producto) => {
    const coincideCategoria = categoria === 'todas' || producto.categoria === categoria;
    const coincideBusqueda = terminoBusqueda === ''
      || `${producto.nombre} ${producto.descripcion}`.toLowerCase().includes(terminoBusqueda);
    return coincideCategoria && coincideBusqueda;
  });

  // ---------- Render ----------
  return (
    <>
      <Header />
      <Navbar
        categorias={categorias}
        categoriaActiva={categoria}
        onFiltrarCategoria={filtrarPorCategoria}
        onBuscar={buscarProductos}
        cantidadCarrito={carrito.length}
      />
      <Carrusel />
      <main>
        <Mensaje texto={mensaje.texto} tipo={mensaje.tipo} />
        <ListaProductos
          productos={productosVisibles}
          estadoCarga={estadoCarga}
          onReintentar={cargarProductos}
          onAgregar={agregarAlCarrito}
        />
        <Carrito carrito={carrito} onQuitar={quitarDelCarrito} />
        <Noticias />
      </main>
      <Footer />
    </>
  );
}

export default App;
