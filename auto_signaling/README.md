# hello_webrtc
For first WebRTC project
(Firebase signaling)

## Pre-condition
#### Create Project on Firebase
- Select "Add Project" on Firebase (http://firebase.com).
- Enter an arbitrary project name. 
- Agree to all checkboxes to create a project.
- Create a WebApp with an arbitrary name from the project page.


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


## Reference
- WebRTC Client:
    - https://www.hiramine.com/programming/videochat_webrtc/index.html
- Signaling Server
    - https://html5experts.jp/technohippy/18040/