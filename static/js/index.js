function showStatus(rips) {
    if (rips) {
        $('.--patient-status .input-group:first-child div').html(rips).parent().slideDown(1000);
    } else {
        $('.--patient-status .input-group:first-child').slideUp(1000);
    }
}