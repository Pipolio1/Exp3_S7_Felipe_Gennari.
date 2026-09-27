import { useEffect, useState } from 'react';

/** URL de la API pública usada para la sección de novedades. */
const API_URL = 'https://jsonplaceholder.typicode.com/posts?_limit=3';
/** Tiempo máximo de espera por intento (ms). */
const TIMEOUT_MS = 8000;

/**
 * Sección de novedades cargadas desde una API externa (JSONPlaceholder)
 * con el hook useEffect. Gestiona con renderizado condicional los
 * estados de carga (spinner), éxito, vacío y error (con botón
 * "Reintentar"). La petición se cancela con AbortController si
 * supera el tiempo máximo de espera.
 */
function Noticias() {
  // Estados locales del componente: lista de noticias y estado de carga.
  const [noticias, setNoticias] = useState([]);
  const [estadoCarga, setEstadoCarga] = useState('cargando'); // 'cargando' | 'ok' | 'vacio' | 'error'

  /**
   * Carga las noticias desde la API con timeout mediante AbortController.
   * Se define fuera del useEffect para poder reutilizarla en el
   * botón "Reintentar" (evento onClick).
   */
  async function cargarNoticias() {
    setEstadoCarga('cargando');
    const controlador = new AbortController();
    const temporizador = setTimeout(() => controlador.abort(), TIMEOUT_MS);

    try {
      const respuesta = await fetch(API_URL, { signal: controlador.signal });

      if (!respuesta.ok) {
        throw new Error(`Error HTTP: ${respuesta.status}`);
      }

      const datos = await respuesta.json();

      // Valida y normaliza los datos antes de mostrarlos:
      // descarta entradas malformadas y limpia los textos.
      const noticiasValidas = Array.isArray(datos)
        ? datos
            .filter((noticia) => noticia
              && typeof noticia.title === 'string'
              && typeof noticia.body === 'string')
            .map((noticia) => ({ title: noticia.title.trim(), body: noticia.body.trim() }))
            .filter((noticia) => noticia.title !== '' && noticia.body !== '')
        : [];

      setNoticias(noticiasValidas);
      setEstadoCarga(noticiasValidas.length > 0 ? 'ok' : 'vacio');
    } catch (error) {
      console.error('Error al cargar noticias:', error);
      setEstadoCarga('error');
    } finally {
      clearTimeout(temporizador);
    }
  }

  // useEffect con array de dependencias vacío: la carga se ejecuta
  // una sola vez, al montar el componente.
  useEffect(() => {
    cargarNoticias();
  }, []);

  return (
    <section id="noticias-api" className="container py-4" aria-label="Novedades cargadas desde API externa">
      <h2 className="text-center mb-4">Novedades desde API externa</h2>

      {/* Renderizado condicional según el estado de la carga */}
      {estadoCarga === 'cargando' && (
        <p className="text-center" role="status" aria-live="polite">
          Cargando noticias desde la API...{' '}
          <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>
        </p>
      )}

      {estadoCarga === 'error' && (
        <p className="text-center" role="status">
          No se pudieron cargar las noticias. Revisa tu conexión e intenta nuevamente.{' '}
          <button type="button" className="btn btn-gamer btn-sm" onClick={cargarNoticias}>
            Reintentar
          </button>
        </p>
      )}

      {estadoCarga === 'vacio' && (
        <p className="text-center" role="status">No hay noticias disponibles por el momento.</p>
      )}

      {estadoCarga === 'ok' && (
        <p className="text-center" role="status" aria-live="polite">Noticias cargadas correctamente.</p>
      )}

      {/* Tarjetas de noticias */}
      <div className="row g-4" aria-busy={estadoCarga === 'cargando'}>
        {noticias.map((noticia, indice) => (
          <div key={indice} className="col-12 col-md-4">
            <article className="card card-producto noticia-api h-100">
              <div className="card-body">
                <h3 className="card-title fs-5">{noticia.title}</h3>
                <p className="card-text">{noticia.body}</p>
              </div>
            </article>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Noticias;
