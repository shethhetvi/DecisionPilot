// ============================================================
//  DECISION PILOT — Main SPA Application
// ============================================================

const API_BASE = 'http://localhost:8081';

const AGENTS = [
  { id: 'context',     name: 'Context',     icon: '👤', desc: 'Extracting your constraints & goals...' },
  { id: 'research',    name: 'Research',    icon: '🔍', desc: 'Gathering facts and real-world data...' },
  { id: 'analysis',    name: 'Analysis',    icon: '⚖️', desc: 'Evaluating trade-offs and impacts...' },
  { id: 'risk',        name: 'Risk',        icon: '⚠️', desc: 'Predicting future pitfalls & risks...' },
  { id: 'decision',    name: 'Decision',    icon: '🧮', desc: 'Calculating weighted confidence scores...' },
  { id: 'explanation', name: 'Explanation', icon: '💬', desc: 'Formulating your personalized answer...' },
];

const EXAMPLE_QUERIES = [
  'MacBook Air vs Pro for AI development?',
  'Should I do an MBA or start my own company?',
  'Python vs JavaScript for full-stack development?',
  'Remote work vs office job — which suits me better?',
  'Invest in stocks or real estate first?',
  'Switch careers to data science at 28?',
];

// ── State ────────────────────────────────────────────────────
let currentQuery = '';
let currentGame  = null;
let abortController = null;

// ── Router ───────────────────────────────────────────────────
const views = ['landing', 'input', 'orchestrator', 'results', 'game', 'error'];

function showView(name) {
  views.forEach(v => {
    const el = document.getElementById(`view-${v}`);
    if (el) {
      el.classList.toggle('active', v === name);
    }
  });
}

// ── DOM Helpers ───────────────────────────────────────────────
const $ = id => document.getElementById(id);

// ── Landing Page ─────────────────────────────────────────────
function initLanding() {
  // Stagger feature card animations
  document.querySelectorAll('.feature-card').forEach((card, i) => {
    card.style.animationDelay = `${0.1 + i * 0.1}s`;
  });

  // Agent chips stagger
  document.querySelectorAll('.agent-chip').forEach((chip, i) => {
    chip.style.animationDelay = `${0.3 + i * 0.08}s`;
  });

  // Animated counter for stats
  animateStats();
}

function animateStats() {
  const stats = document.querySelectorAll('[data-count]');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.count);
        const suffix = el.dataset.suffix || '';
        animateNumber(el, 0, target, 1500, suffix);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  stats.forEach(s => observer.observe(s));
}

function animateNumber(el, from, to, duration, suffix = '') {
  const start = performance.now();
  const update = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(from + (to - from) * eased) + suffix;
    if (progress < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

// ── Decision Input ────────────────────────────────────────────
function initInput() {
  const input = $('query-input');
  const btn   = $('analyze-btn');

  // Populate example chips
  const container = $('example-chips');
  container.innerHTML = '';
  EXAMPLE_QUERIES.forEach(q => {
    const chip = document.createElement('div');
    chip.className = 'example-chip';
    chip.textContent = q;
    chip.addEventListener('click', () => {
      input.value = q;
      input.dispatchEvent(new Event('input'));
      input.focus();
    });
    container.appendChild(chip);
  });

  input.addEventListener('input', () => {
    btn.disabled = !input.value.trim();
  });

  btn.disabled = true;

  // Typing placeholder animation
  const placeholders = [
    'MacBook Air vs Pro for AI dev?',
    'MBA or startup? Help me decide…',
    'Remote vs on-site job offer?',
    'Invest in index funds or crypto?',
    'Python or Go for my next project?',
  ];
  let phIdx = 0;
  setInterval(() => {
    phIdx = (phIdx + 1) % placeholders.length;
    input.placeholder = placeholders[phIdx];
  }, 3000);
}

function startAnalysis() {
  const input = $('query-input');
  currentQuery = input.value.trim();
  if (!currentQuery) return;

  showView('orchestrator');
  initOrchestrator(currentQuery);
}

// ── Orchestrator / Pipeline ───────────────────────────────────
function initOrchestrator(query) {
  $('pipeline-query').textContent = query;

  // Build stepper
  const stepperEl = $('stepper-steps');
  const progressLine = $('step-progress-line');
  stepperEl.innerHTML = '';

  AGENTS.forEach((agent, i) => {
    const item = document.createElement('div');
    item.className = 'step-item';
    item.id = `step-${agent.id}`;
    item.innerHTML = `
      <div class="step-circle" id="circle-${agent.id}">${agent.icon}</div>
      <div class="step-label">${agent.name}</div>
    `;
    stepperEl.appendChild(item);
  });

  // Reset log
  $('log-feed').innerHTML = '';
  addLog('🚀 Orchestrator initialized...', 'active');

  // Start at step 0
  setActiveStep(0, progressLine);
  updateAgentStatus(0);

  // Fetch from backend
  fetchDecisionStream(query, progressLine);
}

function setActiveStep(index, progressLine) {
  AGENTS.forEach((agent, i) => {
    const item = $(`step-${agent.id}`);
    if (!item) return;
    item.classList.remove('active', 'done');
    const circle = $(`circle-${agent.id}`);
    if (i < index) {
      item.classList.add('done');
      circle.textContent = '✓';
    } else if (i === index) {
      item.classList.add('active');
      circle.textContent = agent.icon;
    } else {
      circle.textContent = agent.icon;
    }
  });

  // Update progress line
  const pct = index === 0 ? 0 : Math.min(((index) / AGENTS.length) * 100, 100);
  if (progressLine) progressLine.style.width = pct + '%';
}

function updateAgentStatus(index) {
  if (index >= AGENTS.length) return;
  const agent = AGENTS[index];
  $('agent-status-icon').textContent = agent.icon;
  $('agent-status-name').textContent = `${agent.name} Agent`;
  $('agent-status-desc').textContent = agent.desc;
}

function addLog(msg, type = '') {
  const feed = $('log-feed');
  const line = document.createElement('div');
  line.className = 'log-entry' + (type ? ` ${type}` : '');
  const time = new Date().toLocaleTimeString('en-US', { hour12: false });
  line.textContent = `[${time}] ${msg}`;
  feed.appendChild(line);
  feed.scrollTop = feed.scrollHeight;
}

async function fetchDecisionStream(query, progressLine) {
  if (abortController) abortController.abort();
  abortController = new AbortController();

  try {
    const response = await fetch(`${API_BASE}/api/decide/stream`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
      signal: abortController.signal,
    });

    if (!response.ok) throw new Error(`Backend error: ${response.status}`);

    const reader  = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let currentStep = 0;

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop();

      for (const line of lines) {
        if (!line.startsWith('data: ')) continue;
        let data;
        try { data = JSON.parse(line.slice(6)); } catch { continue; }

        if (data.error) {
          showError(data.error);
          return;
        }

        if (data.agent === 'done') {
          setActiveStep(AGENTS.length, progressLine);
          addLog('✅ All agents complete!', 'success');
          setTimeout(() => showResults(query, data.final_decision), 600);
          return;
        }

        const idx = AGENTS.findIndex(a => a.id === data.agent);
        if (idx !== -1) {
          currentStep = idx + 1;
          setActiveStep(currentStep, progressLine);
          updateAgentStatus(currentStep);
          addLog(`✅ ${AGENTS[idx].name} Agent complete`, 'success');
          if (currentStep < AGENTS.length) addLog(`▶ ${AGENTS[currentStep].name} Agent started...`, 'active');
        }
      }
    }
  } catch (err) {
    if (err.name === 'AbortError') return;
    // Fallback: demo mode
    console.warn('Backend unreachable — running demo mode:', err.message);
    runDemoMode(query, progressLine);
  }
}

// ── Demo Mode (no backend needed) ────────────────────────────
async function runDemoMode(query, progressLine) {
  addLog('⚡ Running in demo mode (backend offline)', 'active');

  for (let i = 0; i < AGENTS.length; i++) {
    await sleep(1400);
    setActiveStep(i + 1, progressLine);
    updateAgentStatus(i + 1 < AGENTS.length ? i + 1 : i);
    addLog(`✅ ${AGENTS[i].name} Agent complete`, 'success');
    if (i + 1 < AGENTS.length) addLog(`▶ ${AGENTS[i + 1].name} Agent started...`, 'active');
  }

  await sleep(600);

  const demoData = buildDemoData(query);
  showResults(query, demoData);
}

function buildDemoData(query) {
  // Extract option names from query
  const hasVs = query.toLowerCase().includes(' vs ') || query.toLowerCase().includes(' or ');
  let optA = 'Option A', optB = 'Option B';

  if (hasVs) {
    const sep = query.toLowerCase().includes(' vs ') ? ' vs ' : ' or ';
    const lq = query.toLowerCase();
    const idx = lq.indexOf(sep);
    if (idx !== -1) {
      optA = query.substring(0, idx).replace(/[?!,]/g, '').trim().split(' ').slice(-3).join(' ');
      optB = query.substring(idx + sep.length).replace(/[?!,]/g, '').trim().split(' ').slice(0, 3).join(' ');
    }
  }

  const scoreA = 72 + Math.floor(Math.random() * 15);
  const scoreB = 55 + Math.floor(Math.random() * 20);

  return {
    recommendation: optA,
    confidence: scoreA,
    explanation: `Based on comprehensive multi-agent analysis, ${optA} emerges as the stronger choice for your situation. The Context Agent identified key constraints, while the Research Agent gathered latest factual data. The Risk Agent flagged lower long-term uncertainty for ${optA}, and the Decision Agent's weighted scoring confirmed this recommendation with ${scoreA}% confidence.`,
    options: [
      {
        name: optA,
        score: scoreA,
        primary_risk: 'Higher upfront investment may strain short-term budget.',
        pros: ['Better long-term ROI', 'Stronger ecosystem', 'Higher resale value'],
        cons: ['Higher initial cost', 'Steeper learning curve'],
      },
      {
        name: optB,
        score: scoreB,
        primary_risk: 'May not scale well as requirements grow.',
        pros: ['Lower cost barrier', 'Simpler to start', 'Wider community'],
        cons: ['Less powerful features', 'Higher maintenance overhead'],
      },
    ]
  };
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// ── Results Dashboard ─────────────────────────────────────────
function showResults(query, data) {
  if (!data || !data.options) {
    showError('The AI returned an unexpected response. Please try again.');
    return;
  }

  showView('results');

  $('results-query').textContent = query;
  $('winner-name').textContent   = data.recommendation;
  $('winner-explanation').textContent = data.explanation;

  // Confidence
  const conf = data.confidence ?? 80;
  $('confidence-value').textContent = `${conf}% Confidence`;
  $('confidence-ring').style.setProperty('--conf', conf);

  // Options
  const grid = $('options-grid');
  grid.innerHTML = '';

  const colors = [
    { bar: 'linear-gradient(135deg,#f472b6,#a78bfa)', score: 'var(--pink)' },
    { bar: 'linear-gradient(135deg,#60a5fa,#22d3ee)', score: 'var(--blue)' },
    { bar: 'linear-gradient(135deg,#34d399,#22d3ee)', score: 'var(--green)' },
  ];

  data.options.forEach((opt, idx) => {
    const isWinner = opt.name === data.recommendation || idx === 0;
    const c = colors[idx % colors.length];

    const card = document.createElement('div');
    card.className = `option-card glass${isWinner ? ' winner-option' : ''}`;
    card.style.animationDelay = `${idx * 0.15}s`;

    const prosHtml = (opt.pros || []).map(p => `<li>${p}</li>`).join('');
    const consHtml = (opt.cons || []).map(c => `<li>${c}</li>`).join('');

    card.innerHTML = `
      <div class="option-header">
        <div>
          ${isWinner ? '<span class="badge badge-pink mb-1">🏆 Recommended</span><br>' : ''}
          <div class="option-name">${opt.name}</div>
        </div>
        <div class="option-score" style="color:${c.score}">${opt.score}</div>
      </div>
      <div class="score-bar-wrap">
        <div class="score-bar-fill" data-score="${opt.score}" style="background:${c.bar}"></div>
      </div>
      <div class="risk-box ${isWinner ? 'warning' : 'ok'}">
        ${isWinner ? '⚠️' : '✓'} <strong>Key Risk:</strong> ${opt.primary_risk || 'No major risks identified.'}
      </div>
      ${(prosHtml || consHtml) ? `
      <div class="pro-con-grid mt-2">
        ${prosHtml ? `<div class="pro-con-card pros"><h5 style="color:var(--green)">✅ Pros</h5><ul>${prosHtml}</ul></div>` : ''}
        ${consHtml ? `<div class="pro-con-card cons"><h5 style="color:var(--red)">❌ Cons</h5><ul>${consHtml}</ul></div>` : ''}
      </div>` : ''}
    `;
    grid.appendChild(card);
  });

  // Animate score bars
  setTimeout(() => {
    document.querySelectorAll('.score-bar-fill[data-score]').forEach(bar => {
      bar.style.width = bar.dataset.score + '%';
    });
  }, 200);
}

// ── Error ─────────────────────────────────────────────────────
function showError(msg) {
  $('error-message').textContent = msg;
  showView('error');
}

// ── Game ──────────────────────────────────────────────────────
function openGame() {
  showView('game');
  currentGame = new DecisionDuel();
}

function restartGame() {
  if (currentGame) currentGame.restart();
}

function goHome() {
  if (abortController) abortController.abort();
  if (currentGame) { currentGame = null; }
  showView('landing');
  initLanding();
}

function goToInput() {
  showView('input');
  initInput();
}

// ── Boot ──────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Start particle system
  new ParticleSystem('particle-canvas');

  // Default view
  showView('landing');
  initLanding();
});
