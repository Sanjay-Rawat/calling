var peer;
var peerId;
var isVideoOn = false;
var isAudioOn = false;
var messages = [];
var videoContainer;

function __init() {
    peer = new Peer();
    const interval = setInterval(() => {
        peerId = peer.id;
        peerId && clearInterval(interval);
        peerId && peer.on('call', incomingStreamHandler )
        if(peerId){
            document.getElementById("uid").innerHTML = peerId
        }
        
    }, 100)
    videoContainer = document.getElementById("video-container")
}

function __init_stream(isVideo = true, isAudio = true) {
    return new Promise((resolve, reject) => {
        const getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
        getUserMedia({ video: isVideo, audio: isAudio }, (stream) => {
            resolve(stream)
        }, (err) => {
            reject(err)
        });
    })
}

 function call(remotePeerId) {
    let id= document.getElementById("remoteId").value
    __init_stream().then(stream => {
        let call =  peer.call(remotePeerId || id, stream);
        incomingStreamHandler(call,false)
    })
}

function incomingStreamHandler(call,doReply=true) {
    doReply && __init_stream().then(stream => {
        call.answer(stream)
    })
    call.on('stream', (remoteStream) => {
        console.log("we have a incomming call")
        let currentTime = Date.now()
        let innerHTML = `
        <div class="row" id="video-container">
        <div class="col-md-3 embed-responsive embed-responsive-16by9" >
            <video id=${currentTime}  autoplay controls class="embed-responsive-item" style="width:100%"></video>
        </div>
    </div>
        `
        videoContainer.innerHTML = innerHTML;
        const _video = document.getElementById(currentTime)
        _video.srcObject = remoteStream;

    });
}

function copyStringToClipboard() {
    let str = peerId
    var el = document.createElement('textarea');
    el.value = str;
    // Set non-editable to avoid focus and move outside of view
    el.setAttribute('readonly', '');
    el.style = { position: 'absolute', left: '-9999px' };
    document.body.appendChild(el);
    // Select text inside element
    el.select();
    // Copy text to clipboard
    document.execCommand('copy');
    // Remove temporary element
    document.body.removeChild(el);

alert("successfully copied! now send this Id to your friend")

}


