import { processImage } from './processing.js';

export class PocketCamera extends HTMLElement {
  declare shadowRoot: ShadowRoot;

  private videoElement: HTMLVideoElement | null = null;
  private canvasElement: HTMLCanvasElement | null = null;

  private stream: MediaStream | null = null;
  private animationId: number | null = null;

  private isProcessing = false;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.render();
  }

  static get observedAttributes() {
    return ['width', 'height', 'auto-start'];
  }

  get width() {
    return parseInt(this.getAttribute('width') || '320');
  }

  get height() {
    return parseInt(this.getAttribute('height') || '240');
  }

  get autoStart() {
    return this.hasAttribute('auto-start');
  }

  connectedCallback() {
    if (this.autoStart) {
      this.startCamera();
    }
  }

  disconnectedCallback() {
    this.stopCamera();
  }

  attributeChangedCallback() {
    this.render();
  }

  private render() {
    const styles = `
      video, canvas {
        image-rendering: pixelated;
        image-rendering: -moz-crisp-edges;
        image-rendering: crisp-edges;
      }
    `;

    this.shadowRoot.innerHTML = `
      <style>${styles}</style>
      <div>
        <video style="display: none;"></video>
        <canvas
          width="${this.width}"
          height="${this.height}"
        />
      </div>
    `;

    this.videoElement = this.shadowRoot.querySelector('video');
    this.canvasElement = this.shadowRoot.querySelector('canvas');
  }

  async startCamera() {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (this.videoElement) {
        this.videoElement.srcObject = this.stream;
        this.videoElement.play();
      }
      this.isProcessing = true;
      this.draw();
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  }

  stopCamera() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }

    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }

    this.isProcessing = false;
    if (this.videoElement) {
      this.videoElement.srcObject = null;
    }
  }

  private draw() {
    if (!this.isProcessing || !this.canvasElement || !this.videoElement) return;

    const ctx = this.canvasElement.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    // Disable image smoothing for pixelated effect
    ctx.imageSmoothingEnabled = false;

    // Draw video frame to canvas
    ctx.drawImage(this.videoElement, 0, 0, this.width, this.height);

    // Process image with Nintendo camera filter
    const imageData = ctx.getImageData(0, 0, this.width, this.height);
    const processedImage = processImage(imageData);

    // Put processed image back to canvas
    ctx.putImageData(processedImage, 0, 0);

    this.animationId = requestAnimationFrame(() => this.draw());
  }
}
