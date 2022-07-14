var socket = io();

function populate_table(data) {
    // Clear list
    $('.summary').children().not(':first').remove();

    // Add new data to the list
    let activePatients = []
    for (let patient of JSON.parse(data)) {
        activePatients.push(patient['rips']);
        let html = `
            <div>
                <div>${patient['rips']}</div>
                <div>
                    <div class="detail">${patient['status']}</div>
                    <div class="detail">${patient['detail']}</div>
                </div>
                <div>
                    <div class="familiar"></div>
                    <div class="surgery${patient['status_index'] > 0 ? ' disabled' : ''}"></div>
                    <div class="pacu${patient['status_index'] > 1 ? ' disabled' : ''}"></div>
                    <div class="exit${patient['status_index'] > 2 ? ' disabled' : ''}"></div>
                </div>
            </div>`;
        
        $('.summary').append(html);
    }

    // If the RIPS provided is not found, asks for registration
    let rips = parseInt($('#filter').val());
    if (rips && !activePatients.includes(rips)) {
        $.confirm('Ingresar Nuevo Paciente',
            `<p>
                El paciente con RIPS
                <span style="font-style: italic; font-weight: bold;">${$('#filter').val()}</span>
                no se encuentra ingresado.
            </p>
            <p>¿Desea ingresarlo ahora?</p>`,
            'Ingresar Paciente', 'Cancelar',
            () => socket.emit('update-rips', { 'location': patientLocation, 'rips': rips }));
    }
}

socket.on(`update-${patientLocation}`, (data) => populate_table(data));
socket.on(`filtered-${patientLocation}`, (data) => populate_table(data));

// Requests filtered patients
socket.emit('filter-patients', [patientLocation, $('#filter').val()]);

// Filter RIPS when Enter key is pressed
$(document).on('keypress', '#filter', (e) => {
    if (e.keyCode == 13 || e.which == '13') {
        // Requests filtered patients
        socket.emit('filter-patients', [patientLocation, $('#filter').val()] );
    }
});