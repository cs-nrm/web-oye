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
    adsensePushed: false,
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
  console.log(`[adFallback] activateFallback ${state.fallbackId} showGPT=${showGPT}`, state);

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
 * Crea un <ins> dinámicamente a partir de los data-attributes del contenedor
 * y hace push a AdSense. Al crear el elemento en el momento justo (no en el DOM
 * inicial), AdSense nunca lo auto-inicializa con availableWidth=0 ni lo marca
 * como "ya en uso" antes de que lo necesitemos.
 */
function scheduleAdsensePush(fb, state) {
  // Eliminar cualquier <ins> previo que pudiera existir (por navegación SPA)
  const old = fb.querySelector('ins.adsbygoogle');
  if (old) old.remove();

  // Crear <ins> fresco con las dimensiones del contenedor
  const ins = document.createElement('ins');
  ins.className = 'adsbygoogle';
  ins.style.display = 'block';
  ins.style.width = (fb.dataset.adWidth || '300') + 'px';
  ins.style.maxWidth = '100%';
  ins.style.height = (fb.dataset.adHeight || '250') + 'px';
  ins.dataset.adClient = fb.dataset.adClient;
  ins.dataset.adSlot = fb.dataset.adSlot;
  ins.dataset.adFormat = fb.dataset.adFormat || 'auto';
  fb.appendChild(ins);

  let attempts = 0;
  const maxAttempts = 10;
  const delay = 80;

  const checkAndPush = () => {
    const insWidth = ins.offsetWidth;
    console.log(`[adFallback] checkAndPush ${state.fallbackId} ins.offsetWidth=${insWidth} intento=${attempts + 1}`);

    if (insWidth > 0) {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      state.adsensePushed = true;
      console.log(`[adFallback] AdSense push OK para ${state.fallbackId} (ins width=${insWidth}px)`);
    } else {
      attempts++;
      if (attempts < maxAttempts) {
        setTimeout(checkAndPush, delay);
      } else {
        console.warn(`[adFallback] ${state.fallbackId} ins.offsetWidth=0 tras ${maxAttempts} intentos — abortando`);
      }
    }
  };

  setTimeout(checkAndPush, 50);
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
    console.log('[ads.js] initGPT()');
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

    var mappingVideoNota = googletag.sizeMapping().addSize([0, 0], [400, 311]).build();

    window.slotBillboard   = googletag.defineSlot("/23349147378/Oye", [[970, 250], [320,  50]], 'ad-slot-billboard').defineSizeMapping(mappingBillboard).addService(googletag.pubads());
    window.slotLeader      = googletag.defineSlot("/23349147378/Oye", [[728,  90], [320,  50]], 'ad-slot-leader').defineSizeMapping(mappingLeader).addService(googletag.pubads());
    window.slotLeader2     = googletag.defineSlot("/23349147378/Oye", [[728,  90], [320,  50]], 'ad-slot-leader2').defineSizeMapping(mappingLeader).addService(googletag.pubads());
    window.slotLeader3     = googletag.defineSlot("/23349147378/Oye", [[728,  90], [320,  50]], 'ad-slot-leader3').defineSizeMapping(mappingLeader).addService(googletag.pubads());
    window.slotSuperLeader = googletag.defineSlot("/23349147378/Oye", [[970,  90], [320,  50]], 'ad-slot-superleader').defineSizeMapping(mappingSuperLeader).addService(googletag.pubads());
    window.slotBox         = googletag.defineSlot("/23349147378/Oye", [300, 250],               'ad-slot-box').defineSizeMapping(mappingBox).addService(googletag.pubads());
    window.slotDoubleBox   = googletag.defineSlot("/23349147378/Oye", [300, 600],               'ad-slot-doublebox').defineSizeMapping(mappingDoubleBox).addService(googletag.pubads());
    window.slot14          = googletag.defineSlot("/23349147378/Oye", [600, 800],               'ad-slot14').addService(googletag.pubads());
    window.slot141         = googletag.defineSlot("/23349147378/Oye", [320, 480],               'ad-slot141').addService(googletag.pubads());
    window.slotVideoNota = googletag.defineSlot("/23349147378/Oye", [400, 311], 'ad-slot-videonota').defineSizeMapping(mappingVideoNota).addService(googletag.pubads());

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
    if (document.getElementById('ad-slot-videonota')) googletag.display('ad-slot-videonota');

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
