/* ==========================================================================
   Akavarapu Teja Dutt Portfolio Interactive Script
   Includes Paradise Theme Ambient Music, Cinematic Dark Storm (Huge Tree, Rain,
   Skulls, Thunder & Screaming Crows), Pleasant Light Mode (Glowing Light Bees),
   RAG Simulator, & ECG Visualizer
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initTypewriter();
  initBackgroundMusic();
  initThemeSwitcher();
  initCanvasAnimations();
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
    "Generative AI & RAG Systems",
    "Scalable Web Applications",
    "Machine Learning Solutions",
    "Robust Backend Architectures",
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
   2. Background Music Engine (The Paradise Theme OST)
   -------------------------------------------------------------------------- */
function initBackgroundMusic() {
  const bgMusic = document.getElementById('bg-music');
  const musicBtn = document.getElementById('music-toggle-btn');
  const musicIcon = document.getElementById('music-icon');
  const tooltip = musicBtn ? musicBtn.querySelector('.btn-tooltip') : null;

  if (!bgMusic) return;

  bgMusic.volume = 0.22;
  let isPlaying = false;

  function playMusic() {
    bgMusic.play().then(() => {
      isPlaying = true;
      if (musicIcon) musicIcon.className = "fa-solid fa-music";
      if (musicBtn) musicBtn.classList.add('active-music');
      if (tooltip) tooltip.textContent = "Paradise Theme: Playing";
    }).catch(err => {
      console.warn("Autoplay blocked by browser policy until user interaction.", err);
    });
  }

  function pauseMusic() {
    bgMusic.pause();
    isPlaying = false;
    if (musicIcon) musicIcon.className = "fa-solid fa-play";
    if (musicBtn) musicBtn.classList.remove('active-music');
    if (tooltip) tooltip.textContent = "Paradise Theme: Paused";
  }

  if (musicBtn) {
    musicBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (isPlaying) {
        pauseMusic();
      } else {
        playMusic();
      }
    });
  }

  const unlockAudio = () => {
    if (!isPlaying) {
      playMusic();
    }
    document.removeEventListener('click', unlockAudio);
    document.removeEventListener('touchstart', unlockAudio);
  };

  document.addEventListener('click', unlockAudio, { once: true });
  document.addEventListener('touchstart', unlockAudio, { once: true });
}

/* --------------------------------------------------------------------------
   3. Theme Switcher & Atmospheric Controls
   -------------------------------------------------------------------------- */
function initThemeSwitcher() {
  const themeBtn = document.getElementById('theme-switch-btn');
  const soundBtn = document.getElementById('sound-toggle-btn');
  const flashOverlay = document.getElementById('theme-flash-overlay');
  const lightningFlash = document.getElementById('lightning-flash');

  if (!themeBtn) return;

  if (soundBtn) {
    soundBtn.addEventListener('click', () => {
      const isMuted = window.audioEngine.toggleMute();
      const soundIcon = document.getElementById('sound-icon');
      const tooltip = soundBtn.querySelector('.btn-tooltip');

      if (isMuted) {
        soundIcon.className = "fa-solid fa-volume-xmark";
        if (tooltip) tooltip.textContent = "Sound FX OFF";
      } else {
        soundIcon.className = "fa-solid fa-volume-high";
        if (tooltip) tooltip.textContent = "Sound FX ON";
        window.audioEngine.playCrowSound();
      }
    });
  }

  themeBtn.addEventListener('click', () => {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme');
    const targetTheme = currentTheme === 'dark' ? 'light' : 'dark';

    flashOverlay.className = targetTheme === 'dark' ? 'flash-dark' : 'flash-light';

    if (targetTheme === 'dark') {
      // Thunder Lightning Strike Effect
      if (lightningFlash) {
        lightningFlash.classList.remove('strike');
        void lightningFlash.offsetWidth; // reflow
        lightningFlash.classList.add('strike');
      }

      window.triggerDarkStormScene();
      window.audioEngine.startRainSound();
      window.audioEngine.playThunderSound();
      window.audioEngine.playCrowSound();
    } else {
      window.triggerLightSunriseScene();
      window.audioEngine.stopRainSound();
    }

    setTimeout(() => {
      html.setAttribute('data-theme', targetTheme);
      flashOverlay.className = '';
    }, 350);
  });
}

/* --------------------------------------------------------------------------
   4. Cinematic Canvas Engine (Dark Storm & Pleasant Light Bees)
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

  let mode = 'dark';
  let animId = null;

  // Rain Drop Particle Class for Dark Storm
  class RainDrop {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * (width + 300) - 150;
      this.y = -20 - Math.random() * 300;
      this.length = 15 + Math.random() * 25;
      this.speed = 14 + Math.random() * 8;
      this.opacity = 0.2 + Math.random() * 0.35;
    }
    update() {
      this.x += 2.5;
      this.y += this.speed;
      if (this.y > height) this.reset();
    }
    draw(ctx) {
      ctx.strokeStyle = `rgba(180, 210, 255, ${this.opacity})`;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(this.x + 3, this.y + this.length);
      ctx.stroke();
    }
  }

  // Golden Light Bees / Glowing Fireflies Particle Class (Light Mode)
  class LightBee {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * width;
      this.y = height + Math.random() * 100;
      this.size = 3 + Math.random() * 4;
      this.vy = -(0.8 + Math.random() * 1.5);
      this.vx = (Math.random() - 0.5) * 1.2;
      this.wingAngle = Math.random() * Math.PI * 2;
      this.alpha = 0.5 + Math.random() * 0.5;
    }
    update() {
      this.x += this.vx + Math.sin(this.y * 0.02) * 0.8;
      this.y += this.vy;
      this.wingAngle += 0.4;
      if (this.y < -30) this.reset();
    }
    draw(ctx) {
      ctx.save();
      ctx.translate(this.x, this.y);

      // Glowing Aura
      const grad = ctx.createRadialGradient(0, 0, 1, 0, 0, this.size * 3.5);
      grad.addColorStop(0, 'rgba(254, 240, 138, 0.9)');
      grad.addColorStop(0.5, 'rgba(2, 132, 199, 0.4)');
      grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(0, 0, this.size * 3.5, 0, Math.PI * 2);
      ctx.fill();

      // Bee Body
      ctx.fillStyle = "#0284c7";
      ctx.beginPath();
      ctx.arc(0, 0, this.size, 0, Math.PI * 2);
      ctx.fill();

      // Flapping Glowing Wings
      const flap = Math.sin(this.wingAngle) * this.size * 1.5;
      ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
      ctx.beginPath();
      ctx.ellipse(-this.size * 0.8, -flap * 0.3, this.size * 1.2, this.size * 0.6, Math.PI / 4, 0, Math.PI * 2);
      ctx.ellipse(this.size * 0.8, -flap * 0.3, this.size * 1.2, this.size * 0.6, -Math.PI / 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }
  }

  // Multi-Jointed Vector Flying Crow Class
  class JointedCrow {
    constructor(index) {
      this.reset(index);
    }
    reset(index = 0) {
      this.x = -100 - (index * 45) - Math.random() * 300;
      this.y = height * 0.2 + Math.random() * (height * 0.5);
      this.vx = 7 + Math.random() * 6;
      this.vy = -(1.5 + Math.random() * 3);
      this.size = 24 + Math.random() * 16;
      this.wingAngle = Math.random() * Math.PI * 2;
      this.wingSpeed = 0.22 + Math.random() * 0.12;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.wingAngle += this.wingSpeed;
    }
    draw(ctx) {
      ctx.save();
      ctx.translate(this.x, this.y);

      ctx.fillStyle = "#0f172a";
      ctx.strokeStyle = "#020617";
      ctx.lineWidth = 1.5;

      const flap = Math.sin(this.wingAngle) * this.size * 0.8;

      ctx.beginPath();
      ctx.moveTo(-this.size * 1.3, this.size * 0.25);
      ctx.lineTo(-this.size * 0.8, 0);

      ctx.lineTo(-this.size * 0.4, flap * 0.5);
      ctx.lineTo(0, flap - this.size * 0.9);
      ctx.lineTo(this.size * 0.2, 0);

      ctx.lineTo(this.size * 0.7, -this.size * 0.15);
      ctx.lineTo(this.size * 0.95, 0);
      ctx.lineTo(this.size * 0.7, this.size * 0.15);

      ctx.lineTo(this.size * 0.2, 0);
      ctx.lineTo(0, flap - this.size * 0.9);
      ctx.lineTo(-this.size * 0.4, flap * 0.5);
      ctx.closePath();

      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }
  }

  // Procedural Background Tree & Skulls Renderer (Soft Translucent Backdrop)
  function drawGnarledTreeAndSkulls(ctx) {
    ctx.save();

    // 1. Ground Landscape Slope (Translucent Dark Overlay)
    ctx.fillStyle = "rgba(9, 13, 22, 0.65)";
    ctx.beginPath();
    ctx.moveTo(0, height);
    ctx.lineTo(0, height - 120);
    ctx.quadraticCurveTo(width * 0.25, height - 160, width * 0.5, height - 100);
    ctx.quadraticCurveTo(width * 0.75, height - 40, width, height - 90);
    ctx.lineTo(width, height);
    ctx.closePath();
    ctx.fill();

    // 2. Huge Ancient Gnarled Tree on Left (Subtle Backdrop stroke)
    const baseX = width * 0.14;
    const baseY = height - 130;

    ctx.strokeStyle = "rgba(15, 23, 42, 0.40)";
    ctx.fillStyle = "rgba(11, 15, 25, 0.40)";
    ctx.lineWidth = 26;
    ctx.lineCap = "round";

    // Trunk
    ctx.beginPath();
    ctx.moveTo(baseX, baseY + 80);
    ctx.quadraticCurveTo(baseX - 30, baseY - 120, baseX + 10, baseY - 240);
    ctx.stroke();

    // Primary Branch Left
    ctx.lineWidth = 15;
    ctx.beginPath();
    ctx.moveTo(baseX - 10, baseY - 180);
    ctx.quadraticCurveTo(baseX - 110, baseY - 280, baseX - 180, baseY - 350);
    ctx.stroke();

    // Sub-branches Left
    ctx.lineWidth = 7;
    ctx.beginPath();
    ctx.moveTo(baseX - 120, baseY - 290);
    ctx.quadraticCurveTo(baseX - 160, baseY - 380, baseX - 220, baseY - 420);
    ctx.moveTo(baseX - 140, baseY - 310);
    ctx.quadraticCurveTo(baseX - 190, baseY - 330, baseX - 250, baseY - 320);
    ctx.stroke();

    // Primary Branch Right
    ctx.lineWidth = 16;
    ctx.beginPath();
    ctx.moveTo(baseX + 10, baseY - 240);
    ctx.quadraticCurveTo(baseX + 90, baseY - 340, baseX + 160, baseY - 420);
    ctx.stroke();

    // Sub-branches Right
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(baseX + 80, baseY - 330);
    ctx.quadraticCurveTo(baseX + 150, baseY - 380, baseX + 210, baseY - 460);
    ctx.moveTo(baseX + 110, baseY - 360);
    ctx.quadraticCurveTo(baseX + 180, baseY - 330, baseX + 230, baseY - 300);
    ctx.stroke();

    // 3. Human Skulls & Skeleton Bones on Floor
    drawHumanSkull(ctx, baseX - 60, baseY + 35, 14);
    drawHumanSkull(ctx, baseX + 45, baseY + 45, 16);
    drawHumanSkull(ctx, baseX + 110, baseY + 50, 12);
    drawSkeletonBones(ctx, baseX - 90, baseY + 40);
    drawSkeletonBones(ctx, baseX + 70, baseY + 55);

    ctx.restore();
  }

  function drawHumanSkull(ctx, x, y, scale) {
    ctx.save();
    ctx.translate(x, y);

    ctx.fillStyle = "rgba(51, 65, 85, 0.6)";
    ctx.strokeStyle = "rgba(30, 41, 59, 0.6)";
    ctx.lineWidth = 1.5;

    ctx.beginPath();
    ctx.arc(0, 0, scale, Math.PI * 0.85, Math.PI * 2.15);
    ctx.lineTo(scale * 0.5, scale * 0.8);
    ctx.lineTo(-scale * 0.5, scale * 0.8);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#020617";
    ctx.beginPath();
    ctx.arc(-scale * 0.35, -scale * 0.1, scale * 0.25, 0, Math.PI * 2);
    ctx.arc(scale * 0.35, -scale * 0.1, scale * 0.25, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  function drawSkeletonBones(ctx, x, y) {
    ctx.save();
    ctx.translate(x, y);
    ctx.strokeStyle = "rgba(51, 65, 85, 0.6)";
    ctx.lineWidth = 2.5;

    ctx.beginPath();
    ctx.moveTo(-15, -6);
    ctx.lineTo(15, 6);
    ctx.moveTo(-15, 6);
    ctx.lineTo(15, -6);
    ctx.stroke();
    ctx.restore();
  }

  let rainDrops = [];
  for (let i = 0; i < 160; i++) rainDrops.push(new RainDrop());

  let lightBees = [];
  for (let i = 0; i < 45; i++) lightBees.push(new LightBee());

  let activeBirds = [];

  function mainLoop() {
    ctx.clearRect(0, 0, width, height);

    if (mode === 'dark') {
      drawGnarledTreeAndSkulls(ctx);
      for (let r of rainDrops) {
        r.update();
        r.draw(ctx);
      }
    } else {
      // Light Mode Light Bees
      for (let lb of lightBees) {
        lb.update();
        lb.draw(ctx);
      }
    }

    let stillActive = false;
    for (let b of activeBirds) {
      b.update();
      b.draw(ctx);
      if (b.x < width + 300 && b.y > -300 && b.y < height + 400) {
        stillActive = true;
      }
    }

    animId = requestAnimationFrame(mainLoop);
  }

  mainLoop();

  window.triggerDarkStormScene = function() {
    mode = 'dark';
    activeBirds = [];
    for (let i = 0; i < 40; i++) {
      activeBirds.push(new JointedCrow(i));
    }
  };

  window.triggerLightSunriseScene = function() {
    mode = 'light';
    activeBirds = [];
  };

  window.triggerDarkStormScene();
}

/* --------------------------------------------------------------------------
   5. Interactive RAG Simulator Sandbox
   -------------------------------------------------------------------------- */
function initRagSandbox() {
  const chatWindow = document.getElementById('rag-chat-window');
  const input = document.getElementById('rag-input');
  const sendBtn = document.getElementById('rag-send-btn');
  const sampleBtns = document.querySelectorAll('.sample-btn');

  if (!chatWindow || !sendBtn) return;

  const ragKnowledgeBase = [
    {
      keywords: ["gpa", "college", "degree", "cbit", "education"],
      response: "<strong>Retrieved Chunk:</strong> Akavarapu Teja Dutt completed his Bachelor of Engineering in Information Technology from <em>Chaitanya Bharathi Institute of Technology (CBIT), Hyderabad</em> (Dec 2021 - Jun 2025) with a <strong>CGPA of 8.09 / 10</strong>."
    },
    {
      keywords: ["plantdeck", "internship", "work", "experience", "web"],
      response: "<strong>Retrieved Chunk:</strong> Tejadutt served as a <em>Web Development Intern at PlantDeck Products & Services</em> (Oct 2024 - Jul 2025), building React.js interfaces, integrating REST APIs, and performing functional debugging."
    },
    {
      keywords: ["ai", "ml", "rag", "pytorch", "skills", "projects"],
      response: "<strong>Retrieved Chunk:</strong> Tejadutt has hands-on GenAI experience building an <em>AI Document Q&A RAG system</em> using Python, vector retrieval, and prompt engineering, plus an <em>ECG Arrhythmia Classifier</em> in PyTorch with 98.4% accuracy."
    },
    {
      keywords: ["contact", "email", "phone", "linkedin"],
      response: "<strong>Retrieved Chunk:</strong> You can contact Tejadutt via Email: <code>akavaraputejadutt@gmail.com</code> | Phone: <code>+91 9866645151</code> | Location: Hyderabad, India."
    }
  ];

  function processQuery(queryText) {
    if (!queryText.trim()) return;

    const userDiv = document.createElement('div');
    userDiv.className = 'msg user-msg';
    userDiv.innerHTML = `<strong>You:</strong> ${escapeHtml(queryText)}`;
    chatWindow.appendChild(userDiv);
    chatWindow.scrollTop = chatWindow.scrollHeight;

    setTimeout(() => {
      const lower = queryText.toLowerCase();
      let match = ragKnowledgeBase.find(kb => kb.keywords.some(k => lower.includes(k)));
      let answerText = match 
        ? match.response 
        : "<strong>RAG Vector Response:</strong> Akavarapu Teja Dutt is a 2025 IT graduate specializing in Generative AI, RAG architectures, PyTorch, React.js, and Backend Software Engineering based in Hyderabad.";

      const botDiv = document.createElement('div');
      botDiv.className = 'msg system-msg';
      botDiv.innerHTML = `<i class="fa-solid fa-robot"></i> ${answerText}`;
      chatWindow.appendChild(botDiv);
      chatWindow.scrollTop = chatWindow.scrollHeight;
    }, 350);

    input.value = '';
  }

  sendBtn.addEventListener('click', () => processQuery(input.value));
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') processQuery(input.value);
  });

  sampleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const q = btn.getAttribute('data-query');
      processQuery(q);
    });
  });
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
