# hello_webrtc
For first WebRTC project
(Firebase signaling)

## Pre-condition
#### Create Project on Firebase
- Select "Add Project" on Firebase (http://firebase.com).
  - Enter an arbitrary project name. 
  - Agree to all checkboxes to create a project.
  - Create a WebApp with an arbitrary name from the project page.
    - Set an Authentication and a Realtime Database.
      - Set the access rule of RealTime Database as following.
``` 
{
  "rules": {
    ".read": "auth != null",
    ".write": "auth != null",
    "myapp" : {
      "multi" : {
        ".read": true,
        ".write": true
      }
    }
  }
}
``` 

#### Install Required Packages
``` 
$ npm install express --save
$ npm install -g firebase-tools
```


#### Login Firebase and Select Project
``` 
$ firebase login
$ firebase init
``` 
And select the project that created in the previous step.


#### How to Launch the Application
``` 
$ node localServer.js
``` 
And access to the displayed endpoint with an arbitrary browser.
You can execute signaling by specifying your API key and Database URL.
The client that enters the room first becomes the Offerer, and the client that enters later becomes the Answerer.


## Reference
- WebRTC Client:
    - https://www.hiramine.com/programming/videochat_webrtc/index.html
- Signaling Server
    - https://html5experts.jp/mganeko/20273/