# Gaming House — Exp3_S7_Felipe_Gennari (React)

Actividad Semana 7 — **Construyendo componentes funcionales en React para un eCommerce interactivo**
Curso: Desarrollo Frontend I (PFY2201) — Duoc UC
Autor: Felipe Gennari

## Descripción

Migración del eCommerce "Gaming House" (Semana 6, HTML + JavaScript vanilla) a **React con Vite**. La interfaz se construye con **componentes funcionales**, el estado se maneja con el hook **useState**, los efectos secundarios (carga de datos y persistencia) con **useEffect** y la interfaz reacciona al estado mediante **renderizado condicional**.

## Funcionalidades

- **Catálogo dinámico**: los productos se cargan con Fetch API desde `public/data/productos.json` dentro de un `useEffect`, con estados de carga (spinner), error (botón "Reintentar") y éxito.
- **Tarjetas de producto**: cada producto muestra imagen, nombre, descripción corta, **precio normal tachado** y **precio de oferta** destacado (renderizado condicional según exista oferta).
- **Carrito de compras persistente**: agregar y quitar productos, **contador del número total de productos** (badge en la navbar y resumen en el carrito), **total en CLP** actualizado en tiempo real y persistencia en **localStorage** mediante `useEffect`.
- **Filtro por categorías**: menú desplegable en la navbar generado dinámicamente desde las categorías del JSON (Consolas, Videojuegos, Accesorios).
- **Búsqueda**: formulario controlado (`onSubmit`/`onChange`) que filtra productos sin recargar la página, con aviso cuando no hay resultados.
- **Noticias desde API externa**: sección de novedades cargada con Fetch API desde JSONPlaceholder, con timeout (AbortController), estados de carga/error/vacío y botón "Reintentar".
- **Mensajes dinámicos accesibles**: avisos de info/éxito/error con `role="status"` y `aria-live="polite"`.

## Estructura del proyecto

```
├── index.html                  # Punto de montaje (#root)
├── public/
│   ├── img/                    # Logo e imágenes del carrusel (WebP)
│   └── data/productos.json     # Catálogo local (con precioOferta)
└── src/
    ├── main.jsx                # Entrada React + imports de Bootstrap
    ├── index.css               # Tema gamer sobre Bootstrap 5
    ├── App.jsx                 # Estado global (useState/useEffect) y composición
    ├── utils/formato.js        # formatearPrecio, capitalizar (funciones reutilizables)
    └── components/             # Componentes funcionales
        ├── Header.jsx
        ├── Navbar.jsx          # Menú, categorías, buscador, badge contador
        ├── Carrusel.jsx        # Carrusel de ofertas (Bootstrap)
        ├── Mensaje.jsx         # Mensajes dinámicos accesibles
        ├── ListaProductos.jsx  # Grilla + estados de carga/error/vacío
        ├── TarjetaProducto.jsx # Card con precio normal y precio oferta
        ├── Carrito.jsx         # Lista, quitar ítems, contador y total
        ├── Noticias.jsx        # Fetch API externa con useEffect
        └── Footer.jsx
```

## Cómo ejecutar

Requisito: [Node.js](https://nodejs.org/) LTS instalado.

```bash
npm install     # instala las dependencias
npm run dev     # servidor de desarrollo en http://localhost:5173
npm run build   # build de producción en dist/
npm run deploy  # build + publicación en la rama gh-pages
```

## Tecnologías

- **React 18** (componentes funcionales, hooks useState y useEffect, renderizado condicional)
- **Vite 5** (entorno de desarrollo y build)
- **Bootstrap 5.3** (navbar, carrusel, grilla responsiva, cards)
- Fetch API, localStorage, CSS3 (variables CSS)

## Enlaces

- Repositorio GitHub: https://github.com/Pipolio1/Exp3_S7_Felipe_Gennari.
- Sitio desplegado (GitHub Pages): https://pipolio1.github.io/Exp3_S7_Felipe_Gennari./

## Capturas de pantalla (evidencia de funcionalidades)

Pendientes de agregar. Checklist sugerido:

1. Catálogo con tarjetas mostrando precio normal tachado y precio oferta.
2. Producto agregado al carrito (mensaje de éxito + badge contador en navbar).
3. Carrito con varios ítems, contador de productos y total.
4. Carrito tras quitar un ítem (total actualizado).
5. Filtro por categoría desde el menú desplegable.
6. Búsqueda con resultados y búsqueda sin resultados (aviso).
7. Persistencia: carrito intacto después de recargar la página.
8. Sección de noticias cargada desde la API.
9. Vistas responsivas: móvil, tablet y escritorio.
