/* =========================================================
   CONFIGURACIÓN — EDITÁ ACÁ LO BÁSICO DE TU NEGOCIO
   ========================================================= */
   const CONFIG = {
    // El mail donde te van a llegar los pedidos (se arma un mailto: con esto)
    email: "nyx-clothes@gmail.com",
    // Nombre de la marca, para que aparezca en el asunto del mail
    nombreMarca: "NYX - CLOTHES",
  };
  
  /* =========================================================
     PRODUCTOS — SUMÁ, EDITÁ O BORRÁ LO QUE NECESITES
     - categoria: "remeras" | "buzos" | "jeans" (usado por los filtros)
     - talles: array de talles disponibles para ESE producto
     - imagen: poné la ruta a tu foto (ej: "img/remera-negra.jpg")
     - CADA id TIENE QUE SER ÚNICO. Si copiás un producto para hacer uno
       nuevo, no te olvides de cambiarle el id (p7, p8, p9...).
     ========================================================= */
  const PRODUCTS = [
    {
      id: "p1",
      nombre: "Remera over",
      categoria: "remeras",
      precio: 19999,
      talles: ["S", "M", "L", "XL"],
      imagen: "img/remeraover.jpg",
      destacado: "Más vendida",
    },
    {
      id: "p2",
      nombre: "Buzo over",
      categoria: "buzos",
      precio: 34999,
      talles: ["M", "L", "XL"],
      imagen: "img/buzoover.jpg",
    },
    {
      id: "p3",
      nombre: "Jean baggy",
      categoria: "jeans",
      precio: 24999,
      talles: ["S", "M", "L"],
      imagen: "img/jeanangel.jpg",
    },
    {
      id: "p4",
      nombre: "Jean chain",
      categoria: "jeans",
      precio: 27999,
      talles: ["S", "M", "L", "XL"],
      imagen: "img/jeanchain.jpg",
    },
    {
      id: "p5",
      nombre: "Campera over",
      categoria: "buzos",
      precio: 44999,
      talles: ["S", "M", "L", "XL"],
      imagen: "img/camperaover.jpg",
      destacado: "Últimas unidades",
    },
    {
      id: "p6",
      nombre: "Remera básica",
      categoria: "remeras",
      precio: 17999,
      talles: ["S", "M", "L"],
      imagen: "img/remerabasica.jpg",
    },
  
    /* ---------------------------------------------------------
       PLACEHOLDERS — vas completando estos a medida que sumes
       prendas nuevas. Cambiá nombre, precio, talles e imagen.
       Los ids (p7, p8, p9) ya son únicos, no hace falta tocarlos,
       pero si agregás MÁS productos nuevos seguí la numeración
       (p10, p11...) para que no se repitan.
       --------------------------------------------------------- */
    {
      id: "p7",
      nombre: "Remera básica (completar)",
      categoria: "remeras",
      precio: 17999,
      talles: ["S", "M", "L"],
      imagen: "img/remerabasica-2.jpg",
    },
    {
      id: "p8",
      nombre: "Remera básica (completar)",
      categoria: "remeras",
      precio: 17999,
      talles: ["S", "M", "L"],
      imagen: "img/remerabasica-3.jpg",
    },
    {
      id: "p9",
      nombre: "Remera básica (completar)",
      categoria: "remeras",
      precio: 17999,
      talles: ["S", "M", "L"],
      imagen: "img/remerabasica-4.jpg",
    },
  ];
  
  /* =========================================================
     FORMATEO DE PRECIO (pesos argentinos, sin decimales)
     ========================================================= */
  function formatearPrecio(numero){
    return "$" + numero.toLocaleString("es-AR");
  }
  
  /* =========================================================
     CARRITO — se guarda en el navegador (localStorage) para que
     no se pierda si el cliente recarga o cierra la pestaña.
     Cada item del carrito es: { id, talle, cantidad }
     ========================================================= */
  let cart = cargarCarrito();
  
  function cargarCarrito(){
    try{
      const guardado = localStorage.getItem("nyx-cart");
      return guardado ? JSON.parse(guardado) : [];
    } catch (err){
      return [];
    }
  }
  
  function guardarCarrito(){
    try{
      localStorage.setItem("nyx-cart", JSON.stringify(cart));
    } catch (err){
      // Si el navegador bloquea localStorage (modo privado, etc.) el carrito
      // sigue funcionando en memoria durante la sesión, solo no persiste.
    }
  }
  
  // Clave única para identificar un item del carrito (mismo producto + mismo talle = mismo renglón)
  function claveItem(id, talle){
    return `${id}__${talle}`;
  }
  
  function agregarAlCarrito(id, talle, cantidad){
    const clave = claveItem(id, talle);
    const existente = cart.find((item) => claveItem(item.id, item.talle) === clave);
    if (existente){
      existente.cantidad += cantidad;
    } else {
      cart.push({ id, talle, cantidad });
    }
    guardarCarrito();
    actualizarContadorCarrito();
  }
  
  function quitarDelCarrito(id, talle){
    cart = cart.filter((item) => claveItem(item.id, item.talle) !== claveItem(id, talle));
    guardarCarrito();
    actualizarContadorCarrito();
    renderCarrito();
  }
  
  function vaciarCarrito(){
    cart = [];
    guardarCarrito();
    actualizarContadorCarrito();
  }
  
  function totalUnidadesCarrito(){
    return cart.reduce((total, item) => total + item.cantidad, 0);
  }
  
  function totalPrecioCarrito(){
    return cart.reduce((total, item) => {
      const producto = PRODUCTS.find((p) => p.id === item.id);
      return producto ? total + producto.precio * item.cantidad : total;
    }, 0);
  }
  
  function actualizarContadorCarrito(){
    document.getElementById("cart-count").textContent = totalUnidadesCarrito();
  }
  
  /* =========================================================
     RENDER DEL CATÁLOGO
     ========================================================= */
  const grid = document.getElementById("product-grid");
  let productoActual = null; // producto elegido en el modal de "agregar al carrito"
  
  function renderGrid(filtro = "todos"){
    grid.innerHTML = "";
    const productosFiltrados = PRODUCTS.filter(
      (p) => filtro === "todos" || p.categoria === filtro
    );
  
    productosFiltrados.forEach((producto) => {
      const card = document.createElement("article");
      card.className = "card";
      card.innerHTML = `
        <div class="card-media">
          ${producto.destacado ? `<span class="card-badge">${producto.destacado}</span>` : ""}
          <img src="${producto.imagen}" alt="${producto.nombre}" loading="lazy" onerror="manejarImagenRota(this)">
        </div>
        <div class="card-body">
          <p class="card-cat">${producto.categoria}</p>
          <h3 class="card-name">${producto.nombre}</h3>
          <p class="card-price">${formatearPrecio(producto.precio)}</p>
          <div class="card-sizes">
            ${producto.talles.map((t) => `<span>${t}</span>`).join("")}
          </div>
          <button class="btn btn-primary" data-id="${producto.id}"><b>Agregar al carrito</b></button>
        </div>
      `;
      grid.appendChild(card);
    });
  
    grid.querySelectorAll("[data-id]").forEach((btn) => {
      btn.addEventListener("click", () => abrirModalAgregar(btn.dataset.id));
    });
  
    animarTarjetas();
  }
  
  /* Imagen de reserva: si una foto todavía no existe o no carga,
     se muestra un cartel gris en su lugar en vez de romper el diseño. */
  function manejarImagenRota(img){
    img.onerror = null;
    img.src = "https://placehold.co/600x750/1a1a1a/9a9a9a?text=Falta+la+foto";
  }
  
  /* Animación simple de aparición al hacer scroll */
  function animarTarjetas(){
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting){
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    document.querySelectorAll(".card").forEach((card) => observer.observe(card));
  }
  
  /* =========================================================
     FILTROS
     ========================================================= */
  document.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      renderGrid(btn.dataset.filter);
    });
  });
  
  /* =========================================================
     MODAL: AGREGAR AL CARRITO (elegir talle + cantidad)
     ========================================================= */
  const addOverlay = document.getElementById("modal-overlay");
  const modalTitle = document.getElementById("modal-title");
  const modalPrice = document.getElementById("modal-price");
  const talleSelect = document.getElementById("talle");
  const addToCartForm = document.getElementById("add-to-cart-form");
  
  function abrirModalAgregar(id){
    productoActual = PRODUCTS.find((p) => p.id === id);
    if (!productoActual) return;
  
    modalTitle.textContent = productoActual.nombre;
    modalPrice.textContent = formatearPrecio(productoActual.precio);
    talleSelect.innerHTML = productoActual.talles
      .map((t) => `<option value="${t}">${t}</option>`)
      .join("");
  
    addToCartForm.reset();
    talleSelect.value = productoActual.talles[0];
  
    addOverlay.classList.add("open");
    document.body.style.overflow = "hidden";
  }
  
  function cerrarModalAgregar(){
    addOverlay.classList.remove("open");
    document.body.style.overflow = "";
  }
  
  document.getElementById("modal-close").addEventListener("click", cerrarModalAgregar);
  addOverlay.addEventListener("click", (e) => {
    if (e.target === addOverlay) cerrarModalAgregar();
  });
  
  addToCartForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const cantidad = parseInt(document.getElementById("cantidad").value, 10) || 1;
    agregarAlCarrito(productoActual.id, talleSelect.value, cantidad);
    cerrarModalAgregar();
    mostrarToast(`${productoActual.nombre} agregado al carrito`);
  });
  
  /* Aviso chiquito abajo cuando se agrega algo */
  let toastTimeout;
  function mostrarToast(mensaje){
    const toast = document.getElementById("toast");
    toast.textContent = mensaje;
    toast.classList.add("show");
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => toast.classList.remove("show"), 2200);
  }
  
  /* =========================================================
     MODAL: CARRITO COMPLETO + DATOS DE ENVÍO
     ========================================================= */
  const cartOverlay = document.getElementById("cart-overlay");
  const cartItemsEl = document.getElementById("cart-items");
  const cartTotalEl = document.getElementById("cart-total");
  const orderForm = document.getElementById("order-form");
  const copyFeedback = document.getElementById("copy-feedback");
  
  document.getElementById("cart-btn").addEventListener("click", () => {
    renderCarrito();
    cartOverlay.classList.add("open");
    document.body.style.overflow = "hidden";
  });
  
  function cerrarCarrito(){
    cartOverlay.classList.remove("open");
    document.body.style.overflow = "";
  }
  document.getElementById("cart-close").addEventListener("click", cerrarCarrito);
  cartOverlay.addEventListener("click", (e) => {
    if (e.target === cartOverlay) cerrarCarrito();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape"){
      cerrarModalAgregar();
      cerrarCarrito();
    }
  });
  
  function renderCarrito(){
    cartOverlay.classList.toggle("empty", cart.length === 0);
  
    cartItemsEl.innerHTML = cart
      .map((item) => {
        const producto = PRODUCTS.find((p) => p.id === item.id);
        if (!producto) return "";
        const subtotal = producto.precio * item.cantidad;
        return `
          <div class="cart-item">
            <img src="${producto.imagen}" alt="${producto.nombre}" onerror="manejarImagenRota(this)">
            <div class="cart-item-info">
              <p class="cart-item-name">${producto.nombre}</p>
              <p class="cart-item-meta">Talle ${item.talle} · x${item.cantidad}</p>
            </div>
            <p class="cart-item-price">${formatearPrecio(subtotal)}</p>
            <button type="button" class="cart-item-remove" data-remove-id="${item.id}" data-remove-talle="${item.talle}" aria-label="Quitar">✕</button>
          </div>
        `;
      })
      .join("");
  
    cartItemsEl.querySelectorAll("[data-remove-id]").forEach((btn) => {
      btn.addEventListener("click", () => {
        quitarDelCarrito(btn.dataset.removeId, btn.dataset.removeTalle);
      });
    });
  
    cartTotalEl.innerHTML = `Total: <span>${formatearPrecio(totalPrecioCarrito())}</span>`;
  }
  
  /* Arma el texto del pedido con TODOS los productos del carrito + datos del comprador */
  function armarTextoPedido(){
    const nombre = document.getElementById("nombre").value.trim();
    const telefono = document.getElementById("telefono").value.trim();
    const localidad = document.getElementById("localidad").value.trim();
    const comentario = document.getElementById("comentario").value.trim();
  
    const listaProductos = cart
      .map((item) => {
        const producto = PRODUCTS.find((p) => p.id === item.id);
        if (!producto) return "";
        const subtotal = producto.precio * item.cantidad;
        return `- ${producto.nombre} | Talle ${item.talle} | Cantidad: ${item.cantidad} | ${formatearPrecio(subtotal)}`;
      })
      .join("\n");
  
    return (
      `Pedido - ${CONFIG.nombreMarca}\n\n` +
      `Productos:\n${listaProductos}\n\n` +
      `TOTAL: ${formatearPrecio(totalPrecioCarrito())}\n\n` +
      `Nombre y apellido: ${nombre}\n` +
      `Teléfono/WhatsApp: ${telefono}\n` +
      `Localidad / dirección: ${localidad}\n` +
      (comentario ? `Comentario: ${comentario}\n` : "")
    );
  }
  
  /* Enviar por mail: arma un mailto: con asunto y cuerpo precargados */
  orderForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (cart.length === 0) return;
    if (!orderForm.checkValidity()){
      orderForm.reportValidity();
      return;
    }
  
    const cuerpo = armarTextoPedido();
    const asunto = `Pedido - ${CONFIG.nombreMarca} (${totalUnidadesCarrito()} prenda/s)`;
  
    const mailtoLink =
      `mailto:${CONFIG.email}` +
      `?subject=${encodeURIComponent(asunto)}` +
      `&body=${encodeURIComponent(cuerpo)}`;
  
    window.location.href = mailtoLink;
  
    // Vaciamos el carrito después de mandar el pedido
    vaciarCarrito();
    orderForm.reset();
    setTimeout(() => {
      renderCarrito();
    }, 300);
  });
  
  /* Copiar pedido: por si el celular/PC no tiene un mail configurado,
     así lo pueden pegar en WhatsApp, Gmail web, donde sea */
  document.getElementById("copy-order").addEventListener("click", async () => {
    if (cart.length === 0) return;
    if (!orderForm.checkValidity()){
      orderForm.reportValidity();
      return;
    }
    const texto = armarTextoPedido();
    try{
      await navigator.clipboard.writeText(texto);
      copyFeedback.textContent = "Pedido copiado. Pegalo donde prefieras enviarlo.";
    } catch (err){
      copyFeedback.textContent = "No se pudo copiar automáticamente. Copiá el texto manualmente.";
    }
  });
  
  /* =========================================================
     INICIO
     ========================================================= */
  renderGrid("todos");
  actualizarContadorCarrito();