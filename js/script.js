$(document).ready(function() {

    // Simulación de base de datos inicial para usar un ciclo 'for'
    const citasIniciales = [
        { doctor: "Dr. Pérez", paciente: "Ana Rodríguez", motivo: "Dolor lumbar", estado: "activo" },
        { doctor: "Dra. Gómez", paciente: "Carlos Ruiz", motivo: "Chequeo general", estado: "pasado" }
    ];

    // Función para renderizar citas dinámicamente (Ciclo for y manipulación DOM)[cite: 1]
    function renderizarCitas(citas) {
        const contenedor = $('#contenedor-citas');
        contenedor.empty(); // Limpiar contenedor

        if(citas.length === 0) {
            contenedor.append('<p>No se encontraron citas.</p>');
            return;
        }

        // Estructura de control: Ciclo
        for (let i = 0; i < citas.length; i++) {
            let cita = citas[i];
            let html = `
                <div class="cita-card" data-estado="${cita.estado}">
                    <h4>${cita.doctor} - Consultorio ${i + 1}</h4>
                    <p><strong>Paciente:</strong> ${cita.paciente} | <strong>Motivo:</strong> ${cita.motivo}</p>
                </div>
            `;
            contenedor.append(html);
        }
    }

    // Carga inicial
    renderizarCitas(citasIniciales);

    // 1. EVENTO ONCLICK: Navegación entre vistas[cite: 1]
    $('#menu-citas, #btn-cancelar').on('click', function(e) {
        e.preventDefault();
        $('#vista-formulario').hide();
        $('#vista-listado').fadeIn();
        $('.sidebar nav ul li a').removeClass('active');
        $('#menu-citas').addClass('active');
    });

    $('#btn-nueva-cita').on('click', function() {
        $('#vista-listado').hide();
        $('#vista-formulario').fadeIn();
    });

    // 2. EVENTO ONINPUT: Búsqueda en tiempo real[cite: 1]
    $('#buscador-citas').on('input', function() {
        let termino = $(this).val().toLowerCase();
        
        // Estructura de control: Filtro/Condicional
        let citasFiltradas = citasIniciales.filter(cita => 
            cita.paciente.toLowerCase().includes(termino) || 
            cita.doctor.toLowerCase().includes(termino)
        );
        renderizarCitas(citasFiltradas);
    });

    // 3. EVENTO ONCHANGE: Filtro por estado (Checkbox)[cite: 1]
    $('#filtro-pasado').on('change', function() {
        let mostrarPasados = $(this).is(':checked');
        
        // Manipulación dinámica según condicional
        if(mostrarPasados) {
            $('.cita-card[data-estado="pasado"]').show();
        } else {
            $('.cita-card[data-estado="pasado"]').hide();
        }
    });

    // 4. EVENTO ONSUBMIT: Validación y creación dinámica de registro[cite: 1]
    $('#form-ingreso').on('submit', function(e) {
        e.preventDefault(); // Evita recargar la página
        
        // Capturar datos
        let pacienteNuevo = $('#nombre').val();
        let especialidad = $('#especialidad').val();
        
        // Validación básica (Condicional)
        if(pacienteNuevo.trim() === '') {
            alert("El nombre del paciente es requerido.");
            return;
        }

        // Lógica para añadir la nueva cita al "backend" simulado
        // Nota: Esta estructura de objeto podría mapearse posteriormente a un estándar FHIR o similar.
        let nuevaCita = {
            doctor: "Dr. Asignado (" + especialidad + ")",
            paciente: pacienteNuevo,
            motivo: "Consulta de Primera Vez",
            estado: "activo"
        };

        citasIniciales.push(nuevaCita);
        
        // Limpiar formulario y volver al listado
        this.reset();
        $('#menu-citas').click(); // Reutiliza el evento click
        renderizarCitas(citasIniciales); // Renderiza nuevamente con la cita agregada
    });
});