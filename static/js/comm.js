let comVideos = [];
let videoIndex = 0;
let _10min = 10 * 60 * 1000;

// Requests current videos
setInterval(socket.emit('get-comm-videos'), _10min);
socket.on('comm-videos', (data) => {
    comVideos = data;
    videoPlay(0);
});

function videoPlay(index) {
    let video = $('video#comm')[0];
    video.src = comVideos[index];
    video.load();
    video.play();
}

$('video#comm').on('ended', () => {
    videoIndex++;
    if (videoIndex >= comVideos.length) {
        videoIndex = 0;
    }
    videoPlay(videoIndex);
});

ensureVideoPlays();	// play the video automatically

function ensureVideoPlays() {
    let video = $('video#comm')[0];

    if(!video) return;
    
    const promise = video.play();
    if(promise !== undefined){
        promise.then(() => {
            // Autoplay started
        }).catch(error => {
            // Autoplay was prevented.
            video.muted = true;
            video.play();
        });
    }
}