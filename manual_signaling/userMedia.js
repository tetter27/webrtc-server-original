"use strict";

const elementVideoLocal = document.getElementById("local_video_box");
const elementTextPageRole = document.getElementById("page_role_text");
const elementButtonSetOfferer = document.getElementById("set_offerer_button");
const elementButtonSetAnswerer = document.getElementById("set_answerer_button");
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


function onclickButton_SetAsOfferer(){

    console.log("Selected Offerer.");
    elementTextPageRole.innerHTML = "You are Offerer!";

    pageRole = "offer";
    elementButtonSetOfferer.style.visibility = "hidden";
    elementButtonSetAnswerer.style.visibility = "hidden";

    let config = {"iceServers": []};
    rtcPeerConnection = new RTCPeerConnection(config);

    // The OfferSDP is pasted when "ICE gathering state change" becomes "complete".
    setupRTCPeerConnectionEventHandler(rtcPeerConnection);

    localVideo.getTracks().forEach((track) =>
        {
            rtcPeerConnection.addTrack(track, localVideo);
        });

    // Create OfferSDP
    createOfferSDP(rtcPeerConnection);
}


function onclickButton_SetAsAnswerer(){

    console.log("Selected Answerer.");
    elementTextPageRole.innerHTML = "You are Answerer!";

    pageRole = "answer";
    elementButtonSetOfferer.style.visibility = "hidden";
    elementButtonSetAnswerer.style.visibility = "hidden";
}

// Set Remote SDP button
function onclickButton_SetRemoteSDP(){

    if (pageRole == "offer"){
        // set SDP that issued by Answerer as Remote SDP.
        setAnswerSDPasRemoteSDP()

    }else if (pageRole === "answer"){
        // set SDP that issued by Offerer as Remote SDP.
        setOfferSDPasRemoteSDP()

    }else{

        console.log("You must select role of this tab.");
    }
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
function pastelocalSDPtoTextarea(rtcPeerConnection, roleFromHandler){
    
    elementTextareaLocalSDP.value = rtcPeerConnection.localDescription.sdp;

}


function setOfferSDPasRemoteSDP(){

    // Get OfferSDP from Textarea
    let strOfferSDP = elementTextareaRemoteSDP.value;
    if(!strOfferSDP){ 
        alert("OfferSDP is empty. Please enter the OfferSDP.");
        return;
    }

    // Create RTCPeerConnection object
    console.log("Call : createPeerConnection()");
    rtcPeerConnection = createPeerConnection(localVideo);

    // Set OfferSDP as a remote SDP
    let sessionDescription = new RTCSessionDescription( {
        type: "offer",
        sdp: strOfferSDP,
    } );
    createAnswerSDP(rtcPeerConnection, sessionDescription);

}


function createAnswerSDP(rtcPeerConnection, sessionDescription){

    console.log("Call : rtcPeerConnection.createAnswer()");
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
        } )
        .catch( (error) =>
        {
            console.error("Error : ", error);
        } );
}


function setAnswerSDPasRemoteSDP(){
    
    // Get AnswerSDP from Textarea
    let strAnswerSDP = elementTextareaRemoteSDP.value;
    if(!strAnswerSDP){ 
        alert("AnswerSDP is empty. Please enter the AnswerSDP.");
        return;
    }

    // Set AnswerSDP as a remote SDP
    let sessionDescription = new RTCSessionDescription( {
        type: "answer",
        sdp: strAnswerSDP,
    } );
    console.log( "Call : setAnswerSDP()" );
    setAnswerSDP(rtcPeerConnection, sessionDescription);
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