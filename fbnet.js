/* =========================================================
   fbnet.js — Firebase Realtime Database 위에서 '연결'을 흉내 내는 작은 도구
   (예전 PeerJS 직접 연결을 대신함. 기기끼리 직접 잇지 않고 모두 Firebase를 거침)

   여는 쪽(교사 화면, 방장)   FBNet.hub(path, {onMsg(dev, m), onPresence(dev, on, info)})
   들어가는 쪽(학생, 참가자)  FBNet.client(path, dev, {info, presence, onMsg(m), onView(v), onState(ok)})
   자리 차지(코드 중복 방지)  FBNet.claim(path, id)  → Promise<true|false>

   path 아래 구조
     hub        여는 쪽이 차지한 표시 (끊기면 자동으로 지워짐)
     up/…       들어가는 쪽 → 여는 쪽 메시지 (여는 쪽이 읽고 지움)
     dm/{dev}/… 여는 쪽 → 특정 기기 메시지
     down/…     여는 쪽 → 모두에게 (최근 것만 남김)
     view/{dev} 여는 쪽이 기기마다 덮어쓰는 최신 화면 상태
     mem/{dev}  접속 표시 {on, name, …}
   메시지는 JSON 글자로 저장해서 빈 배열·빈 객체가 사라지지 않게 함
========================================================= */
window.FBNet = (function () {
  const ok = !!(window.firebase && window.FB_CONFIG && FB_CONFIG.apiKey && FB_CONFIG.databaseURL);
  let db = null;
  if (ok) { try { if (!firebase.apps || !firebase.apps.length) firebase.initializeApp(FB_CONFIG); db = firebase.database(); } catch (e) { console.error(e); } }
  const TS = ok ? firebase.database.ServerValue.TIMESTAMP : 0;
  let offset = 0;
  if (db) db.ref('.info/serverTimeOffset').on('value', s => { offset = +s.val() || 0; });
  const now = () => Date.now() + offset;
  const J = m => JSON.stringify(m === undefined ? null : m);
  const P = j => { try { return JSON.parse(j); } catch (e) { return null; } };
  const connCbs = [];
  let connected = false;
  if (db) db.ref('.info/connected').on('value', s => { connected = !!s.val(); connCbs.slice().forEach(f => { try { f(connected); } catch (e) { console.error(e); } }); });
  function onConnected(cb) { connCbs.push(cb); if (db) cb(connected); return () => { const i = connCbs.indexOf(cb); if (i >= 0) connCbs.splice(i, 1); }; }

  /* 자리 차지: 비어 있거나 내 것(같은 id)이면 차지. 내 연결이 끊기면 자동으로 비워짐 */
  function claim(path, id) {
    if (!db) return Promise.resolve(false);
    const ref = db.ref(path);
    return ref.transaction(cur => (cur == null || cur.id === id) ? { id, t: Date.now() } : undefined, null, false)
      .then(r => { if (r.committed) { ref.onDisconnect().remove(); return true; } return false; })
      .catch(() => false);
  }
  function release(path) { if (!db) return; const ref = db.ref(path); try { ref.onDisconnect().cancel(); } catch (e) { } ref.remove().catch(() => { }); }
  function exists(path) { if (!db) return Promise.resolve(false); return db.ref(path).once('value').then(s => s.exists()).catch(() => false); }

  /* 여는 쪽 */
  function hub(path, h) {
    const base = db.ref(path), up = base.child('up'), mem = base.child('mem'), t0 = now();
    up.on('child_added', snap => {
      const v = snap.val(); snap.ref.remove().catch(() => { });
      if (!v || !v.dev) return;
      if ((+v.t || 0) < t0 - 60000) return;          // 아주 오래된 메시지는 버림
      const m = P(v.j); if (m) h.onMsg && h.onMsg(String(v.dev), m);
    });
    const pres = (s, on) => { const v = s.val() || {}; h.onPresence && h.onPresence(s.key, on && v.on !== false, v); };
    mem.on('child_added', s => pres(s, true));
    mem.on('child_changed', s => pres(s, true));
    mem.on('child_removed', s => pres(s, false));
    let lastPrune = 0;
    return {
      base,
      sendTo(dev, m) { return base.child('dm/' + dev).push({ j: J(m), t: TS }).catch(() => { }); },
      setView(dev, m) { return base.child('view/' + dev).set({ j: J(m), t: TS }).catch(() => { }); },
      broadcast(m) {
        const r = base.child('down').push({ j: J(m), t: TS }).catch(() => { });
        if (Date.now() - lastPrune > 30000) {   // 1분 넘은 전체 메시지는 정리
          lastPrune = Date.now();
          base.child('down').orderByChild('t').endAt(now() - 60000).once('value', s => s.forEach(c => { c.ref.remove(); })).catch(() => { });
        }
        return r;
      },
      close() { up.off(); mem.off(); }
    };
  }

  /* 들어가는 쪽 */
  function client(path, dev, h) {
    const base = db.ref(path), me = base.child('mem/' + dev), dm = base.child('dm/' + dev), view = base.child('view/' + dev);
    const hubRef = base.child('hub');
    let info = Object.assign({}, h.info || {}), hubOn = null, srvOn = false, ready = false, closed = false;
    const t0 = now() - 3000;
    dm.remove().catch(() => { }); view.remove().catch(() => { });
    const setReady = () => { const r = srvOn && hubOn === true; if (r !== ready) { ready = r; h.onState && h.onState(ready); } };
    const writeMe = () => {
      if (closed) return;
      if (h.presence === 'remove') me.onDisconnect().remove(); else me.onDisconnect().update({ on: false, t: TS });
      me.set(Object.assign({}, info, { on: true, t: TS })).catch(() => { });
    };
    const offConn = onConnected(on => { srvOn = on; if (on) writeMe(); h.onServer && h.onServer(on); setReady(); });
    hubRef.on('value', s => { hubOn = s.exists(); h.onHub && h.onHub(hubOn); setReady(); }, () => { hubOn = false; h.onHub && h.onHub(false); setReady(); });
    dm.on('child_added', s => { const v = s.val(); s.ref.remove().catch(() => { }); const m = v && P(v.j); if (m) h.onMsg && h.onMsg(m); });
    const down = base.child('down').orderByChild('t').startAt(t0);
    down.on('child_added', s => { const v = s.val(); const m = v && P(v.j); if (m) h.onMsg && h.onMsg(m); });
    view.on('value', s => { const v = s.val(); const m = v && P(v.j); if (m) h.onView && h.onView(m); });
    return {
      get ready() { return ready; },
      send(m) { if (closed) return; base.child('up').push({ dev, j: J(m), t: TS }).catch(() => { }); },
      setInfo(o) { Object.assign(info, o); if (!closed && srvOn) me.update(o).catch(() => { }); },
      close() {
        if (closed) return; closed = true; offConn();
        hubRef.off(); dm.off(); down.off(); view.off();
        try { me.onDisconnect().cancel(); } catch (e) { }
        if (h.presence === 'remove') me.remove().catch(() => { }); else me.update({ on: false }).catch(() => { });
      }
    };
  }
  return { ok: ok && !!db, db, now, claim, release, exists, hub, client, onConnected };
})();
