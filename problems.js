/* 좌표평면 오목 — 공용: 교과서형 좌표평면 그림 + 좌표 퀴즈 생성기 (학생·교사 페이지가 함께 씀) */
(function () {
  const MINUS = '−';
  const FONT = `font-family="'Times New Roman','STIX Two Text',Times,serif"`;
  const fmt = n => (n < 0 ? MINUS + (-n) : String(n));
  const pt = (a, b) => '(' + fmt(a) + ', ' + fmt(b) + ')';
  const ri = (lo, hi) => lo + Math.floor(Math.random() * (hi - lo + 1));
  const nz = r => { let v = 0; while (v === 0) v = ri(-r, r); return v; };
  const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

  /* 교과서형 좌표평면: 흰 바탕, 옅은 모눈, 검은 굵은 축 + 양의 방향 화살표, x·y 이탤릭, O·눈금 숫자 정자체 */
  function planeSVG(o) {   // o.numbers === false 면 눈금 숫자 없음 (상 단계)
    const r = o.r, c = o.cell, m = o.margin, fs = o.fs || 22;
    const C = m + r * c, X = x => C + x * c, Y = y => C - y * c;
    const th = o.thick ? 1.9 : 1;   // 프로젝터용 굵은 선
    const lw = Math.max(1.6, c / 24) * th;
    let s = '', lab = '';
    if (o.grid !== false) {
      s += `<g stroke="${o.thick ? '#9a9a9a' : '#c9c9c9'}" stroke-width="${(Math.max(1, c / 45) * (o.thick ? 1.8 : 1)).toFixed(2)}">`;
      for (let i = -r; i <= r; i++) {
        s += `<line x1="${X(i)}" y1="${Y(-r)}" x2="${X(i)}" y2="${Y(r)}"/><line x1="${X(-r)}" y1="${Y(i)}" x2="${X(r)}" y2="${Y(i)}"/>`;
      }
      s += '</g>';
    }
    const ext = c * 0.62, ah = c * 0.3 * (o.thick ? 1.25 : 1), aw = c * 0.13 * (o.thick ? 1.25 : 1);
    const tx = X(r) + ext, ty = Y(r) - ext;
    s += `<g stroke="#111" stroke-width="${lw}" fill="none" stroke-linecap="butt">` +
      `<line x1="${X(-r) - c * 0.4}" y1="${C}" x2="${tx - ah * 0.5}" y2="${C}"/>` +
      `<line x1="${C}" y1="${Y(-r) + c * 0.4}" x2="${C}" y2="${ty + ah * 0.5}"/></g>`;
    s += `<polygon fill="#111" points="${tx},${C} ${tx - ah},${C - aw} ${tx - ah * 0.72},${C} ${tx - ah},${C + aw}"/>`;
    s += `<polygon fill="#111" points="${C},${ty} ${C - aw},${ty + ah} ${C},${ty + ah * 0.72} ${C + aw},${ty + ah}"/>`;
    const s0 = s.length;
    s += `<g ${FONT} font-size="${fs}" fill="#111" stroke="#fff" stroke-width="${(fs * 0.24).toFixed(1)}" paint-order="stroke" stroke-linejoin="round">`;
    s += `<text x="${tx - ah * 0.2}" y="${C + fs * 1.15}" text-anchor="middle" font-style="italic" font-size="${fs * 1.15}">x</text>`;
    s += `<text x="${C + fs * 0.7}" y="${ty + fs * 0.5}" text-anchor="middle" font-style="italic" font-size="${fs * 1.15}">y</text>`;
    s += `<text x="${C - fs * 0.42}" y="${C + fs * 1.05}" text-anchor="middle">O</text>`;
    if (o.numbers !== false) {
      for (let i = -r; i <= r; i++) {
        if (i === 0) continue;
        s += `<text x="${X(i)}" y="${C + fs * 1.05}" text-anchor="middle">${fmt(i)}</text>`;
        s += `<text x="${C - fs * 0.3}" y="${Y(i) + fs * 0.36}" text-anchor="end">${fmt(i)}</text>`;
      }
    }
    s += '</g>';
    if (o.part === 'base') return s.slice(0, s0);
    if (o.part === 'labels') return s.slice(s0);
    return s;
  }

  /* 퀴즈 그림 (점 + 이름표). 점 이름은 정자체 */
  function quizFigSVG(fig, thick) {
    const r = fig.r || 5, c = 38, m = 46, fs = 22, size = m * 2 + c * 2 * r, C = m + r * c;
    let s = `<svg viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg" role="img">` +
      `<rect width="${size}" height="${size}" fill="#fff"/>` + planeSVG({ r, cell: c, margin: m, fs, thick });
    (fig.pts || []).forEach(p => {
      const x = C + p.x * c, y = C - p.y * c;
      s += `<circle cx="${x}" cy="${y}" r="${thick ? 7.5 : 5.5}" fill="#111"/>`;
      const dx = p.x < 0 ? -1 : 1, dy = p.y < 0 ? 1 : -1;
      if (p.label) s += `<text ${FONT} x="${x + dx * 9}" y="${y + dy * 9 + (dy > 0 ? fs * 0.8 : 0)}" text-anchor="${dx < 0 ? 'end' : 'start'}" font-size="${fs * 1.2}" fill="#111" stroke="#fff" stroke-width="5" paint-order="stroke">${p.label}</text>`;
    });
    return s + '</svg>';
  }

  function quadName(a, b) {
    if (a === 0 || b === 0) return '어느 사분면에도 속하지 않는다';
    if (a > 0 && b > 0) return '제1사분면';
    if (a < 0 && b > 0) return '제2사분면';
    if (a < 0 && b < 0) return '제3사분면';
    return '제4사분면';
  }
  const sign = v => (v > 0 ? '양수' : '음수');

  const TYPES = { readP: '점의 좌표 읽기', plot: '좌표로 점 찾기', quad: '어느 사분면?' };

  function makeQuiz(type) {
    if (!TYPES[type]) type = ['readP', 'plot', 'quad'][ri(0, 2)];
    if (type === 'readP') {
      let a, b; do { a = nz(4); b = nz(4); } while (Math.abs(a) === Math.abs(b));
      const wrong = shuffle([[b, a], [-a, b], [a, -b], [-a, -b], [-b, -a]]).slice(0, 3);
      const opts = shuffle([[a, b]].concat(wrong));
      return {
        type, q: '다음 좌표평면 위의 점 P의 좌표를 고르시오.', fig: { r: 5, pts: [{ x: a, y: b, label: 'P' }] },
        options: opts.map(o => pt(o[0], o[1])), answer: opts.findIndex(o => o[0] === a && o[1] === b),
        explain: `점 P에서 x축에 수선을 그으면 ${fmt(a)}, y축에 수선을 그으면 ${fmt(b)}를 만나요. 그래서 P${pt(a, b)}예요. 순서쌍은 (x좌표, y좌표) 순서!`
      };
    }
    if (type === 'plot') {
      let a, b; do { a = nz(4); b = nz(4); } while (Math.abs(a) === Math.abs(b));
      const cand = shuffle([[a, b], [b, a], [-a, b], [a, -b]]);
      const labels = ['A', 'B', 'C', 'D'];
      const pts = cand.map((p, i) => ({ x: p[0], y: p[1], label: labels[i] }));
      const ans = cand.findIndex(p => p[0] === a && p[1] === b);
      return {
        type, q: `좌표가 ${pt(a, b)}인 점을 고르시오.`, fig: { r: 5, pts },
        options: labels.map(l => '점 ' + l), answer: ans,
        explain: `원점 O에서 x축 방향으로 ${fmt(a)}, y축 방향으로 ${fmt(b)}만큼 간 곳이 점 ${labels[ans]}예요.`
      };
    }
    let a, b;
    if (Math.random() < 0.2) { if (Math.random() < 0.5) { a = nz(6); b = 0; } else { a = 0; b = nz(6); } }
    else { a = nz(6); b = nz(6); }
    const options = ['제1사분면', '제2사분면', '제3사분면', '제4사분면', '어느 사분면에도 속하지 않는다'];
    const name = quadName(a, b);
    const explain = (a === 0 || b === 0)
      ? `${pt(a, b)}은 ${a === 0 ? 'y축' : 'x축'} 위의 점이라 어느 사분면에도 속하지 않아요.`
      : `x좌표는 ${sign(a)}, y좌표는 ${sign(b)}이므로 ${name} 위의 점이에요.`;
    return { type: 'quad', q: `점 ${pt(a, b)}은 어디에 있는지 고르시오.`, fig: null, options, answer: options.indexOf(name), explain };
  }

  /* 찍기 실수 유형: 말한 좌표 s, 찍은 좌표 t */
  const MISS = {
    swap: { name: 'x·y 바꿈', tip: 'x좌표와 y좌표가 서로 바뀌었어요. 순서쌍은 (x좌표, y좌표) — 앞의 수가 가로(x축) 방향이에요.' },
    signx: { name: 'x 부호 반대', tip: 'x좌표의 부호가 반대예요. 원점 O보다 오른쪽이면 양수, 왼쪽이면 음수예요.' },
    signy: { name: 'y 부호 반대', tip: 'y좌표의 부호가 반대예요. 원점 O보다 위쪽이면 양수, 아래쪽이면 음수예요.' },
    signxy: { name: '두 부호 반대', tip: 'x좌표와 y좌표의 부호가 모두 반대예요. 원점 O에서 어느 쪽으로 가는지 부호를 먼저 보세요.' },
    near: { name: '한 칸 어긋남', tip: '한 칸 어긋났어요. 원점 O에서부터 눈금을 하나씩 세어 보세요.' },
    other: { name: '다른 곳', tip: '많이 다른 곳이에요. 좌표를 천천히 다시 확인해 보세요. (x좌표 먼저, 그다음 y좌표)' }
  };
  function missType(s, t) {
    if (t.x === s.y && t.y === s.x && s.x !== s.y) return 'swap';
    if (t.x === -s.x && t.y === s.y && s.x !== 0) return 'signx';
    if (t.y === -s.y && t.x === s.x && s.y !== 0) return 'signy';
    if (t.x === -s.x && t.y === -s.y && s.x !== 0 && s.y !== 0) return 'signxy';
    if (Math.max(Math.abs(t.x - s.x), Math.abs(t.y - s.y)) === 1) return 'near';
    return 'other';
  }
  /* 이름을 '번호 이름' 꼴로: "7김민지", "07번 김 민지" → "7 김민지". 번호가 없으면 null */
  function normName(raw) {
    const m = String(raw || '').trim().match(/^(\d{1,2})\s*번?\s*(.+)$/);
    if (!m) return null;
    const nm = m[2].replace(/\s+/g, '').slice(0, 8);
    if (!nm) return null;
    return (+m[1]) + ' ' + nm;
  }

  window.CoordKit = { fmt, pt, planeSVG, quizFigSVG, makeQuiz, TYPES, MINUS, MISS, missType, normName };
})();
