let database = null;
let clientId = null;
let roomBroadcastRef = null;
const databaseRoot = 'myapp/multi/';
let room = null;
let fromId = null;

// Initialize Firebase
function initFirebaseInfo(firebaseApiKey, databaseUrl){

    console.log("URL is %s", databaseUrl);

    let config = {
        apiKey: firebaseApiKey,  
        databaseURL: databaseUrl
    };
    firebase.initializeApp(config);
    database = firebase.database();

}

/*
const firebaseConfig = {
    apiKey: "AIzaSyDCdqO6OKL4blqPavI7jUSGK2sMN8jPuEE",
    authDomain: "hello-webrtc-4fe0e.firebaseapp.com",
    databaseURL: "https://hello-webrtc-4fe0e-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "hello-webrtc-4fe0e",
    storageBucket: "hello-webrtc-4fe0e.appspot.com",
    messagingSenderId: "770671796068",
    appId: "1:770671796068:web:be391b4e08de1e5101a471",
    measurementId: "G-8N37JY34MG"
  };

firebase.initializeApp(firebaseConfig);
let database = firebase.database();
*/


function setRoomId(roomId){

    if (roomId === null){
      room = Math.random().toString(32).substring(2);
      pasteRoomId(room);
    }else{
      room = roomId;
    }
    
    console.log("Path: " + databaseRoot + room + '/_join_');
    let key = database.ref(databaseRoot + room + '/_join_').push({ joined : 'unknown'}).key
    clientId = 'member_' + key;
    console.log("Peer ID: " + clientId);
    database.ref(databaseRoot + room + '/_join_/' + key).update({ joined : clientId});
      
    roomBroadcastRef = database.ref(databaseRoot + room + '/_broadcast_');
    roomBroadcastRef.on('child_added', function(data) {
        console.log('roomBroadcastRef.on(data) data.key=' + data.key + ', data.val():', data.val());
        let message = data.val();
        let fromId = message.from;
        if (fromId === clientId) {
          // ignore self message
          return;
        }
        
        if (message.type === 'call me') {
            createAndSendOfferSDP(fromId); 
        }
    });

    let clientRef = database.ref(databaseRoot + room + '/_direct_/' + clientId);
    clientRef.on('child_added', function(data) {
        console.log('clientRef.on(data)  data.key=' + data.key + ', data.val():', data.val());
        let message = data.val();
        let fromId = message.from;

        if (message.type === 'offer') {
          // -- got offer ---
          console.log('Received offer ... fromId=' + fromId);
          console.log("Message:" + JSON.stringify(message));
          let offer = new RTCSessionDescription(message);
          console.log("Offer:" + JSON.stringify(offer));
          setOfferSDPasRemoteSDP(fromId, offer);
        }else if (message.type === 'answer') {
          // --- got answer ---
          console.log('Received answer ... fromId=' + fromId);
          console.log("Message:" + JSON.stringify(message));
          let answer = new RTCSessionDescription(message);
          console.log("Answer:" + JSON.stringify(answer));
          setAnswerSDPasRemoteSDP(fromId, answer);
        }
        else if (message.type === 'candidate') {
          // --- got ICE candidate ---
          console.log('Received ICE candidate ... fromId=' + fromId);
          let candidate = new RTCIceCandidate(JSON.parse(message.ice)); // <---- JSON
          console.log(candidate);
          addIceCandidate(fromId, candidate);
        }
        
    });
}


function sendSdp(id, sessionDescription) {

  console.log('---sending sdp ---');
  let message = { type: sessionDescription.type, sdp: sessionDescription.sdp };
  console.log('sending SDP=' + message);
  emitTo(id, message);

}


function sendIceCandidate(id, candidate) {

  console.log('---sending ICE candidate ---');
  let obj = { type: 'candidate', ice: JSON.stringify(candidate) }; // <--- JSON
  emitTo(id, obj);

}


function callMe() {
    emitRoom({type: 'call me'});
}


function emitRoom(msg) {
    //socket.emit('message', msg);
    msg.from = clientId;
    roomBroadcastRef.push(msg);
}


function emitTo(id, msg) {
  //msg.sendto = id;
  //socket.emit('message', msg);

  console.log('===== sending from=' + clientId + ' ,  to=' + id);
  msg.from = clientId;
  database.ref(databaseRoot + room + '/_direct_/' + id).push(msg);
}