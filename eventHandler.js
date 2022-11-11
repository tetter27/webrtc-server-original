function setupRTCPeerConnectionEventHandler(rtcPeerConnection){

    // Handler for the "Negotiation needed" event
    //   This event occurs when the change that needs session negotiation occurs.
    //   Since some session changes cannot be negotiated as an answer, this negotiation must be performed as an offerer.
    //   Most generally, the negotiationneeded event occurs after a transmission track is added to the RTCPeerConnection.
    //   This event does not occur when another negotiation is already ongoing.
    rtcPeerConnection.onnegotiationneeded = () =>{
        console.log("Event: Navigation needed.");
    };

    // Handler for the "ICE Candidate" event
    //   This event always occurs when any ICE agent starts streaming message.
    rtcPeerConnection.onicecandidate = (event) =>
    {
        console.log("Event : ICE candidate");
        if(event.candidate)
        {   // ICE candidate is existed
            console.log("=> ICE candidate : ", event.candidate);

            // If Vanilla ICE, SDP is not sending yet.
            // If Trickle ICE, initial SDP is sending.
        }
        else
        {   // There are no ICE candiate => Finalized ICE candidate collection.
            console.log("=> ICE candidate : empty");
        }
    };

    // Handler for the "ICE candidate" error
    //   This event occurs if an error occurs while collecing ICE candidates.
    //   [ToDo] Check https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/onicecandidateerror
    rtcPeerConnection.onicecandidateerror = (event) =>
    {
        console.error("Event : ICE candidate error. error code : ", event.errorCode);
    };

    // Handler for the "ICE gathering state change" event
    //   This event occurs when the change of "ICE gathering state".
    //   [ToDo] Check https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/onicegatheringstatechange
    rtcPeerConnection.onicegatheringstatechange = () =>
    {
        console.log("Event : ICE gathering state change");
        console.log("=> ICE gathering state : ", rtcPeerConnection.iceGatheringState);

        if("complete" === rtcPeerConnection.iceGatheringState)
        {
            // If Vanilla ICE, SDP is not sending yet.
            // If Trickle ICE, initial SDP is sending.

            // Paseted OfferSDP to textarea
            console.log("=> Set OfferSDP in textarea");

            pastelocalSDPtoTextarea(rtcPeerConnection);

        }
    };

    // Handler for "ICE connection state change" event
    //   This event occurs if "ICE connection state" changed while negotiation process.
    //   "ICE connection state" normally transit "new" => "checking" => "connected" => "completed".
    //   However, in specific condition, "connected" is possibly skipped.
    //     (If the candidate that is checked at last only succeed.)
    //   [ToDo] Check https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/iceconnectionstatechange_event
    rtcPeerConnection.oniceconnectionstatechange = () =>
    {
        console.log("Event : ICE connection state change");
        console.log("=> ICE connection state : ", rtcPeerConnection.iceConnectionState);
        // "disconnected" : Failed at least one component to confirm that the component is still connecting.
        //                  This sometimes occurs intermittently, and is solved while temporary disconnection.
        // "failed"       : It means that all candidate peer are confirmed and there are no peer that has compatibility.
        // [ToDo] Check https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/iceConnectionState
    };

    // Handler for "Signaling state change" event
    //   This event send if "signalState" of peer connection changed.
    //   This possibly occurs due to call of setLocalDescription（） or setRemoteDescription（).
    //   [ToDo] Check https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/onsignalingstatechange
    rtcPeerConnection.onsignalingstatechange = () =>
    {
        console.log("Event : Signaling state change");
        console.log("=> Signaling state : ", rtcPeerConnection.signalingState);
    };

    // Handler for "Connection state change" event.
    //   This event occurs when peer connection state is changed.
    //   [ToDo] Check https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/onconnectionstatechange
    rtcPeerConnection.onconnectionstatechange = () =>
    {
        console.log("Event : Connection state change");
        console.log("=> Connection state : ", rtcPeerConnection.connectionState);
        // "disconnected" : At least one of the ICE transport are "disconnected" status, and
        //                  all of the other transports are not "failed" or "connecting", "checking" status.
        // "failed"       : At least one of the ICE transport are "failed" status.
        // [ToDo] Check https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/connectionState
    };

    // Handler for "Track" event.
    //   This event sends when new MediaStreamTrack of incoming call is created and it is associated with the 
    //   RTCRtpReceiver object that is added to receiver set on the connection.
    //   [ToDo] Check https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/ontrack
    //   !!! rtcPeerConnection.onaddstream is duplicated.
    rtcPeerConnection.ontrack = (event) =>
    {
        console.log("Event : Track");
        console.log("=> stream", event.streams[0]);
        console.log("=> track", event.track);
    };
}