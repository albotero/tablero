var socket = io();

if (patientLocation) {

    setInterval(function() {
        const time = new Date();
        let h = time.getHours() % 12;
        h = h == 0 ? 12 : h;
        let m = time.getMinutes();
        m = (m < 10 ? '0': '') + m;
        let s = time.getSeconds();
        s = (s < 10 ? '0': '') + s;
        let t = time.getHours() >= 12 ? 'pm' : 'am';

        // Update clock
        const months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
        $('.time').html(`${h}:${m}:${s} ${t}<br/>${time.getDate()} ${months[time.getMonth()]}. ${time.getFullYear()}`);
    }, 500);

    setInterval(function() {
        // Requests active patients
        socket.emit('active_patients', patientLocation);

        // Only scrolls if content overflows
        var container = $('#patients');
        let isOverflowing = container[0].clientHeight < container[0].scrollHeight;
        if (!isOverflowing) return;

        $('#patients .patient:first').slideUp(1000, function() {
            container.append($(this).show());
        });
    }, 5000);

    // Requests active patients
    socket.emit('active_patients', patientLocation);
}

socket.on(`update-${patientLocation}`, function(data) {
    data = JSON.parse(data);
    let activePatients = [];

    // Add new data to the list
    for (let patient of data) {
        activePatients.push(patient['rips'] + '');

        let html = `
            <div class="--patient-rips">${patient['rips']}</div>
            <div class="--patient-time">${patient['time']}</div>
            <div class="--patient-status">${patientStatus[patient['status']]}</div>
            <div class="--patient-detail">${patient['detail']}</div>`;
    
        if ($(`#patient-${patient['rips']}`).length) {
            // If patient already exists, updates its data
            $(`#patient-${patient['rips']}`).html(html);
        } else {
            // If doesn't exist, appends it to list
            html = `<div class="patient --${patient['status']}" id="patient-${patient['rips']}">${html}</div>`;
            $('#patients').hide().append(html).slideDown(1000);
        }
    }

    // Delete outdated patients
    for (let patient of $('#patients').children()) {
        let rips = $(patient).find('.--patient-rips').text();
        if (!activePatients.includes(rips)) {
            $(patient).slideUp(1000);
        }
    }
});