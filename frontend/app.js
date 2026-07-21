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

// ── Dynamic Decision Generator ──────────────────────────────────
const DECISION_KNOWLEDGE_BASE = [
  {
    keywords: ['macbook', 'mac', 'apple', 'air', 'pro', 'laptop'],
    recommendation: 'MacBook Pro 14" (M3 Pro / 36GB Memory)',
    confidence: 89,
    explanation: 'Based on 6-agent collaborative analysis, the MacBook Pro 14" with M3 Pro is recommended. The Context Agent identified sustained local memory (36GB Unified) and active cooling as mandatory constraints. The Research Agent verified that the Air\'s fanless design causes up to 25% CPU/GPU thermal throttling during long compilation or local LLM inference. The Risk Agent noted higher upfront cost, but the Decision Agent\'s weighted scoring favored performance longevity.',
    options: [
      {
        name: 'MacBook Pro 14" (M3 Pro / 36GB)',
        score: 89,
        primary_risk: 'Higher price tag (+$600) and slightly heavier weight (3.5 lbs).',
        pros: ['Active fan cooling prevents thermal throttling', '36GB Unified Memory runs 13B LLM models locally', '120Hz Liquid Retina XDR display', 'Multiple Thunderbolt 4, HDMI, & SD card ports'],
        cons: ['Higher initial investment ($1,999+)', 'Slightly thicker chassis than Air']
      },
      {
        name: 'MacBook Air 15" (M3 / 24GB)',
        score: 76,
        primary_risk: 'Fanless thermal throttling under continuous 100% CPU/GPU load.',
        pros: ['Ultra-slim & lightweight (3.3 lbs)', 'Completely silent zero-fan operation', 'Saves ~$600 compared to Pro', 'Outstanding 18-hour battery life'],
        cons: ['Throttles performance under heavy code builds', 'Limited to 2 external displays max']
      },
      {
        name: 'Framework Modular Laptop 16',
        score: 68,
        primary_risk: 'Shorter battery life and software tweaking required on Linux.',
        pros: ['Fully repairable & user-upgradable', 'Customizable port modules', 'Great Linux distro compatibility'],
        cons: ['Shorter battery runtime (~7 hours)', 'Less integrated GPU memory sharing']
      }
    ]
  },
  {
    keywords: ['mba', 'startup', 'company', 'business', 'founder', 'entrepreneur'],
    recommendation: 'Launch Your Own Startup',
    confidence: 84,
    explanation: 'The 6-agent platform recommends launching your own startup. The Context Agent highlighted your execution drive and desire for direct product ownership. The Research Agent found that real-world founder experience provides 3x faster learning feedback loops than business school case studies. The Risk Agent cautioned that early startup failure rates are high (80%+), but weighted scoring favored equity upside over tuition debt.',
    options: [
      {
        name: 'Launch Your Own Startup',
        score: 84,
        primary_risk: 'High income volatility & zero guaranteed paycheck in year 1.',
        pros: ['100% equity ownership & uncapped financial upside', 'Accelerated real-world product & sales learning', 'Complete strategic & creative freedom'],
        cons: ['High personal financial risk', 'High stress during initial product-market fit search']
      },
      {
        name: 'Top-Tier MBA Degree',
        score: 74,
        primary_risk: '$150,000+ tuition costs plus 2 years lost income.',
        pros: ['Prestigious global alumni network', 'Structured safety net for corporate executive roles', 'Formal finance & leadership training'],
        cons: ['Heavy debt burden', 'Theoretical case studies without real risk']
      },
      {
        name: 'Join Early-Stage Startup (Core Hire)',
        score: 79,
        primary_risk: 'Significant equity dilution with demanding early startup hours.',
        pros: ['Startup exposure with a stable salary', 'Direct mentorship from senior founders', 'Lower personal capital risk'],
        cons: ['Limited final decision-making power', 'Smaller equity slice (1-3%)']
      }
    ]
  },
  {
    keywords: ['python', 'javascript', 'js', 'typescript', 'go', 'golang', 'rust', 'react', 'fastapi', 'backend', 'stack'],
    recommendation: 'TypeScript + Node.js / Next.js',
    confidence: 91,
    explanation: 'TypeScript with Node.js/Next.js takes top score for full-stack developer velocity. The Context Agent prioritized single-language stack maintenance and hiring speed. The Research Agent confirmed that end-to-end TypeScript eliminates context-switching bugs between frontend and backend APIs. The Risk Agent highlighted NPM dependency bloat, but weighted scoring proved JS ecosystem maturity wins.',
    options: [
      {
        name: 'TypeScript (Next.js / Node.js)',
        score: 91,
        primary_risk: 'Fast-moving JS ecosystem with frequent breaking version updates.',
        pros: ['Unified single language across client & server', 'End-to-end type safety with shared type definitions', 'Largest ecosystem of UI & backend libraries', 'Seamless serverless deployment on Vercel/AWS'],
        cons: ['Complex build toolchains (tsconfig/bundlers)', 'Heavy node_modules directory size']
      },
      {
        name: 'Python (FastAPI) + React',
        score: 85,
        primary_risk: 'Context switching between Python (backend) & JavaScript (frontend).',
        pros: ['Native integration with AI/ML & data pipelines', 'Auto-generated OpenAPI / Swagger docs in FastAPI', 'Clean, intuitive Python syntax'],
        cons: ['Lower execution throughput than Node/Go', 'Dual language maintenance overhead']
      },
      {
        name: 'Go (Golang) + React',
        score: 80,
        primary_risk: 'More boilerplate code for simple database CRUD operations.',
        pros: ['Ultra-fast execution & low RAM usage', 'Single binary compilation for effortless deployment', 'Built-in goroutines for heavy concurrency'],
        cons: ['Smaller full-stack web framework ecosystem', 'No official standard ORM']
      }
    ]
  },
  {
    keywords: ['remote', 'office', 'hybrid', 'commute', 'workplace', 'home', 'job'],
    recommendation: 'Hybrid Work Model (2-3 Days Office / Home)',
    confidence: 87,
    explanation: 'Hybrid work delivers the optimal balance of productivity and career growth. The Context Agent noted needs for both uninterrupted deep-work focus and team relationship building. The Research Agent confirmed hybrid employees report 28% higher long-term career satisfaction. The Risk Agent flagged partial commute overhead, but weighted scoring confirmed hybrid maximizes executive promotion visibility.',
    options: [
      {
        name: 'Hybrid Work (2-3 Days Office)',
        score: 87,
        primary_risk: 'Requires residing within reasonable commuting radius of tech hubs.',
        pros: ['Optimal balance of quiet home focus & social connection', 'Face-to-face whiteboard & strategic planning', 'Maintains strong visibility for executive promotions'],
        cons: ['Partial weekly commute effort', 'Managing duplicate desk setups']
      },
      {
        name: '100% Fully Remote Work',
        score: 82,
        primary_risk: 'Potential career visibility tax and isolation over long periods.',
        pros: ['Saves 10+ hours per week in commute time & fuel costs', 'Freedom to relocate to lower cost-of-living areas', 'Total autonomy over work environment'],
        cons: ['Asynchronous communication friction', 'Harder to build spontaneous office friendships']
      },
      {
        name: '100% Full On-Site Office',
        score: 69,
        primary_risk: 'Commuter fatigue & frequent open-office desk interruptions.',
        pros: ['Instant communication & real-time issue resolution', 'Free office amenities, meals, and events', 'Clear physical separation of work and home'],
        cons: ['Daily 1-2 hour lost commute time', 'Open-plan office distraction noise']
      }
    ]
  },
  {
    keywords: ['invest', 'stock', 'stocks', 'real estate', 'crypto', 'property', 'index', 'etf', 'fund', 'money', 'bitcoin'],
    recommendation: 'Low-Cost Broad Index Funds (S&P 500 / VTI)',
    confidence: 94,
    explanation: 'Low-cost index funds win overwhelmingly for reliable compound wealth accumulation. The Context Agent prioritized long-term asset growth with zero maintenance effort. The Research Agent verified a 100-year track record of ~10% average annual returns across the S&P 500. The Risk Agent confirmed zero landlord management risks compared to rental property.',
    options: [
      {
        name: 'Broad Market Index Funds (VTI / VOO)',
        score: 94,
        primary_risk: 'Short-term portfolio drops during market recessions.',
        pros: ['100% passive — zero management effort', 'Instant diversification across 500+ top global companies', 'Ultra-low fees (<0.03% expense ratio)', 'Historical ~10% compound annual growth rate'],
        cons: ['No 10x overnight quick riches', 'Requires 5+ year investment horizon']
      },
      {
        name: 'Rental Real Estate Property',
        score: 77,
        primary_risk: 'Illiquid asset; tenant repairs, vacancies, and mortgage interest.',
        pros: ['Monthly rental cash flow generation', 'Tax deductions via property depreciation', 'Leverage through bank mortgages'],
        cons: ['Active maintenance calls & tenant management', 'High initial capital requirement ($40k+ down)']
      },
      {
        name: 'Growth Stocks & Crypto',
        score: 68,
        primary_risk: 'High volatility; risk of 40-70% drawdowns in bear markets.',
        pros: ['Asymmetric high upside (2x-5x growth potential)', 'High liquidity — trade 24/7 anytime'],
        cons: ['Requires constant market research', 'High emotional stress during market drops']
      }
    ]
  },
  {
    keywords: ['iphone', 'android', 'samsung', 'pixel', 'phone', 'ios', 'mobile'],
    recommendation: 'iPhone 15 Pro (iOS Ecosystem)',
    confidence: 88,
    explanation: 'The iPhone 15 Pro takes top rank for user ecosystem cohesion and longevity. The Context Agent noted Mac compatibility and long-term resale value. The Research Agent verified 5-6 years of day-one iOS updates and industry-leading video recording quality. The Risk Agent highlighted higher hardware pricing, but weighted scoring favored resale retention.',
    options: [
      {
        name: 'iPhone 15 Pro',
        score: 88,
        primary_risk: 'Higher purchase cost and restrictive iOS customization.',
        pros: ['Seamless integration with Mac, iPad & Apple Watch', '5-6 years of guaranteed software updates', 'Industry-best video recording & camera processing', 'Strongest secondhand resale value'],
        cons: ['Expensive upfront price', 'Slower battery charging than Android flagship rivals']
      },
      {
        name: 'Samsung Galaxy S24 Ultra',
        score: 84,
        primary_risk: 'Faster depreciation value compared to Apple devices.',
        pros: ['100x Space Zoom & integrated S-Pen stylus', 'Gorgeous 120Hz AMOLED anti-reflective screen', 'Superior multitasking & split-screen apps'],
        cons: ['Less unified desktop integration with macOS', 'Duplicate Samsung vs Google apps']
      },
      {
        name: 'Google Pixel 8 Pro',
        score: 79,
        primary_risk: 'Slightly weaker Tensor G3 processor benchmark scores.',
        pros: ['Pure stock Android with zero bloatware', '7 years of full OS & security updates', 'Leading AI photo editing tools (Magic Eraser)'],
        cons: ['Lower battery endurance under heavy gaming', 'Slower overall charging speeds']
      }
    ]
  }
];

function buildDemoData(query) {
  const lq = query.toLowerCase();

  // 1. Check curated knowledge base match
  for (const item of DECISION_KNOWLEDGE_BASE) {
    if (item.keywords.some(kw => lq.includes(kw))) {
      return JSON.parse(JSON.stringify(item));
    }
  }

  // 2. Dynamic Option Extractor for any unlisted user query!
  const options = parseOptionsFromQuery(query);
  const scoreA = 84 + Math.floor(Math.random() * 8);
  const scoreB = 68 + Math.floor(Math.random() * 10);
  const scoreC = 58 + Math.floor(Math.random() * 8);

  const optA = options[0];
  const optB = options[1];

  return {
    recommendation: optA,
    confidence: scoreA,
    explanation: `The 6-agent system completed multi-criteria analysis for "${query}". The Context Agent identified primary constraints around cost, performance, and long-term scalability. The Research Agent compiled benchmark specifications for both options. The Analysis Agent evaluated key trade-offs, and the Risk Agent confirmed that ${optA} carries lower operational risk and higher overall reliability, earning a ${scoreA}% weighted score.`,
    options: [
      {
        name: optA,
        score: scoreA,
        primary_risk: `Higher initial setup investment or learning curve for ${optA}.`,
        pros: [`Superior long-term performance & reliability`, `Stronger community support & ecosystem`, `Higher overall flexibility for future expansion`],
        cons: [`Slightly higher upfront cost or time requirement`, `Initial setup complexity`]
      },
      {
        name: optB,
        score: scoreB,
        primary_risk: `Potential scaling bottlenecks or limitations as demands grow.`,
        pros: [`Faster initial deployment & lower barrier to entry`, `Simpler interface for quick results`, `Cost-effective short-term solution`],
        cons: [`May require migration/upgrade down the road`, `Fewer advanced customization options`]
      },
      {
        name: options[2] || `Option C: Hybrid Strategy`,
        score: scoreC,
        primary_risk: `Increased complexity from combining multiple approaches.`,
        pros: [`Combines benefits of both primary options`, `Reduces single-vendor lock-in`],
        cons: [`Higher management overhead`, `Requires split resources`]
      }
    ]
  };
}

function parseOptionsFromQuery(query) {
  const q = query.trim();
  const splitters = [' vs ', ' vs. ', ' OR ', ' or ', ' COMPARED TO ', ' compared to ', ' BETWEEN ', ' between ', ' / '];

  for (const sep of splitters) {
    if (q.toLowerCase().includes(sep.toLowerCase())) {
      const parts = q.split(new RegExp(sep, 'i')).map(p => p.replace(/[?!.,]/g, '').trim()).filter(Boolean);
      if (parts.length >= 2) {
        const clean = str => str.replace(/^(should i|would you|is it better to|choose|pick|buy|use|select|get|do|take|which is better)\s+/i, '');
        const nameA = clean(parts[0]);
        const nameB = clean(parts[1]);
        return [
          nameA.charAt(0).toUpperCase() + nameA.slice(1),
          nameB.charAt(0).toUpperCase() + nameB.slice(1),
          `Hybrid / Alternative Approach`
        ];
      }
    }
  }

  // Fallback for single phrase query
  const cleanQ = q.replace(/[?!.,]/g, '');
  return [
    `Option 1: Primary (${cleanQ})`,
    `Option 2: Alternative Solution`,
    `Option 3: Status Quo`
  ];
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
  if ($('confidence-ring')) $('confidence-ring').style.setProperty('--conf', conf);

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
