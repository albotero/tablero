var socket = io();

function populate_table(data) {
    // Clear list
    $('.summary').children().not(':first').remove();

    // Add new data to the list
    for (let patient of JSON.parse(data)) {
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