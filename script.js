let camera_button = document.querySelector("#start-camera");
// camera


let video = document.querySelector("#video");
let start_button = document.querySelector("#start-record");
let stop_button = document.querySelector("#stop-record");
let download_link = document.querySelector("#download-video");
let download_btn =  document.querySelector('.download-btn')
let camera_stream = null;
let media_recorder = null;
let blobs_recorded = [];
stop_button.addEventListener('click', function() {
    media_recorder.stop(); 
});

camera_button.addEventListener('click', async function() {
    camera_stream = await navigator.mediaDevices.getUserMedia({ 
        video: {
        facingMode: 'environment'
        }, audio: true });
    video.srcObject = camera_stream;
    start_button.classList.remove('d-none')
    stop_button.classList.remove('d-none')
    download_btn.classList.remove('d-none')
    camera_button.classList.add('d-none')
    requestDeviceOrientation()
});



function requestDeviceOrientation () {
if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
  DeviceOrientationEvent.requestPermission()
  .then(permissionState => {
  if (permissionState === 'granted') {
  window.addEventListener("deviceorientation", function(event) {
        document.getElementById("alpha").innerHTML = event.alpha.toFixed(2);
        document.getElementById("beta").innerHTML = event.beta.toFixed(2);
        document.getElementById("gamma").innerHTML = event.gamma.toFixed(2);
        renderSurface(event.alpha.toFixed(2), event.gamma.toFixed(2), event.beta.toFixed(2))
    }, false);
  }
  })
  .catch(console.error);
  } else {
      window.addEventListener("deviceorientation", function(event) {
        document.getElementById("alpha").innerHTML = event.alpha.toFixed(2);
        document.getElementById("beta").innerHTML = event.beta.toFixed(2);
        document.getElementById("gamma").innerHTML = event.gamma.toFixed(2);
        renderSurface(event.alpha.toFixed(2),event.gamma.toFixed(2), event.beta.toFixed(2))
    }, false);
  console.log ("not iOS");
  }
     // set MIME type of recording as video/webm
    media_recorder = new MediaRecorder(camera_stream, { mimeType: 'video/webm' });
    // event : new recorded video blob available 
    media_recorder.addEventListener('dataavailable', function(e) {
        blobs_recorded.push(e.data);
    });
    // event : recording stopped & all blobs sent
    media_recorder.addEventListener('stop', function() {
        // create local object URL from the recorded video blobs
        let video_local = URL.createObjectURL(new Blob(blobs_recorded, { type: 'video/webm' }));
        download_link.href = video_local;
    });
    // start recording with each recorded blob having 1 second video
    media_recorder.start(1000);
    
}

function renderSurface (alpha, gama, beta) {
    let scene_body = document.querySelector('.scene-body')
    scene_body.style.transform = 'rotateZ(' + alpha + 'deg) rotateY(' + (gama - 90 ) + 'deg) rotateX(' + beta + 'deg)';
}
