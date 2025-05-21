

async function cargarYMostrarRutas() {
    fetch("rutas.json")
  .then(response => response.json())
  .then(data => {
    rutas = data.rutas;
    mostrarRutas(rutas);
  })
  .catch(error => console.error("Error al cargar rutas:", error));
}

function mostrarRutas(rutas) {
    const contenedorRutas = document.getElementById("rutas-container");
    const titulos = ["Rutas Bajas", "Rutas Medias", "Rutas Altas"];

    if (!rutas) { //Comprobación agregada
        console.error("El array de rutas está indefinido.");
        contenedorRutas.innerHTML = "<p>Error: No se pudieron cargar las rutas.</p>";
        return;
    }

    contenedorRutas.innerHTML = rutas.map((ruta, index) => {
        const tituloSeccion = index % 3 === 0 ? `<h2 class="titulo-seccion">${titulos[Math.floor(index / 3)]}</h2>` : '';
        return `
            ${tituloSeccion}
            <div class="ruta">
                <h3>${ruta.ruta}</h3>
                <p><strong>Ubicación:</strong> ${ruta.ubicacion || "No especificada"}</p>
                <p>${ruta.descripcion}</p>
                <button onclick="abrirModal(${index})">Ver más</button>
            </div>
        `;
    }).join("");
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

async function CrearEditarGuia(Editar = false, registroId) {
    if(validarFormulario()){

    

    try {
        let nuevoRegistro = {
            nombreCompleto: document.getElementById('nombreCompleto').value,
            tipoDocumento: document.getElementById('tipoDocumento').value,
            numeroDocumento: document.getElementById('numeroDocumento').value,
            tipoSangre: document.getElementById('tipoSangre').value,
            telefono: document.getElementById('telefono').value,
            genero: document.getElementById('genero').value,
            talla: document.getElementById('talla').value,
            correoElectronico: document.getElementById('correoElectronico').value,
            nombreContactoEmergencia: document.getElementById('nombreContactoEmergencia').value,
            telefonoContactoEmergencia: document.getElementById('telefonoContactoEmergencia').value,
            condicionSalud: document.getElementById('condicionSalud').value || "Ninguna",
            fechaRegistro: new Date().toISOString()
        };

        

        if (!Editar) {
            nuevoRegistro.grupoID = "Guia";

            
                const nuevoCaminanteRef = registrosGuia.push();
                await nuevoCaminanteRef.set(nuevoRegistro);
                alert('Caminante registrado exitosamente');
        } else {
            const datosAntiguosSnapshot = await registrosGuia.child(registroId).once('value');
            const datosAntiguos = datosAntiguosSnapshot.val();

            await registrosGuia.child(registroId).update(nuevoRegistro);

            const modal = bootstrap.Modal.getInstance(document.getElementById('modalNuevoCaminante'));
            if (modal) modal.hide();
            else console.error('El modal no se encontró.');

            cargarCaminantes();
            alert('Datos actualizados correctamente.');
        }

        window.location.reload();
    } catch (error) {
        console.error('Error:', error);
        alert('Ocurrió un error. Por favor, inténtalo de nuevo.');
    }
    }
}
async function CrearEditar(Editar = false, registroId, grupo_id) {
    if(validarFormulario()){
    let ruta1, ruta2, cuposRuta1 = null, cuposRuta2 = null;
    const cedula = document.getElementById('numeroDocumento').value;

    ruta1 = Editar ? document.getElementById('rutaE1').value || "" : document.getElementById('ruta1').value || "";
    ruta2 = Editar ? document.getElementById('rutaE2').value || "" : document.getElementById('ruta2').value || "";

    try {
        let nuevoRegistro = {
            nombreCompleto: document.getElementById('nombreCompleto').value,
            tipoDocumento: document.getElementById('tipoDocumento').value,
            numeroDocumento: cedula,
            tipoSangre: document.getElementById('tipoSangre').value,
            telefono: document.getElementById('telefono').value,
            genero: document.getElementById('genero').value,
            talla: document.getElementById('talla').value,
            correoElectronico: document.getElementById('correoElectronico').value,
            nombreContactoEmergencia: document.getElementById('nombreContactoEmergencia').value,
            telefonoContactoEmergencia: document.getElementById('telefonoContactoEmergencia').value,
            condicionSalud: document.getElementById('condicionSalud').value || "Ninguna",
            fechaRegistro: new Date().toISOString()
        };

        if (ruta1) {
            const cuposRuta1Snapshot = await rutasRef.child(ruta1).child('cupos').child('sabado').once('value');
            cuposRuta1 = cuposRuta1Snapshot.val();
            if (cuposRuta1 <= 0) {
                alert(`No hay cupos disponibles para la ruta ${ruta1} el día Sábado.`);
                return;
            }
        }

        if (ruta2) {
            const cuposRuta2Snapshot = await rutasRef.child(ruta2).child('cupos').child('domingo').once('value');
            cuposRuta2 = cuposRuta2Snapshot.val();
            if (cuposRuta2 <= 0) {
                alert(`No hay cupos disponibles para la ruta ${ruta2} el día Domingo.`);
                return;
            }
        }

        if (!Editar && grupo_id) {
            const integrantesSnapshot = await gruposRef.child(grupo_id).child('integrantes').once('value');
            const integrantes = integrantesSnapshot.val();

            if (integrantes && parseInt(integrantes) > 0) {
                nuevoRegistro.grupoID = grupo_id;
                nuevoRegistro.ruta1 = ruta1;
                nuevoRegistro.ruta2 = ruta2;

                const nuevoRegistroRef = registrosRef.push();
                await nuevoRegistroRef.set(nuevoRegistro);

                alert('Caminante registrado exitosamente');
                bootstrap.Modal.getInstance(document.getElementById('modalNuevoCaminante')).hide();
                IntegrantesInscritos(grupo_id);
                cargarCaminantes();
                await actualizarCuposCreado(cuposRuta1, cuposRuta2, ruta1, ruta2);
                alert('Registro creado correctamente.');
            }
        } else if (!Editar) {
            nuevoRegistro.grupoID = "Independiente";
            nuevoRegistro.ruta1 = ruta1;
            nuevoRegistro.ruta2 = ruta2;

            const caminanteSnapshot = await registrosRef.orderByChild('numeroDocumento').equalTo(cedula).once('value');
            const caminanteExistente = caminanteSnapshot.val();

            if (caminanteExistente) {
                const caminanteKey = Object.keys(caminanteExistente)[0];
                const datosAntiguosSnapshot = await registrosRef.child(caminanteKey).once('value');
                const datosAntiguos = datosAntiguosSnapshot.val();
                const ruta1Antigua = datosAntiguos.ruta1||"";
                const ruta2Antigua = datosAntiguos.ruta2||"";
                await actualizarCupos(ruta1, ruta2, ruta1Antigua, ruta2Antigua);
                await registrosRef.child(caminanteKey).update(nuevoRegistro);
                console.log('Caminante actualizado correctamente.');
                alert('Caminante actualizado correctamente.');
            } else {
                const nuevoCaminanteRef = registrosRef.push();
                await nuevoCaminanteRef.set(nuevoRegistro);
                alert('Caminante registrado exitosamente');
                await actualizarCuposCreado(cuposRuta1, cuposRuta2, ruta1, ruta2);
            }
        } else {
            nuevoRegistro.ruta1 = ruta1;
            nuevoRegistro.ruta2 = ruta2;
            const datosAntiguosSnapshot = await registrosRef.child(registroId).once('value');
            const datosAntiguos = datosAntiguosSnapshot.val();
            const ruta1Antigua = datosAntiguos.ruta1||"";
            const ruta2Antigua = datosAntiguos.ruta2||"";

            await actualizarCupos(ruta1, ruta2, ruta1Antigua, ruta2Antigua);
            await registrosRef.child(registroId).update(nuevoRegistro);

            const modal = bootstrap.Modal.getInstance(document.getElementById('modalNuevoCaminante'));
            if (modal) modal.hide();
            else console.error('El modal no se encontró.');

            cargarCaminantes();
            alert('Datos actualizados correctamente.');
        }

        window.location.reload();
    } catch (error) {
        console.error('Error:', error);
        alert('Ocurrió un error. Por favor, inténtalo de nuevo.');
    }
    }
}

async function actualizarCuposCreado(cuposRuta1, cuposRuta2, ruta1, ruta2) {
    if(cuposRuta1 && ruta1){
        await rutasRef.child(ruta1).child('cupos').child('sabado').set(cuposRuta1 - 1);
    }
    if(cuposRuta2 && ruta2){
    await rutasRef.child(ruta2).child('cupos').child('domingo').set(cuposRuta2 - 1);}
}

async function IntegrantesInscritos(grupo) {
    await gruposRef.child(grupo).child('integrantes').transaction((numIntegrantes) => {
            if (typeof numIntegrantes === 'number') {
                return numIntegrantes - 1; // Incrementar el valor de forma atómica
            } else {
                return 1; // Establecer el valor inicial en 1 si no es un número
            }
        }).then(() => {
            console.log('Integrante descontado correctamente.');
        }).catch((error) => {
            console.error('Error al descontar integrante:', error);
        });    
}

function validarFormulario() {
    let campos = [
        { id: 'nombreCompleto', nombre: 'Nombre Completo' },
        { id: 'tipoDocumento', nombre: 'Tipo de Documento' },
        { id: 'numeroDocumento', nombre: 'Número de Documento' },
        { id: 'tipoSangre', nombre: 'Tipo de Sangre' },
        { id: 'telefono', nombre: 'Teléfono', validar: validarTelefono },
        { id: 'genero', nombre: 'Género' },
        { id: 'talla', nombre: 'Talla' },
        { id: 'correoElectronico', nombre: 'Correo Electrónico' },
        { id: 'nombreContactoEmergencia', nombre: 'Nombre de Contacto de Emergencia' },
        { id: 'telefonoContactoEmergencia', nombre: 'Teléfono de Contacto de Emergencia', validar: validarTelefono }
    ];

    for (let campo of campos) {
        let valor = document.getElementById(campo.id).value.trim();
        if (valor === '') {
            alert(`El campo "${campo.nombre}" es obligatorio.`);
            return false;
        }
        if (campo.validar && !campo.validar(valor)) {
            alert(`El campo "${campo.nombre}" debe tener 7 o 10 dígitos.`);
            return false;
        }
    }

    return true; // Todos los campos son válidos
}

function validarTelefono(numero) {
    return /^[0-9]{7,10}$/.test(numero);
}


async function actualizarCupos( ruta1, ruta2, ruta1Antigua, ruta2Antigua) {
    console.log(ruta1)
    console.log(ruta2)
    console.log(ruta1Antigua)
    console.log(ruta2Antigua)
    if (ruta1Antigua !== ruta1 ) {
        if(ruta1Antigua!=""){
        await rutasRef.child(ruta1Antigua).child('cupos').child('sabado').transaction((cuposSabado) => {
            if (typeof cuposSabado === 'number') {
                return cuposSabado + 1; // Incrementar el valor de forma atómica
            } else {
                return 1; // Establecer el valor inicial en 1 si no es un número
            }
        }).then(() => {
            console.log('Cupos de sábado incrementados correctamente.');
        }).catch((error) => {
            console.error('Error al incrementar cupos de sábado:', error);
        });
        }
        await rutasRef.child(ruta1).child('cupos').child('sabado').transaction((cuposSabado) => {
            if (typeof cuposSabado === 'number') {
                return cuposSabado - 1; // Incrementar el valor de forma atómica
            } else {
                return 1; // Establecer el valor inicial en 1 si no es un número
            }
        }).then(() => {
            console.log('Cupos de sábado incrementados correctamente.');
        }).catch((error) => {
            console.error('Error al incrementar cupos de sábado:', error);
        });
    }

    if (ruta2Antigua !== ruta2) {
        if(ruta1Antigua!=""){
        await rutasRef.child(ruta2Antigua).child('cupos').child('domingo').transaction((cuposDomingo) => {
            if (typeof cuposDomingo === 'number') {
                return cuposDomingo + 1; // Incrementar el valor de forma atómica
            } else {
                return 1; // Establecer el valor inicial en 1 si no es un número
            }
        }).then(() => {
            console.log('Cupos de sábado incrementados correctamente.');
        }).catch((error) => {
            console.error('Error al incrementar cupos de sábado:', error);
        });}
        await rutasRef.child(ruta2).child('cupos').child('domingo').transaction((cuposDomingo) => {
            if (typeof cuposDomingo === 'number') {
                return cuposDomingo - 1; // Incrementar el valor de forma atómica
            } else {
                return 1; // Establecer el valor inicial en 1 si no es un número
            }
        }).then(() => {
            console.log('Cupos de sábado incrementados correctamente.');
        }).catch((error) => {
            console.error('Error al incrementar cupos de sábado:', error);
        });
    }
}

function precargarDatos(datos) {
  // Asigna los valores a los campos del formulario
  document.getElementById('nombreCompleto').value = datos.nombreCompleto;
  document.getElementById('correoElectronico').value = datos.correoElectronico;
  document.getElementById('tipoDocumento').value = datos.tipoDocumento;
  document.getElementById('numeroDocumento').value = datos.numeroDocumento;
  document.getElementById('tipoSangre').value = datos.tipoSangre;
  document.getElementById('telefono').value = datos.telefono;
  document.getElementById('genero').value = datos.genero||'';
  document.getElementById('talla').value = datos.talla||'';
  document.getElementById('nombreContactoEmergencia').value = datos.nombreContactoEmergencia||'';
  document.getElementById('telefonoContactoEmergencia').value = datos.telefonoContactoEmergencia||'';
  document.getElementById('condicionSalud').value = datos.condicionSalud||'Ninguna';
  document.getElementById('rutaE1').value = datos.ruta1;
  document.getElementById('rutaE2').value = datos.ruta2;
}


function cargarRutasEnSelect(idRuta1, idRuta2, rutaElegida1 = null, rutaElegida2 = null) {
    
    const selectRuta1 = document.getElementById(idRuta1);
    const selectRuta2 = document.getElementById(idRuta2);
    rutasRef.once('value', (snapshot) => {
        const rutas = snapshot.val();

        // Limpia los selects antes de agregar las opciones
        selectRuta1.innerHTML = '<option value="">Selecciona una ruta</option>';
        selectRuta2.innerHTML = '<option value="">Selecciona una ruta</option>';

        for (const ruta in rutas) {
        const cupos = rutas[ruta].cupos['sabado'];
        const cupos2 = rutas[ruta].cupos['domingo'];

        if (cupos > 0) {
            const option1 = document.createElement('option');
            option1.value = ruta;
            option1.text = `${ruta} (cupos ${cupos})`;
            selectRuta1.appendChild(option1);

            // Si se proporciona rutaElegida1 y coincide con la ruta actual, selecciona la opción
            if (rutaElegida1 && rutaElegida1 === ruta) {
            option1.selected = true;
            }
        }

        if (cupos2 > 0) {
            const option2 = document.createElement('option');
            option2.value = ruta;
            option2.text = `${ruta} (cupos ${cupos2})`;
            selectRuta2.appendChild(option2);

            // Si se proporciona rutaElegida2 y coincide con la ruta actual, selecciona la opción
            if (rutaElegida2 && rutaElegida2 === ruta) {
            option2.selected = true;
            }
        }
        }
    });
}

async function buscarRegistro(crear=false) {
        if(crear){
            const cedula = document.getElementById('numeroDocumento').value;
            const caminanteSnapshot = await registrosRef.orderByChild('numeroDocumento').equalTo(cedula).once('value');
            const caminanteExistente = caminanteSnapshot.val();

            if (caminanteExistente) {
                alert("El participante ya está registrado. Para agregarlo a su grupo, por favor contacte al organizador del evento.")
                window.location.reload();
            }
            
            
        }
      const cedula = document.getElementById('cedula').value;

      registrosRef.orderByChild('numeroDocumento').equalTo(cedula).once('value', (snapshot) => {
        const registro = snapshot.val();

        if (registro) {
          // El registro existe, cargar los datos en el formulario
          const registroId = Object.keys(registro)[0]; // Obtener el ID del registro
          const datos = registro[registroId];
          localStorage.setItem("Caminante_registrado",registroId)
          document.getElementById('nombreCompleto').value = datos.nombreCompleto;
          document.getElementById('tipoDocumento').value = datos.tipoDocumento;
          document.getElementById('numeroDocumento').value = datos.numeroDocumento;
          document.getElementById('numeroDocumento').disabled = true;
          document.getElementById('tipoSangre').value = datos.tipoSangre;
          document.getElementById('telefono').value = datos.telefono;
          document.getElementById('talla').value = datos.talla;
          document.getElementById('genero').value = datos.genero;
          document.getElementById('correoElectronico').value = datos.correoElectronico;
          document.getElementById('nombreContactoEmergencia').value = datos.nombreContactoEmergencia;
          document.getElementById('telefonoContactoEmergencia').value = datos.telefonoContactoEmergencia;
          document.getElementById('condicionSalud').value = datos.condicionSalud;
          document.getElementById('ruta1').value = datos.ruta1;
          document.getElementById('ruta2').value = datos.ruta2;

          // Habilitar el formulario y ocultar el campo de cédula
          document.getElementById('formulario').style.display = 'block';
          document.getElementById('cedula').style.display = 'none';
          document.getElementById('buscar').style.display = 'none';
          document.getElementById('registroId').value = registroId; // Guardar el ID del registro

        } else {
          // El registro no existe, mostrar un mensaje y habilitar el formulario para crear uno nuevo
          //alert('No se encontró ningún registro con esa cédula. Por favor, complete el formulario.');
          document.getElementById('numeroDocumento').value=cedula;
          document.getElementById('formulario').style.display = 'block';
          document.getElementById('cedula').style.display = 'none';
          document.getElementById('buscar').style.display = 'none';
          
        }
      });
    }


    async function Grupo(id) {
        return new Promise((resolve, reject) => {
            gruposRef.orderByChild('liderCedula').equalTo(id).once('value', (snapshot) => {
                const registro = snapshot.val();
                
                if (registro) {
                    const registroId = Object.keys(registro)[0]; // Obtener el ID del registro
                    const datos = registro[registroId];
                    resolve(datos.nombre); // Devuelve el nombre correctamente
                } else {
                    resolve(null); // Si no hay datos, devuelve null
                }
            }, (error) => reject(error)); // Manejo de errores
        });
    }

    async function Lider(id) {
        //console.log(registrosRef)
        
        return new Promise((resolve, reject) => {
            //gruposRef.orderByChild('liderCedula').equalTo(id).once('value', (snapshot) => {
            registrosRef.orderByChild('numeroDocumento').equalTo(id).once('value', (snapshot) => {
                
                const registro = snapshot.val();
                
                if (registro) {
                    const registroId = Object.keys(registro)[0]; // Obtener el ID del registro
                    const datos = registro[registroId];
                    resolve(datos.nombreCompleto); // Devuelve el nombre correctamente
                } else {
                    resolve(null); // Si no hay datos, devuelve null
                }
            }, (error) => reject(error)); // Manejo de errores
        });
    }
    