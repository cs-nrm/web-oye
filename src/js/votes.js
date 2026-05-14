// ===== [VOTES] detectarNavegador, detectarDispositivo, registerVote =====

function detectarNavegador() {
  const ua = navigator.userAgent;

  let navegador = "desconocido";
  if (ua.includes("Chrome")) navegador = "Chrome";
  else if (ua.includes("Firefox")) navegador = "Firefox";
  else if (ua.includes("Safari") && !ua.includes("Chrome")) navegador = "Safari";
  else if (ua.includes("Edge")) navegador = "Edge";
  else if (ua.includes("MSIE") || ua.includes("Trident")) navegador = "IE";

  let so = "desconocido";
  if (ua.includes("Windows")) so = "Windows";
  else if (ua.includes("Mac")) so = "MacOS";
  else if (ua.includes("Linux")) so = "Linux";
  else if (ua.includes("Android")) so = "Android";
  else if (ua.includes("iPhone") || ua.includes("iPad")) so = "iOS";

  return { navegador, sistema: so };
}

const VOTE_COLOR = '#ef4444';

function detectarDispositivo() {
  return /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent) ? 'mobile' : 'desktop';
}

/**
 * Registra un voto en el backend.
 * @param {string} seccion
 * @param {string} artista
 * @param {string} cancion
 * @param {HTMLElement|null} btn
 * @returns {Promise}
 */
function registerVote(seccion, artista, cancion, btn = null) {
  return new Promise((resolve, reject) => {
    const url = 'https://playnrm.com/6456heu2/8s4v3f1l3s.php';

    // Protección de doble click o voto ya marcado
    if (btn) {
      if (btn.dataset.voteStatus === 'voted') {
        console.log('Ya votaste por esta canción.');
        return resolve({ status: 'already' });
      }
      if (btn.dataset.voteStatus === 'pending') {
        return resolve({ status: 'disabled' });
      }
      btn.dataset.voteStatus = 'pending';
    }

    const safe = (s) => (s || '').toString().replace('&', '%26');
    const { navegador, sistema } = detectarNavegador();

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
      body: new URLSearchParams({
        artista: safe(artista),
        cancion: safe(cancion),
        seccion: seccion, // El backend actual puede ignorarlo; ya preparado para futuro
        dispositivo: detectarDispositivo(),
        navegador,
        sistema_operativo: sistema,
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error('network-fail');
        return res.json();
      })
      .then((resp) => {
        if (btn) btn.dataset.voteStatus = '';
        if (!resp || resp.status !== 'success') {
          console.log((resp && resp.message) || 'Error al votar.');
          reject(resp || new Error('vote-error'));
          return;
        }

        const svg = btn ? btn.querySelector('svg') : null;
        if (svg) svg.style.fill = VOTE_COLOR;
        if (btn) btn.dataset.voteStatus = 'voted';
        console.log('Voto registrado con éxito.');
        window.ga4Track('vote', { section: seccion, artist: artista, song: cancion });
        resolve(resp);
      })
      .catch((error) => {
        if (btn) btn.dataset.voteStatus = '';
        console.log('No se pudo registrar el voto. Intenta de nuevo.');
        reject(error);
      });
  });
}

// Exponer como global para que player.js pueda llamarla
window.registerVote = registerVote;
