setInterval(function() {
    const time = new Date();
    var h = time.getHours() % 12;
    var m = time.getMinutes();
    m = (m < 10 ? '0': '') + m;
    var s = time.getSeconds();
    s = (s < 10 ? '0': '') + s;
    var t = time.getHours() >= 12 ? 'pm' : 'am';

    const months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
    $('.time').html(`${h}:${m}:${s} ${t}<br/>${time.getDay()} ${months[time.getMonth()]}. ${time.getFullYear()}`);
}, 500);

setInterval(function() {
    var container = $('.patients');

    // Only scrolls if content overflows
    var isOverflowing = container[0].clientHeight < container[0].scrollHeight;
    if (!isOverflowing) return;

    $('.patients > .patient:first').slideUp(1000, function() {
        container.append($(this).show());
    });
}, 2000);

var socket = io();
socket.on('response', function(data) {
    for(var patient in data['patients']) {

    }
});