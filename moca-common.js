/* 부산현대미술관 공통 스크립트: 화면 설정 패널 + 설정 버튼 + 자주 찾는 페이지 바로가기
   모든 페이지에서 같은 설정이 적용되고(localStorage), 페이지를 옮겨도 유지됩니다. */
(function () {
  var root = document.documentElement;
  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  };

  /* 글자 크기 + 굵기(부산모카 레귤러 / 미디엄 / 볼드) */
  var SIZES = [
    { fz: '1',   fw: '400', label: '기본',     s: '15px', w: 400 },
    { fz: '1.1', fw: '500', label: '크게',     s: '19px', w: 500 },
    { fz: '1.2', fw: '700', label: '아주 크게', s: '23px', w: 700 }
  ];
  /* M.I. 상징색채 조합 */
  var MODES = [
    { id: '',      label: '기본',            sw: '#fff' },
    { id: 'k-w',   label: '흑 + 백',          sw: 'linear-gradient(90deg,#0f1612 50%,#ffffff 50%)' },
    { id: 'k-lg',  label: '흑 + 연회',        sw: 'linear-gradient(90deg,#0f1612 50%,#c9d1ce 50%)' },
    { id: 'w-dg',  label: '백 + 진회',        sw: 'linear-gradient(90deg,#ffffff 50%,#3c423f 50%)' },
    { id: 'k-ng',  label: '흑 + 네온그린',    sw: 'linear-gradient(90deg,#0f1612 50%,#ceff88 50%)' },
    { id: 'w-g',   label: '백 + 선록~그린',   sw: 'linear-gradient(90deg,#ffffff 34%,#65e200 34% 67%,#39b034 67%)' },
    { id: 'dg-g',  label: '진회~연회 + 선록·그린', sw: 'linear-gradient(90deg,#3c423f 34%,#c9d1ce 34% 67%,#65e200 67%)' }
  ];
  var LINKS = [
    { t: '현재 전시', h: 'exhibition.html#current' },
    { t: '프로그램',  h: 'index.html#events', nolink: 1 },
    { t: '공지사항',  h: 'index.html#notice', nolink: 1 },
    { t: '관람 안내', h: 'index.html#visit' },
    { t: '소장품',    h: 'index.html#collection' },
    { t: '뮤지엄숍',  h: 'index.html#store' }
  ];
  var QUICK = [LINKS[0], LINKS[1], LINKS[2], LINKS[3]];

  var gear = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><path d="M4 7h10M18 7h2M4 17h2M10 17h10"/><circle cx="16" cy="7" r="2.2"/><circle cx="8" cy="17" r="2.2"/></svg>';

  function build() {
    if (document.getElementById('setPanel')) return;
    var body = document.body;

    var fab = document.createElement('button');
    fab.className = 'set-fab' + (document.getElementById('aiBtn') ? '' : ' no-ai');
    fab.id = 'setBtn'; fab.type = 'button';
    fab.setAttribute('aria-label', '화면 설정 열기');
    fab.setAttribute('aria-expanded', 'false');
    fab.setAttribute('aria-controls', 'setPanel');
    fab.innerHTML = gear + '<span>화면설정</span>';
    body.appendChild(fab);

    var qn = document.createElement('nav');
    qn.className = 'side-quick';
    qn.setAttribute('aria-label', '자주 찾는 페이지');
    qn.innerHTML = QUICK.map(function (l) { return '<a href="' + (l.nolink ? '#' : l.h) + '"' + (l.nolink ? ' data-nolink="1"' : '') + '>' + l.t + '</a>'; }).join('');
    /* 아직 연결 페이지가 없는 바로가기는 클릭해도 이동하지 않음 */
    qn.addEventListener('click', function (e) { var a = e.target.closest && e.target.closest('a[data-nolink]'); if (a) e.preventDefault(); });
    body.appendChild(qn);

    var p = document.createElement('aside');
    p.className = 'set-panel'; p.id = 'setPanel';
    p.setAttribute('role', 'dialog'); p.setAttribute('aria-label', '화면 설정'); p.setAttribute('aria-hidden', 'true');
    p.innerHTML =
      '<button class="set-close" id="setClose" type="button" aria-label="화면 설정 닫기"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M5 5l14 14M19 5L5 19"/></svg></button>' +
      '<h2>안녕하세요? 부산현대미술관입니다.</h2>' +
      '<p class="set-desc">아래 옵션을 조정하여 나에게 꼭 맞는 탐색 환경을 만들어 보세요. 설정은 다른 페이지로 이동해도 그대로 유지됩니다.</p>' +
      '<div class="set-group"><h3>글자 크기 · 굵기</h3><div class="set-size" id="setSize">' +
      SIZES.map(function (z) {
        return '<button type="button" data-fz="' + z.fz + '" style="--s:' + z.s + ';--w:' + z.w + '" aria-label="글자 ' + z.label + '"><b>가</b><small>' + z.label + '</small></button>';
      }).join('') + '</div></div>' +
      '<div class="set-group"><h3>색상 조합</h3><div class="set-mode" id="setMode">' +
      MODES.map(function (m) {
        return '<button type="button" data-mode="' + m.id + '"><i style="background:' + m.sw + '"></i>' + m.label + '</button>';
      }).join('') + '</div></div>' +
      '<div class="set-group"><h3>바로가기</h3><div class="set-links">' +
      LINKS.map(function (l) { return '<a href="' + l.h + '">' + l.t + '</a>'; }).join('') + '</div></div>' +
      '<button class="set-reset" id="setReset" type="button">설정 초기화</button>';
    body.appendChild(p);
  }

  function init() {
    build();
    var setBtn = document.getElementById('setBtn');
    var setPanel = document.getElementById('setPanel');
    var sizeBtns = [].slice.call(document.querySelectorAll('#setSize button'));
    var modeBtns = [].slice.call(document.querySelectorAll('#setMode button'));

    function openPanel(open) {
      setPanel.classList.toggle('open', open);
      setPanel.setAttribute('aria-hidden', String(!open));
      setBtn.setAttribute('aria-expanded', String(open));
      if (open) document.getElementById('setClose').focus({ preventScroll: true });
      else setBtn.focus({ preventScroll: true });
    }
    function setSize(fz) {
      var z = SIZES.filter(function (s) { return s.fz === fz; })[0] || SIZES[0];
      root.style.setProperty('--fz', z.fz);
      if (z.fw === '400') root.removeAttribute('data-fw'); else root.setAttribute('data-fw', z.fw);
      sizeBtns.forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.fz === z.fz)); });
      store.set('moca-fz', z.fz);
    }
    function setMode(mode) {
      if (!MODES.some(function (m) { return m.id === mode; })) mode = '';
      if (mode) root.setAttribute('data-mode', mode); else root.removeAttribute('data-mode');
      modeBtns.forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.mode === mode)); });
      store.set('moca-mode', mode);
    }

    setBtn.onclick = function () { openPanel(!setPanel.classList.contains('open')); };
    document.getElementById('setClose').onclick = function () { openPanel(false); };
    document.getElementById('setReset').onclick = function () { setSize('1'); setMode(''); };
    sizeBtns.forEach(function (b) { b.onclick = function () { setSize(b.dataset.fz); }; });
    modeBtns.forEach(function (b) { b.onclick = function () { setMode(b.dataset.mode); }; });
    [].forEach.call(setPanel.querySelectorAll('.set-links a'), function (a) { a.addEventListener('click', function () { openPanel(false); }); });
    addEventListener('keydown', function (e) { if (e.key === 'Escape' && setPanel.classList.contains('open')) openPanel(false); });
    addEventListener('pointerdown', function (e) {
      if (setPanel.classList.contains('open') && !setPanel.contains(e.target) && !setBtn.contains(e.target)) openPanel(false);
    });
    setSize(store.get('moca-fz') || '1');
    setMode(store.get('moca-mode') || '');
  }

  /* 저장된 설정을 화면이 그려지기 전에 먼저 적용해서 깜박임을 줄임 */
  try {
    var m0 = store.get('moca-mode'), z0 = store.get('moca-fz');
    if (m0) root.setAttribute('data-mode', m0);
    if (z0) { root.style.setProperty('--fz', z0); if (z0 === '1.1') root.setAttribute('data-fw', '500'); if (z0 === '1.2') root.setAttribute('data-fw', '700'); }
  } catch (e) {}

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
