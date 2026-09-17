$(document).ready(function() {
 const API_URL = '[https://gestion-medica-web-1.onrender.com/api](https://gestion-medica-web-1.onrender.com/api)';
    let citasGlobales = [];

    // 1. LOGIN
    $('#form-login').on('submit', async function(e) {
        e.preventDefault();
        const usuario = $('#username').val();
        const password = $('#password').val();

        try {
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include', // <- CLAVE PARA XAMPP Y SESIONES
                body: JSON.stringify({ usuario, password })
            });

            if (response.ok) {
                const data = await response.json();
                $('#user-display').text(`👤 ${data.usuario} (Admin)`);
                $('#login-modal').fadeOut();
                $('#main-app').fadeIn();
                cargarCitas();
            } else {
                $('#login-error').show().text("Credenciales inválidas");
            }
        } catch (error) {
            console.error('Error:', error);
            $('#login-error').show().text("Error de conexión al servidor");
        }
    });

    // LOGOUT
    $('#menu-logout').on('click', function(e) {
        e.preventDefault();
        $('#main-app').hide();
        $('#login-modal').fadeIn();
        $('#form-login')[0].reset();
    });

    // 2. CRUD
    async function cargarCitas() {
        try {
            const res = await fetch(`${API_URL}/citas`, { credentials: 'include' });
            citasGlobales = await res.json();
            aplicarFiltros();
        } catch (error) { console.error('Error:', error); }
    }

    $('#form-ingreso').on('submit', async function(e) {
        e.preventDefault(); 
        const nuevaCita = {
            nombre_paciente: $('#nombre').val(),
            codigo_seguro: $('#codigo').val(),
            especialidad: $('#especialidad').val()
        };

        try {
            const res = await fetch(`${API_URL}/citas`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(nuevaCita)
            });

            if (res.ok) {
                this.reset();
                $('#menu-citas').click(); 
                cargarCitas();
            } else { alert("Error al guardar."); }
        } catch (error) { console.error("Error:", error); }
    });

    $('#contenedor-citas').on('click', '.btn-update', async function() {
        const id = $(this).data('id');
        const nuevoEstado = $(this).data('estado') === 'activo' ? 'pasado' : 'activo';
        await fetch(`${API_URL}/citas/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ estado: nuevoEstado })
        });
        cargarCitas();
    });

    $('#contenedor-citas').on('click', '.btn-delete', async function() {
        if(confirm('¿Eliminar registro físico de BD?')) {
            await fetch(`${API_URL}/citas/${$(this).data('id')}`, { method: 'DELETE', credentials: 'include' });
            cargarCitas();
        }
    });

    // 3. INTERFAZ Y FILTROS
    function renderizarCitas(citas) {
        const contenedor = $('#contenedor-citas');
        contenedor.empty(); 
        if(citas.length === 0) return contenedor.append('<p>No hay registros.</p>');

        citas.forEach(cita => {
            let badge = cita.estado === 'activo' ? 'green' : 'gray';
            contenedor.append(`
                <div class="cita-card" data-estado="${cita.estado}">
                    <h4>ID ${cita.id} - ${cita.especialidad} <span style="color:${badge}; font-size:12px;">(${cita.estado})</span></h4>
                    <p><strong>Paciente:</strong> ${cita.nombre_paciente} | <strong>Seguro:</strong> ${cita.codigo_seguro}</p>
                    <div class="card-actions">
                        <button class="btn-sm btn-update" data-id="${cita.id}" data-estado="${cita.estado}">Alternar</button>
                        <button class="btn-sm btn-delete" data-id="${cita.id}">Borrar</button>
                    </div>
                </div>
            `);
        });
    }

    function aplicarFiltros() {
        let termino = $('#buscador-citas').val().toLowerCase();
        let mostrarActivos = $('#filtro-activo').is(':checked');
        let mostrarPasados = $('#filtro-pasado').is(':checked');

        let filtradas = citasGlobales.filter(cita => {
            let coincideTexto = cita.nombre_paciente.toLowerCase().includes(termino);
            let coincideEstado = (mostrarActivos && cita.estado === 'activo') || (mostrarPasados && cita.estado === 'pasado');
            return coincideTexto && coincideEstado;
        });
        renderizarCitas(filtradas);
    }

    $('#buscador-citas').on('input', aplicarFiltros);
    $('#filtro-activo, #filtro-pasado').on('change', aplicarFiltros);

    $('#menu-citas, #btn-cancelar').on('click', function(e) {
        e.preventDefault();
        $('#vista-formulario').hide();
        $('#vista-listado').fadeIn();
    });

    $('#btn-nueva-cita').on('click', function() {
        $('#vista-listado').hide();
        $('#vista-formulario').fadeIn();
    });
});