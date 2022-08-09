let comVideos = [];
let videoIndex = -1;
let _1min = 60 * 1000;

function playNext() {
    videoIndex++;
    if (videoIndex >= comVideos.length) {
        videoIndex = 0;
    }
    $('video#comm')
        .attr('src', comVideos[videoIndex])[0]
        .play();
}

// Requests current videos
socket.emit('get-comm-videos');
setInterval(() => socket.emit('get-comm-videos'), _1min);

socket.on('comm-videos', (data) => {
    if (comVideos != data) {
        comVideos = data;
        playNext();
    }
});

$('video#comm').on('ended', () => playNext());