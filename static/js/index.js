var socket = io();

const destination_services = {
    'Hospitalización': ['2a', '3a'],
    'UCI': ['1', '2', 'Ped', 'RN'],
    'Urgencias': ['2a']
};

const change = `
    onkeyup="this.onchange();"
    onpaste="this.onchange();"
    oninput="this.onchange();"`;

function active_destination(active) {
    $('#destination div').removeClass('active');
    $(`#destination .--${active}-options`).addClass('active');
}

function populate_destination_hosp() {
    let html = '<option selected disabled>Seleccionar servicio</option>';
    $.each(destination_services, (service, floors) => {
        html += `<optgroup label="${service}">`;
        $.each(floors, (_index, floor) => {
            html += `<option value="${service} ${floor}">${service} ${floor}</option>`;
        });
        html += '</optgroup>';
    });
    return html;
}

function format_destination_hosp(element) {
    let active = $(element).parent();
    let detail = $(active).children('select[name="--service"]').val();
    let room = $(active).children('input[name="--room"]').val();
    if (room) {
        detail += ` - Cama ${room}`;
    }
    $(active).children('input[name="--destination-detail"]').val(detail);
}

var updated_patient = null;

function clear_filter() {
    $('#filter').val('');
    socket.emit('active-patients', {'location': patientLocation});
}

function update_status({ rips, status, destination = '', relative = false, time = null }) {
    var data = {
        'location': patientLocation,
        'rips': rips,
        'time': time,
        'status': status,
        'destination': destination,
        'relative': relative,
        'filter': $('#filter').val()
    };
    
    if (status == 'exit' && !destination) {
        $.confirm('Egresar Paciente',
            `<form id="destination">
                <h4>Destino del paciente:</h4>
                <p>
                    <label><input type="radio" name="--destination" onclick="active_destination('discharge');">Casa</label>
                    <label><input type="radio" name="--destination" onclick="active_destination('hosp');">Hospitalización</label>
                    <label><input type="radio" name="--destination" onclick="active_destination('other');">Otro</label>
                </p>
                <div class="--discharge-options">
                    <input type="hidden" name="--destination-detail" value="Casa">
                </div>
                <div class="--hosp-options">                    
                    <h4>Servicio:</h4>
                    <select name="--service" onchange="format_destination_hosp(this);" ${change}>
                        ${populate_destination_hosp()}
                    </select>
                    <h4>Cama:</h4>
                    <input type="text" name="--room" autocomplete="off" onchange="format_destination_hosp(this);" ${change}>
                    <input type="hidden" name="--destination-detail" value="">
                </div>
                <div class="--other-options">
                    <h4>Detalle:</h4>
                    <input type="text" name="--destination-detail" autocomplete="off">
                </div>
            </form>
            <script type="text/javascript">$('input[name="--destination"]')[0].click();</script>`,
            'Egresar', 'Cancelar',
            () => {
                updated_patient = rips;
                data['destination'] = $('.active input[name="--destination-detail"]').val();
                return socket.emit('update-rips', data);
            });
    } else {
        updated_patient = rips;
        return socket.emit('update-rips', data);
    }
}

function populate_table(data) {
    // Clear list
    $('.summary').children().not(':first').remove();

    // Add new data to the list
    let activePatients = []
    for (let patient of JSON.parse(data)) {
        activePatients.push(patient['rips']);
        let html = `
            <div${updated_patient == patient['rips'] ? ' class="updated-patient"' : ''}>
                <div>${patient['rips']}</div>
                <div>
                    <div class="detail">${patient['time_str']} &#10137; ${patient['status_str']}</div>
                    <div class="detail">${patient['destination']}</div>
                </div>
                <div>
                    <div class="tooltip relative${patient['relative'] ? ' --relative-called' : ''}" onclick="update_status({rips: ${patient['rips']}, status: '${patient['status']}', destination: '${patient['destination']}', time: '${patient['time']}', relative: !${patient['relative']}});">
                        <div class="tooltiptext">${patient['relative'] ? 'Retirar llamado al familiar' : 'Llamar al familiar'}</div>
                    </div>
                    <div class="tooltip surgery${patient['status_index'] > 0 ? ' disabled' : `" onclick="update_status({rips: ${patient['rips']}, status: 'surgery'});`}"><div class="tooltiptext">Ingreso a Quirófano</div></div>
                    <div class="tooltip pacu${patient['status_index'] > 1 ? ' disabled' : `" onclick="update_status({rips: ${patient['rips']}, status: 'pacu'});`}"><div class="tooltiptext">Recuperación</div></div>
                    <div class="tooltip exit${patient['status_index'] > 2 ? ' disabled' : `" onclick="update_status({rips: ${patient['rips']}, status: 'exit'});`}"><div class="tooltiptext">Salida</div></div>
                </div>
            </div>`;
        
        $('.summary').append(html);
    }
    updated_patient = null;

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
            'Ingresar', 'Cancelar',
            () => {
                updated_patient = rips;
                socket.emit('update-rips', { 'location': patientLocation, 'rips': rips, 'filter': $('#filter').val() });
            });
    }
}

// Requests filtered patients
socket.emit('active-patients', {'location': patientLocation, 'filter': $('#filter').val()});

// Filter RIPS when Enter key is pressed
$(document).on('keypress', '#filter', (e) => {
    if (e.keyCode == 13 || e.which == '13') {
        // Requests filtered patients
        socket.emit('active-patients', {'location': patientLocation, 'filter': $('#filter').val()} );
    }
});

socket.on(`filtered-${patientLocation}`, (data) => populate_table(data));