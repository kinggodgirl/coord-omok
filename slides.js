/* 수업 슬라이드 (교사 화면 📽 수업 슬라이드)
   kind: title(표지) · goal(학습목표) · join(접속 안내 + QR) · fig(설명 + 그림, 단계별로 나타남) · ask(학생 의견 받기) · text(글)
   steps: 이 장에서 → 키를 누를 때마다 하나씩 나타나는 단계 수. 글이나 그림에서 data-s="n" 인 것은 n단계에 나타나고, data-h="n" 인 것은 n단계에 사라져요.
   글 속 <b>…</b> 는 주황 강조, <span class="m">…</span> 는 Times 글꼴(좌표), <span class="blank">답</span> 은 빈칸(누르면 답이 보임)
   교사 화면에서 ✏ 로 고친 글은 그 브라우저에 따로 저장되고, 이 파일은 기본값입니다. */
window.DEFAULT_SLIDES = [
  { id: 'cover', kind: 'title', kicker: 'Ⅳ. 좌표평면과 그래프', title: '순서쌍과 좌표', sub: '좌표평면 오목' },
  { id: 'goal', kind: 'goal', title: '학습목표', tag: '학습목표',
    now: '<b>순서쌍</b>과 <b>좌표</b>를 이해하고, 좌표평면 위에 <b>점을 나타낼</b> 수 있다.' },
  { id: 'join', kind: 'join', title: '수업에 들어와요', tag: '준비',
    body: '패드로 <b>QR 코드</b>를 찍거나 주소를 열고,<br><b>번호와 이름</b>, <b>수업 코드</b>를 넣으세요.<br><br><span style="font-size:30px;color:#6b6f78">예) 7 김민지</span>' },
  { id: 'quad', kind: 'fig', fig: 'quad', steps: 2, title: '사분면', tag: '개념',
    body: '<p>좌표평면은 <b>좌표축</b>에 의해 네 부분으로 나뉘어요.</p>'
      + '<p data-s="1">오른쪽 위부터 <b>시계 반대 방향</b>으로<br>제1사분면, 제2사분면, 제3사분면, 제4사분면이라고 해요.</p>'
      + '<p data-s="2">같은 사분면 위의 점은 x좌표, y좌표의 <b>부호</b>가 같아요.</p>' },
  { id: 'axis', kind: 'ask', fig: 'axis', title: 'x축 위의 점은?', tag: '생각 모으기',
    q: 'x축 위의 점 <span class="m">P(3, 0)</span>은 어느 사분면에 속할까요?',
    hint: '고르고, 그렇게 생각한 까닭도 짧게 써 보세요.',
    options: ['제1사분면', '제4사분면', '제1사분면과 제4사분면 둘 다', '어느 사분면에도 속하지 않는다'], answer: 3,
    explain: '점 P(3, 0)의 y좌표 0은 양수도 음수도 아니에요. 좌표축 위의 점은 어느 사분면에도 속하지 않아요.' },
  { id: 'read', kind: 'fig', fig: 'read', steps: 3, title: '점의 좌표 읽기', tag: '개념',
    body: '<p>점 P의 좌표는 어떻게 읽을까요?</p>'
      + '<p data-s="1">① 점 P에서 <b>x축</b>에 수선을 그으면 <span class="m">3</span> → <b>x좌표</b></p>'
      + '<p data-s="2">② 점 P에서 <b>y축</b>에 수선을 그으면 <span class="m">2</span> → <b>y좌표</b></p>'
      + '<p data-s="3">③ <span class="m">P(3, 2)</span><br><span style="font-size:30px;color:#6b6f78">(x좌표, y좌표) 순서로 써요. <span class="m">(2, 3)</span>과는 다른 점!</span></p>' },
  { id: 'plot', kind: 'fig', fig: 'plot', steps: 3, title: '좌표에 맞춰 점 찍기', tag: '개념',
    body: '<p>점 <span class="m">A(−2, −3)</span>을 찍어 볼까요?</p>'
      + '<p data-s="1">① 원점 O에서 x좌표 <span class="m">−2</span> → <b>왼쪽</b>으로 2칸<br><span style="font-size:28px;color:#6b6f78">(양수면 오른쪽)</span></p>'
      + '<p data-s="2">② y좌표 <span class="m">−3</span> → <b>아래</b>로 3칸<br><span style="font-size:28px;color:#6b6f78">(양수면 위)</span></p>'
      + '<p data-s="3">③ 그 자리에 점을 찍어요.</p>' },
  { id: 'game', kind: 'text', title: '좌표평면 오목', tag: '활동',
    body: '<p>① 4명이 <b>흑돌 조</b>·<b>백돌 조</b>로 나뉘고, 조마다 <b>말하는 사람</b>·<b>찍는 사람</b>을 정해요.</p>'
      + '<p>② 말하는 사람은 패드에서 몰래 고른 자리의 <b>좌표만 말해요</b>.</p>'
      + '<p>③ 찍는 사람은 들은 좌표에 <b>점만 찍어요</b>. 다르게 찍으면 차례를 잃어요.</p>'
      + '<p>④ 먼저 <b>4개를 한 줄로</b> 놓는 조가 이겨요.</p>'
      + '<p class="note">패드에서 [👥 2:2 방 만들기] → 방 코드를 친구에게 알려 주세요.</p>' },
];

/* 슬라이드 그림 (교과서형: 흰 바탕, 검은 축, Times 글꼴, 그림에 비해 큰 글자) */
window.SLIDE_FIGS = (function () {
  const R = 5, C = 58, M = 62, FS = 30, SIZE = M * 2 + C * 2 * R, O = M + R * C;
  const X = x => O + x * C, Y = y => O - y * C;
  const T = `font-family="'Times New Roman','STIX Two Text',Times,serif"`;
  const K = `font-family="'Noto Sans KR',sans-serif"`;
  const ACC = '#f07c1e';
  const fmt = n => (n < 0 ? '−' + (-n) : String(n));
  const wrap = (inner, o) => `<svg viewBox="0 0 ${SIZE} ${SIZE}" xmlns="http://www.w3.org/2000/svg" role="img"><rect width="${SIZE}" height="${SIZE}" fill="#fff"/>`
    + CoordKit.planeSVG({ r: R, cell: C, margin: M, fs: FS, thick: true, numbers: !(o && o.noNum) }) + inner + '</svg>';
  const dot = (x, y, s) => `<circle ${s != null ? `data-s="${s}"` : ''} cx="${X(x)}" cy="${Y(y)}" r="10" fill="#111"/>`;
  /* o: {s: 나타나는 단계, h: 사라지는 단계, fill, anchor} */
  const lab = (x, y, t, dx, dy, o) => { o = o || {}; return `<text ${o.s != null ? `data-s="${o.s}"` : ''} ${o.h != null ? `data-h="${o.h}"` : ''} ${T} x="${X(x) + dx}" y="${Y(y) + dy}" text-anchor="${o.anchor || 'start'}" font-size="${FS * 1.35}" fill="${o.fill || '#111'}" stroke="#fff" stroke-width="7" paint-order="stroke">${t}</text>`; };
  const dash = (x1, y1, x2, y2, s) => `<line data-s="${s}" x1="${X(x1)}" y1="${Y(y1)}" x2="${X(x2)}" y2="${Y(y2)}" stroke="#111" stroke-width="3" stroke-dasharray="2 9" stroke-linecap="round"/>`;
  /* 축의 눈금 숫자를 주황색으로 크게 강조 (planeSVG 눈금 숫자와 같은 자리) */
  const hiX = (v, s) => `<text data-s="${s}" ${T} x="${X(v)}" y="${O + FS * 1.12}" text-anchor="middle" font-size="${FS * 1.45}" font-weight="700" fill="${ACC}" stroke="#fff" stroke-width="8" paint-order="stroke">${fmt(v)}</text>`;
  const hiY = (v, s) => `<text data-s="${s}" ${T} x="${O - FS * 0.3}" y="${Y(v) + FS * 0.5}" text-anchor="end" font-size="${FS * 1.45}" font-weight="700" fill="${ACC}" stroke="#fff" stroke-width="8" paint-order="stroke">${fmt(v)}</text>`;
  function arrow(x1, y1, x2, y2, s) {
    const a = X(x1), b = Y(y1), c = X(x2), d = Y(y2), L = Math.hypot(c - a, d - b), ux = (c - a) / L, uy = (d - b) / L, h = 26, w = 13;
    const bx = c - ux * h, by = d - uy * h;
    return `<g data-s="${s}"><line x1="${a}" y1="${b}" x2="${bx}" y2="${by}" stroke="${ACC}" stroke-width="9" stroke-linecap="round"/>`
      + `<polygon fill="${ACC}" points="${c},${d} ${bx - uy * w},${by + ux * w} ${bx + uy * w},${by - ux * w}"/></g>`;
  }
  return {
    quad() {
      const q = [[2.6, 2.6, '제1사분면', '(+, +)'], [-2.6, 2.6, '제2사분면', '(−, +)'], [-2.6, -2.6, '제3사분면', '(−, −)'], [2.6, -2.6, '제4사분면', '(+, −)']];
      let s = '';
      q.forEach(([x, y, n, g]) => {
        s += `<text data-s="1" ${K} x="${X(x)}" y="${Y(y) - 6}" text-anchor="middle" font-size="40" font-weight="700" fill="#111" stroke="#fff" stroke-width="8" paint-order="stroke">${n}</text>`;
        s += `<text data-s="2" ${T} x="${X(x)}" y="${Y(y) + 52}" text-anchor="middle" font-size="46" fill="${ACC}" stroke="#fff" stroke-width="8" paint-order="stroke">${g}</text>`;
      });
      return wrap(s, { noNum: true });
    },
    axis() { return wrap(dot(3, 0) + lab(3, 0, 'P', 10, -16)); },
    read() {
      return wrap(dash(3, 2, 3, 0, 1) + hiX(3, 1) + dash(3, 2, 0, 2, 2) + hiY(2, 2) + dot(3, 2)
        + lab(3, 2, 'P', 14, -14, { h: 3 }) + lab(3, 2, 'P(3, 2)', 14, -14, { s: 3, fill: ACC }));
    },
    plot() {
      return wrap(`<circle cx="${X(0)}" cy="${Y(0)}" r="9" fill="${ACC}"/>` + arrow(0, 0, -2, 0, 1) + arrow(-2, 0, -2, -3, 2) + dot(-2, -3, 3)
        + lab(-2, -3, 'A(' + fmt(-2) + ', ' + fmt(-3) + ')', -14, 48, { s: 3, fill: ACC, anchor: 'end' }));
    }
  };
})();
