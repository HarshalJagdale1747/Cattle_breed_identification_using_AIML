/*
  Shared JavaScript for all pages.
  It handles loader animation, menu toggle, previews, camera access,
  fake AI prediction, and contact form feedback.
*/
const breeds = ["Gir", "Sahiwal", "Red Sindhi", "Tharparkar", "Ongole", "Kankrej"];

// This function is used by the back button on all pages.
function goBackHome() {
  window.location.href = "index.html";
}

// Helper function to show the initial page loader animation.
function hidePageLoader() {
  const loader = document.getElementById("pageLoader");
  document.body.classList.add("loader-active");

  setTimeout(() => {
    if (loader) {
      loader.classList.add("hide");
    }
    document.body.classList.remove("loader-active");
  }, 1400);
}

// Generate fake breed prediction with random confidence values.
function generatePrediction() {
  const breed = breeds[Math.floor(Math.random() * breeds.length)];
  const accuracy = Math.floor(Math.random() * 8) + 90;
  return { breed, accuracy: `${accuracy}%` };
}

// Show a temporary scanning effect before displaying the result.
function showPredictionLoader(onComplete) {
  const loader = document.getElementById("pageLoader");
  if (loader) {
    loader.classList.remove("hide");
  }
  document.body.classList.add("loader-active");

  setTimeout(() => {
    if (loader) {
      loader.classList.add("hide");
    }
    document.body.classList.remove("loader-active");
    onComplete();
  }, 1600);
}

// Reusable function to update result area text.
function setPredictionResult(breedId, accuracyId) {
  const breedOutput = document.getElementById(breedId);
  const accuracyOutput = document.getElementById(accuracyId);
  const result = generatePrediction();

  if (breedOutput && accuracyOutput) {
    breedOutput.textContent = `Breed: ${result.breed}`;
    accuracyOutput.textContent = result.accuracy;
  }
}

// Handle the mobile menu.
function initMenuToggle() {
  const toggle = document.getElementById("menuToggle");
  const panel = document.getElementById("navPanel");

  if (!toggle || !panel) return;

  toggle.addEventListener("click", () => {
    panel.classList.toggle("open");
  });
}

// Handle image upload preview and buttons.
function initImagePrediction() {
  const imageUpload = document.getElementById("imageUpload");
  const imagePreview = document.getElementById("imagePreview");
  const imagePlaceholder = document.getElementById("imagePlaceholder");
  const predictButton = document.getElementById("predictImageBtn");
  const resetButton = document.getElementById("resetImageBtn");

  if (!imageUpload || !imagePreview || !predictButton || !resetButton) return;

  imageUpload.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (!file) return;

    imagePreview.src = URL.createObjectURL(file);
    imagePreview.style.display = "block";
    if (imagePlaceholder) imagePlaceholder.style.display = "none";
  });

  predictButton.addEventListener("click", () => {
    if (!imagePreview.src) {
      alert("Please upload an image first.");
      return;
    }

    showPredictionLoader(() => setPredictionResult("imageBreed", "imageAccuracy"));
  });

  resetButton.addEventListener("click", () => {
    imageUpload.value = "";
    imagePreview.removeAttribute("src");
    imagePreview.style.display = "none";
    if (imagePlaceholder) imagePlaceholder.style.display = "block";
    document.getElementById("imageBreed").textContent = "-";
    document.getElementById("imageAccuracy").textContent = "-";
  });
}

// Handle video preview, frame extraction and fake prediction.
function initVideoPrediction() {
  const videoUpload = document.getElementById("videoUpload");
  const videoPreview = document.getElementById("videoPreview");
  const videoPlaceholder = document.getElementById("videoPlaceholder");
  const frameCanvas = document.getElementById("frameCanvas");
  const framePlaceholder = document.getElementById("framePlaceholder");
  const extractFrameBtn = document.getElementById("extractFrameBtn");
  const predictVideoBtn = document.getElementById("predictVideoBtn");

  if (!videoUpload || !videoPreview || !frameCanvas || !extractFrameBtn || !predictVideoBtn) return;

  const context = frameCanvas.getContext("2d");

  videoUpload.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (!file) return;

    videoPreview.src = URL.createObjectURL(file);
    videoPreview.style.display = "block";
    if (videoPlaceholder) videoPlaceholder.style.display = "none";
  });

  extractFrameBtn.addEventListener("click", () => {
    if (!videoPreview.src) {
      alert("Please upload a video first.");
      return;
    }

    frameCanvas.width = videoPreview.videoWidth || 640;
    frameCanvas.height = videoPreview.videoHeight || 360;
    context.drawImage(videoPreview, 0, 0, frameCanvas.width, frameCanvas.height);
    if (framePlaceholder) framePlaceholder.style.display = "none";
  });

  predictVideoBtn.addEventListener("click", () => {
    if (!videoPreview.src) {
      alert("Please upload a video first.");
      return;
    }

    showPredictionLoader(() => setPredictionResult("videoBreed", "videoAccuracy"));
  });
}

// Handle live camera access and capture.
function initCameraPrediction() {
  const startCameraBtn = document.getElementById("startCameraBtn");
  const captureBtn = document.getElementById("captureBtn");
  const predictCaptureBtn = document.getElementById("predictCaptureBtn");
  const cameraFeed = document.getElementById("cameraFeed");
  const captureCanvas = document.getElementById("captureCanvas");
  const cameraPlaceholder = document.getElementById("cameraPlaceholder");
  const capturePlaceholder = document.getElementById("capturePlaceholder");

  if (!startCameraBtn || !captureBtn || !predictCaptureBtn || !cameraFeed || !captureCanvas) return;

  const context = captureCanvas.getContext("2d");
  let currentStream = null;
  let hasCapture = false;

  startCameraBtn.addEventListener("click", async () => {
    try {
      currentStream = await navigator.mediaDevices.getUserMedia({ video: true });
      cameraFeed.srcObject = currentStream;
      if (cameraPlaceholder) cameraPlaceholder.style.display = "none";
    } catch (error) {
      alert("Camera access denied or unavailable on this device.");
      console.error(error);
    }
  });

  captureBtn.addEventListener("click", () => {
    if (!cameraFeed.srcObject) {
      alert("Please start the camera first.");
      return;
    }

    captureCanvas.width = cameraFeed.videoWidth || 640;
    captureCanvas.height = cameraFeed.videoHeight || 360;
    context.drawImage(cameraFeed, 0, 0, captureCanvas.width, captureCanvas.height);
    if (capturePlaceholder) capturePlaceholder.style.display = "none";
    hasCapture = true;
  });

  predictCaptureBtn.addEventListener("click", () => {
    if (!hasCapture) {
      alert("Please capture an image first.");
      return;
    }

    showPredictionLoader(() => setPredictionResult("cameraBreed", "cameraAccuracy"));
  });

  window.addEventListener("beforeunload", () => {
    if (currentStream) {
      currentStream.getTracks().forEach((track) => track.stop());
    }
  });
}

// Simple contact form response for demo use.
function initContactForm() {
  const contactForm = document.getElementById("contactForm");
  const formStatus = document.getElementById("formStatus");

  if (!contactForm || !formStatus) return;

  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    formStatus.textContent = "Message submitted successfully.";
    contactForm.reset();
  });
}

// Start everything once the page has fully loaded.
document.addEventListener("DOMContentLoaded", () => {
  hidePageLoader();
  initMenuToggle();
  initImagePrediction();
  initVideoPrediction();
  initCameraPrediction();
  initContactForm();
});
