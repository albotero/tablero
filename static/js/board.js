var socket = io();

setInterval(() => {
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
    $('.time').html(`${h}:${m} ${t}<br/>${time.getDate()} ${months[time.getMonth()]}. ${time.getFullYear()}`);
}, 1000);

setInterval(() => {
    // Requests active patients
    socket.emit('active-patients', { 'location': patientLocation });

    // Only scrolls if content overflows
    var container = $('#patients');
    let isOverflowing = container[0].clientHeight < container[0].scrollHeight;
    if (!isOverflowing)
        return;

    $('#patients .patient:last').slideUp(500, () => container.prepend($(this).slideDown(1000)) );
}, 5000);

// Requests active patients
socket.emit('active-patients', {'location': patientLocation});

socket.on(`filtered-${patientLocation}`, (data) => {
    data = JSON.parse(data);
    let activePatients = [];

    // Add new data to the list
    for (let patient of data.reverse()) {
        activePatients.push(patient['rips'] + '');

        let html = `
            <div class="--patient-rips">${patient['rips']}</div>
            <div class="--patient-time">${patient['time_str']}</div>
            <div class="--patient-status">${patient['status_str']}</div>
            <div class="--patient-detail">
                ${patient['relative'] ? '<div class="--detail-relative"></div>' : ''}                
                ${patient['destination'] ? `<div class="--detail-destination">${patient['destination']}</div>` : ''}
            </div>`;

        let item = `#patient-${patient['rips']}`;

        if ($(item).length) {
            // If patient already exists, updates its data
            if ($(item).html() != html) {
                $(item).slideUp(1000, () => $(item).html(html)
                    .attr('class', `patient --${patient['status']}`)
                    .prependTo('#patients')
                    .slideDown(1000)
                );
            }
        } else {
            // If doesn't exist, adds it to list
            html = `<div class="patient --${patient['status']}" id="patient-${patient['rips']}">${html}</div>`;
            $('#patients').prepend(html);
            $(item).hide().slideDown(1000);
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