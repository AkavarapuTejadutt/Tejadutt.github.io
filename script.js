/* ==========================================================================
   Akavarapu Teja Dutt Portfolio Interactive Script
   Includes Photorealistic Atmospheric VFX & CGX Engine (Volumetric Rain,
   Procedural Fractal Lightning, Surface Ripples, God Rays & Bokeh Particles),
   QuantORB Trading Console, RAG Simulator, & ECG Visualizer
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initTypewriter();
  initThemeSwitcher();
  initCanvasAnimations();
  initQuantOrbTerminal();
  initRagSandbox();
  initEcgVisualizer();
  initNavigation();
});

/* --------------------------------------------------------------------------
   1. Typewriter Effect
   -------------------------------------------------------------------------- */
function initTypewriter() {
  const el = document.getElementById('typewriter-text');
  if (!el) return;

  const phrases = [
    "Quantitative Trading Algorithms",
    "Generative AI & RAG Systems",
    "Scalable Web Applications",
    "Machine Learning Solutions",
    "Event-Driven Architectures",
    "Software & API Engineering"
  ];

  let phraseIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  const speed = 80;

  function type() {
    const currentPhrase = phrases[phraseIdx];

    if (isDeleting) {
      el.textContent = currentPhrase.substring(0, charIdx - 1);
      charIdx--;
    } else {
      el.textContent = currentPhrase.substring(0, charIdx + 1);
      charIdx++;
    }

    let delay = isDeleting ? speed / 2 : speed;

    if (!isDeleting && charIdx === currentPhrase.length) {
      delay = 2000;
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
      delay = 500;
    }

    setTimeout(type, delay);
  }

  type();
}


/* --------------------------------------------------------------------------
   3. Theme Switcher & Atmospheric Controls (Sound-Free)
   -------------------------------------------------------------------------- */
function initThemeSwitcher() {
  const themeBtn = document.getElementById('theme-switch-btn');
  const lightningFlash = document.getElementById('lightning-flash');

  if (!themeBtn) return;

  themeBtn.addEventListener('click', () => {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme');
    const targetTheme = currentTheme === 'dark' ? 'light' : 'dark';

    html.setAttribute('data-theme', targetTheme);

    if (targetTheme === 'dark') {
      if (lightningFlash) {
        lightningFlash.classList.remove('strike');
        void lightningFlash.offsetWidth; // reflow
        lightningFlash.classList.add('strike');
      }
      if (window.triggerDarkStormScene) {
        window.triggerDarkStormScene();
      }
    } else {
      if (window.triggerLightSunriseScene) {
        window.triggerLightSunriseScene();
      }
    }
  });
}

/* --------------------------------------------------------------------------
   4. Photorealistic Atmospheric VFX & CGX Engine
   - Dark Storm: Multi-depth volumetric rain, procedural fractal lightning,
     wind physics, surface splash ripples, and drifting atmospheric storm fog.
   - Cinematic Daylight: Soft volumetric god rays (light shafts) & drifting
     ambient bokeh micro-dust particulates.
   -------------------------------------------------------------------------- */
function initCanvasAnimations() {
  const canvas = document.getElementById('anim-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  let mode = document.documentElement.getAttribute('data-theme') || 'dark';

  // 1. Wind & Atmospheric Physics
  let wind = {
    current: 2.0,
    time: 0
  };

  // 2. Multi-Depth Volumetric Rain Particle (CGX)
  class VolumetricRainDrop {
    constructor() {
      this.init(true);
    }

    init(randomY = false) {
      // 3 Depth layers: 0 (background mist), 1 (midground), 2 (foreground heavy)
      this.layer = Math.random() < 0.25 ? 2 : (Math.random() < 0.6 ? 1 : 0);

      this.x = Math.random() * (width + 400) - 200;
      this.y = randomY ? Math.random() * height : -30 - Math.random() * 80;

      if (this.layer === 2) {
        // Foreground: fast, long, blurred, prominent
        this.speed = 22 + Math.random() * 8;
        this.length = 28 + Math.random() * 20;
        this.width = 1.4;
        this.alpha = 0.35 + Math.random() * 0.25;
      } else if (this.layer === 1) {
        // Midground
        this.speed = 15 + Math.random() * 6;
        this.length = 16 + Math.random() * 12;
        this.width = 1.0;
        this.alpha = 0.20 + Math.random() * 0.15;
      } else {
        // Background fine mist
        this.speed = 9 + Math.random() * 4;
        this.length = 8 + Math.random() * 8;
        this.width = 0.6;
        this.alpha = 0.08 + Math.random() * 0.08;
      }
    }

    update(windX) {
      this.x += windX * (this.speed / 15);
      this.y += this.speed;

      if (this.y > height) {
        // Chance to spawn surface splash
        if (this.layer >= 1 && Math.random() < 0.35) {
          splashes.push(new RainSplash(this.x, height - Math.random() * 15, this.layer));
        }
        this.init(false);
      }
    }

    draw(ctx, windX) {
      ctx.strokeStyle = `rgba(195, 220, 255, ${this.alpha})`;
      ctx.lineWidth = this.width;
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(this.x + windX * 1.5, this.y + this.length);
      ctx.stroke();
    }
  }

  // 3. Rain Splash & Micro-Droplet Physics (VFX)
  class RainSplash {
    constructor(x, y, layer) {
      this.x = x;
      this.y = y;
      this.radius = 1;
      this.maxRadius = layer === 2 ? 6 + Math.random() * 4 : 3 + Math.random() * 3;
      this.alpha = layer === 2 ? 0.45 : 0.25;
      this.decay = 0.03 + Math.random() * 0.02;
      this.droplets = [];

      const count = layer === 2 ? 3 : 1;
      for (let i = 0; i < count; i++) {
        this.droplets.push({
          x: 0,
          y: 0,
          vx: (Math.random() - 0.5) * 3,
          vy: -(1.5 + Math.random() * 2.5),
          life: 1.0
        });
      }
    }

    update() {
      this.radius += 0.5;
      this.alpha -= this.decay;
      for (let d of this.droplets) {
        d.x += d.vx;
        d.y += d.vy;
        d.vy += 0.2; // gravity
        d.life -= 0.08;
      }
      return this.alpha > 0;
    }

    draw(ctx) {
      // Expanding ripple ring
      ctx.strokeStyle = `rgba(186, 215, 255, ${this.alpha * 0.6})`;
      ctx.lineWidth = 0.75;
      ctx.beginPath();
      ctx.ellipse(this.x, this.y, this.radius * 1.5, this.radius * 0.6, 0, 0, Math.PI * 2);
      ctx.stroke();

      // Droplet spray
      for (let d of this.droplets) {
        if (d.life > 0) {
          ctx.fillStyle = `rgba(224, 238, 255, ${d.life * 0.5})`;
          ctx.beginPath();
          ctx.arc(this.x + d.x, this.y + d.y, 0.9, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
  }

  // 4. Procedural Fractal Lightning Bolt Engine (VFX)
  class FractalLightning {
    constructor() {
      this.segments = [];
      this.branches = [];
      this.alpha = 1.0;
      this.life = 1.0;
      this.decay = 0.05 + Math.random() * 0.03;
      this.originX = width * (0.2 + Math.random() * 0.6);
      this.originY = 0;
      this.targetX = this.originX + (Math.random() - 0.5) * (width * 0.35);
      this.targetY = height * (0.7 + Math.random() * 0.3);

      this.generateBolt();
    }

    generateBolt() {
      // Main trunk recursive generation
      this.segments = this.createBranch(
        this.originX, this.originY,
        this.targetX, this.targetY,
        5, 55
      );

      // Recursive secondary tendril branches
      const branchPoints = [Math.floor(this.segments.length * 0.25), Math.floor(this.segments.length * 0.5), Math.floor(this.segments.length * 0.75)];
      for (let idx of branchPoints) {
        if (this.segments[idx] && Math.random() < 0.75) {
          const pt = this.segments[idx];
          const angle = Math.atan2(this.targetY - this.originY, this.targetX - this.originX) + (Math.random() - 0.5) * 1.2;
          const branchLen = 80 + Math.random() * 140;
          const endX = pt.x + Math.sin(angle) * branchLen;
          const endY = pt.y + Math.cos(angle) * branchLen;

          this.branches.push(this.createBranch(pt.x, pt.y, endX, endY, 4, 30));
        }
      }
    }

    createBranch(x1, y1, x2, y2, iterations, maxDisplacement) {
      let points = [{ x: x1, y: y1 }, { x: x2, y: y2 }];

      for (let i = 0; i < iterations; i++) {
        let newPoints = [];
        for (let j = 0; j < points.length - 1; j++) {
          const p1 = points[j];
          const p2 = points[j + 1];
          const midX = (p1.x + p2.x) / 2;
          const midY = (p1.y + p2.y) / 2;

          // Perpendicular displacement
          const dx = p2.x - p1.x;
          const dy = p2.y - p1.y;
          const len = Math.sqrt(dx * dx + dy * dy);
          const nx = -dy / (len || 1);
          const ny = dx / (len || 1);

          const disp = (Math.random() - 0.5) * (maxDisplacement / (i + 1));
          newPoints.push(p1);
          newPoints.push({ x: midX + nx * disp, y: midY + ny * disp });
        }
        newPoints.push(points[points.length - 1]);
        points = newPoints;
      }
      return points;
    }

    update() {
      this.life -= this.decay;
      // Strobe flickering decay
      this.alpha = this.life > 0.7 ? 1.0 : (this.life > 0.4 ? (Math.random() > 0.3 ? 0.8 : 0.2) : this.life * 1.5);
      return this.life > 0;
    }

    draw(ctx) {
      if (this.alpha <= 0) return;

      ctx.save();
      ctx.globalAlpha = Math.max(0, Math.min(1, this.alpha));

      // 1. Atmospheric Sky Bloom at lightning origin
      const bloom = ctx.createRadialGradient(this.originX, this.originY, 20, this.originX, this.originY + 200, width * 0.6);
      bloom.addColorStop(0, 'rgba(168, 85, 247, 0.22)');
      bloom.addColorStop(0.4, 'rgba(59, 130, 246, 0.12)');
      bloom.addColorStop(1, 'rgba(15, 23, 42, 0)');
      ctx.fillStyle = bloom;
      ctx.fillRect(0, 0, width, height);

      // 2. Outer electric corona glow
      ctx.strokeStyle = "rgba(147, 197, 253, 0.35)";
      ctx.lineWidth = 7.0;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      this.renderPath(ctx, this.segments);

      // 3. Main electrical discharge channel
      ctx.strokeStyle = "rgba(192, 132, 252, 0.75)";
      ctx.lineWidth = 3.0;
      this.renderPath(ctx, this.segments);

      // 4. Hyper-intense white plasma core
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 1.2;
      this.renderPath(ctx, this.segments);

      // Tendril branches
      for (let branch of this.branches) {
        ctx.strokeStyle = "rgba(147, 197, 253, 0.25)";
        ctx.lineWidth = 3.0;
        this.renderPath(ctx, branch);

        ctx.strokeStyle = "rgba(255, 255, 255, 0.85)";
        ctx.lineWidth = 1.0;
        this.renderPath(ctx, branch);
      }

      ctx.restore();
    }

    renderPath(ctx, pts) {
      if (pts.length < 2) return;
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length; i++) {
        ctx.lineTo(pts[i].x, pts[i].y);
      }
      ctx.stroke();
    }
  }

  // 5. Cinematic Daylight Volumetric God Rays & Ambient Bokeh Particles (Light Mode)
  class DaylightBokehParticle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = 1.5 + Math.random() * 3.5;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = -(0.3 + Math.random() * 0.6); // Gentle upward brownian drift
      this.alpha = 0.15 + Math.random() * 0.35;
      this.pulseSpeed = 0.015 + Math.random() * 0.02;
      this.pulseAngle = Math.random() * Math.PI * 2;
    }

    update() {
      this.x += this.vx + Math.sin(this.pulseAngle) * 0.25;
      this.y += this.vy;
      this.pulseAngle += this.pulseSpeed;

      if (this.y < -20 || this.x < -20 || this.x > width + 20) {
        this.reset();
        this.y = height + 10;
      }
    }

    draw(ctx) {
      const currentAlpha = this.alpha * (0.6 + 0.4 * Math.sin(this.pulseAngle));
      const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 2.2);
      grad.addColorStop(0, `rgba(56, 189, 248, ${currentAlpha})`);
      grad.addColorStop(0.5, `rgba(139, 92, 246, ${currentAlpha * 0.4})`);
      grad.addColorStop(1, 'rgba(255, 255, 255, 0)');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size * 2.2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // 6. Volumetric God Rays (Light Mode Cinematic Shafts)
  function drawGodRays(ctx) {
    ctx.save();
    const rayCount = 4;
    const originX = width * 0.85;
    const originY = -50;

    for (let i = 0; i < rayCount; i++) {
      const spread = (i - 1.5) * 260;
      const targetX = originX - 450 + spread;
      const targetY = height + 100;

      const rayGrad = ctx.createLinearGradient(originX, originY, targetX, targetY);
      rayGrad.addColorStop(0, 'rgba(224, 242, 254, 0.14)');
      rayGrad.addColorStop(0.5, 'rgba(186, 230, 253, 0.06)');
      rayGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');

      ctx.fillStyle = rayGrad;
      ctx.beginPath();
      ctx.moveTo(originX - 30 + (i * 20), originY);
      ctx.lineTo(originX + 30 + (i * 20), originY);
      ctx.lineTo(targetX + 100, targetY);
      ctx.lineTo(targetX - 100, targetY);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();
  }

  // 7. Drifting Atmospheric Storm Mist Clouds (Dark Mode)
  class StormMistCloud {
    constructor(index) {
      this.x = (index / 3) * width;
      this.y = height * 0.3 + (index * 80);
      this.radiusX = width * 0.45;
      this.radiusY = height * 0.28;
      this.speed = 0.3 + Math.random() * 0.2;
    }

    update() {
      this.x += this.speed;
      if (this.x - this.radiusX > width) {
        this.x = -this.radiusX;
      }
    }

    draw(ctx) {
      const grad = ctx.createRadialGradient(this.x, this.y, 10, this.x, this.y, this.radiusX);
      grad.addColorStop(0, 'rgba(15, 23, 42, 0.22)');
      grad.addColorStop(0.6, 'rgba(10, 15, 26, 0.12)');
      grad.addColorStop(1, 'rgba(3, 7, 18, 0)');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.ellipse(this.x, this.y, this.radiusX, this.radiusY, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Pool instances
  const rainDrops = [];
  for (let i = 0; i < 220; i++) rainDrops.push(new VolumetricRainDrop());

  let splashes = [];
  let lightningBolts = [];

  const mistClouds = [
    new StormMistCloud(0),
    new StormMistCloud(1),
    new StormMistCloud(2)
  ];

  const bokehParticles = [];
  for (let i = 0; i < 55; i++) bokehParticles.push(new DaylightBokehParticle());

  let nextLightningTime = Date.now() + 3500;

  // Main VFX Render Loop
  function vfxLoop() {
    ctx.clearRect(0, 0, width, height);

    if (mode === 'dark') {
      // Atmospheric wind drift
      wind.time += 0.01;
      wind.current = 1.8 + Math.sin(wind.time) * 1.2;

      // Draw drifting storm fog
      for (let mist of mistClouds) {
        mist.update();
        mist.draw(ctx);
      }

      // Draw multi-depth rain
      for (let drop of rainDrops) {
        drop.update(wind.current);
        drop.draw(ctx, wind.current);
      }

      // Update & draw surface splashes
      splashes = splashes.filter(s => {
        const alive = s.update();
        if (alive) s.draw(ctx);
        return alive;
      });

      // Spontaneous natural lightning strikes
      const now = Date.now();
      if (now > nextLightningTime) {
        lightningBolts.push(new FractalLightning());
        nextLightningTime = now + 4500 + Math.random() * 6000;
      }

      // Render lightning bolts
      lightningBolts = lightningBolts.filter(bolt => {
        const active = bolt.update();
        if (active) bolt.draw(ctx);
        return active;
      });

    } else {
      // Cinematic Daylight / Light Mode
      drawGodRays(ctx);
      for (let p of bokehParticles) {
        p.update();
        p.draw(ctx);
      }
    }

    requestAnimationFrame(vfxLoop);
  }

  vfxLoop();

  window.triggerDarkStormScene = function() {
    mode = 'dark';
    lightningBolts.push(new FractalLightning());
  };

  window.triggerLightSunriseScene = function() {
    mode = 'light';
    lightningBolts = [];
    splashes = [];
  };
}

/* --------------------------------------------------------------------------
   5. Interactive RAG Simulator Sandbox
   -------------------------------------------------------------------------- */
function initRagSandbox() {
  const chatWindow = document.getElementById('rag-chat-window');
  const input = document.getElementById('rag-input');
  const sendBtn = document.getElementById('rag-send-btn');
  const clearBtn = document.getElementById('rag-clear-btn');
  const sampleBtns = document.querySelectorAll('.sample-btn');

  if (!chatWindow || !sendBtn) return;

  const ragKnowledgeBase = [
    {
      id: "rag-pipeline",
      title: "RAG System & Document Q&A Architecture",
      source: "AI-Document-QA-RAG / architecture_spec.md",
      confidence: "98.7%",
      keywords: ["rag", "document", "documents", "documentation", "how does it work", "pipeline", "architecture", "langchain", "chroma", "vector", "embedding", "chunk", "chunking", "retrieval", "hallucination", "box", "bot", "assistant", "system", "qa"],
      response: "<strong>RAG Architecture & Document Q&A:</strong> This system implements Retrieval-Augmented Generation (RAG) by applying recursive semantic chunking (500 tokens, 50-token overlap) to unstructured PDF and technical documents. Embeddings are stored in a ChromaDB vector index. Upon receiving a query, top-k cosine similarity search retrieves grounded passages to augment LLM prompts, completely eliminating hallucinations."
    },
    {
      id: "quantorb",
      title: "QuantORB Algorithmic Trading Framework",
      source: "QuantORB-Framework / README.txt",
      confidence: "97.9%",
      keywords: ["quant", "quantorb", "trading", "algo", "algorithm", "orb", "nifty", "fyers", "angel", "smartapi", "broker", "finance", "stocks", "futures", "breakout", "risk", "pnl", "replay"],
      response: "<strong>QuantORB Trading Framework:</strong> Tejadutt architected an automated 24/7 quantitative trading engine in Python for Nifty 50 Futures and Equities. It executes 5-minute Opening Range Breakouts (09:15–09:45 IST) via FYERS API v3 and Angel One SmartAPI with sub-second order dispatch, 1:4 Risk-to-Reward targets, prior-candle trailing stop losses, paper trading simulation, and historical backtest replay."
    },
    {
      id: "experience",
      title: "Work Experience & Internships",
      source: "Tejadutt_Resume.pdf / Experience",
      confidence: "96.8%",
      keywords: ["plantdeck", "cbit r&d", "intern", "internship", "internships", "work", "experience", "job", "career", "company", "frontend", "research", "engineer"],
      response: "<strong>Professional Experience:</strong><br>&bull; <em>Web Development Intern</em> @ <strong>PlantDeck Products & Services</strong> (Oct 2024 – Jul 2025): Engineered responsive user interfaces in JavaScript & React.js, connected REST APIs, and performed functional debugging using Git.<br>&bull; <em>R&D Engineer Intern</em> @ <strong>CBIT Hyderabad</strong> (Jun 2024 – Aug 2024): Developed Python software modules for institutional multi-modal R&D, validated system behaviors, and documented testing outcomes."
    },
    {
      id: "academics",
      title: "Education, GPA & Degree",
      source: "Tejadutt_Resume.pdf / Education",
      confidence: "99.4%",
      keywords: ["gpa", "cgpa", "college", "degree", "cbit", "chaitanya bharathi", "education", "university", "graduation", "marks", "score", "grade", "bachelor"],
      response: "<strong>Academic Background:</strong> Akavarapu Teja Dutt holds a Bachelor of Engineering in Information Technology from <strong>Chaitanya Bharathi Institute of Technology (CBIT), Hyderabad</strong> (Dec 2021 – Jun 2025) with a <strong>CGPA of 8.09 / 10</strong>. Coursework spans Data Structures & Algorithms, OOP, DBMS, Machine Learning, and Web Technologies."
    },
    {
      id: "skills",
      title: "Core Technical Skills & Stack",
      source: "Tejadutt_Resume.pdf / Technical Skills",
      confidence: "96.5%",
      keywords: ["skill", "skills", "tech stack", "stack", "technologies", "languages", "python", "react", "sql", "pytorch", "fastapi", "tools", "competencies", "best skills"],
      response: "<strong>Core Technical Competencies:</strong><br>&bull; <em>Programming:</em> Python, Java, JavaScript (ES6+), TypeScript, SQL.<br>&bull; <em>AI & Quant:</em> PyTorch, Scikit-learn, RAG, FYERS API v3, Angel One SmartAPI, WebSockets, Pandas, NumPy.<br>&bull; <em>Web & APIs:</em> React.js, FastAPI, RESTful APIs, HTML5, CSS3, JSON.<br>&bull; <em>Tools:</em> Git/GitHub, VS Code, Postman, Power BI."
    },
    {
      id: "deep-learning",
      title: "Deep Learning & Biomedical AI Systems",
      source: "Tejadutt_Resume.pdf / Projects",
      confidence: "97.6%",
      keywords: ["ecg", "arrhythmia", "rna", "autoencoder", "biomedical", "deep learning", "cnn", "gru", "tcn", "mit-bih", "genomic", "healthcare", "machine learning", "ml"],
      response: "<strong>Biomedical Deep Learning Systems:</strong><br>&bull; <em>ECG Arrhythmia Classification:</em> PyTorch deep learning pipeline (CNN-Attention-GRU & TCN-DGA) on MIT-BIH dataset with DWT preprocessing; achieved 98.98% accuracy and 99.73% sensitivity.<br>&bull; <em>RNA-Seq Anomaly Detection:</em> Unsupervised PyTorch Autoencoder on GSE183947 gene expression data, tuned via GridSearchCV, achieving 94.23% reconstruction accuracy."
    },
    {
      id: "math-tutor",
      title: "Math Tutor Agent",
      source: "Math_Agent / README.md",
      confidence: "96.1%",
      keywords: ["math", "tutor", "solver", "algebra", "agentic", "fastapi math", "student"],
      response: "<strong>Math Tutor Agent:</strong> Engineered an AI-driven tutoring web application delivering step-by-step mathematical problem solutions. Built with a high-throughput FastAPI backend in Python and a modern interactive React + TypeScript + Tailwind CSS frontend."
    },
    {
      id: "contact",
      title: "Contact, Location & Availability",
      source: "Tejadutt_Resume.pdf / Contact Info",
      confidence: "99.8%",
      keywords: ["contact", "email", "phone", "linkedin", "github", "hire", "hiring", "location", "hyderabad", "reach", "call", "available", "interview"],
      response: "<strong>Contact & Hiring Availability:</strong> Tejadutt is located in <strong>Hyderabad, India</strong> and is actively available for Software Engineering, GenAI, and Quantitative Development roles.<br>&bull; Email: <code>akavaraputejadutt@gmail.com</code><br>&bull; Phone: <code>+91 9866645151</code><br>&bull; LinkedIn: <a href=\"https://linkedin.com/in/teja-dutt-akavarapu-b755a9249\" target=\"_blank\" style=\"color:var(--accent-primary);text-decoration:underline;\">teja-dutt-akavarapu</a><br>&bull; GitHub: <a href=\"https://github.com/AkavarapuTejadutt\" target=\"_blank\" style=\"color:var(--accent-primary);text-decoration:underline;\">AkavarapuTejadutt</a>"
    },
    {
      id: "general",
      title: "General Greeting & System Overview",
      source: "RAG System Initializer",
      confidence: "99.5%",
      keywords: ["hi", "hello", "hey", "who are you", "what is this", "help", "about", "summary", "tell me about yourself", "overview", "start"],
      response: "<strong>Hello! I am Tejadutt's RAG Document Assistant.</strong> I have full-text indexed his official resume, QuantORB trading specifications, academic transcripts, and project repositories. Ask me about his QuantORB framework, RAG architecture, internships, GPA, or technical competencies!"
    }
  ];

  function getBestMatch(queryText) {
    const lower = queryText.toLowerCase().trim();
    let bestMatch = null;
    let highestScore = 0;

    ragKnowledgeBase.forEach(item => {
      let score = 0;
      item.keywords.forEach(kw => {
        if (lower === kw) {
          score += 15;
        } else if (lower.includes(kw)) {
          score += kw.length > 4 ? 6 : 3;
        }
      });
      if (score > highestScore) {
        highestScore = score;
        bestMatch = item;
      }
    });

    if (highestScore > 0 && bestMatch) {
      return bestMatch;
    }

    return {
      title: "General Profile Knowledge Chunk",
      source: "Tejadutt_Resume.pdf (Vector Chunk #1)",
      confidence: "92.4%",
      response: "<strong>Vector Retrieved Overview:</strong> Akavarapu Teja Dutt is a 2025 Information Technology graduate from CBIT Hyderabad (GPA: 8.09) with hands-on engineering experience across <strong>QuantORB Algorithmic Trading (FYERS/Angel One)</strong>, <strong>Generative AI & RAG Architectures</strong>, <strong>Biomedical Deep Learning (ECG/PyTorch)</strong>, and <strong>Full-Stack React & FastAPI Development</strong>."
    };
  }

  function processQuery(queryText) {
    if (!queryText || !queryText.trim()) return;

    // Add user bubble
    const userDiv = document.createElement('div');
    userDiv.className = 'msg user-msg';
    userDiv.innerHTML = `<strong>You:</strong> ${escapeHtml(queryText)}`;
    chatWindow.appendChild(userDiv);
    chatWindow.scrollTop = chatWindow.scrollHeight;

    input.value = '';

    // Add typing indicator
    const typingDiv = document.createElement('div');
    typingDiv.className = 'msg system-msg typing-indicator';
    typingDiv.id = 'rag-typing-bubble';
    typingDiv.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Retrieving vector chunks & generating answer...`;
    chatWindow.appendChild(typingDiv);
    chatWindow.scrollTop = chatWindow.scrollHeight;

    setTimeout(() => {
      const bubble = document.getElementById('rag-typing-bubble');
      if (bubble) bubble.remove();

      const match = getBestMatch(queryText);

      const botDiv = document.createElement('div');
      botDiv.className = 'msg system-msg';
      botDiv.innerHTML = `
        <div class="bot-meta">
          <span><i class="fa-solid fa-robot"></i> RAG Assistant</span>
          <span class="similarity-chip">Similarity: ${match.confidence}</span>
        </div>
        <div>${match.response}</div>
        <div class="rag-cite"><i class="fa-solid fa-file-lines"></i> Source: ${match.source}</div>
      `;
      chatWindow.appendChild(botDiv);
      chatWindow.scrollTop = chatWindow.scrollHeight;
    }, 380);
  }

  sendBtn.addEventListener('click', () => processQuery(input.value));
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') processQuery(input.value);
  });

  sampleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const q = btn.getAttribute('data-query');
      if (q) processQuery(q);
    });
  });

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      chatWindow.innerHTML = `
        <div class="msg system-msg">
          <div class="bot-meta">
            <span><i class="fa-solid fa-robot"></i> RAG Assistant</span>
            <span class="similarity-chip">Index: Ready</span>
          </div>
          <div>Chat history cleared. Context vector index active with 4 source documents. Select a prompt or type below!</div>
          <div class="rag-cite"><i class="fa-solid fa-folder-tree"></i> Source: Local Knowledge Vector Store</div>
        </div>
      `;
    });
  }
}

function escapeHtml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/* --------------------------------------------------------------------------
   6. ECG Canvas Visualizer
   -------------------------------------------------------------------------- */
function initEcgVisualizer() {
  const canvas = document.getElementById('ecg-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = canvas.width = canvas.parentElement.clientWidth || 350;
  let height = canvas.height = 90;

  let x = 0;
  let points = [];
  
  function getEcgY(t) {
    const cycle = t % 120;
    const mid = height / 2;
    
    if (cycle > 30 && cycle < 36) return mid - 8;
    if (cycle >= 36 && cycle < 42) return mid;
    if (cycle === 44) return mid + 6;
    if (cycle === 48) return mid - 36;
    if (cycle === 52) return mid + 16;
    if (cycle >= 54 && cycle < 60) return mid;
    if (cycle > 70 && cycle < 85) return mid - 12;
    
    return mid + (Math.random() * 2 - 1);
  }

  function drawEcg() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.15)";
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = "#10b981";
    ctx.lineWidth = 2;
    ctx.shadowBlur = 8;
    ctx.shadowColor = "#10b981";

    ctx.beginPath();
    const y = getEcgY(x);
    points.push({ x: x % width, y });

    if (points.length > width) points.shift();

    for (let i = 0; i < points.length; i++) {
      if (i === 0) ctx.moveTo(points[i].x, points[i].y);
      else ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.stroke();
    ctx.shadowBlur = 0;

    x += 2;
    requestAnimationFrame(drawEcg);
  }

  drawEcg();
}

/* --------------------------------------------------------------------------
   7. Navigation Controls
   -------------------------------------------------------------------------- */
function initNavigation() {
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const navMenu = document.getElementById('nav-menu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
    });
  }
}

/* --------------------------------------------------------------------------
   8. QuantORB Interactive Trading Terminal Engine
   -------------------------------------------------------------------------- */
function initQuantOrbTerminal() {
  const simulateBtn = document.getElementById('orb-simulate-btn');
  const toggleBrokerBtn = document.getElementById('orb-toggle-broker-btn');
  const resetBtn = document.getElementById('orb-reset-btn');
  const consoleEl = document.getElementById('orb-console');
  const statusEl = document.getElementById('orb-status-val');
  const pnlEl = document.getElementById('orb-pnl-val');
  const brokerBadge = document.getElementById('orb-broker-badge');
  const modeBadge = document.getElementById('orb-mode-badge');

  if (!simulateBtn || !consoleEl) return;

  let currentBroker = 'FYERS';
  let isSimulating = false;
  let timerIds = [];

  function appendLog(text, type = '') {
    const line = document.createElement('div');
    line.className = `console-line ${type}`;
    line.innerHTML = text;
    consoleEl.appendChild(line);
    consoleEl.scrollTop = consoleEl.scrollHeight;
  }

  function clearTimers() {
    timerIds.forEach(id => clearTimeout(id));
    timerIds = [];
  }

  // Simulate Long Breakout Sequence
  simulateBtn.addEventListener('click', () => {
    if (isSimulating) return;
    isSimulating = true;
    simulateBtn.disabled = true;
    simulateBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Executing ORB...';

    statusEl.textContent = 'EVALUATING 5M CANDLE';
    statusEl.className = 'stat-value status-breakout';

    appendLog('<span class="c-time">[10:00:00 IST]</span> 09:55 candle closing... Close: 25,189.20 (Breaches Range High 25,185.00).', 'highlight');

    const t1 = setTimeout(() => {
      statusEl.textContent = 'LONG ENTRY (1 LOT @ 25,189.20)';
      statusEl.className = 'stat-value status-in-trade';
      pnlEl.textContent = '+₹0.00';
      pnlEl.className = 'stat-value pnl-green';

      appendLog('<span class="c-time">[10:00:01 IST]</span> <span class="tag-buy">BUY SIGNAL</span> Market order dispatched to broker. Fill: 25,189.20 | SL: 25,120.00 (Risk: ₹5,190.00) | Target (1:4 R:R): 25,465.00.');
    }, 700);

    const t2 = setTimeout(() => {
      pnlEl.textContent = '+₹6,825.00';
      appendLog('<span class="c-time">[10:08:30 IST]</span> Live Tick: 25,280.20 (+91.00 pts). Trailing stop rule active (wick protection verified).');
    }, 1800);

    const t3 = setTimeout(() => {
      pnlEl.textContent = '+₹14,250.00';
      appendLog('<span class="c-time">[10:16:15 IST]</span> Live Tick: 25,379.20 (+190.00 pts). Momentum sustained across Nifty basket.');
    }, 2900);

    const t4 = setTimeout(() => {
      statusEl.textContent = 'TARGET HIT (SQUARED OFF)';
      statusEl.className = 'stat-value status-target';
      pnlEl.textContent = '+₹20,685.00';
      pnlEl.className = 'stat-value pnl-green highlight';

      appendLog('<span class="c-time">[10:24:45 IST]</span> <span class="tag-target">TARGET HIT @ 25,465.00</span> (+275.80 pts). Position closed at market. Net Realized Gain: <strong>+₹20,685.00</strong> (1:4 R:R achieved). State archived to trades.csv.', 'highlight');

      simulateBtn.disabled = false;
      simulateBtn.innerHTML = '<i class="fa-solid fa-check"></i> Trade Complete (+₹20.6k)';
      isSimulating = false;
    }, 4100);

    timerIds.push(t1, t2, t3, t4);
  });

  // Switch Broker Adapter
  toggleBrokerBtn.addEventListener('click', () => {
    if (isSimulating) return;
    if (currentBroker === 'FYERS') {
      currentBroker = 'ANGEL';
      brokerBadge.innerHTML = '<i class="fa-solid fa-bolt"></i> Angel One SmartAPI';
      appendLog('<span class="c-time">[' + new Date().toLocaleTimeString('en-US', {hour12: false}) + ' IST]</span> Execution routed to Angel One SmartAPI (SmartConnect). Live WebSocket feed established.', 'info');
    } else {
      currentBroker = 'FYERS';
      brokerBadge.innerHTML = '<i class="fa-solid fa-plug"></i> FYERS API v3';
      appendLog('<span class="c-time">[' + new Date().toLocaleTimeString('en-US', {hour12: false}) + ' IST]</span> Execution routed to FYERS API v3. App ID validated. Tick socket active.', 'info');
    }
  });

  // Reset Terminal
  resetBtn.addEventListener('click', () => {
    clearTimers();
    isSimulating = false;
    simulateBtn.disabled = false;
    simulateBtn.innerHTML = '<i class="fa-solid fa-bolt"></i> Simulate Long Breakout';
    statusEl.textContent = 'WAITING FOR BREAKOUT';
    statusEl.className = 'stat-value status-breakout';
    pnlEl.textContent = '+₹0.00';
    pnlEl.className = 'stat-value pnl-neutral';

    consoleEl.innerHTML = `
      <div class="console-line"><span class="c-time">[08:55:00 IST]</span> Authenticated with ${currentBroker === 'FYERS' ? 'FYERS API v3' : 'Angel One SmartAPI'}. Session token cached.</div>
      <div class="console-line"><span class="c-time">[09:15:00 IST]</span> WebSocket tick feed connected. Subscribed to Nifty 50 index & futures.</div>
      <div class="console-line"><span class="c-time">[09:45:00 IST]</span> Range formed: HIGH = 25,185.00 | LOW = 25,120.00 (Spread: 65.00 pts).</div>
      <div class="console-line info"><span class="c-time">[09:45:01 IST]</span> Entry window open until 12:10 IST. Monitoring 5-min candle closes for breakout...</div>
    `;
  });
}
