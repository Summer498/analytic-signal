import { fft } from './fft.js';
import { ifft } from './ifft.js';

const canvas = document.getElementById('oscilloscope');
const ctx = canvas.getContext('2d');

let audioContext;
let analyser;
let buffer;
let animationId;

function resizeCanvas() {
  const size = Math.min(window.innerWidth, window.innerHeight) * 1.5;
  canvas.width = size;
  canvas.height = size;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();


let hilbertFilter = null;

function createHilbertFilter(N) {
  const H = new Array(N).fill(0);
  H[0] = 1;
  if (N % 2 === 0) H[N/2] = 1;
  for (let i = 1; i < N/2; i++) H[i] = 2;
  return H;
}

function computeAnalyticSignal(x) {
  const N = x.length;
  if (!hilbertFilter || hilbertFilter.length !== N) {
    hilbertFilter = createHilbertFilter(N);
  }

  const X = fft(x);

  for (let i = 0; i < N; i++) {
    X[i][0] *= hilbertFilter[i];
    X[i][1] *= hilbertFilter[i];
  }

  const analytic = ifft(X);
  return analytic;
}

async function startVisualization() {
  try {
    const stream = await navigator.mediaDevices.getDisplayMedia({ audio: true, video: true });
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const source = audioContext.createMediaStreamSource(stream);

    analyser = audioContext.createAnalyser();
    analyser.fftSize = 1024;
    const bufferLength = analyser.fftSize;
    buffer = new Float32Array(bufferLength);

    source.connect(analyser);

    function draw() {
      animationId = requestAnimationFrame(draw);

      analyser.getFloatTimeDomainData(buffer);
      const analytic = computeAnalyticSignal(buffer);

      ctx.fillStyle = '#111';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = '#0ff';
      ctx.lineWidth = 2;
      ctx.beginPath();

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const scale = Math.min(centerX, centerY) * 0.8;

      for (let i = 0; i < analytic.length; i++) {
        const [re, im] = analytic[i];
        const x = centerX + re * scale;
        const y = centerY - im * scale;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }

      ctx.stroke();
    }

    draw();
  } catch (err) {
    alert('Error accessing display media: ' + err.message);
  }
}

window.addEventListener('load', startVisualization);
