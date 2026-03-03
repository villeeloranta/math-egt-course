/* ========================================
   Interactive Visualizations Engine
   ======================================== */

// ==========================================
// 1. FUNCTION PLOTTER (Module 1)
// ==========================================
function initFunctionPlotter(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;

  let xMin = -5, xMax = 5, yMin = -5, yMax = 5;
  let currentFunc = 'x^2';

  const funcSelect = document.getElementById('func-select');
  if (funcSelect) {
    funcSelect.addEventListener('change', () => {
      currentFunc = funcSelect.value;
      draw();
    });
  }

  const functions = {
    'x^2': x => x * x,
    '2x + 1': x => 2 * x + 1,
    'sin(x)': x => Math.sin(x),
    'e^x': x => Math.exp(x),
    'ln(x)': x => x > 0 ? Math.log(x) : NaN,
    '1/(1+e^(-x))': x => 1 / (1 + Math.exp(-x)),
    'x^3 - 3x': x => x * x * x - 3 * x
  };

  function toScreen(x, y) {
    return [
      mapRange(x, xMin, xMax, 40, W - 20),
      mapRange(y, yMin, yMax, H - 30, 20)
    ];
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, W, H);

    // Grid
    ctx.strokeStyle = '#eee';
    ctx.lineWidth = 1;
    for (let x = Math.ceil(xMin); x <= xMax; x++) {
      const [sx] = toScreen(x, 0);
      ctx.beginPath(); ctx.moveTo(sx, 20); ctx.lineTo(sx, H - 30); ctx.stroke();
    }
    for (let y = Math.ceil(yMin); y <= yMax; y++) {
      const [, sy] = toScreen(0, y);
      ctx.beginPath(); ctx.moveTo(40, sy); ctx.lineTo(W - 20, sy); ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    const [ox, oy] = toScreen(0, 0);
    ctx.beginPath(); ctx.moveTo(40, oy); ctx.lineTo(W - 20, oy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(ox, 20); ctx.lineTo(ox, H - 30); ctx.stroke();

    // Labels
    ctx.fillStyle = '#666';
    ctx.font = '11px sans-serif';
    ctx.textAlign = 'center';
    for (let x = Math.ceil(xMin); x <= xMax; x++) {
      if (x === 0) continue;
      const [sx] = toScreen(x, 0);
      ctx.fillText(x, sx, oy + 15);
    }
    ctx.textAlign = 'right';
    for (let y = Math.ceil(yMin); y <= yMax; y++) {
      if (y === 0) continue;
      const [, sy] = toScreen(0, y);
      ctx.fillText(y, ox - 5, sy + 4);
    }

    // Function curve
    const fn = functions[currentFunc];
    if (!fn) return;

    ctx.strokeStyle = '#e74c3c';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    let started = false;
    const steps = W;
    for (let i = 0; i <= steps; i++) {
      const x = xMin + (xMax - xMin) * i / steps;
      const y = fn(x);
      if (isNaN(y) || !isFinite(y) || y < yMin - 5 || y > yMax + 5) {
        started = false;
        continue;
      }
      const [sx, sy] = toScreen(x, y);
      if (!started) { ctx.moveTo(sx, sy); started = true; }
      else ctx.lineTo(sx, sy);
    }
    ctx.stroke();

    // Label
    ctx.fillStyle = '#e74c3c';
    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('f(x) = ' + currentFunc, 50, 40);
  }

  draw();
  return { draw, setFunc: f => { currentFunc = f; draw(); } };
}


// ==========================================
// 2. MATRIX OPERATIONS VISUALIZER (Module 2)
// ==========================================
function initMatrixCalculator(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  function getMatrix(prefix) {
    const vals = [];
    for (let i = 0; i < 2; i++) {
      vals.push([]);
      for (let j = 0; j < 2; j++) {
        const el = document.getElementById(`${prefix}${i}${j}`);
        vals[i].push(el ? parseFloat(el.value) || 0 : 0);
      }
    }
    return vals;
  }

  function displayResult(matrix, label) {
    const resultDiv = document.getElementById('matrix-result');
    if (!resultDiv) return;
    let html = `<strong>${label}:</strong><br>`;
    html += '<table class="payoff-matrix" style="margin-top:0.5rem">';
    for (let i = 0; i < matrix.length; i++) {
      html += '<tr>';
      for (let j = 0; j < matrix[i].length; j++) {
        html += `<td>${fmt(matrix[i][j], 2)}</td>`;
      }
      html += '</tr>';
    }
    html += '</table>';
    resultDiv.innerHTML = html;
  }

  window.matrixAdd = () => {
    const A = getMatrix('a'), B = getMatrix('b');
    const C = [[A[0][0]+B[0][0], A[0][1]+B[0][1]], [A[1][0]+B[1][0], A[1][1]+B[1][1]]];
    displayResult(C, 'A + B');
  };

  window.matrixMul = () => {
    const A = getMatrix('a'), B = getMatrix('b');
    const C = [
      [A[0][0]*B[0][0]+A[0][1]*B[1][0], A[0][0]*B[0][1]+A[0][1]*B[1][1]],
      [A[1][0]*B[0][0]+A[1][1]*B[1][0], A[1][0]*B[0][1]+A[1][1]*B[1][1]]
    ];
    displayResult(C, 'A × B');
  };

  window.matrixDet = () => {
    const A = getMatrix('a');
    const det = A[0][0]*A[1][1] - A[0][1]*A[1][0];
    document.getElementById('matrix-result').innerHTML = `<strong>det(A) = ${fmt(det, 4)}</strong>`;
  };

  window.matrixEigen = () => {
    const A = getMatrix('a');
    const trace = A[0][0] + A[1][1];
    const det = A[0][0]*A[1][1] - A[0][1]*A[1][0];
    const disc = trace * trace - 4 * det;
    let html = '<strong>Eigenvalues of A:</strong><br>';
    html += `Trace = ${fmt(trace, 3)}, Det = ${fmt(det, 3)}<br>`;
    html += `Discriminant = ${fmt(disc, 3)}<br>`;
    if (disc >= 0) {
      const l1 = (trace + Math.sqrt(disc)) / 2;
      const l2 = (trace - Math.sqrt(disc)) / 2;
      html += `λ₁ = ${fmt(l1, 4)}, λ₂ = ${fmt(l2, 4)}`;
    } else {
      const re = trace / 2;
      const im = Math.sqrt(-disc) / 2;
      html += `λ = ${fmt(re, 3)} ± ${fmt(im, 3)}i (complex)`;
    }
    document.getElementById('matrix-result').innerHTML = html;
  };
}


// ==========================================
// 3. DERIVATIVE VISUALIZER (Module 3)
// ==========================================
function initDerivativeViz(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;

  const xMin = -4, xMax = 4, yMin = -3, yMax = 8;
  let xPoint = 1;

  const slider = document.getElementById('deriv-x-slider');
  const valDisplay = document.getElementById('deriv-x-val');

  function f(x) { return x * x; }
  function df(x) { return 2 * x; }

  function toScreen(x, y) {
    return [
      mapRange(x, xMin, xMax, 50, W - 20),
      mapRange(y, yMin, yMax, H - 30, 20)
    ];
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, W, H);

    // Grid
    ctx.strokeStyle = '#f0f0f0';
    ctx.lineWidth = 1;
    for (let x = Math.ceil(xMin); x <= xMax; x++) {
      const [sx] = toScreen(x, 0);
      ctx.beginPath(); ctx.moveTo(sx, 20); ctx.lineTo(sx, H-30); ctx.stroke();
    }
    for (let y = Math.ceil(yMin); y <= yMax; y++) {
      const [,sy] = toScreen(0, y);
      ctx.beginPath(); ctx.moveTo(50, sy); ctx.lineTo(W-20, sy); ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    const [ox, oy] = toScreen(0, 0);
    ctx.beginPath(); ctx.moveTo(50, oy); ctx.lineTo(W-20, oy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(ox, 20); ctx.lineTo(ox, H-30); ctx.stroke();

    // Axis labels
    ctx.fillStyle = '#666';
    ctx.font = '11px sans-serif';
    ctx.textAlign = 'center';
    for (let x = Math.ceil(xMin); x <= xMax; x++) {
      if (x === 0) continue;
      const [sx] = toScreen(x, 0);
      ctx.fillText(x, sx, oy + 15);
    }

    // Function curve f(x) = x²
    ctx.strokeStyle = '#2980b9';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    for (let i = 0; i <= W; i++) {
      const x = xMin + (xMax - xMin) * i / W;
      const y = f(x);
      const [sx, sy] = toScreen(x, y);
      if (i === 0) ctx.moveTo(sx, sy); else ctx.lineTo(sx, sy);
    }
    ctx.stroke();

    // Point on curve
    const yp = f(xPoint);
    const slope = df(xPoint);
    const [px, py] = toScreen(xPoint, yp);

    // Tangent line
    ctx.strokeStyle = '#e74c3c';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 3]);
    const tLen = 2;
    const [tx1, ty1] = toScreen(xPoint - tLen, yp - slope * tLen);
    const [tx2, ty2] = toScreen(xPoint + tLen, yp + slope * tLen);
    ctx.beginPath(); ctx.moveTo(tx1, ty1); ctx.lineTo(tx2, ty2); ctx.stroke();
    ctx.setLineDash([]);

    // Point dot
    ctx.fillStyle = '#e74c3c';
    ctx.beginPath();
    ctx.arc(px, py, 6, 0, Math.PI * 2);
    ctx.fill();

    // Labels
    ctx.fillStyle = '#2980b9';
    ctx.font = 'bold 13px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('f(x) = x²', 60, 35);

    ctx.fillStyle = '#e74c3c';
    ctx.fillText(`Tangent at x=${fmt(xPoint,1)}`, 60, 55);
    ctx.fillText(`f'(${fmt(xPoint,1)}) = ${fmt(slope,2)} (slope)`, 60, 75);
    ctx.fillText(`f(${fmt(xPoint,1)}) = ${fmt(yp,2)}`, 60, 95);
  }

  if (slider) {
    slider.addEventListener('input', () => {
      xPoint = parseFloat(slider.value);
      if (valDisplay) valDisplay.textContent = fmt(xPoint, 1);
      draw();
    });
  }

  draw();
}


// ==========================================
// 4. PHASE PORTRAIT / ODE VISUALIZER (Module 4)
// ==========================================
function initPhasePortrait(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;

  const range = 3;
  let systemType = 'saddle';

  const systemSelect = document.getElementById('system-select');
  if (systemSelect) {
    systemSelect.addEventListener('change', () => {
      systemType = systemSelect.value;
      draw();
    });
  }

  const systems = {
    'saddle':      { a: 1, b: 0, c: 0, d: -1, name: 'Saddle Point (λ₁>0, λ₂<0)' },
    'stable-node': { a: -1, b: 0, c: 0, d: -2, name: 'Stable Node (λ₁<0, λ₂<0)' },
    'unstable-node': { a: 1, b: 0, c: 0, d: 2, name: 'Unstable Node (λ₁>0, λ₂>0)' },
    'stable-spiral': { a: -0.2, b: 1, c: -1, d: -0.2, name: 'Stable Spiral (Re(λ)<0)' },
    'unstable-spiral': { a: 0.2, b: 1, c: -1, d: 0.2, name: 'Unstable Spiral (Re(λ)>0)' },
    'center': { a: 0, b: 1, c: -1, d: 0, name: 'Center (Re(λ)=0)' },
    'lotka-volterra': { a: 0, b: 0, c: 0, d: 0, name: 'Lotka-Volterra (nonlinear)' }
  };

  function toScreen(x, y) {
    return [
      mapRange(x, -range, range, 30, W - 10),
      mapRange(y, -range, range, H - 20, 10)
    ];
  }

  function dynamics(x, y) {
    if (systemType === 'lotka-volterra') {
      // dx/dt = x(1 - y), dy/dt = y(x - 1)
      return [x * (1 - y), y * (x - 1)];
    }
    const s = systems[systemType];
    return [s.a * x + s.b * y, s.c * x + s.d * y];
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, W, H);

    // Grid
    ctx.strokeStyle = '#f5f5f5';
    ctx.lineWidth = 1;
    for (let v = -range; v <= range; v++) {
      const [sx] = toScreen(v, 0);
      const [, sy] = toScreen(0, v);
      ctx.beginPath(); ctx.moveTo(sx, 10); ctx.lineTo(sx, H-20); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(30, sy); ctx.lineTo(W-10, sy); ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = '#aaa';
    ctx.lineWidth = 1.5;
    const [ox, oy] = toScreen(0, 0);
    ctx.beginPath(); ctx.moveTo(30, oy); ctx.lineTo(W-10, oy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(ox, 10); ctx.lineTo(ox, H-20); ctx.stroke();

    // Vector field
    const step = 0.4;
    for (let x = -range + step/2; x <= range; x += step) {
      for (let y = -range + step/2; y <= range; y += step) {
        const [dx, dy] = dynamics(x, y);
        const mag = Math.sqrt(dx*dx + dy*dy);
        if (mag < 0.001) continue;
        const scale = 0.15;
        const ndx = dx / mag * Math.min(mag, 2) * scale;
        const ndy = dy / mag * Math.min(mag, 2) * scale;

        const [sx, sy] = toScreen(x, y);
        const [ex, ey] = toScreen(x + ndx, y + ndy);

        ctx.strokeStyle = `hsl(${220 - Math.min(mag, 3) * 40}, 70%, 50%)`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(ex, ey);
        ctx.stroke();

        // Arrowhead
        const angle = Math.atan2(ey - sy, ex - sx);
        const aLen = 4;
        ctx.beginPath();
        ctx.moveTo(ex, ey);
        ctx.lineTo(ex - aLen * Math.cos(angle - 0.4), ey - aLen * Math.sin(angle - 0.4));
        ctx.moveTo(ex, ey);
        ctx.lineTo(ex - aLen * Math.cos(angle + 0.4), ey - aLen * Math.sin(angle + 0.4));
        ctx.stroke();
      }
    }

    // Sample trajectories
    const starts = [];
    for (let a = 0; a < Math.PI * 2; a += Math.PI / 4) {
      starts.push([2.5 * Math.cos(a), 2.5 * Math.sin(a)]);
      starts.push([1.5 * Math.cos(a), 1.5 * Math.sin(a)]);
    }

    starts.forEach(([x0, y0]) => {
      ctx.strokeStyle = 'rgba(231, 76, 60, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      let x = x0, y = y0;
      const [sx0, sy0] = toScreen(x, y);
      ctx.moveTo(sx0, sy0);

      const dt = 0.02;
      for (let t = 0; t < 500; t++) {
        const [dx, dy] = dynamics(x, y);
        x += dx * dt;
        y += dy * dt;
        if (Math.abs(x) > range * 2 || Math.abs(y) > range * 2) break;
        if (isNaN(x) || isNaN(y)) break;
        const [sx, sy] = toScreen(x, y);
        ctx.lineTo(sx, sy);
      }
      ctx.stroke();
    });

    // Fixed point
    ctx.fillStyle = '#2c3e50';
    ctx.beginPath();
    const [fx, fy] = toScreen(0, 0);
    ctx.arc(fx, fy, 5, 0, Math.PI * 2);
    ctx.fill();

    if (systemType === 'lotka-volterra') {
      const [fx2, fy2] = toScreen(1, 1);
      ctx.beginPath();
      ctx.arc(fx2, fy2, 5, 0, Math.PI * 2);
      ctx.fill();
    }

    // Label
    const sys = systems[systemType];
    ctx.fillStyle = '#333';
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(sys.name, 40, 25);
  }

  draw();

  // Click to add trajectory
  canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const x0 = mapRange(mx, 30, W - 10, -range, range);
    const y0 = mapRange(my, H - 20, 10, -range, range);

    draw(); // Redraw base

    ctx.strokeStyle = 'rgba(46, 204, 113, 0.8)';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    let x = x0, y = y0;
    const [sx0, sy0] = toScreen(x, y);
    ctx.moveTo(sx0, sy0);

    const dt = 0.01;
    for (let t = 0; t < 1000; t++) {
      const [dx, dy] = dynamics(x, y);
      x += dx * dt;
      y += dy * dt;
      if (Math.abs(x) > range * 2 || Math.abs(y) > range * 2) break;
      if (isNaN(x) || isNaN(y)) break;
      const [sx, sy] = toScreen(x, y);
      ctx.lineTo(sx, sy);
    }
    ctx.stroke();

    // Start point
    ctx.fillStyle = '#2ecc71';
    ctx.beginPath();
    ctx.arc(sx0, sy0, 5, 0, Math.PI * 2);
    ctx.fill();
  });
}


// ==========================================
// 5. REPLICATOR DYNAMICS SIMULATOR (Module 7)
// ==========================================
function initReplicatorDynamics(canvasId, timeCanvasId) {
  const canvas = document.getElementById(canvasId);
  const timeCanvas = document.getElementById(timeCanvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;

  let tCtx;
  if (timeCanvas) tCtx = timeCanvas.getContext('2d');
  const TW = timeCanvas ? timeCanvas.width : 0;
  const TH = timeCanvas ? timeCanvas.height : 0;

  // 2-strategy replicator dynamics
  // Payoff matrix for 2x2 game
  let a = 3, b = 0, c = 5, d = 1; // Default: Prisoner's Dilemma-like
  let x0 = 0.5; // initial proportion of strategy 1
  let speed = 1;

  const presets = {
    'pd': { a: 3, b: 0, c: 5, d: 1, name: "Prisoner's Dilemma" },
    'hawk-dove': { a: -1, b: 3, c: 1, d: 2, name: 'Hawk-Dove' },
    'coordination': { a: 3, b: 0, c: 0, d: 2, name: 'Coordination Game' },
    'rps-like': { a: 0, b: -1, c: 1, d: 0, name: 'Battle (asymmetric)' }
  };

  // Bind controls
  const inputs = ['rep-a', 'rep-b', 'rep-c', 'rep-d'].map(id => document.getElementById(id));
  const x0Slider = document.getElementById('rep-x0');
  const x0Val = document.getElementById('rep-x0-val');
  const presetSelect = document.getElementById('rep-preset');
  const playBtn = document.getElementById('rep-play');
  const resetBtn = document.getElementById('rep-reset');

  if (inputs[0]) inputs[0].value = a;
  if (inputs[1]) inputs[1].value = b;
  if (inputs[2]) inputs[2].value = c;
  if (inputs[3]) inputs[3].value = d;

  function readPayoffs() {
    if (inputs[0]) a = parseFloat(inputs[0].value) || 0;
    if (inputs[1]) b = parseFloat(inputs[1].value) || 0;
    if (inputs[2]) c = parseFloat(inputs[2].value) || 0;
    if (inputs[3]) d = parseFloat(inputs[3].value) || 0;
  }

  if (presetSelect) {
    presetSelect.addEventListener('change', () => {
      const p = presets[presetSelect.value];
      if (p) {
        a = p.a; b = p.b; c = p.c; d = p.d;
        if (inputs[0]) inputs[0].value = a;
        if (inputs[1]) inputs[1].value = b;
        if (inputs[2]) inputs[2].value = c;
        if (inputs[3]) inputs[3].value = d;
        resetSim();
      }
    });
  }

  inputs.forEach(inp => {
    if (inp) inp.addEventListener('change', () => { readPayoffs(); resetSim(); });
  });

  if (x0Slider) {
    x0Slider.addEventListener('input', () => {
      x0 = parseFloat(x0Slider.value);
      if (x0Val) x0Val.textContent = fmt(x0, 2);
      resetSim();
    });
  }

  // Simulation
  let history = [];
  let animId = null;
  let running = false;

  function replicatorStep(x, dt) {
    // x = proportion playing strategy 1
    // Fitness of strategy 1: f1 = a*x + b*(1-x)
    // Fitness of strategy 2: f2 = c*x + d*(1-x)
    // Average fitness: φ = x*f1 + (1-x)*f2
    // dx/dt = x * (f1 - φ) = x * (1-x) * (f1 - f2)
    const f1 = a * x + b * (1 - x);
    const f2 = c * x + d * (1 - x);
    const dxdt = x * (1 - x) * (f1 - f2);
    return clamp(x + dxdt * dt, 0.001, 0.999);
  }

  function resetSim() {
    if (animId) { cancelAnimationFrame(animId); animId = null; }
    running = false;
    if (playBtn) playBtn.textContent = 'Play';
    readPayoffs();
    if (x0Slider) x0 = parseFloat(x0Slider.value);
    history = [{ t: 0, x: x0 }];
    drawAll();
  }

  function step() {
    const last = history[history.length - 1];
    const dt = 0.05 * speed;
    const newX = replicatorStep(last.x, dt);
    history.push({ t: last.t + dt, x: newX });
    if (history.length > 2000) history.shift();
    drawAll();
    if (running) animId = requestAnimationFrame(step);
  }

  if (playBtn) {
    playBtn.addEventListener('click', () => {
      running = !running;
      playBtn.textContent = running ? 'Pause' : 'Play';
      if (running) step();
      else if (animId) { cancelAnimationFrame(animId); animId = null; }
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', resetSim);
  }

  function drawAll() {
    drawBarChart();
    if (tCtx) drawTimeSeries();
  }

  function drawBarChart() {
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, W, H);

    const last = history[history.length - 1];
    const x = last.x;
    const barW = 80;
    const maxBarH = H - 80;

    // Strategy 1
    const h1 = x * maxBarH;
    ctx.fillStyle = '#3498db';
    ctx.fillRect(W/2 - barW - 20, H - 40 - h1, barW, h1);

    // Strategy 2
    const h2 = (1 - x) * maxBarH;
    ctx.fillStyle = '#e74c3c';
    ctx.fillRect(W/2 + 20, H - 40 - h2, barW, h2);

    // Labels
    ctx.fillStyle = '#333';
    ctx.font = 'bold 13px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Strategy 1', W/2 - barW/2 - 20, H - 20);
    ctx.fillText('Strategy 2', W/2 + barW/2 + 20, H - 20);
    ctx.fillText(`${fmt(x * 100, 1)}%`, W/2 - barW/2 - 20, H - 45 - h1);
    ctx.fillText(`${fmt((1-x) * 100, 1)}%`, W/2 + barW/2 + 20, H - 45 - h2);

    // Time
    ctx.fillStyle = '#666';
    ctx.font = '12px sans-serif';
    ctx.fillText(`t = ${fmt(last.t, 1)}`, W/2, 20);

    // Equilibrium info
    const f1eq = a - c, f2eq = d - b;
    let eqInfo = '';
    if (f1eq + f2eq !== 0) {
      const xStar = f2eq / (f1eq + f2eq);
      if (xStar > 0 && xStar < 1) {
        eqInfo = `Interior eq: x* = ${fmt(xStar, 3)}`;
      }
    }
    if (eqInfo) {
      ctx.fillStyle = '#8e44ad';
      ctx.font = '11px sans-serif';
      ctx.fillText(eqInfo, W/2, 38);
    }
  }

  function drawTimeSeries() {
    tCtx.clearRect(0, 0, TW, TH);
    tCtx.fillStyle = '#fff';
    tCtx.fillRect(0, 0, TW, TH);

    const pad = { l: 45, r: 15, t: 15, b: 35 };
    const plotW = TW - pad.l - pad.r;
    const plotH = TH - pad.t - pad.b;

    // Axes
    tCtx.strokeStyle = '#333';
    tCtx.lineWidth = 1.5;
    tCtx.beginPath();
    tCtx.moveTo(pad.l, pad.t);
    tCtx.lineTo(pad.l, TH - pad.b);
    tCtx.lineTo(TW - pad.r, TH - pad.b);
    tCtx.stroke();

    // Y-axis labels
    tCtx.fillStyle = '#666';
    tCtx.font = '10px sans-serif';
    tCtx.textAlign = 'right';
    for (let v = 0; v <= 1; v += 0.25) {
      const y = TH - pad.b - v * plotH;
      tCtx.fillText(fmt(v, 2), pad.l - 5, y + 3);
      tCtx.strokeStyle = '#eee';
      tCtx.lineWidth = 1;
      tCtx.beginPath();
      tCtx.moveTo(pad.l, y);
      tCtx.lineTo(TW - pad.r, y);
      tCtx.stroke();
    }

    tCtx.textAlign = 'center';
    tCtx.fillText('Proportion (x)', pad.l - 20, pad.t + plotH/2);

    if (history.length < 2) return;

    const tMax = Math.max(history[history.length - 1].t, 5);

    // X-axis labels
    for (let t = 0; t <= tMax; t += Math.max(1, Math.floor(tMax / 5))) {
      const x = pad.l + (t / tMax) * plotW;
      tCtx.fillText(fmt(t, 0), x, TH - pad.b + 15);
    }
    tCtx.fillText('Time', pad.l + plotW/2, TH - 5);

    // Strategy 1 line
    tCtx.strokeStyle = '#3498db';
    tCtx.lineWidth = 2;
    tCtx.beginPath();
    history.forEach((pt, i) => {
      const sx = pad.l + (pt.t / tMax) * plotW;
      const sy = TH - pad.b - pt.x * plotH;
      if (i === 0) tCtx.moveTo(sx, sy); else tCtx.lineTo(sx, sy);
    });
    tCtx.stroke();

    // Strategy 2 line
    tCtx.strokeStyle = '#e74c3c';
    tCtx.lineWidth = 2;
    tCtx.beginPath();
    history.forEach((pt, i) => {
      const sx = pad.l + (pt.t / tMax) * plotW;
      const sy = TH - pad.b - (1 - pt.x) * plotH;
      if (i === 0) tCtx.moveTo(sx, sy); else tCtx.lineTo(sx, sy);
    });
    tCtx.stroke();

    // Legend
    tCtx.font = '11px sans-serif';
    tCtx.fillStyle = '#3498db';
    tCtx.textAlign = 'left';
    tCtx.fillText('— Strategy 1', pad.l + 5, pad.t + 12);
    tCtx.fillStyle = '#e74c3c';
    tCtx.fillText('— Strategy 2', pad.l + 100, pad.t + 12);

    // Equilibrium line
    const f1eq = a - c, f2eq = d - b;
    if (f1eq + f2eq !== 0) {
      const xStar = f2eq / (f1eq + f2eq);
      if (xStar > 0 && xStar < 1) {
        tCtx.strokeStyle = 'rgba(142, 68, 173, 0.5)';
        tCtx.lineWidth = 1.5;
        tCtx.setLineDash([5, 3]);
        const sy = TH - pad.b - xStar * plotH;
        tCtx.beginPath();
        tCtx.moveTo(pad.l, sy);
        tCtx.lineTo(TW - pad.r, sy);
        tCtx.stroke();
        tCtx.setLineDash([]);
        tCtx.fillStyle = '#8e44ad';
        tCtx.fillText(`x*=${fmt(xStar,2)}`, TW - pad.r - 50, sy - 5);
      }
    }
  }

  resetSim();
}


// ==========================================
// 6. 3-STRATEGY SIMPLEX (Module 7)
// ==========================================
function initSimplexPlot(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;

  // Payoff matrix for Rock-Paper-Scissors
  // Rows = strategy i, Cols = strategy j
  // A[i][j] = payoff to i when playing against j
  let A = [
    [0, -1, 1],
    [1, 0, -1],
    [-1, 1, 0]
  ];

  const presetSelect = document.getElementById('simplex-preset');
  const presets = {
    'rps': { A: [[0,-1,1],[1,0,-1],[-1,1,0]], name: 'Rock-Paper-Scissors' },
    'rps-asym': { A: [[0,-1,2],[1,0,-1],[-2,1,0]], name: 'Asymmetric RPS' },
    'coord3': { A: [[3,0,0],[0,2,0],[0,0,1]], name: '3-Strategy Coordination' },
    'dom': { A: [[3,3,3],[2,2,2],[1,1,1]], name: 'Dominant Strategy' }
  };

  if (presetSelect) {
    presetSelect.addEventListener('change', () => {
      const p = presets[presetSelect.value];
      if (p) { A = p.A.map(r => [...r]); draw(); }
    });
  }

  // Simplex coordinates: equilateral triangle
  const cx = W / 2, cy = H / 2;
  const size = Math.min(W, H) * 0.4;
  const vertices = [
    [cx, cy - size],                                   // Top: strategy 1
    [cx - size * Math.cos(Math.PI/6), cy + size * Math.sin(Math.PI/6)], // Bottom-left: strategy 2
    [cx + size * Math.cos(Math.PI/6), cy + size * Math.sin(Math.PI/6)]  // Bottom-right: strategy 3
  ];

  function baryToCart(p1, p2, p3) {
    return [
      p1 * vertices[0][0] + p2 * vertices[1][0] + p3 * vertices[2][0],
      p1 * vertices[0][1] + p2 * vertices[1][1] + p3 * vertices[2][1]
    ];
  }

  function replicatorField(x1, x2, x3) {
    // Fitness of each strategy
    const f1 = A[0][0]*x1 + A[0][1]*x2 + A[0][2]*x3;
    const f2 = A[1][0]*x1 + A[1][1]*x2 + A[1][2]*x3;
    const f3 = A[2][0]*x1 + A[2][1]*x2 + A[2][2]*x3;
    const phi = x1*f1 + x2*f2 + x3*f3;
    return [
      x1 * (f1 - phi),
      x2 * (f2 - phi),
      x3 * (f3 - phi)
    ];
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, W, H);

    // Draw triangle
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(vertices[0][0], vertices[0][1]);
    ctx.lineTo(vertices[1][0], vertices[1][1]);
    ctx.lineTo(vertices[2][0], vertices[2][1]);
    ctx.closePath();
    ctx.stroke();

    // Vertex labels
    ctx.fillStyle = '#333';
    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('S₁', vertices[0][0], vertices[0][1] - 12);
    ctx.fillText('S₂', vertices[1][0] - 15, vertices[1][1] + 20);
    ctx.fillText('S₃', vertices[2][0] + 15, vertices[2][1] + 20);

    // Vector field on simplex
    const steps = 15;
    for (let i = 0; i <= steps; i++) {
      for (let j = 0; j <= steps - i; j++) {
        const k = steps - i - j;
        const x1 = (i + 0.5) / (steps + 1.5);
        const x2 = (j + 0.5) / (steps + 1.5);
        const x3 = (k + 0.5) / (steps + 1.5);
        const sum = x1 + x2 + x3;
        const p1 = x1/sum, p2 = x2/sum, p3 = x3/sum;

        if (p1 < 0.02 || p2 < 0.02 || p3 < 0.02) continue;

        const [dx1, dx2, dx3] = replicatorField(p1, p2, p3);
        const [sx, sy] = baryToCart(p1, p2, p3);

        const ep1 = p1 + dx1 * 2;
        const ep2 = p2 + dx2 * 2;
        const ep3 = p3 + dx3 * 2;
        const [ex, ey] = baryToCart(ep1, ep2, ep3);

        const mag = Math.sqrt((ex-sx)*(ex-sx) + (ey-sy)*(ey-sy));
        if (mag < 0.5) continue;

        const scale = Math.min(mag, 12) / mag;
        const fx = sx + (ex - sx) * scale;
        const fy = sy + (ey - sy) * scale;

        ctx.strokeStyle = `hsl(${200 - Math.min(mag, 15) * 8}, 70%, 50%)`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(fx, fy);
        ctx.stroke();

        // Arrow head
        const angle = Math.atan2(fy - sy, fx - sx);
        const aLen = 3;
        ctx.beginPath();
        ctx.moveTo(fx, fy);
        ctx.lineTo(fx - aLen * Math.cos(angle - 0.5), fy - aLen * Math.sin(angle - 0.5));
        ctx.moveTo(fx, fy);
        ctx.lineTo(fx - aLen * Math.cos(angle + 0.5), fy - aLen * Math.sin(angle + 0.5));
        ctx.stroke();
      }
    }

    // Sample trajectories
    const traj_starts = [
      [0.8, 0.1, 0.1], [0.1, 0.8, 0.1], [0.1, 0.1, 0.8],
      [0.5, 0.25, 0.25], [0.25, 0.5, 0.25], [0.25, 0.25, 0.5],
      [0.33, 0.34, 0.33], [0.6, 0.3, 0.1], [0.1, 0.6, 0.3]
    ];

    traj_starts.forEach(([x1, x2, x3]) => {
      ctx.strokeStyle = 'rgba(231, 76, 60, 0.3)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      let p1 = x1, p2 = x2, p3 = x3;
      const [sx, sy] = baryToCart(p1, p2, p3);
      ctx.moveTo(sx, sy);

      const dt = 0.01;
      for (let t = 0; t < 2000; t++) {
        const [d1, d2, d3] = replicatorField(p1, p2, p3);
        p1 = Math.max(0.001, p1 + d1 * dt);
        p2 = Math.max(0.001, p2 + d2 * dt);
        p3 = Math.max(0.001, p3 + d3 * dt);
        const s = p1 + p2 + p3;
        p1 /= s; p2 /= s; p3 /= s;

        const [px, py] = baryToCart(p1, p2, p3);
        ctx.lineTo(px, py);
      }
      ctx.stroke();
    });

    // Center point (1/3, 1/3, 1/3)
    const [cpx, cpy] = baryToCart(1/3, 1/3, 1/3);
    ctx.fillStyle = '#2c3e50';
    ctx.beginPath();
    ctx.arc(cpx, cpy, 4, 0, Math.PI * 2);
    ctx.fill();
  }

  draw();

  // Click to add trajectory
  canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    // Convert click to barycentric roughly
    // Solve for barycentric coordinates
    const v0 = vertices[0], v1 = vertices[1], v2 = vertices[2];
    const d00 = (v1[0]-v0[0])*(v1[0]-v0[0]) + (v1[1]-v0[1])*(v1[1]-v0[1]);
    const d01 = (v1[0]-v0[0])*(v2[0]-v0[0]) + (v1[1]-v0[1])*(v2[1]-v0[1]);
    const d11 = (v2[0]-v0[0])*(v2[0]-v0[0]) + (v2[1]-v0[1])*(v2[1]-v0[1]);
    const d20 = (mx-v0[0])*(v1[0]-v0[0]) + (my-v0[1])*(v1[1]-v0[1]);
    const d21 = (mx-v0[0])*(v2[0]-v0[0]) + (my-v0[1])*(v2[1]-v0[1]);
    const denom = d00*d11 - d01*d01;
    let p2 = (d11*d20 - d01*d21) / denom;
    let p3 = (d00*d21 - d01*d20) / denom;
    let p1 = 1 - p2 - p3;

    if (p1 < 0 || p2 < 0 || p3 < 0) return;

    draw();

    ctx.strokeStyle = 'rgba(46, 204, 113, 0.8)';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    const [sx, sy] = baryToCart(p1, p2, p3);
    ctx.moveTo(sx, sy);

    const dt = 0.01;
    for (let t = 0; t < 2000; t++) {
      const [d1, d2, d3] = replicatorField(p1, p2, p3);
      p1 = Math.max(0.001, p1 + d1 * dt);
      p2 = Math.max(0.001, p2 + d2 * dt);
      p3 = Math.max(0.001, p3 + d3 * dt);
      const s = p1 + p2 + p3;
      p1 /= s; p2 /= s; p3 /= s;
      const [px, py] = baryToCart(p1, p2, p3);
      ctx.lineTo(px, py);
    }
    ctx.stroke();

    ctx.fillStyle = '#2ecc71';
    ctx.beginPath();
    ctx.arc(sx, sy, 5, 0, Math.PI * 2);
    ctx.fill();
  });
}


// ==========================================
// 7. NASH EQUILIBRIUM FINDER (Module 6)
// ==========================================
function initNashFinder(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  window.findNash = function() {
    const get = id => parseFloat(document.getElementById(id)?.value) || 0;
    // Player 1 payoffs
    const a1 = get('nash-a1'), b1 = get('nash-b1');
    const c1 = get('nash-c1'), d1 = get('nash-d1');
    // Player 2 payoffs
    const a2 = get('nash-a2'), b2 = get('nash-b2');
    const c2 = get('nash-c2'), d2 = get('nash-d2');

    const resultDiv = document.getElementById('nash-result');
    let html = '<strong>Analysis:</strong><br>';

    // Check pure strategy NE
    const pureNE = [];

    // (Top, Left) is NE if a1 >= c1 (Player 1 doesn't deviate) and a2 >= b2 (Player 2 doesn't deviate)
    if (a1 >= c1 && a2 >= b2) pureNE.push('(Strategy 1, Strategy 1)');
    // (Top, Right)
    if (b1 >= d1 && b2 >= a2) pureNE.push('(Strategy 1, Strategy 2)');
    // (Bottom, Left)
    if (c1 >= a1 && c2 >= d2) pureNE.push('(Strategy 2, Strategy 1)');
    // (Bottom, Right)
    if (d1 >= b1 && d2 >= c2) pureNE.push('(Strategy 2, Strategy 2)');

    if (pureNE.length > 0) {
      html += '<br><strong>Pure Strategy Nash Equilibria:</strong><br>';
      pureNE.forEach(ne => { html += `&nbsp;&nbsp;• ${ne}<br>`; });
    } else {
      html += '<br>No pure strategy Nash Equilibrium found.<br>';
    }

    // Mixed strategy NE
    // Player 1 mixes so Player 2 is indifferent: p*a2 + (1-p)*c2 = p*b2 + (1-p)*d2
    // p*(a2-c2) + c2 = p*(b2-d2) + d2
    // p*(a2-c2-b2+d2) = d2 - c2
    const denom1 = a2 - c2 - b2 + d2;
    const denom2 = a1 - b1 - c1 + d1;

    if (Math.abs(denom1) > 0.0001 && Math.abs(denom2) > 0.0001) {
      const p = (d2 - c2) / denom1; // Player 1's mix probability
      const q = (d1 - b1) / denom2; // Player 2's mix probability

      if (p > 0 && p < 1 && q > 0 && q < 1) {
        html += `<br><strong>Mixed Strategy Nash Equilibrium:</strong><br>`;
        html += `&nbsp;&nbsp;Player 1: plays S1 with prob ${fmt(p, 3)}, S2 with prob ${fmt(1-p, 3)}<br>`;
        html += `&nbsp;&nbsp;Player 2: plays S1 with prob ${fmt(q, 3)}, S2 with prob ${fmt(1-q, 3)}<br>`;

        const ev1 = p * (q * a1 + (1-q) * b1) + (1-p) * (q * c1 + (1-q) * d1);
        const ev2 = p * (q * a2 + (1-q) * b2) + (1-p) * (q * c2 + (1-q) * d2);
        html += `&nbsp;&nbsp;Expected payoff P1: ${fmt(ev1, 3)}, P2: ${fmt(ev2, 3)}<br>`;
      }
    }

    // Dominant strategies
    html += '<br><strong>Dominance Analysis:</strong><br>';
    if (a1 > c1 && b1 > d1) html += '&nbsp;&nbsp;Player 1: Strategy 1 strictly dominates Strategy 2<br>';
    else if (c1 > a1 && d1 > b1) html += '&nbsp;&nbsp;Player 1: Strategy 2 strictly dominates Strategy 1<br>';
    else html += '&nbsp;&nbsp;Player 1: No strictly dominant strategy<br>';

    if (a2 > b2 && c2 > d2) html += '&nbsp;&nbsp;Player 2: Strategy 1 strictly dominates Strategy 2<br>';
    else if (b2 > a2 && d2 > c2) html += '&nbsp;&nbsp;Player 2: Strategy 2 strictly dominates Strategy 1<br>';
    else html += '&nbsp;&nbsp;Player 2: No strictly dominant strategy<br>';

    if (resultDiv) resultDiv.innerHTML = html;
  };
}


// ==========================================
// 8. SVO RING MEASURE (Module 8)
// ==========================================
function initSVORing(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;

  let angle = 45; // SVO angle in degrees
  const slider = document.getElementById('svo-angle');
  const valDisplay = document.getElementById('svo-angle-val');
  const typeDisplay = document.getElementById('svo-type');

  function getSVOType(deg) {
    if (deg > 57.15) return 'Altruistic';
    if (deg > 22.45) return 'Prosocial';
    if (deg > -12.04) return 'Individualistic';
    return 'Competitive';
  }

  function getSVOColor(deg) {
    if (deg > 57.15) return '#27ae60';
    if (deg > 22.45) return '#2980b9';
    if (deg > -12.04) return '#f39c12';
    return '#e74c3c';
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, W, H);

    const cx = W / 2, cy = H / 2;
    const r = Math.min(W, H) * 0.35;

    // Ring
    ctx.strokeStyle = '#ddd';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();

    // Quadrant labels and colored arcs
    const segments = [
      { start: -12.04, end: 22.45, color: '#f39c12', label: 'Individualistic' },
      { start: 22.45, end: 57.15, color: '#2980b9', label: 'Prosocial' },
      { start: 57.15, end: 90, color: '#27ae60', label: 'Altruistic' },
      { start: -90, end: -12.04, color: '#e74c3c', label: 'Competitive' }
    ];

    segments.forEach(seg => {
      const startRad = -seg.start * Math.PI / 180;
      const endRad = -seg.end * Math.PI / 180;
      ctx.strokeStyle = seg.color;
      ctx.lineWidth = 8;
      ctx.globalAlpha = 0.3;
      ctx.beginPath();
      ctx.arc(cx, cy, r, endRad, startRad);
      ctx.stroke();
      ctx.globalAlpha = 1;

      // Label
      const midAngle = -(seg.start + seg.end) / 2 * Math.PI / 180;
      const lx = cx + (r + 30) * Math.cos(midAngle);
      const ly = cy + (r + 30) * Math.sin(midAngle);
      ctx.fillStyle = seg.color;
      ctx.font = '11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(seg.label, lx, ly);
    });

    // Axes
    ctx.strokeStyle = '#999';
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 3]);
    ctx.beginPath(); ctx.moveTo(cx - r - 20, cy); ctx.lineTo(cx + r + 20, cy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx, cy - r - 20); ctx.lineTo(cx, cy + r + 20); ctx.stroke();
    ctx.setLineDash([]);

    // Axis labels
    ctx.fillStyle = '#666';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Payoff to Self →', cx + r/2, cy + r + 45);
    ctx.save();
    ctx.translate(cx - r - 45, cy);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Payoff to Other →', 0, 0);
    ctx.restore();

    // SVO vector
    const rad = -angle * Math.PI / 180;
    const vx = cx + r * Math.cos(rad);
    const vy = cy + r * Math.sin(rad);

    ctx.strokeStyle = getSVOColor(angle);
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(vx, vy);
    ctx.stroke();

    // Arrow head
    const aAngle = Math.atan2(vy - cy, vx - cx);
    ctx.beginPath();
    ctx.moveTo(vx, vy);
    ctx.lineTo(vx - 10 * Math.cos(aAngle - 0.3), vy - 10 * Math.sin(aAngle - 0.3));
    ctx.lineTo(vx - 10 * Math.cos(aAngle + 0.3), vy - 10 * Math.sin(aAngle + 0.3));
    ctx.closePath();
    ctx.fillStyle = getSVOColor(angle);
    ctx.fill();

    // Dot at tip
    ctx.fillStyle = getSVOColor(angle);
    ctx.beginPath();
    ctx.arc(vx, vy, 5, 0, Math.PI * 2);
    ctx.fill();

    // Center dot
    ctx.fillStyle = '#333';
    ctx.beginPath();
    ctx.arc(cx, cy, 4, 0, Math.PI * 2);
    ctx.fill();

    // Angle label
    ctx.fillStyle = '#333';
    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`SVO Angle: ${fmt(angle, 1)}°`, 15, 25);
    ctx.fillStyle = getSVOColor(angle);
    ctx.fillText(`Type: ${getSVOType(angle)}`, 15, 45);
  }

  if (slider) {
    slider.addEventListener('input', () => {
      angle = parseFloat(slider.value);
      if (valDisplay) valDisplay.textContent = fmt(angle, 1) + '°';
      if (typeDisplay) typeDisplay.textContent = getSVOType(angle);
      draw();
    });
  }

  draw();
}


// ==========================================
// 9. CPR GAME SIMULATOR (Module 8)
// ==========================================
function initCPRGame(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  let nPlayers = 5;
  let maxResource = 100;
  let regrowthRate = 0.3;
  let rounds = [];
  let currentResource = maxResource;

  const resultDiv = document.getElementById('cpr-result');
  const historyDiv = document.getElementById('cpr-history');

  window.cprHarvest = function() {
    const harvestInput = document.getElementById('cpr-harvest');
    if (!harvestInput) return;

    const myHarvest = Math.min(parseFloat(harvestInput.value) || 0, currentResource / nPlayers);

    // AI players harvest based on different strategies
    const aiHarvests = [];
    for (let i = 0; i < nPlayers - 1; i++) {
      let h;
      if (i === 0) h = currentResource / nPlayers * 0.5; // Conservative
      else if (i === 1) h = currentResource / nPlayers * 0.8; // Moderate
      else if (i === 2) h = currentResource / nPlayers * 1.0; // Maximizer
      else h = currentResource / nPlayers * 0.3; // Sustainable
      aiHarvests.push(Math.min(h, currentResource / nPlayers));
    }

    const totalHarvest = myHarvest + aiHarvests.reduce((s, h) => s + h, 0);
    const remaining = Math.max(0, currentResource - totalHarvest);
    const regrown = remaining + remaining * regrowthRate;
    const nextResource = Math.min(maxResource, regrown);

    rounds.push({
      round: rounds.length + 1,
      resource: currentResource,
      myHarvest: myHarvest,
      totalHarvest: totalHarvest,
      remaining: remaining,
      afterRegrowth: nextResource
    });

    currentResource = nextResource;

    // Display
    let html = `<strong>Round ${rounds.length} Results:</strong><br>`;
    html += `Resource available: ${fmt(rounds[rounds.length-1].resource, 1)}<br>`;
    html += `Your harvest: ${fmt(myHarvest, 1)}<br>`;
    html += `Total harvested: ${fmt(totalHarvest, 1)}<br>`;
    html += `Remaining: ${fmt(remaining, 1)}<br>`;
    html += `After regrowth (${(regrowthRate*100)}%): ${fmt(nextResource, 1)}<br>`;

    if (currentResource < 10) {
      html += '<br><span style="color:#e74c3c;font-weight:bold">⚠ Resource nearly depleted! This is the Tragedy of the Commons.</span>';
    }

    if (resultDiv) resultDiv.innerHTML = html;

    // History
    if (historyDiv) {
      let hHtml = '<table class="payoff-matrix"><tr><th>Round</th><th>Resource</th><th>Your Take</th><th>Total Take</th><th>After Regrowth</th></tr>';
      rounds.forEach(r => {
        hHtml += `<tr><td>${r.round}</td><td>${fmt(r.resource,1)}</td><td>${fmt(r.myHarvest,1)}</td><td>${fmt(r.totalHarvest,1)}</td><td>${fmt(r.afterRegrowth,1)}</td></tr>`;
      });
      hHtml += '</table>';
      historyDiv.innerHTML = hHtml;
    }
  };

  window.cprReset = function() {
    currentResource = maxResource;
    rounds = [];
    if (resultDiv) resultDiv.innerHTML = 'Start harvesting to begin the simulation.';
    if (historyDiv) historyDiv.innerHTML = '';
  };
}


// ==========================================
// 10. PROBABILITY VISUALIZER (Module 5)
// ==========================================
function initProbabilityViz(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;

  let nTrials = 100;
  let prob = 0.5;

  const nSlider = document.getElementById('prob-n');
  const pSlider = document.getElementById('prob-p');
  const nVal = document.getElementById('prob-n-val');
  const pVal = document.getElementById('prob-p-val');
  const rollBtn = document.getElementById('prob-roll');

  function binomialPMF(n, k, p) {
    let coeff = 1;
    for (let i = 0; i < k; i++) {
      coeff *= (n - i) / (i + 1);
    }
    return coeff * Math.pow(p, k) * Math.pow(1 - p, n - k);
  }

  function drawDistribution() {
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, W, H);

    const pad = { l: 50, r: 20, t: 30, b: 50 };
    const plotW = W - pad.l - pad.r;
    const plotH = H - pad.t - pad.b;

    // Find max PMF for scaling
    let maxPMF = 0;
    const n = Math.min(nTrials, 50); // Cap display at 50
    const pmfs = [];
    for (let k = 0; k <= n; k++) {
      const p_k = binomialPMF(n, k, prob);
      pmfs.push(p_k);
      if (p_k > maxPMF) maxPMF = p_k;
    }

    // Axes
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(pad.l, pad.t);
    ctx.lineTo(pad.l, H - pad.b);
    ctx.lineTo(W - pad.r, H - pad.b);
    ctx.stroke();

    // Bars
    const barW = Math.max(2, plotW / (n + 1) - 1);
    for (let k = 0; k <= n; k++) {
      const x = pad.l + (k / (n + 1)) * plotW + 1;
      const h = (pmfs[k] / (maxPMF * 1.1)) * plotH;
      const y = H - pad.b - h;

      ctx.fillStyle = '#3498db';
      ctx.globalAlpha = 0.7;
      ctx.fillRect(x, y, barW, h);
      ctx.globalAlpha = 1;
      ctx.strokeStyle = '#2980b9';
      ctx.lineWidth = 1;
      ctx.strokeRect(x, y, barW, h);
    }

    // X-axis labels
    ctx.fillStyle = '#666';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'center';
    const labelStep = n <= 20 ? 1 : Math.ceil(n / 10);
    for (let k = 0; k <= n; k += labelStep) {
      const x = pad.l + (k / (n + 1)) * plotW + barW/2;
      ctx.fillText(k, x, H - pad.b + 15);
    }
    ctx.fillText('k (successes)', pad.l + plotW/2, H - 10);

    // Y-axis labels
    ctx.textAlign = 'right';
    const ySteps = 5;
    for (let i = 0; i <= ySteps; i++) {
      const v = (maxPMF * 1.1) * i / ySteps;
      const y = H - pad.b - (i / ySteps) * plotH;
      ctx.fillText(fmt(v, 3), pad.l - 5, y + 3);
    }

    // Stats
    const mean = nTrials * prob;
    const variance = nTrials * prob * (1 - prob);
    ctx.fillStyle = '#333';
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`Binomial(n=${nTrials}, p=${fmt(prob,2)})`, pad.l + 5, pad.t + 15);
    ctx.font = '11px sans-serif';
    ctx.fillText(`Mean = ${fmt(mean,2)}, Variance = ${fmt(variance,2)}, SD = ${fmt(Math.sqrt(variance),2)}`, pad.l + 5, pad.t + 32);
  }

  if (nSlider) nSlider.addEventListener('input', () => {
    nTrials = parseInt(nSlider.value);
    if (nVal) nVal.textContent = nTrials;
    drawDistribution();
  });

  if (pSlider) pSlider.addEventListener('input', () => {
    prob = parseFloat(pSlider.value);
    if (pVal) pVal.textContent = fmt(prob, 2);
    drawDistribution();
  });

  if (rollBtn) rollBtn.addEventListener('click', () => {
    // Simulate and overlay results
    drawDistribution();

    const n = Math.min(nTrials, 50);
    const pad = { l: 50, r: 20, t: 30, b: 50 };
    const plotW = W - pad.l - pad.r;
    const plotH = H - pad.t - pad.b;
    const barW = Math.max(2, plotW / (n + 1) - 1);

    // Simulate 1000 experiments
    const counts = new Array(n + 1).fill(0);
    const experiments = 1000;
    for (let i = 0; i < experiments; i++) {
      let successes = 0;
      for (let j = 0; j < nTrials; j++) {
        if (Math.random() < prob) successes++;
      }
      if (successes <= n) counts[successes]++;
    }

    // Find max for scaling
    let maxPMF = 0;
    for (let k = 0; k <= n; k++) {
      const p_k = binomialPMF(n, k, prob);
      if (p_k > maxPMF) maxPMF = p_k;
    }

    // Overlay simulated frequencies
    let maxFreq = Math.max(...counts) / experiments;
    const scale = maxPMF * 1.1;

    ctx.fillStyle = '#e74c3c';
    ctx.globalAlpha = 0.4;
    for (let k = 0; k <= n; k++) {
      const freq = counts[k] / experiments;
      const x = pad.l + (k / (n + 1)) * plotW + 1;
      const h = (freq / scale) * plotH;
      const y = H - pad.b - h;
      ctx.fillRect(x + barW * 0.2, y, barW * 0.6, h);
    }
    ctx.globalAlpha = 1;

    // Legend
    ctx.font = '11px sans-serif';
    ctx.fillStyle = '#e74c3c';
    ctx.textAlign = 'right';
    ctx.fillText('Red = simulated (1000 runs)', W - pad.r - 5, pad.t + 15);
  });

  drawDistribution();
}


// ==========================================
// INITIALIZATION
// ==========================================
function initVisualizations() {
  // Skip if the page has its own inline visualizations (e.g., Module 7)
  if (window._customVizInit) return;

  // Module 1
  initFunctionPlotter('func-plotter');

  // Module 2
  initMatrixCalculator('matrix-calc');

  // Module 3
  initDerivativeViz('deriv-canvas');

  // Module 4
  initPhasePortrait('phase-canvas');

  // Module 5
  initProbabilityViz('prob-canvas');

  // Module 6
  initNashFinder('nash-finder');

  // Module 7
  initReplicatorDynamics('rep-bar-canvas', 'rep-time-canvas');
  initSimplexPlot('simplex-canvas');

  // Module 8
  initSVORing('svo-canvas');
  initCPRGame('cpr-game');
}
