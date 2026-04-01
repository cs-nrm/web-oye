// ===== [ANALYTICS] ga4Track, trackTritonPlaybackEvent =====

/**
 * Envía un evento a GA4. Usa gtag() si está disponible (inicializado por TDSdk),
 * y siempre hace dataLayer.push para que GTM también lo reciba.
 * @param {string} event  - Nombre del evento GA4
 * @param {Object} params - Parámetros adicionales del evento
 */
function ga4Track(event, params) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(Object.assign({ event: event }, params));
  if (typeof window.gtag === 'function') {
    window.gtag('event', event, params || {});
  }
}

/**
 * Registra un evento de playback de Triton en GA4.
 * @param {string} event  - 'play' | 'stop' | 'ad_start' | 'ad_complete'
 * @param {Object} params - Parámetros adicionales
 */
function trackTritonPlaybackEvent(event, params) {
  ga4Track('triton_' + event, Object.assign({ station: 'XEOYEFM' }, params));
}

// Exponer como globales para que player.js y votes.js puedan usarlas
window.ga4Track = ga4Track;
window.trackTritonPlaybackEvent = trackTritonPlaybackEvent;
