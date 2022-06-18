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