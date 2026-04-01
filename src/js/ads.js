// ===== [ADS] adFallback, initAdFallbackListener, initGPT =====
window._adFallbackStates = window._adFallbackStates || {};

function adFallback(slots, fallbackId) {
  const state = { slots, fallbackId, loaded: {}, rendered: 0 };
  slots.forEach(id => { state.loaded[id] = false; });
  window._adFallbackStates[fallbackId] = state;
}

function initAdFallbackListener() {
  googletag.pubads().addEventListener('slotRenderEnded', function(event) {
    const id = event.slot.getSlotElementId();
    for (const state of Object.values(window._adFallbackStates)) {
      if (!state.slots.includes(id)) continue;
      if (!event.isEmpty) state.loaded[id] = true;
      state.rendered++;
      if (state.rendered < state.slots.length) break;
      const showGPT = state.slots.every(s => state.loaded[s]);
      state.slots.forEach(s => {
        const el = document.getElementById(s);
        if (el) el.style.display = showGPT ? '' : 'none';
      });
      const fb = document.getElementById(state.fallbackId);
      if (fb) {
        fb.style.display = showGPT ? 'none' : 'block';
        if (!showGPT) {
          const schedulePush = () => {
            if (fb.offsetWidth > 0) {
              try { (adsbygoogle = window.adsbygoogle || []).push({}); }
              catch (e) { console.error('adFallback: adsbygoogle push failed', e); }
            } else {
              setTimeout(schedulePush, 50);
            }
          };
          requestAnimationFrame(schedulePush);
        }
      }
      break;
    }
  });
}

function initGPT() {
  googletag.cmd.push(function () {
    googletag.destroySlots();
    window._adFallbackStates = {};

    var mappingBillboard   = googletag.sizeMapping().addSize([768, 0], [970, 250]).addSize([0, 0], [320,  50]).build();
    var mappingLeader      = googletag.sizeMapping().addSize([768, 0], [728,  90]).addSize([0, 0], [320,  50]).build();
    var mappingSuperLeader = googletag.sizeMapping().addSize([768, 0], [970,  90]).addSize([0, 0], [320,  50]).build();
    var mappingBox         = googletag.sizeMapping().addSize([768, 0], [300, 250]).addSize([0, 0], []).build();
    var mappingDoubleBox   = googletag.sizeMapping().addSize([768, 0], [300, 600]).addSize([0, 0], []).build();
    var mappingSlide       = googletag.sizeMapping().addSize([0, 0],   [300, 250]).build();

    window.slotBillboard   = googletag.defineSlot("/21799830913/Oye", [[970, 250], [320,  50]], 'ad-slot-billboard').defineSizeMapping(mappingBillboard).addService(googletag.pubads());
    window.slotLeader      = googletag.defineSlot("/21799830913/Oye", [[728,  90], [320,  50]], 'ad-slot-leader').defineSizeMapping(mappingLeader).addService(googletag.pubads());
    window.slotLeader2     = googletag.defineSlot("/21799830913/Oye", [[728,  90], [320,  50]], 'ad-slot-leader2').defineSizeMapping(mappingLeader).addService(googletag.pubads());
    window.slotLeader3     = googletag.defineSlot("/21799830913/Oye", [[728,  90], [320,  50]], 'ad-slot-leader3').defineSizeMapping(mappingLeader).addService(googletag.pubads());
    window.slotSuperLeader = googletag.defineSlot("/21799830913/Oye", [[970,  90], [320,  50]], 'ad-slot-superleader').defineSizeMapping(mappingSuperLeader).addService(googletag.pubads());
    window.slotBox         = googletag.defineSlot("/21799830913/Oye", [300, 250],               'ad-slot-box').defineSizeMapping(mappingBox).addService(googletag.pubads());
    window.slotDoubleBox   = googletag.defineSlot("/21799830913/Oye", [300, 600],               'ad-slot-doublebox').defineSizeMapping(mappingDoubleBox).addService(googletag.pubads());
    window.slot14          = googletag.defineSlot("/21799830913/Oye", [600, 800],               'ad-slot14').addService(googletag.pubads());
    window.slot141         = googletag.defineSlot("/21799830913/Oye", [320, 480],               'ad-slot141').addService(googletag.pubads());
    window.slot201 = googletag.defineSlot("/21799830913/Beat/Box",  [300, 250], 'ad-slot201').defineSizeMapping(mappingSlide).addService(googletag.pubads());
    window.slot202 = googletag.defineSlot("/21799830913/Beat/Box2", [300, 250], 'ad-slot202').defineSizeMapping(mappingSlide).addService(googletag.pubads());
    window.slot203 = googletag.defineSlot("/21799830913/Beat/Box3", [300, 250], 'ad-slot203').defineSizeMapping(mappingSlide).addService(googletag.pubads());
    window.slot204 = googletag.defineSlot("/21799830913/Beat/Box4", [300, 250], 'ad-slot204').defineSizeMapping(mappingSlide).addService(googletag.pubads());
    window.slot205 = googletag.defineSlot("/21799830913/Beat/Box5", [300, 250], 'ad-slot205').defineSizeMapping(mappingSlide).addService(googletag.pubads());

    googletag.pubads().setTargeting("test", "responsive");
    googletag.enableServices();

    if (document.getElementById('ad-slot-billboard'))   googletag.display('ad-slot-billboard');
    if (document.getElementById('ad-slot-leader'))      googletag.display('ad-slot-leader');
    if (document.getElementById('ad-slot-leader2'))     googletag.display('ad-slot-leader2');
    if (document.getElementById('ad-slot-leader3'))     googletag.display('ad-slot-leader3');
    if (document.getElementById('ad-slot-superleader')) googletag.display('ad-slot-superleader');
    if (document.getElementById('ad-slot-box'))         googletag.display('ad-slot-box');
    if (document.getElementById('ad-slot-doublebox'))   googletag.display('ad-slot-doublebox');
    if (document.getElementById('ad-slot14'))           googletag.display('ad-slot14');
    if (document.getElementById('ad-slot141'))          googletag.display('ad-slot141');
    if (document.getElementById('ad-slot201')) googletag.display('ad-slot201');
    if (document.getElementById('ad-slot202')) googletag.display('ad-slot202');
    if (document.getElementById('ad-slot203')) googletag.display('ad-slot203');
    if (document.getElementById('ad-slot204')) googletag.display('ad-slot204');
    if (document.getElementById('ad-slot205')) googletag.display('ad-slot205');

    if (document.getElementById('ad-slot-billboard'))   adFallback(['ad-slot-billboard'],   'ad-slot-billboard-adsense');
    if (document.getElementById('ad-slot-leader'))      adFallback(['ad-slot-leader'],      'ad-slot-leader-adsense');
    if (document.getElementById('ad-slot-leader2'))     adFallback(['ad-slot-leader2'],     'ad-slot-leader2-adsense');
    if (document.getElementById('ad-slot-leader3'))     adFallback(['ad-slot-leader3'],     'ad-slot-leader3-adsense');
    if (document.getElementById('ad-slot-superleader')) adFallback(['ad-slot-superleader'], 'ad-slot-superleader-adsense');
    if (document.getElementById('ad-slot-box'))         adFallback(['ad-slot-box'],         'ad-slot-box-adsense');
    if (document.getElementById('ad-slot-doublebox'))   adFallback(['ad-slot-doublebox'],   'ad-slot-doublebox-adsense');

    if (window._boxRefreshInterval) clearInterval(window._boxRefreshInterval);
    window._boxRefreshInterval = setInterval(function() { googletag.pubads().refresh([window.slotBox]); }, 40000);
  });
}

// Exponer initGPT como global para que player.js pueda llamarla
window.initGPT = initGPT;

// El listener se registra UNA SOLA VEZ (no dentro de initGPT)
googletag.cmd.push(initAdFallbackListener);
