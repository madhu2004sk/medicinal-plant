const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let currentStream = null;
let useFrontCamera = false;
let imageCaptured = false;

/* ================= CAMERA START ================= */
async function startCamera() {
  if (currentStream) {
    currentStream.getTracks().forEach(track => track.stop());
  }

 const constraints = {
  video: {
    facingMode: useFrontCamera ? "user" : { exact: "environment" },
    width: { ideal: 1100 },
    height: { ideal: 720 }
  }
};

  currentStream = await navigator.mediaDevices.getUserMedia(constraints);
  video.srcObject = currentStream;

  video.hidden = false;
  canvas.hidden = true;
  imageCaptured = false;
}

startCamera();

/* ================= SWITCH CAMERA ================= */
function switchCamera() {
  useFrontCamera = !useFrontCamera;
  startCamera();
}

/* ================= CAPTURE IMAGE ================= */
function captureImage() {
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  canvas.hidden = false;
  video.hidden = true;

  imageCaptured = true;

  if (currentStream) {
  currentStream.getTracks().forEach(track => track.stop());
}


  document.getElementById("result").innerText =
    "📸 Image captured. Tap Scan Plant";
}

/* ================= SCAN IMAGE ================= */
function scanImage() {
  document.getElementById("result").innerText =
    "⚠️ AI Scanner disabled in demo mode";
}

/* ================= RESET FOR NEXT SCAN ================= */
function retakeImage() {
  startCamera();
  document.getElementById("result").innerText = "📷 Ready to scan";
}  