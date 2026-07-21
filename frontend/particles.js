// ============================================================
//  DECISION PILOT — Particle Background
// ============================================================

class ParticleSystem {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.mouse = { x: 0, y: 0 };
    this.animFrameId = null;

    this.resize();
    this.init();
    this.bindEvents();
    this.loop();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.W = this.canvas.width;
    this.H = this.canvas.height;
  }

  randomColor() {
    const palette = [
      'rgba(167,139,250,', // violet
      'rgba(244,114,182,', // pink
      'rgba(96,165,250,',  // blue
      'rgba(34,211,238,',  // cyan
      'rgba(52,211,153,',  // green
    ];
    return palette[Math.floor(Math.random() * palette.length)];
  }

  createParticle(x, y) {
    const color = this.randomColor();
    return {
      x: x ?? Math.random() * this.W,
      y: y ?? Math.random() * this.H,
      r: Math.random() * 2 + 0.5,
      alpha: Math.random() * 0.5 + 0.1,
      alphaDir: (Math.random() > 0.5 ? 1 : -1) * 0.003,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      color,
      connected: []
    };
  }

  init() {
    const count = Math.min(120, Math.floor((this.W * this.H) / 8000));
    this.particles = Array.from({ length: count }, () => this.createParticle());
  }

  bindEvents() {
    window.addEventListener('resize', () => {
      this.resize();
      this.init();
    });
    document.addEventListener('mousemove', e => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });
  }

  draw() {
    const { ctx, W, H, particles, mouse } = this;
    ctx.clearRect(0, 0, W, H);

    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxDist = 120;

        if (dist < maxDist) {
          const opacity = (1 - dist / maxDist) * 0.15;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(167,139,250,${opacity})`;
          ctx.lineWidth = 0.6;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }

      // Mouse interaction
      const dx = particles[i].x - mouse.x;
      const dy = particles[i].y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100) {
        const force = (100 - dist) / 100;
        particles[i].vx += (dx / dist) * force * 0.3;
        particles[i].vy += (dy / dist) * force * 0.3;
      }
    }

    // Draw particles
    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 0.99;
      p.vy *= 0.99;

      p.alpha += p.alphaDir;
      if (p.alpha <= 0.05 || p.alpha >= 0.6) p.alphaDir *= -1;

      // Wrap
      if (p.x < -5) p.x = W + 5;
      if (p.x > W + 5) p.x = -5;
      if (p.y < -5) p.y = H + 5;
      if (p.y > H + 5) p.y = -5;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `${p.color}${p.alpha})`;
      ctx.fill();
    }
  }

  loop() {
    this.draw();
    this.animFrameId = requestAnimationFrame(() => this.loop());
  }

  destroy() {
    if (this.animFrameId) cancelAnimationFrame(this.animFrameId);
  }
}
