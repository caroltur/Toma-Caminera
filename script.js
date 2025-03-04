fetch("rutas.json")
  .then(response => response.json())
  .then(data => {
    rutas = data.rutas;
    mostrarRutas();
  })
  .catch(error => console.error("Error al cargar rutas:", error));

  function mostrarRutas() {
    const contenedorRutas = document.getElementById("rutas-container");
    const titulos = ["Rutas Bajas", "Rutas Medias", "Rutas Altas"];

    contenedorRutas.innerHTML = rutas.map((ruta, index) => `
        ${index % 3 === 0 ? `<h2 class="titulo-seccion">${titulos[Math.floor(index / 3)]}</h2>` : ''} 
        <div class="ruta">
            <h3>${ruta.ruta}</h3>
            <p><strong>Ubicación:</strong> ${ruta.ubicacion || "No especificada"}</p>
            <p>${ruta.descripcion}</p>
            <button onclick="abrirModal(${index})">Ver más</button>
        </div>
    `).join("");
}

function abrirModal(index) {
    const ruta = rutas[index]; // Asegúrate de que estás usando el array correcto
    const modal = document.getElementById("modal"); // El ID correcto del HTML
    const modalTitulo = document.getElementById("modal-titulo");
    const modalDescripcion = document.getElementById("modal-descripcion");
    const modalDistancia = document.getElementById("modal-distancia");
    const modalDificultad = document.getElementById("modal-dificultad");
    const modalDuracion = document.getElementById("modal-duracion");
    const modalImagenes = document.getElementById("modal-imagenes");
    const atractivosList = document.getElementById("atractivos-list");



    // Llenar el modal con la información de la ruta seleccionada
    atractivosList.innerHTML = "";
    modalTitulo.textContent = ruta.ruta;
    modalDescripcion.textContent = ruta.descripcion;
    modalDistancia.textContent = ruta.recorrido.distancia || "No especificada";
    modalDificultad.textContent = ruta.recorrido.dificultad || "No especificada";
    modalDuracion.textContent = ruta.recorrido.duracion || "No especificada";
    ruta.atractivos.map(atractivo => {
        const listItem = document.createElement("li");
        listItem.textContent = atractivo;
        atractivosList.appendChild(listItem);
      });
    // Agregar imágenes al carrusel
    if (ruta.imagenes && ruta.imagenes.length > 0) {
        modalImagenes.innerHTML = ruta.imagenes.map((img, index) => 
            index === 3  // Si es la cuarta imagen (índice 3)
            ? `<a href="${ruta.album}" target="_blank">
                 <img src="${img}" alt="Imagen de ${ruta.ruta}" class="imagen-modal">
               </a>` 
            : `<img src="${img}" alt="Imagen de ${ruta.ruta}" class="imagen-modal">`
        ).join("");
    } else {
        modalImagenes.innerHTML = "<p>No hay imágenes disponibles.</p>";
    }

    // Mostrar el modal
    modal.style.display = "block";
}

function cerrarModal() {
    const modal = document.getElementById("modal");
    modal.style.display = "none";
}



// Ejemplo de uso
