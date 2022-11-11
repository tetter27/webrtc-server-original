"use strict";

const elementVideoLocal = document.getElementById( "local_video_box" );
const elementTextareaLocalSDP = document.getElementById( "local_sdp_text" );
const elementTextareaRemoteSDP = document.getElementById( "remote_sdp_text" );


// Run when just accessed this page.
navigator.mediaDevices.getUserMedia({"video": true, /*"audio": true*/})
.then( ( stream ) =>
{
    //Display video from usb camera as the local stream.
    elementVideoLocal.srcObject = stream;
    console.log("Stream has set.");

    let config = { "iceServers": [] };
    let rtcPeerConnection = new RTCPeerConnection( config );

    // The OfferSDP is pasted when "ICE gathering state change" becomes "complete".
    setupRTCPeerConnectionEventHandler( rtcPeerConnection );

    stream.getTracks().forEach( ( track ) =>
        {
            rtcPeerConnection.addTrack( track, stream );
        } );

    // Create OfferSDP
    createOfferSDP( rtcPeerConnection );
} )
.catch( ( error ) =>
{
    console.error( "Error : ", error );
    alert( "Could not setup." );
    return;
} );




function createPeerConnection(stream){
    let config = {"iceServer":[]};
    let rtcPeerConnection = new RTCPeerConnection( config );

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

    console.log( "Call : rtcPeerConnection.createOffer()" );
    rtcPeerConnection.createOffer()
        .then( ( sessionDescription ) =>
        {
            // Set OfferSDP ot LocalDescription
            console.log( "Call : rtcPeerConnection.setLocalDescription()" );
            return rtcPeerConnection.setLocalDescription( sessionDescription );
        } )
        .then( () =>
        {
            // If Vanilla ICE, SDP is not sending yet.
            // If Trickle ICE, initial SDP is sending.
        } )
        .catch( ( error ) =>
        {
            console.error( "Error : ", error );
        } );
}

// The offer SDP is pasted when "ICE gathering state change" becomes "complete".
function pastelocalSDPtoTextarea(rtcPeerConnection){
    
    elementTextareaLocalSDP.value = rtcPeerConnection.localDescription.sdp;

}