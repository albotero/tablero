var socket = io();

let curr_videos = [];
socket.on('comm-videos', (data) => {
    if (data != curr_videos) {
        // Clear list
        $('.summary').children().not(':first').remove();

        // Add videos
        data.forEach(video => {
            let index = data.indexOf(video) + 1;
            let actions = '';
            
            if (index > 1) {
                actions += `
                    <div class="tooltip up" onclick="update_status({});">
                        <div class="tooltiptext">Subir</div>
                    </div>`;
            }
            if (index < data.length) {
                actions += `
                    <div class="tooltip down" onclick="update_status({});">
                        <div class="tooltiptext">Bajar</div>
                    </div>`;
            }
            actions += `
                <div class="tooltip delete" onclick="update_status({});">
                    <div class="tooltiptext">Eliminar</div>
                </div>`;

            let html = `
                <div>
                    <div>${index}</div>
                    <div>${video.replace(/^.*[\\\/]/, '')}</div>
                    <div>${actions} </div>
                </div>`;
            
            $('.summary').append(html);
        });

        // Update global variable
        curr_videos = data;
    }
});

setInterval(() => socket.emit('get-comm-videos'), 1000);