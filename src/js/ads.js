// ===== [ADS] adFallback, initAdFallbackListener, initGPT con TIMEOUT y RETRY =====
window._adFallbackStates = window._adFallbackStates || {};

/**
 * Registra un slot GPT con su div de AdSense fallback.
 * @param {string[]} slots      - Array de IDs de divs GPT
 * @param {string}   fallbackId - ID del div AdSense
 * @param {number}   timeoutMs  - Timeout en ms (default 5000)
 */
function adFallback(slots, fallbackId, timeoutMs = 5000) {
  const state = {
    slots,
    fallbackId,
    loaded: {},
    rendered: 0,
    timeoutId: null,
    adsenseAttempts: 0,
    maxAdsenseAttempts: 3,
    completed: false
  };
  slots.forEach(id => { state.loaded[id] = false; });
  window._adFallbackStates[fallbackId] = state;

  // TIMEOUT: Si no todos los slots se renderan en timeoutMs, fuerza el fallback
  state.timeoutId = setTimeout(() => {
    if (state.completed) return;
    console.warn(`[adFallback] Timeout para ${fallbackId} - Activando fallback forzado`);
    state.completed = true;
    activateFallback(state);
  }, timeoutMs);
}

/**
 * Activa el fallback manualmente (usado por timeout y por listener)
 */
function activateFallback(state) {
  // Determinar si mostrar GPT o AdSense
  const showGPT = state.slots.every(s => state.loaded[s]);

  // Mostrar/ocultar divs GPT
  state.slots.forEach(s => {
    const el = document.getElementById(s);
    if (el) el.style.display = showGPT ? '' : 'none';
  });

  // Mostrar/ocultar AdSense y ejecutar push
  const fb = document.getElementById(state.fallbackId);
  if (fb) {
    fb.style.display = showGPT ? 'none' : 'block';
    if (!showGPT) {
      scheduleAdsensePush(fb, state);
    }
  }

  // Limpiar timeout si aún está activo
  if (state.timeoutId) {
    clearTimeout(state.timeoutId);
    state.timeoutId = null;
  }
}

/**
 * Push a AdSense con reintentos y espera a que el div sea visible
 */
function scheduleAdsensePush(fb, state) {
  const checkAndPush = () => {
    if (fb.offsetWidth > 0) {
      if (state.adsenseAttempts < state.maxAdsenseAttempts) {
        try {
          (adsbygoogle = window.adsbygoogle || []).push({});
          state.adsenseAttempts++;
          console.log(`[adFallback] AdSense push #${state.adsenseAttempts} para ${state.fallbackId}`);
        } catch (e) {
          console.error(`[adFallback] AdSense push falló:`, e);
          if (state.adsenseAttempts < state.maxAdsenseAttempts) {
            setTimeout(checkAndPush, 500);
          }
        }
      }
    } else {
      // Div no es visible aún, reintentar
      if (state.adsenseAttempts < state.maxAdsenseAttempts) {
        requestAnimationFrame(checkAndPush);
      }
    }
  };
  requestAnimationFrame(checkAndPush);
}

/**
 * Listener de slotRenderEnded - registrador UNA SOLA VEZ
 */
function initAdFallbackListener() {
  googletag.pubads().addEventListener('slotRenderEnded', function(event) {
    const id = event.slot.getSlotElementId();
    if (!id) return;

    for (const state of Object.values(window._adFallbackStates)) {
      if (!state.slots.includes(id)) continue;
      if (state.completed) break; // Ya fue procesado por timeout

      // Registrar resultado de este slot
      if (!event.isEmpty) {
        state.loaded[id] = true;
      }
      state.rendered++;

      // Chequear si TODOS los slots de este grupo respondieron
      if (state.rendered >= state.slots.length) {
        state.completed = true;
        activateFallback(state);
      }
      break;
    }
  });
}

/**
 * initGPT MEJORADO - Ahora limpia listeners previos
 */
function initGPT() {
  googletag.cmd.push(function () {
    // Limpiar slots y listeners previos
    googletag.destroySlots();

    // Limpiar timeouts de fallbacks previos
    for (const state of Object.values(window._adFallbackStates)) {
      if (state.timeoutId) {
        clearTimeout(state.timeoutId);
      }
    }
    window._adFallbackStates = {};

    // SIZEMAPPING - Mejorado para mobile
    var mappingBillboard   = googletag.sizeMapping()
      .addSize([768, 0], [970, 250])
      .addSize([0, 0], [320, 50])
      .build();

    var mappingLeader      = googletag.sizeMapping()
      .addSize([768, 0], [728, 90])
      .addSize([0, 0], [320, 50])
      .build();

    var mappingSuperLeader = googletag.sizeMapping()
      .addSize([768, 0], [970, 90])
      .addSize([0, 0], [320, 50])
      .build();

    // FIX: Para BoxBanner, ahora tiene fallback a 300x250 en mobile en lugar de empty
    var mappingBox = googletag.sizeMapping()
      .addSize([768, 0], [300, 250])
      .addSize([0, 0], [300, 250])  // ← FIX: 300x250 en lugar de empty
      .build();

    // FIX: Para DoubleBox, ahora tiene fallback a 300x250 en mobile en lugar de empty
    var mappingDoubleBox = googletag.sizeMapping()
      .addSize([768, 0], [300, 600])
      .addSize([0, 0], [300, 250])  // ← FIX: 300x250 en lugar de empty
      .build();

    var mappingSlide       = googletag.sizeMapping()
      .addSize([0, 0],   [300, 250])
      .build();

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
