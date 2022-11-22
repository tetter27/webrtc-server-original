"use strict";

const elementVideoLocal = document.getElementById("local_video_box");
const elementTextPageRole = document.getElementById("page_role_text");
const elementTextFirebaseApiKey = document.getElementById("firebase_apikey_text");
const elementTextFirebaseDatabaseUrl = document.getElementById("firebase_url_text");
const elementTextRoomId = document.getElementById("room_id_text");
const elementMessageRoom = document.getElementById("room_message")
const elementButtonStartConnect = document.getElementById("connect_start_button");
const elementTextareaLocalSDP = document.getElementById("local_sdp_text");
const elementTextareaRemoteSDP = document.getElementById("remote_sdp_text");

const elementVideoRemote = document.getElementById("remote_video_box");
const elementAudioRemote = document.getElementById("audio_remote");

let rtcPeerConnection = null;
let pageRole = null;
let localVideo = null;
let remoteVideo = null;
let remoteAudio = null;


// Run when just accessed this page.
navigator.mediaDevices.getUserMedia({"video": true, /*"audio": true*/})
.then((stream) =>
{
    //Display video from usb camera as the local stream.
    localVideo = stream
    elementVideoLocal.srcObject = localVideo;
    console.log("Stream has set.");
    console.log("Stream type is: %s.", typeof(localVideo));

})
.catch((error) =>
{
    console.error("Error : ", error);
    alert("Could not setup.");
    return;
});


function onclickButton_ConnectStart(){

    let rId = elementTextRoomId.value;
    console.log("Enterd Room ID:");
    console.log(rId);

    elementButtonStartConnect.style.visibility = "hidden";

    let apiKey = elementTextFirebaseApiKey.value;
    let databaseUrl = elementTextFirebaseDatabaseUrl.value;

    initFirebaseInfo(apiKey, databaseUrl);

    setRoomId(rId);
    pageRole = judgePageRole()

    console.log("Page Role: ", pageRole);

    if (pageRole === "offer"){
        elementTextPageRole.innerHTML = "You are Offerer!";

    }else if (pageRole === "answer"){
        elementTextPageRole.innerHTML = "You are Answerer!";
        callMe();
    }

}

function initCommonly(){
    elementButtonSetOfferer.style.visibility = "hidden";
    elementButtonSetAnswerer.style.visibility = "hidden";

    let apiKey = elementTextFirebaseApiKey.value;
    let databaseUrl = elementTextFirebaseDatabaseUrl.value;

    initFirebaseInfo(apiKey, databaseUrl);

}

function createPeerConnection(id, stream){

    let config = {"iceServers":[{"urls": "stun:stun.l.google.com:19302"}]};
    let pc = new RTCPeerConnection(config);

    // Event handler for RTCPeetConnection
    setupRTCPeerConnectionEventHandler(id, pc);

    // Add the local media stream to RTCPeerConnection object.
    if (stream){
        stream.getTracks().forEach((track) => {
            pc.addTrack(track,stream);
        });
    }else{
        console.log("No local stream !!");
    }

    return pc;

}

function createAndSendOfferSDP(id){

    console.log("Call : createPeerConnection()");
    rtcPeerConnection = createPeerConnection(id, localVideo);

    console.log("Call : rtcPeerConnection.createOffer()");
    rtcPeerConnection.createOffer()
        .then((sessionDescription) =>
        {
            // Set OfferSDP at LocalDescription
            console.log("Call : rtcPeerConnection.setLocalDescription()");
            return rtcPeerConnection.setLocalDescription(sessionDescription);
        })
        .then(() =>
        {
            // If Vanilla ICE, SDP is not sending yet.

            // If Trickle ICE, initial SDP is sending.
            sendSdp(id, rtcPeerConnection.localDescription);
        })
        .catch((error) =>
        {
            console.error("Error : ", error);
        });
}

// The offer SDP is pasted when "ICE gathering state change" becomes "complete".
function setLocalSDPtoTextarea(rtcPeerConnection, roleFromHandler){
    
    elementTextareaLocalSDP.value = rtcPeerConnection.localDescription.sdp;

}


function setOfferSDPasRemoteSDP(id, sessionDescription){

    elementTextareaRemoteSDP.value = sessionDescription.sdp;

    // Create RTCPeerConnection object
    console.log("Call : createPeerConnection()");
    rtcPeerConnection = createPeerConnection(id, localVideo);
    
    rtcPeerConnection.setRemoteDescription(sessionDescription)
        .then( () =>
        {
            // Create AnswerSDP
            console.log( "Call : rtcPeerConnection.createAnswer()" );
            return rtcPeerConnection.createAnswer();
        } )
        .then( (sessionDescription) =>
        {
            // Set created AnswerSDP in LocalDescription
            console.log( "Call : rtcPeerConnection.setLocalDescription()" );
            return rtcPeerConnection.setLocalDescription(sessionDescription);
        } )
        .then( () =>
        {
            // If Vanilla ICE, SDP is not sending yet.
            
            // If Trickle ICE, initial SDP is sending.
            sendSdp(id, rtcPeerConnection.localDescription);

        } )
        .catch( (error) =>
        {
            console.error("Error : ", error);
        } );

}


function setAnswerSDPasRemoteSDP(id, sessionDescription){

    elementTextareaRemoteSDP.value = sessionDescription.sdp;

    rtcPeerConnection.setRemoteDescription(sessionDescription)
    .then(function() {
      console.log('setRemoteDescription(answer) succsess in promise');
    }).catch(function(err) {
      console.error('setRemoteDescription(answer) ERROR: ', err);
    });
}


function setAnswerSDP( rtcPeerConnection, sessionDescription )
{
    console.log( "Call : rtcPeerConnection.setRemoteDescription()" );
    rtcPeerConnection.setRemoteDescription(sessionDescription)
        .catch( (error) =>
        {
            console.error("Error : ", error);
        } );
}

function displayRemoteMedia(stream, kind){

    if ("video" === kind)
    {
        console.log("Call : setStreamToElement( Video_Remote, stream )");
        remoteVideo = stream;
        elementVideoRemote.srcObject = remoteVideo;

    }else if ("audio" === kind){
        console.log("Call : setStreamToElement( Audio_Remote, stream )");
        remoteAudio = stream;
        
    }else{
        console.error( "Unexpected : Unknown track kind : ", kind );
    }
}

function pasteRoomId(room){

    elementTextRoomId.value = room;
    elementMessageRoom.innerHTML = "Your Room ID !! →→→→→";
    elementMessageRoom.style.color = "red";

}


function addIceCandidate(id, candidate) {

      rtcPeerConnection.addIceCandidate(candidate);

  }