// ===== [GLOBALS + SVG CONSTANTS] =====
var streaming;
var local_status;
const buttonPause = '<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-player-pause" width="44" height="44" viewBox="0 0 24 24" stroke-width="1.5" stroke="var(--verde-electrico)" fill="var(--verde-electrico)" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M6 5m0 1a1 1 0 0 1 1 -1h2a1 1 0 0 1 1 1v12a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1z" /><path d="M14 5m0 1a1 1 0 0 1 1 -1h2a1 1 0 0 1 1 1v12a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1z" /></svg>';
const buttonPlay = '<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-player-play-filled" width="44" height="44" viewBox="0 0 24 24" stroke-width="1.5" stroke="#000" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M6 4v16a1 1 0 0 0 1.524 .852l13 -8a1 1 0 0 0 0 -1.704l-13 -8a1 1 0 0 0 -1.524 .852z" stroke-width="0" fill="currentColor" /></svg>';
const bigButtonPause = '<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-player-pause" width="35" height="35" viewBox="0 0 24 24" stroke-width="1.5" stroke="var(--verde-electrico)" fill="var(--verde-electrico)" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M6 5m0 1a1 1 0 0 1 1 -1h2a1 1 0 0 1 1 1v12a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1z" /><path d="M14 5m0 1a1 1 0 0 1 1 -1h2a1 1 0 0 1 1 1v12a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1z" /></svg>';
const bigButtonPlay = '<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-player-play" width="35" height="35" viewBox="0 0 24 24" stroke-width="1.5" stroke="var(--verde-electrico)" fill="var(--verde-electrico)" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M7 4v16l13 -8z" /></svg>';
const buttongLoading = '<img width="40" height="40" src="https://storage.googleapis.com/nrm-web/oye/recursos/loading-normal.gif" style="padding:5px;"/>';
const buttonPodcastPlay = '<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-player-play" width="60" height="60" viewBox="0 0 24 24" stroke-width="2" stroke="#fff" fill="#fff" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M7 4v16l13 -8z" /></svg>';
const buttonPodcastPause = '<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-player-pause" width="60" height="60" viewBox="0 0 24 24" stroke-width="1.5" stroke="#fff" fill="#fff" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M6 5m0 1a1 1 0 0 1 1 -1h2a1 1 0 0 1 1 1v12a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1z" /><path d="M14 5m0 1a1 1 0 0 1 1 -1h2a1 1 0 0 1 1 1v12a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1z" /></svg>';
var volume;
var artist;
var cancion;
var hora;
const radioButton = document.getElementById('radiobutton');
const player = document.getElementById('player');
const secchome = document.getElementById('home');
const qs = (selector, root = document) => root.querySelector(selector);
const qsa = (selector, root = document) => Array.from(root.querySelectorAll(selector));
const setHtml = (selector, value, root = document) => qsa(selector, root).forEach((el) => { el.innerHTML = value; });
const setAttr = (selector, attr, value, root = document) => qsa(selector, root).forEach((el) => el.setAttribute(attr, value));
const addClass = (selector, className, root = document) => qsa(selector, root).forEach((el) => el.classList.add(className));
const removeClass = (selector, className, root = document) => qsa(selector, root).forEach((el) => el.classList.remove(className));
const setDisplay = (selector, value, root = document) => qsa(selector, root).forEach((el) => { el.style.display = value; });
const setWidth = (selector, value, root = document) => qsa(selector, root).forEach((el) => { el.style.width = value; });
const onAll = (selector, eventName, key, handler, root = document) => {
    qsa(selector, root).forEach((el) => {
        const eventKey = `__${eventName}_${key}`;
        if (el[eventKey]) el.removeEventListener(eventName, el[eventKey]);
        el[eventKey] = handler;
        el.addEventListener(eventName, handler);
    });
};

// ===== [PLAYER - TRITON SDK] initPlayerSDK, getStatus, callbacks VAST =====
//function initPlayer(){
    function initPlayerSDK(){
        var tdPlayerConfig = {
             coreModules: [{
               id: 'MediaPlayer',
               playerId: 'td_container' ,
               audioAdaptive: false,
               plugins: [ {id:"vastAd"}]
             }],
             // The callbacks are defined in your source code.
             playerReady: onPlayerReady,
             moduleError: onModuleError,
             audioAdaptive: true,
             analytics: {
                active: true,
                debug: false,
                appInstallerId: 'oyePag',            
                trackingId: 'G-M9RYDQ6Z9L',
                trackingEvents: [ 'play', 'stop', 'pause', 'resume', 'all' ],
                sampleRate: 100,     
                category: 'Reproduccion Radio Pag' 
             }
            };
        // The call to loadModules() as been removed.
        streaming = new TDSdk( tdPlayerConfig );
        streaming.addEventListener( 'stream-status', getStatus );
        streaming.addEventListener( 'ad-playback-complete', completeAd );
        streaming.addEventListener( 'ad-playback-start', startAd );
        streaming.addEventListener( 'ad-playback-error', errorAd );
      }
    var musicInterval = null; // Agrega esto al inicio del archivo o cerca de lastArtist/lastSong

     function getStatus(s){
        local_status = s.data.code;
        const secchome = document.getElementById('home');                 
        if( local_status == 'GETTING_STATION_INFORMATION' || local_status == 'LIVE_CONNECTING' || local_status == 'LIVE_BUFFERING' ){
            /*document.getElementById('loading').classList.add('show');
            document.getElementById('loading').classList.remove('hide');*/
            document.getElementById('play-pause').classList.remove('show');
            document.getElementById('play-pause').classList.add('hide'); 
            document.getElementById('big-play').innerHTML = buttongLoading;    
            
         }
         if (local_status == 'LIVE_PLAYING'){
            window.trackTritonPlaybackEvent('play');
            document.getElementById('play-pause').innerHTML = buttonPause;
            /*document.getElementById('loading').classList.remove('show');
            document.getElementById('loading').classList.add('hide');*/
            document.getElementById('play-pause').classList.add('show');
            document.getElementById('play-pause').classList.remove('hide'); 
            document.getElementById('big-play').innerHTML = bigButtonPause;            
            setHtml('.text-player', '<div style="font-weight:bold;">Ahora suena...</div><div id="infoMusic" style="line-height:11px; font-size:12px;"></div>');
            addClass('.text-player', 'playing');
            addClass('#radiobutton', 'playerplaying');
            // Limpia cualquier intervalo anterior
            if (musicInterval) clearInterval(musicInterval);
            setTimeout(function(){
                getInfoMusic(); // Primera consulta inmediata
            }, 1000); // Espera 1 segundo antes de la primera consulta
            musicInterval = setInterval(getInfoMusic, 30000); // Intervalo solo cuando está LIVE_PLAYING
            
         }
         if(local_status == 'LIVE_STOP' || local_status == 'LIVE_PAUSE') {
            window.trackTritonPlaybackEvent('stop', { status: local_status });
            /*document.getElementById('loading').classList.remove('show');
            document.getElementById('loading').classList.add('hide');*/
            document.getElementById('play-pause').classList.add('show');
            document.getElementById('play-pause').classList.remove('hide'); 
            document.getElementById('play-pause').innerHTML = buttonPlay;            
            document.getElementById('big-play').innerHTML = bigButtonPlay; 
            removeClass('.text-player', 'playing');
            removeClass('#radiobutton', 'playerplaying');
            setHtml('.text-player', '');
            setTimeout( function(){
                setHtml('.text-player', 'ESCUCHA LA RADIO  <span style="color: ;    font-weight: bold;    font-size: 12px;">EN VIVO</span> AHORA');             
            },1000);
            if (musicInterval) clearInterval(musicInterval);    
         }

     }
     

    function completeAd(e){
        window.trackTritonPlaybackEvent('ad_complete');
        streaming.play({
            station:'XEOYEFM',
            trackingParameters:{
            Dist: 'WebOye'
            }
        }); 
        removeClass('#td_container', 'pub_active');
        setDisplay('#full-cover', 'none');
        
       
      }
     

     function adBreakCuePoint( e ){
       //console.log('PAUSA COMERCIAL');
       //document.getElementById('infoMusic').innerHTML = 'PAUSA COMERCIAL';
    }

      function startAd(e){
        window.trackTritonPlaybackEvent('ad_start');
        addClass('#td_container', 'pub_active');
        setDisplay('#full-cover', 'block');
        document.getElementById('big-play').innerHTML = buttongLoading;    
        setHtml('.text-player', '<div style="font-style: italic; line-height:11px; font-weight:bold; font-size:11px;">Iniciamos después del anuncio...</div>'); 
      }
      
      var start = function(){
        //console.log('trata la pub primero');    
        streaming.playAd( 'vastAd', { url:'https://pubads.g.doubleclick.net/gampad/ads?sz=600x360&iu=/23349147378/Oye/VASTPrueba&ciu_szs=600x360&impl=s&gdfp_req=1&env=vp&output=vast&unviewed_position_start=1&url=[referrer_url]&description_url=[description_url]&correlator=[timestamp]' } );
      };


      function pause(){
        streaming.stop();
      }

      
      function play(){
        streaming.play({
            station:'XEOYEFM',
            trackingParameters:{
            Dist: 'WebOye'
            }
        });        
      }      
   

      function stop(){
      //  console.log('stopped');
        streaming.stop();
      }

      function errorAd(e){        
        streaming.play({
            station:'XEOYEFM',
            trackingParameters:{
            Dist: 'WebOye'
            }
        });
        console.log(e);
        console.log('error ad');
        
      }
    /* Callback function called to notify that the SDK is ready to be used */
    function onPlayerReady(){                
        console.log('streaming ready');        
        /*document.getElementById('loading').classList.remove('show');
        document.getElementById('loading').classList.add('hide');*/
        document.getElementById('play-pause').classList.add('show');
        document.getElementById('play-pause').classList.remove('hide'); 
        vol = streaming.getVolume();
     //   console.log(vol);

    }

  
    /* Callback function called to notify that the player configuration has an error. */
    function onConfigurationError( e ) {
        console.log(e);
        console.log(e.data.errors);
        //Error code : object.data.errors[0].code
        //Error message : object.data.errors[0].message
    }
    /* Callback function called to notify that a module has not been loaded properly */
    function onModuleError( object ){
        console.log(object);
        console.log(object.data.errors);
        //Error code : object.data.errors[0].code
        //Error message : object.data.errors[0].message
    }
    
    /* Callback function called to notify that an Ad-Blocker was detected */
    function onAdBlockerDetected(){
        console.log( 'AdBlockerDetected' );
    }

    const autoplay = function(){        
        streaming.play({
            station:'XEOYEFM',
            trackingParameters:{
                Dist: 'WebOye',
                autoplay: 1
            }
        });
    }

    initPlayerSDK();        
        volume = document.getElementById('vol');
        volume.addEventListener('input', function(){
            //console.log(volume.value);
            streaming.setVolume(volume.value);

        });

// ===== [PLAYER - SONG POLLING] getInfoMusic =====
var lastArtist = null;
var lastSong = null;

function getInfoMusic() {
    fetch("https://cdn.nrm.com.mx/cdn/oye/playlist/cancion.json")
    .then((res) => {
        if (!res.ok) {
            throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
    })
    .then((data) => {
        let newArtist = '';
        let newSong = '';
        let newHora = '';

        switch( data.categoria ){
                    case 'COMERCIALES' :
                    case 'OYE-ESPECIALES' :
                    case 'OYE-DEBRAYE':
                    case 'OYE-TURNOS':
                    case 'OYE-CAP':
                    case 'OYE-PRO':                                            
                        artist = 'PAUSA COMERCIAL';
                        cancion = '';
                        cover= 'https://storage.googleapis.com/nrm-web/nrm/images/footer/logo-oye-80.png';
                    break;
                    case 'OYE-MUS':
                    case 'OYE-INGLES':
                    case 'OYE-PARTY-NIGHTS':
                        newArtist = data.artista;
                        newSong = data.title;
                        newHora = data.hora_real;
                    break;                                            
                    default:
                        newArtist = 'PAUSA COMERCIAL';
                        newSong = '';
                        cover= 'https://storage.googleapis.com/nrm-web/nrm/images/footer/logo-oye-80.png';
                    break;
                } 

        // Actualiza siempre en la primera llamada o si hay cambio
        if (lastArtist === null || lastSong === null || newArtist !== lastArtist || newSong !== lastSong) {
            lastArtist = newArtist;
            lastSong = newSong;
            artist = newArtist;
            cancion = newSong;
            hora = newHora;

            if (cancion === '') {
                document.getElementById('infoMusic').innerHTML = artist;
            } else {
                const secenvivo = document.getElementById('envivo');
                var cover;
                var coverbase = "https://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=0aa2713d85e04243944924876ba71f05&format=json";
                const codtit = cancion.replace('&', '%26');
                const codart = artist.replace('&', '%26');
                console.log('Artista: ' + artist);
                console.log('Canción: ' + cancion);
                console.log('escribe');
                setHtml('#infoMusic', '<div class="current-song">' + cancion + ' / ' + artist + '</div><div class="share-current"><div class="like"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" width="28" height="28" stroke-width="1"> <path d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572"></path> </svg> </div> <div class="share-wp"><a href="https://api.whatsapp.com/send/?text=Estoy%20escuchando%20' + codtit +'%20de%20'+ codart +'%20en%20https://oyedigital.mx/" target="_blank"> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" width="28" height="28" stroke-width="1"> <path d="M13 4v4c-6.575 1.028 -9.02 6.788 -10 12c-.037 .206 5.384 -5.962 10 -6v4l8 -7l-8 -7z"></path> </svg> </div></div>'); 
                //document.getElementById('infoMusic').innerHTML = 

               // Binder de voto para la sección RADIO (evita handlers duplicados)
                onAll('.like', 'click', 'vote', function (e) {
                  e.preventDefault();
                  window.registerVote('Radio', artist, cancion, this)
                    .then(() => {
                      // Hook opcional: aquí podrías disparar un toast/analytics
                    })
                    .catch(() => {
                      // Manejo ya se hizo con logs; deja el catch vacío para no romper UX
                    });
                });
                
                // Consulta el cover solo si hay cambio
                var linkcover = coverbase + '&track=' + codtit + '&artist=' + codart;
                fetch(linkcover)
                    .then((res) => {
                        if (!res.ok) {
                            throw new Error(`HTTP error! Status: ${res.status}`);
                        }
                        return res.json();
                    })
                    .then((dataalbum) => {
                        var lig = dataalbum.track.album;
                        if (secenvivo) {
                            setHtml('.cover-background', '');
                            if (!lig || artist == 'PAUSA COMERCIAL') {
                                cover = 'https://storage.googleapis.com/nrm-web/oye/recursos/LOGO-OYE-BLANCO-2025.svg';
                                setAttr('.logo-player img', 'src', cover);
                            } else {
                                cover = dataalbum.track.album.image[2]['#text'];
                                setAttr('.logo-player img', 'src', cover);
                            }
                        } else {
                            if (!lig || artist == 'PAUSA COMERCIAL') {
                                setHtml('#radiobutton .cover-background', '');
                            } else {
                                cover = dataalbum.track.album.image[2]['#text'];
                                setHtml('#radiobutton .cover-background', '');
                                qs('#radiobutton')?.insertAdjacentHTML('beforeend', '<div class="cover-background"><img src="' + cover + '" /></div>');
                            }
                        }
                    });
            }
            }
            // Si no hay cambio, no hace nada
        });
    }

       
// ===== [PLAYER - PROGRAMACION] getInfoProg =====
        function getInfoProg(){            
            fetch("https://playnrm.com/wp-json/wp/v2/posts?_embed&per_page=30&categories=3312&_fields[]=_links&_fields[]=_embedded&_fields[]=acf&_fields[]=content")            
            .then((res) => {
                if (!res.ok) {
                    throw new Error
                        ('HTTP error! Status: ${res.status}');
                }
                return res.json();
            })
            .then((data) => {                
                //console.log(data);
                const fecha = new Date();                
                //const hora = fecha.getHours() + ':' + fecha.getUTCMinutes() + ':' + fecha.getSeconds();
                const dias = ['domingo','lunes','martes','miercoles','jueves','viernes','sabado'];
                const dia = dias[fecha.getDay()];                
                const hora = dayjs(fecha).format('HH:mm:ss');
                let siguientePrograma = null;
                data.map(function(prog,i,el){                    
                    if(prog.acf[dia] === true){
                        var h_i;
                        if( prog.acf.hora_fin >= hora &&  prog.acf.hora_inicio <= hora){
                            setAttr('.banner-prog img', 'src', prog._embedded['wp:featuredmedia'][0].media_details.sizes['full'].source_url);
                            setHtml('.envivo-prog', prog.acf.programa);
                            setHtml('.envivo-now', prog.acf.hora_inicio + ' - ' + prog.acf.hora_fin);
                            setHtml('.envivo-prog-tab', prog.acf.programa);                            
                            setHtml('.envivo-desc', prog.content.rendered);                            
                        }

                        if (prog.acf.hora_inicio > hora) {
                            if (!siguientePrograma || prog.acf.hora_inicio < siguientePrograma.acf.hora_inicio) {
                                siguientePrograma = prog;
                            }
                        }                        
                    }
                });   
                if (siguientePrograma) {
                    console.log("Siguiente programa:", siguientePrograma.acf.programa);
                    setHtml('.envivo-next', siguientePrograma.acf.hora_inicio + ' - ' + siguientePrograma.acf.hora_fin);
                    setHtml('.envivo-prog-next-tab', siguientePrograma.acf.programa);
                }                                                
            });           
        }
        
        //setTimeout(getInfoProg, 20000);
        //setInterval( getInfoProg, 300000);       

// ===== [PLAYER - CONTROLS] radioActive, playstopRadio, transitionPlayer =====
const radioActive = function(){
    addClass('#player-inner', 'active');
    removeClass('#player-v-podcast', 'active');
    removeClass('#player-v-video', 'active');
    removeClass('.player-float', 'hide');
}

const podcastActive = function(){
    //transitionPlayer();
    removeClass('#player-inner', 'active');
    addClass('#player-v-podcast', 'active');
    removeClass('#player-v-video', 'active');
    addClass('.player-float', 'hide');
    removeClass('.player-float', 'active');
}

const videoActive = function(){
    removeClass('#player-inner', 'active');
    removeClass('#player-v-podcast', 'active');
    addClass('#player-v-video', 'active');
}

const radioStop = function(){
        transitionPlayer();
        streaming.stop();
        qs('#player')?.setAttribute('data-status','init');                
        //hidebarra();
        removeClass('#player-inner', 'active');
}

const initPlayer = function(){
    transitionPlayer();
    removeClass('#player-v-podcast', 'active');
    removeClass('#player-v-video', 'active');
    removeClass('.player-float', 'hide');
    removeClass('#radiobutton', 'playerplaying'); 
    removeClass('.player-float', 'hide');
    addClass('.player-float', 'active');    
}

const transitionPlayer = function(){
    setWidth('#radiobutton', '0px');
    setTimeout( function(){
        setWidth('#radiobutton', '250px');
    }, 500);
}


const playerstatus = function(){
    var state  = qs('#player')?.getAttribute('data-status');
    return state;
};

const playstopRadio = function(){
            transitionPlayer();
            const getplayingstatus = playerstatus();                        
            if(getplayingstatus == 'podcast-playing'){
                //transitionBarra();
                const containerpodcast  = document.getElementById('iframepodcast');
                containerpodcast.innerHTML ='';                
            }                
                                               
            if(getplayingstatus == 'video-playing'){
                
            }

            if( local_status == null || local_status == 'undefined' || local_status == '' ){                                
                //console.log('aqui debe iniciar');
                start();     
                qs('#player')?.setAttribute('data-status','radio-playing');
                //transitionBarra();                 
                radioActive();   
            }else if(local_status == 'LIVE_STOP'){
                //console.log('else play');
                play();
                qs('#player')?.setAttribute('data-status','radio-playing');
            }else if( local_status == 'LIVE_PLAYING' || local_status == 'GETTING_STATION_INFORMATION' || local_status == 'LIVE_CONNECTING' || local_status == 'LIVE_BUFFERING'){                
                radioStop();
            }
};


onAll('#big-play', 'click', 'radio', function(){    
       // console.log('click en radiobutton');
        playstopRadio();      
});


onAll('#return-live', 'click', 'radio', function(){    
       playstopRadio();    
});

onAll('.radio-link', 'click', 'radio', function(){    
       playstopRadio();    
});

/* TONEFUSE APPLE MUSIC */
function initAppleMusicAds() {
  const slot147 = document.getElementById('amplified_100007147');
  const slot145 = document.getElementById('amplified_100007145');
  const slot143 = document.getElementById('amplified_100007143');
  if (!slot147 && !slot145 && !slot143) return;

  const runAppleMusicAds = () => {
    window.amplified = window.amplified || { init: [] };

    if (typeof window.amplified.setParams === 'function' &&
        typeof window.amplified.pushAdUnit === 'function' &&
        typeof window.amplified.run === 'function') {
      window.amplified.setParams({ artist: '', song: '' });
      window.amplified.pushAdUnit(100007147);
      window.amplified.pushAdUnit(100007145);
      window.amplified.pushAdUnit(100007143);
      window.amplified.run();
      return true;
    }

    if (Array.isArray(window.amplified.init)) {
      window.amplified.init.push(function() {
        window.amplified.setParams({ artist: '', song: '' });
        window.amplified.pushAdUnit(100007147);
        window.amplified.pushAdUnit(100007145);
        window.amplified.pushAdUnit(100007143);
        window.amplified.run();
      });
      return true;
    }

    return false;
  };

  if (runAppleMusicAds()) return;

  window.setTimeout(() => {
    if (!document.getElementById('amplified_100007147')) return;
    runAppleMusicAds();
    if (!document.getElementById('amplified_100007145')) return;
    runAppleMusicAds();
    if (!document.getElementById('amplified_100007143')) return;
    runAppleMusicAds();
  }, 500);
}

// ===== [NAVIGATION + PAGE LOAD] =====
document.addEventListener('astro:before-preparation', ev => {
  //  console.log('insert spin');    
    document.querySelector('main').classList.add('loading');    
    document.querySelector('.preloader').classList.add('showpreloader');
});

document.addEventListener("astro:after-swap", () => {
    // Reinitialize ads after Astro client-side navigation
    if (window.googletag && googletag.apiReady) {
        window.initGPT();
    } else {
        window.googletag = window.googletag || { cmd: [] };
        googletag.cmd.push(function() { window.initGPT(); });
    }
    setTimeout(() => { window.instgrm.Embeds.process(); }, 1500);
});




document.addEventListener('astro:page-load', ev => {
   // console.log('pageload');
   window.ga4Track('page_view', { page_location: window.location.href, page_title: document.title });
   if (typeof window.COMSCORE !== 'undefined') {
     window.COMSCORE.beacon({ c1: '2', c2: '6906652' });
   }



const getCancionEl = qs('.getcancion');
if(getCancionEl){
    //console.log('aqui va a imprimir la canción');
    const artist = getCancionEl.getAttribute('data-artista');
    const cancion = getCancionEl.getAttribute('data-cancion');
    //console.log(cancion);
    //console.log(artist);
    function getInfoLyrics(){
            fetch("https://api.lyrics.ovh/v1/"+artist+"/"+cancion)
            .then((res) => {
                if (!res.ok) {
                    throw new Error
                        ('HTTP error! Status: ${res.status}');
                }
                return res.json();
            })
            .then((data) => { 
                //console.log(data.lyrics);
                getCancionEl.innerHTML = data.lyrics;
            });
    }
    getInfoLyrics();
}

    /* publicidad: reinicializa slots tras el DOM swap de Astro View Transitions */
    if (window.googletag && googletag.apiReady) {
        window.initGPT();
    } else {
        window.googletag = window.googletag || { cmd: [] };
        googletag.cmd.push(function() { window.initGPT(); });
    }
    
        initAppleMusicAds();

   const getplayingstatus = playerstatus();
    document.querySelector('main').classList.remove('loading');    
    document.querySelector('.preloader').classList.remove('showpreloader');
    
    const secchome = document.getElementById('home');
    const secenvivo = document.getElementById('envivo');
    const secgaleria = document.getElementsByClassName('galeria');

    var elemgaleria = document.querySelector('.wp-block-gallery');
    if( elemgaleria ){
        var flktygaleria = new Flickity( elemgaleria, {
            contain: true,
            lazyLoad: 1,
            wrapAround: true,
            cellAlign: 'center',
            pageDots: false,
            autoPlay: true
        });
    }

    if ( secenvivo ){   
        //console.log('envivo');
        getInfoProg();
        getInfoMusic();
        setInterval( getInfoProg, 60000);
        addClass('#radiobutton', 'en-vivo');
        //console.log(local_status);
        if( local_status == null || local_status == 'undefined' || local_status == '' || local_status == 'LIVE_STOP' ){  
            playstopRadio();
        }
        if( local_status == 'LIVE_PLAYING' || local_status == 'GETTING_STATION_INFORMATION' || local_status == 'LIVE_CONNECTING' || local_status == 'LIVE_BUFFERING' ){
            setHtml('.cover-background', '');
        }
        setAttr('.logo-player img', 'src','https://storage.googleapis.com/nrm-web/oye/recursos/LOGO-OYE-BLANCO-2025.svg');
        removeClass('#big-play', 'border-4');
        
    }else{
       // getInfoMusic();
        setAttr('.logo-player img', 'src','https://storage.googleapis.com/nrm-web/oye/recursos/LOGO-OYE-BLANCO-2025.svg');        
        removeClass('#radiobutton', 'en-vivo');
        addClass('#big-play', 'border-4');
    }
    
    
    if ( secchome ){
        //getInfoProg();
        console.log(getplayingstatus);
        /*if( getplayingstatus == 'radio-playing'){
             document.getElementById('big-play').innerHTML = bigButtonPause; 
        }*/

        /*var elem = document.querySelector('.carousel-main');
        var flkty = new Flickity( elem, {
            // options
            cellAlign: 'center',
            prevNextButtons: true,
        //    autoPlay: 5000,
            pageDots: false,
            pauseAutoPlayOnHover: true,
            freeScroll: true,
            wrapAround: true
        });
        flkty.select(2);
        flkty.reloadCells();   
        */

        /*var elemnav = document.querySelector('.carousel-nav');
        var flktynav = new Flickity( elemnav, {
            // options
            cellAlign: 'center',
            contain: true,
            asNavFor: '.carousel-main',
            prevNextButtons: false,
            pageDots: false, 
            pauseAutoPlayOnHover: true
        });
        */ 
         var elemtopten = document.querySelector('.main-topten');
        var flktytopten = new Flickity( elemtopten, {
            contain: true,
            lazyLoad: 1, 
            wrapAround: true, 
            cellAlign: 'center',
            pageDots: false,
            autoPlay: true
        });
        var elembuenfin = document.querySelector('.carousel-buenfin');
        var flktybuenfin = new Flickity( elembuenfin, {
            // options
            cellAlign: 'right',
            prevNextButtons: true,
        //    autoPlay: 5000,
            pageDots: false,
            pauseAutoPlayOnHover: true,
            freeScroll: true,
            wrapAround: true
        }); 
        var elemportada = document.querySelector('.carousel-portada');
        var flktyportada = new Flickity(elemportada, {
        // options
        cellAlign: 'center',
        prevNextButtons: false,
        pageDots: false,
        pauseAutoPlayOnHover: true,
        freeScroll: false,
        wrapAround: true,
        autoPlay: 5000,
        });
 
    }
    const secprogram = document.getElementById('programacion');
    if ( secprogram || secchome ){  

        var elempod = document.querySelector('.main-carousel');
        var flktypod = new Flickity( elempod, {
            contain: true,
            lazyLoad: 1, 
            wrapAround: true, 
            cellAlign: 'center',
            pageDots: false,
            autoPlay: 5000,
        });
    }
        /*var elempod = document.querySelector('.main-carousel');
        var flktypod = new Flickity( elempod, {
            contain: true,
            lazyLoad: 1, 
            wrapAround: true, 
            cellAlign: 'center',
            pageDots: false,
            autoPlay: true
        });*/

       


    const imagenNota = document.getElementById("imagen-nota");
    if( imagenNota ){
        const imgNotaOriginal = imagenNota.getElementsByTagName('img');
        const imgNotaOriginal2 = imgNotaOriginal[0].getAttribute('src');
        imagenNota.style.backgroundImage = "url("+imgNotaOriginal2+")";
    }
    
    
    if( getplayingstatus == 'podcast-playing'){
        const containerpodcast  = document.getElementById('iframepodcast');
        //containerpodcast.innerHTML ='';
        initPlayer();
        //hidebarra();
    }

    onAll('.audiopod', 'click', 'podcast', function(){
            const getstatus = playerstatus();
            const podactive = this.querySelector('.play-pause-podcast');
            const podcaststatus = podactive?.getAttribute('data-podcast-status');
            const containerpodcast  = document.getElementById('iframepodcast');
            
            transitionPlayer();
            podcastActive();
            setTimeout( function(){
                addClass('#radiobutton', 'playerplaying'); 
            },600);
            
            
            if (getstatus == 'radio-playing'){
                radioStop();                
            }            
                                                
            if (podactive) podactive.innerHTML = '<img class="loading-gif" src="https://storage.googleapis.com/nrm-web/oye/recursos/loading-normal.gif" />';
            
            onAll('.close-podcast', 'click', 'podcast-close', function(){
                initPlayer();
                const playerpodcast = document.getElementById('iframepodcast').getElementsByTagName('iframe')[0];                
                const ply =  new playerjs.Player(playerpodcast);
                ply.on('ready', ()=> {
                    ply.pause();
                    podactive?.setAttribute('data-podcast-status','ready');
                });
                qsa('.audiopod').forEach((audioPod) => {
                    qsa('.play-pause-podcast', audioPod).forEach((playButton) => {
                        playButton.innerHTML = buttonPodcastPlay;
                        playButton.setAttribute('data-podcast-status','ready');
                    });
                });
                
            });
            
            if (getstatus == 'podcast-playing'){
                
                const playerpodcast = document.getElementById('iframepodcast').getElementsByTagName('iframe')[0];                
                const ply =  new playerjs.Player(playerpodcast);
                ply.on('ready', ()=> {
                    ply.pause();
                    podactive?.setAttribute('data-podcast-status','ready');
                });
                qsa('.audiopod').forEach((audioPod) => {
                    qsa('.play-pause-podcast', audioPod).forEach((playButton) => {
                        playButton.innerHTML = buttonPodcastPlay;
                        playButton.setAttribute('data-podcast-status','ready');
                    });
                });
            }
            //console.log(podcaststatus);            
            if(podcaststatus == 'ready'){
                //transitionBarra();
                const ifr = this.querySelector('.data-iframe')?.getAttribute('data-iframe') || '';
                const ifrsrc = ifr.split('src="');
                if (!ifrsrc[1]) return;
                const src = ifrsrc[1].split('"');
                //const playerpodcast = document.getElementById('playerpodcast');
                //<iframe src="https://omny.fm/shows/beat-trends/amor-de-lejos-amor-de-ya-no-aplica/embed?size=square&style=cover&image=0&description=1&download=1&playlistImages=1&playlistShare=1&share=1&subscribe=0&background=efefef&foreground=2b2b2c&highlight=fff" allow="autoplay; clipboard-write" width="300" height="300" frameborder="0" title="Amor de lejos, amor de… Ya no aplica"></iframe>           
                containerpodcast.innerHTML ='';
                const playerpodcast = document.createElement('iframe');
                playerpodcast.setAttribute('src',src[0]+"?image=0&share=0&download=1&description=0&background=efefef&foreground=2b2b2c&highlight=fff");
                playerpodcast.setAttribute('width','300');
                playerpodcast.setAttribute('height','190');
                playerpodcast.setAttribute('frameborder','0');
                playerpodcast.setAttribute('allow','autoplay');
                playerpodcast.setAttribute('transition:persist','');
                //console.log(playerpodcast);
                containerpodcast.appendChild(playerpodcast);            
                const ply =  new playerjs.Player(playerpodcast);
                 
                ply.on('ready', ()=> {
                    podactive?.setAttribute('data-podcast-status','active');
                    qs('#player')?.setAttribute('data-status','podcast-playing');
                    playerpodcast.classList.add('iframestyle');
                    ply.play(); 
                    
                    ply.on('play', ()=>{
                        if (podactive) podactive.innerHTML = buttonPodcastPause; 
                    });
    
                    ply.on('pause', ()=>{
                        if (podactive) podactive.innerHTML = buttonPodcastPlay; 
                        setHtml('.play-pause-podcast-home', buttonPodcastPlay+'<span>REPRODUCIR AHORA</span>');
                    });
                    
                });   
            }
            else if(podcaststatus == 'active'){
                /*if( getplayingstatus == 'podcast-playing'){
                    const containerpodcast  = document.getElementById('iframepodcast');
                    containerpodcast.innerHTML ='';
                    hidebarra();
                }*/
                //containerpodcast.innerHTML = '';
                //hidebarra();                
                const playerpodcast = document.getElementById('iframepodcast').getElementsByTagName('iframe')[0];
                //console.log(playerpodcast);
                const ply =  new playerjs.Player(playerpodcast);
                ply.on('ready', ()=> {
                    ply.pause();
                    podactive?.setAttribute('data-podcast-status','ready');
                });                
                
            }

    });
    
    qsa('.wp-block-image').forEach((figure) => {        
        const img = figure.querySelector('img');
        const datasrc = img?.getAttribute('data-src');        
        if (img && datasrc) img.setAttribute('src', datasrc);
    });

    
        
  

    const containvideo = document.getElementById('content-w-video');
    if (containvideo){
        //console.log('sccion pop');  
        console.log(navigator.userAgent);
        if(navigator.userAgent.indexOf("iPhone") != -1){
            
        qsa('.wp-block-embed-youtube .wp-block-embed__wrapper iframe').forEach((iframe) => {
            console.log(iframe);   
            iframe.addEventListener('click', function(){
                const getstatus = playerstatus();
                if( getstatus == 'radio-playing'){
                    radioStop();   
                    //hidebarra();
                    qs('#player')?.setAttribute('data-status','video-playing');
                }
            });            
            
        });        

        }else{                      
        qsa('.wp-block-embed-youtube .wp-block-embed__wrapper').forEach((wrapper) => {
            console.log(wrapper.querySelector('iframe'));            
            const plyr = new Plyr(wrapper.querySelector('iframe')?.parentElement || wrapper,{
                debug:true,
                controls:[
                    'play-large', // The large play button in the center
                    'restart', // Restart playback
                    'rewind', // Rewind by the seek time (default 10 seconds)
                    'play', // Play/pause playback
                    'fast-forward', // Fast forward by the seek time (default 10 seconds)
                    'progress', // The progress bar and scrubber for playback and buffering
                    'current-time', // The current time of playback
                    'duration', // The full duration of the media
                    'mute', // Toggle mute
                    'volume', // Volume control
                    'captions', // Toggle captions
                    'settings', // Settings menu
                    'pip', // Picture-in-picture (currently Safari only)
                    'airplay', // Airplay (currently Safari only)
                    'download', // Show a download button with a link to either the current source or a custom URL you specify in your options
                    'fullscreen', 
                ],
                playsinline: true

            });
            //console.log(plyr);
            plyr.on('playing',function(){
                const getstatus = playerstatus();
                if( getstatus == 'radio-playing'){
                    radioStop();   
                    //hidebarra();
                    qs('#player')?.setAttribute('data-status','video-playing');
                }
            });
            
            onAll('#radiobutton', 'click', 'pause-video', function(){
                plyr.pause();
            });     
        }); 
        }
        
             /*voto*/
        var yavoto = 0;
        var allowvote = 60;

        onAll('.voto-pop', 'click', 'voto-pop', function(){
                console.log(yavoto);
                if (yavoto === 0){
                    yavoto = 1;        
    
                    var interval = setInterval(function(){
                        console.log(allowvote)
                        allowvote--;
                        
                        if(allowvote < 0){
                        console.log('permitir votar de nuevo');
                        yavoto = 0;
                        allowvote = 60;
                        console.log(yavoto);
                        clearInterval(interval);
                        }
                        
                    }, 1000);
    
                    console.log(this.getAttribute('data-voto-id'));
                    const id = this.getAttribute('data-voto-id');                                                
                    const params = {
                        "item_id":id,
                        "user_id":15,
                        "type":"post",
                        "user_ip":"0.0.0.0",
                        "status":"like"
                    };                
                    const Rparamas = {
                        method: 'POST',
                        headers: {
                            'Authorization': 'Bearer ngXupo2jqRcdogAaVAwfiVZhEDULq9kRRKrWZzpsnE6ETAbBu5abURCmA98SvA2SOXKjtC3uqW15DV2dEhWP1QrGkkSZb8c8vhI8Snbszb94oXYGmewSgTW3',
                            'Content-Type': 'application/json'
                        },                    
                        body: JSON.stringify( params )
                    };
                        
                    fetch('https://playnrm.com/wp-json/wp-ulike-pro/v1/vote/', Rparamas)
                    .then((res) => {
                        if (!res.ok) {
                            throw new Error
                                ('HTTP error! Status: ${res.status}');
                        }
                        return res.json();
                    })
                    .then((data) => { 
                            console.log(data);
                            this.classList.add('voted');
                            this.querySelector('svg')?.setAttribute('fill','white');
                            Toastify({
                                text: "Gracias por tu voto",
                                className: "info",
                                style: {
                                  background: "#000",
                                  'border-radius': '6px',
                                  'box-shadow':'var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)' 
                                },
                                offset:{
                                    x:'10rem',
                                    y:'20rem'
                                }
                            }).showToast();
                    });
                
                    
                }else if(yavoto === 1){
                    Toastify({
                        text: "Espera un minuto para poder volver a votar",
                        className: "info",
                        style: {
                          background: "#000",
                          'border-radius': '6px',
                          'box-shadow':'var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)' 
                        },
                        offset:{
                            x:'10rem',
                            y:'20rem'
                        }
                    }).showToast();
    
                }   
                
        });   


        
        /*------------------- */
        
    } 

    // === [/VOTOS] ===
    onAll('.like-topten', 'click', 'vote', function (e) {
                    e.preventDefault();
                    const artist = this.dataset.artist || '';
                    const cancion = this.dataset.song || '';
                    window.registerVote('TopTen', artist, cancion, this)
                        .then(() => {
                        // Hook opcional: aquí podrías disparar un toast/analytics
                        })
                        .catch(() => {
                        // Manejo ya se hizo con logs; deja el catch vacío para no romper UX
                        });
    });
        
       
});
