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
    window.slotSuperLeader = googletag.defineSlot("/23349147378/Oye", [[728,  90], [320,  50]], 'ad-slot-superleader').defineSizeMapping(mappingLeaderboard).addService(googletag.pubads());
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
    if (document.getElementById('ad-slot14'))           googletag.display('ad-slot14');
    if (document.getElementById('ad-slot141'))          googletag.display('ad-slot141');
    if (document.getElementById('ad-slot-videonota'))   googletag.display('ad-slot-videonota');

    if (window._boxRefreshInterval) clearInterval(window._boxRefreshInterval);
    window._boxRefreshInterval = setInterval(function() { googletag.pubads().refresh([window.slotBox]); }, 120000);
  });
}

// Exponer initGPT como global para que player.js pueda llamarla
window.initGPT = initGPT;
