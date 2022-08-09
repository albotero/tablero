var socket = io();

let curr_videos = [];
socket.on('comm-videos', (data) => {
    if (data != curr_videos) {
        // Clear list
        $('.summary').children().not(':first').remove();

        // Add videos
        data.forEach(video => {
            const regexp = /^.*[\\\/](\d+)-(.+)/g;
            const matches = regexp.exec(video);

            let index = matches[1], filename = matches[2];
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
                    <div>${filename}</div>
                    <div>${actions} </div>
                </div>`;
            
            $('.summary').append(html);
        });

        // Update global variable
        curr_videos = data;
    }
});

setInterval(() => socket.emit('get-comm-videos'), 1000);

function uploadVideo() {
    $.confirm('Subir video',
        `<form id="uploadvideo" action="/upload-video" method="post" enctype="multipart/form-data">
            <input
                type="file" name="video"
                accept="video/mp4,video/x-m4v,video/*"
                autocomplete="off"
                required>
        </form>`,
        'Subir', 'Cancelar',
        () => {
            if ($('#uploadvideo')[0].reportValidity()) {
                $('#uploadvideo').submit()
            }
        },
        false);
}