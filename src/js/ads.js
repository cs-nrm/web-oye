// ===== [ADS] initGPT =====

function initGPT() {
  googletag.cmd.push(function () {
    console.log('[ads.js] initGPT()');
    // Limpiar slots previos
    googletag.destroySlots();

    // SIZEMAPPING
    var mappingLeaderboard = googletag.sizeMapping()
      .addSize([768, 0], [728, 90])
      .addSize([0, 0], [320, 50])
      .build();

    var mappingSuperLeader = googletag.sizeMapping()
      .addSize([768, 0], [970, 90])
      .addSize([0, 0], [320, 50])
      .build();

    var mappingBox = googletag.sizeMapping()
      .addSize([768, 0], [300, 250])
      .addSize([0, 0], [300, 250])
      .build();

    var mappingDoubleBox = googletag.sizeMapping()
      .addSize([768, 0], [300, 600])
      .addSize([0, 0], [300, 250])
      .build();

    var mappingVideoNota = googletag.sizeMapping().addSize([0, 0], [400, 311]).build();

    window.slotBillboard   = googletag.defineSlot("/23349147378/Oye", [[728,  90], [320,  50]], 'ad-slot-billboard').defineSizeMapping(mappingLeaderboard).addService(googletag.pubads());
    window.slotLeader      = googletag.defineSlot("/23349147378/Oye", [[728,  90], [320,  50]], 'ad-slot-leader').defineSizeMapping(mappingLeaderboard).addService(googletag.pubads());
    window.slotLeader2     = googletag.defineSlot("/23349147378/Oye", [[728,  90], [320,  50]], 'ad-slot-leader2').defineSizeMapping(mappingLeaderboard).addService(googletag.pubads());
    window.slotLeader3     = googletag.defineSlot("/23349147378/Oye", [[728,  90], [320,  50]], 'ad-slot-leader3').defineSizeMapping(mappingLeaderboard).addService(googletag.pubads());
    window.slotSuperLeader = googletag.defineSlot("/23349147378/Oye", [[970,  90], [320,  50]], 'ad-slot-superleader').defineSizeMapping(mappingSuperLeader).addService(googletag.pubads());
    window.slotBox         = googletag.defineSlot("/23349147378/Oye", [300, 250],               'ad-slot-box').defineSizeMapping(mappingBox).addService(googletag.pubads());
    window.slotBox2        = googletag.defineSlot("/23349147378/Oye", [300, 250],               'ad-slot-box2').defineSizeMapping(mappingBox).addService(googletag.pubads());
    window.slotDoubleBox   = googletag.defineSlot("/23349147378/Oye", [300, 600],               'ad-slot-doublebox').defineSizeMapping(mappingDoubleBox).addService(googletag.pubads());
    window.slot14          = googletag.defineSlot("/23349147378/Oye", [600, 800],               'ad-slot14').addService(googletag.pubads());
    window.slot141         = googletag.defineSlot("/23349147378/Oye", [320, 480],               'ad-slot141').addService(googletag.pubads());
    window.slotVideoNota   = googletag.defineSlot("/23349147378/Oye", [400, 311],               'ad-slot-videonota').defineSizeMapping(mappingVideoNota).addService(googletag.pubads());

    googletag.pubads().setTargeting("test", "responsive");
    googletag.enableServices();

    if (document.getElementById('ad-slot-billboard'))   googletag.display('ad-slot-billboard');
    if (document.getElementById('ad-slot-leader'))      googletag.display('ad-slot-leader');
    if (document.getElementById('ad-slot-leader2'))     googletag.display('ad-slot-leader2');
    if (document.getElementById('ad-slot-leader3'))     googletag.display('ad-slot-leader3');
    if (document.getElementById('ad-slot-superleader')) googletag.display('ad-slot-superleader');
    if (document.getElementById('ad-slot-box'))         googletag.display('ad-slot-box');
    if (document.getElementById('ad-slot-box2'))        googletag.display('ad-slot-box2');
    if (document.getElementById('ad-slot-doublebox'))   googletag.display('ad-slot-doublebox');
    // Takeover (Modal.astro): pedir solo el tamano visible. El otro queda en display:none
    // y, si se pidiera, contaria una impresion que nadie ve. Mismo corte que el CSS del modal.
    var takeoverDesktop = window.matchMedia('(min-width: 621px)').matches;
    // Mostrar el modal solo si el takeover trae una linea de GAM (venta directa o deal).
    // trampa: el relleno de AdX tambien llena el 600x800 y abria el modal a pantalla completa;
    // ese relleno trae lineItemId null. No usar sourceAgnosticLineItemId: en el relleno si trae valor.
    // Los listeners de pubads sobreviven a destroySlots(), por eso se registra una sola vez
    // aunque initGPT corra en cada navegacion.
    if (!window._takeoverListener) {
      window._takeoverListener = true;
      googletag.pubads().addEventListener('slotRenderEnded', function (e) {
        var id = e.slot.getSlotElementId();
        if (id !== 'ad-slot14' && id !== 'ad-slot141') return;
        if (!e.isEmpty && e.lineItemId) {
          var modal = document.getElementById('modal');
          if (modal) modal.classList.add('con-anuncio');
        } else if (window.startVideoIntersticial) {
          // Sin takeover directo: intentar el video intersticial (deals de video, p. ej. KIA).
          window.startVideoIntersticial();
        }
      });
    }
    if (takeoverDesktop  && document.getElementById('ad-slot14'))  googletag.display('ad-slot14');
    if (!takeoverDesktop && document.getElementById('ad-slot141')) googletag.display('ad-slot141');
    if (document.getElementById('ad-slot-videonota'))   googletag.display('ad-slot-videonota');

    if (window._boxRefreshInterval) clearInterval(window._boxRefreshInterval);
    window._boxRefreshInterval = setInterval(function() { googletag.pubads().refresh([window.slotBox, window.slotLeader]); }, 60000);
  });
}

// Exponer initGPT como global para que player.js pueda llamarla
window.initGPT = initGPT;
