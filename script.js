/* =========================================================
   CONFIGURACIÓN — EDITÁ ACÁ LO BÁSICO DE TU NEGOCIO
   ========================================================= */
const CONFIG = {
  // El mail donde te van a llegar los pedidos (se arma un mailto: con esto)
  email: "tuemail@gmail.com",
  // Nombre de la marca, para que aparezca en el asunto del mail
  nombreMarca: "Nombre de tu marca",
};

/* =========================================================
   PRODUCTOS — SUMÁ, EDITÁ O BORRÁ LO QUE NECESITES
   - categoria: "hombre" | "mujer" | "unisex"  (usado por los filtros)
   - talles: array de talles disponibles para ESE producto
   - imagen: poné la ruta a tu foto (ej: "img/remera-negra.jpg")
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
    nombre: "Jean spider",
    categoria: "jeans",
    precio: 27999,
    talles: ["S", "M", "L", "XL"],
    imagen: "img/jeanspider.jpg",
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
];

/* =========================================================
   FORMATEO DE PRECIO (pesos argentinos, sin decimales)
   ========================================================= */
function formatearPrecio(numero){
  return "$" + numero.toLocaleString("es-AR");
}

/* =========================================================
   RENDER DEL CATÁLOGO
   ========================================================= */
const grid = document.getElementById("product-grid");
let productoActual = null;

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
        <img src="${producto.imagen}" alt="${producto.nombre}" loading="lazy">
      </div>
      <div class="card-body">
        <p class="card-cat">${producto.categoria}</p>
        <h3 class="card-name">${producto.nombre}</h3>
        <p class="card-price">${formatearPrecio(producto.precio)}</p>
        <div class="card-sizes">
          ${producto.talles.map((t) => `<span>${t}</span>`).join("")}
        </div>
        <button class="btn btn-primary" data-id="${producto.id}">Pedir esta prenda</button>
      </div>
    `;
    grid.appendChild(card);
  });

  // Reconectar los botones "Pedir esta prenda" recién creados
  grid.querySelectorAll("[data-id]").forEach((btn) => {
    btn.addEventListener("click", () => abrirModal(btn.dataset.id));
  });

  animarTarjetas();
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
   MODAL DE PEDIDO
   ========================================================= */
const overlay = document.getElementById("modal-overlay");
const modalTitle = document.getElementById("modal-title");
const modalPrice = document.getElementById("modal-price");
const talleSelect = document.getElementById("talle");
const orderForm = document.getElementById("order-form");
const copyFeedback = document.getElementById("copy-feedback");

function abrirModal(id){
  productoActual = PRODUCTS.find((p) => p.id === id);
  if (!productoActual) return;

  modalTitle.textContent = productoActual.nombre;
  modalPrice.textContent = formatearPrecio(productoActual.precio);
  talleSelect.innerHTML = productoActual.talles
    .map((t) => `<option value="${t}">${t}</option>`)
    .join("");

  copyFeedback.textContent = "";
  orderForm.reset();
  talleSelect.value = productoActual.talles[0];

  overlay.classList.add("open");
  document.body.style.overflow = "hidden";
}

function cerrarModal(){
  overlay.classList.remove("open");
  document.body.style.overflow = "";
}

document.getElementById("modal-close").addEventListener("click", cerrarModal);
overlay.addEventListener("click", (e) => {
  if (e.target === overlay) cerrarModal();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") cerrarModal();
});

/* Arma el texto del pedido a partir del formulario + producto elegido */
function armarTextoPedido(){
  const nombre = document.getElementById("nombre").value.trim();
  const telefono = document.getElementById("telefono").value.trim();
  const localidad = document.getElementById("localidad").value.trim();
  const comentario = document.getElementById("comentario").value.trim();
  const talle = talleSelect.value;
  const cantidad = document.getElementById("cantidad").value;

  return (
    `Pedido - ${CONFIG.nombreMarca}\n\n` +
    `Prenda: ${productoActual.nombre}\n` +
    `Talle: ${talle}\n` +
    `Cantidad: ${cantidad}\n` +
    `Precio unitario: ${formatearPrecio(productoActual.precio)}\n\n` +
    `Nombre y apellido: ${nombre}\n` +
    `Teléfono/WhatsApp: ${telefono}\n` +
    `Localidad / dirección: ${localidad}\n` +
    (comentario ? `Comentario: ${comentario}\n` : "")
  );
}

/* Enviar por mail: arma un mailto: con asunto y cuerpo precargados */
orderForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!orderForm.checkValidity()){
    orderForm.reportValidity();
    return;
  }

  const cuerpo = armarTextoPedido();
  const asunto = `Pedido: ${productoActual.nombre} (talle ${talleSelect.value})`;

  const mailtoLink =
    `mailto:${CONFIG.email}` +
    `?subject=${encodeURIComponent(asunto)}` +
    `&body=${encodeURIComponent(cuerpo)}`;

  window.location.href = mailtoLink;
});

/* Copiar pedido: por si el celular/PC no tiene un mail configurado,
   así lo pueden pegar en WhatsApp, Gmail web, donde sea */
document.getElementById("copy-order").addEventListener("click", async () => {
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
