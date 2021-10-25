var log = msg => {
    document.getElementById('logs').innerHTML += msg + '<br>'
};
window.webRTCSession = isPublisher => {
    let pc = new RTCPeerConnection({
        iceServers: [
            {
                urls: 'stun:stun.l.google.com:19302'
            }
        ]
    });
    pc.oniceconnectionstatechange = e => log(pc.iceConnectionState);

    if (isPublisher) {
        pc.onicecandidate = event => {
            if (event.candidate === null) {
                app.localSession = btoa(JSON.stringify(pc.localDescription))
            }
        };
        navigator.mediaDevices.getUserMedia({video: true, audio: false})
            .then(stream => {
                stream.getTracks().forEach(track => pc.addTrack(track, stream));
                document.getElementById('local-video').srcObject = stream;
                pc.createOffer()
                    .then(d => pc.setLocalDescription(d))
                    .catch(log)
            }).catch(log);
        app.localPC = pc
    } else {
        pc.onicecandidate = event => {
            if (event.candidate === null) {
                app.remoteSession = btoa(JSON.stringify(pc.localDescription))
            }
        };
        pc.addTransceiver('video');
        pc.createOffer()
            .then(d => pc.setLocalDescription(d))
            .catch(log);

        pc.ontrack = function (event) {
            let el = document.getElementById('remote-video');
            el.srcObject = event.streams[0];
            // el.autoplay = true;
        };
        app.remotePC = pc
    }
};