"use strict";

const elementVideoLocal = document.getElementById("local_video_box");
const elementTextPageRole = document.getElementById("page_role_text");
const elementButtonSetOfferer = document.getElementById("set_offerer_button");
const elementButtonSetAnswerer = document.getElementById("set_answerer_button");
const elementTextareaLocalSDP = document.getElementById("local_sdp_text");
const elementTextareaRemoteSDP = document.getElementById("remote_sdp_text");

let pageRole = null;
let localStream = null;
let remoteStream = null;

// Run when just accessed this page.
navigator.mediaDevices.getUserMedia({"video": true, /*"audio": true*/})
.then((stream) =>
{
    //Display video from usb camera as the local stream.
    localStream = stream
    elementVideoLocal.srcObject = localStream;
    console.log("Stream has set.");

})
.catch((error) =>
{
    console.error("Error : ", error);
    alert("Could not setup.");
    return;
});



function onclickButton_SetAsOfferer(){

    console.log("Selected Offerer.");
    elementTextPageRole.innerHTML = "You are Offerer!";

    pageRole = "Offerer";
    elementButtonSetOfferer.style.visibility = "hidden";
    elementButtonSetAnswerer.style.visibility = "hidden";

    let config = {"iceServers": []};
    let rtcPeerConnection = new RTCPeerConnection(config);

    // The OfferSDP is pasted when "ICE gathering state change" becomes "complete".
    setupRTCPeerConnectionEventHandler(rtcPeerConnection);

    localStream.getTracks().forEach((track) =>
        {
            rtcPeerConnection.addTrack(track, localStream);
        });

    // Create OfferSDP
    createOfferSDP(rtcPeerConnection);
}


function onclickButton_SetAsAnswerer(){

    console.log("Selected Answerer.");
    elementTextPageRole.innerHTML = "You are Answerer!";

    pageRole = "Answerer";
    elementButtonSetOfferer.style.visibility = "hidden";
    elementButtonSetAnswerer.style.visibility = "hidden";
}


function createPeerConnection(stream){
    let config = {"iceServer":[]};
    let rtcPeerConnection = new RTCPeerConnection(config);

    // Event handler for RTCPeetConnection
    setupRTCPeerConnectionEventHandler(rtcPeerConnection);

    // Add the local media stream to RTCPeerConnection object.
    if (stream){
        stream.getTracks().forEach((track) => {
            rtcPeerConnection.addTrack(track,stream);
        });
    }else{
        console.log("No local stream !!");
    }

    return rtcPeerConnection;

}

function createOfferSDP(rtcPeerConnection)
{

    console.log("Call : rtcPeerConnection.createOffer()");
    rtcPeerConnection.createOffer()
        .then((sessionDescription) =>
        {
            // Set OfferSDP ot LocalDescription
            console.log("Call : rtcPeerConnection.setLocalDescription()");
            return rtcPeerConnection.setLocalDescription(sessionDescription);
        })
        .then(() =>
        {
            // If Vanilla ICE, SDP is not sending yet.
            // If Trickle ICE, initial SDP is sending.
        })
        .catch((error) =>
        {
            console.error("Error : ", error);
        });
}

// The offer SDP is pasted when "ICE gathering state change" becomes "complete".
function pastelocalSDPtoTextarea(rtcPeerConnection){
    
    elementTextareaLocalSDP.value = rtcPeerConnection.localDescription.sdp;

}



