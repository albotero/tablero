var socket = io();

var update_status = ({rips, status, detail = '', familiar = false, time = null}) => socket.emit('update-rips', {
    'location': patientLocation,
    'rips': rips,
    'time': time,
    'status': status,
    'detail': detail,
    'familiar': familiar,
    'noupdate': true
});

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
                    <div class="detail">${patient['time_str']} &#10137; ${patient['status_str']}</div>
                    <div class="detail">${patient['detail']}</div>
                </div>
                <div>
                    <div class="familiar" onclick="update_status({rips: ${patient['rips']}, status: '${patient['status']}', time: '${patient['time']}', familiar: !${patient['familiar']}});"></div>
                    <div class="surgery${patient['status_index'] > 0 ? ' disabled' : ` " onclick="update_status({rips: ${patient['rips']}, status: 'surgery'});`}"></div>
                    <div class="pacu${patient['status_index'] > 1 ? ' disabled' : ` " onclick="update_status({rips: ${patient['rips']}, status: 'pacu'});`}"></div>
                    <div class="exit${patient['status_index'] > 2 ? ' disabled' : ` " onclick="update_status({rips: ${patient['rips']}, status: 'exit', time: '${patient['time']}', detail: '${patient['detail']}'});`}"></div>
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