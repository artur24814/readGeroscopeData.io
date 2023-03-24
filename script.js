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

// surface

// Get the canvas element from the DOM
const canvas = document.getElementById('scene');

// Get the canvas dimensions
let width = canvas.width; // Width of the scene
let height = canvas.height; // Height of the scene

// Store the 2D context
const ctx = canvas.getContext('2d');

// Function called right after user resized its screen
function onResize () {
  // We need to define the dimensions of the canvas to our canvas element
  // Javascript doesn't know the computed dimensions from CSS so we need to do it manually
  width = canvas.offsetWidth;
  height = canvas.offsetHeight;
  
  // If the screen device has a pixel ratio over 1
  // We render the canvas twice bigger to make it sharper (e.g. Retina iPhone)
  if (window.devicePixelRatio > 1) {
    canvas.width = canvas.clientWidth * 2;
    canvas.height = canvas.clientHeight * 2;
    ctx.scale(2, 2);
  } else {
    canvas.width = width;
    canvas.height = height;
  }
}

// Listen to resize events
window.addEventListener('resize', onResize);
// Make sure the canvas size is perfect
onResize();

function renderSurface (alpha, gama, beta) {
    let scene_body = document.querySelector('.scene-body')
    scene_body.style.transform = 'rotateZ(' + alpha + 'deg) rotateY(' + gama + 'deg) rotateX(' + beta + 'deg)';
}

function drawCanvas() {
    ctx.fillStyle = "gray";
    ctx.fillRect(20, 0, height, width);
    ctx.beginPath();
    ctx.arc(75, 75, 50, 0, Math.PI * 2, true); // Outer circle
    ctx.moveTo(110, 75);
    ctx.arc(75, 75, 35, 0, Math.PI, false); // Mouth (clockwise)
    ctx.moveTo(65, 65);
    ctx.arc(60, 65, 5, 0, Math.PI * 2, true); // Left eye
    ctx.moveTo(95, 65);
    ctx.arc(90, 65, 5, 0, Math.PI * 2, true); // Right eye
    ctx.stroke();
    
}

drawCanvas()
