var socket = io();

if (patientLocation) {

    setInterval(function() {
        const time = new Date();
        let h = time.getHours() % 12;
        let m = time.getMinutes();
        m = (m < 10 ? '0': '') + m;
        let s = time.getSeconds();
        s = (s < 10 ? '0': '') + s;
        let t = time.getHours() >= 12 ? 'pm' : 'am';

        const months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
        $('.time').html(`${h}:${m}:${s} ${t}<br/>${time.getDate()} ${months[time.getMonth()]}. ${time.getFullYear()}`);
    }, 500);

    setInterval(function() {
        var container = $('#patients');

        // Only scrolls if content overflows
        let isOverflowing = container[0].clientHeight < container[0].scrollHeight;
        if (!isOverflowing) return;

        $('#patients .patient:first').slideUp(1000, function() {
            container.append($(this).show());
        });
    }, 2000);

    // Requests active patients
    socket.emit('active_patients', patientLocation);
}

socket.on(`update-${patientLocation}`, function(data) {
    data = JSON.parse(data);
    let activePatients = [];

    // Add new data to the list
    for (let patient of data['patients']) {
        activePatients.push(patient['rips']);

        let html = `
            <div class="patient --${patient['status']}" id="patient-${patient['rips']}">
                <div class="--patient-rips">${patient['rips']}</div>
                <div class="--patient-time">${patient['time']}</div>
                <div class="--patient-status">${patient['status_str']}</div>
                <div class="--patient-detail">${patient['detail']}</div>
            </div>`;
    
        if ($(`#patient-${patient['rips']}`).length) {
            // If patient already exists, updates its data
            $(`#patient-${patient['rips']}`).html(html);
        } else {
            // If doesn't exist, appends it to list
            $('#patients').append(html);
        }
    }

    // Delete outdated patients
    for (let patient in $('#patients').children()) {
        let rips = $(patient).find('.--patient-rips').text();
        if (activePatients.includes(rips)) {
            $(patient).slideUp(1000);
        }
    }
});