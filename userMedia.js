const g_elementVideoLocal = document.getElementById( "video_box" );

// getUserMedia API !!
navigator.getUserMedia({"video": true, /*"audio": true*/}, gotStream, logError);

function gotStream(stream){

    g_elementVideoLocal.srcObject = stream;
    console.log("Stream has set.");
    // pc.addStream(stream)
    // pc.createOffer(function(offer) {
    //     pc.setLocalDescription(offer);
    //     signalingChannel.send(offer.sdp);
    // });
}

function logError(error){
    console.error( "Error : ", error );
}