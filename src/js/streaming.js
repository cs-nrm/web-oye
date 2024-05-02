var streaming;
var local_status;
const buttonPause = '<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-player-pause" width="44" height="44" viewBox="0 0 24 24" stroke-width="1.5" stroke="#2c3e50" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M6 5m0 1a1 1 0 0 1 1 -1h2a1 1 0 0 1 1 1v12a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1z" /><path d="M14 5m0 1a1 1 0 0 1 1 -1h2a1 1 0 0 1 1 1v12a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1z" /></svg>';
const buttonPlay = '<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-player-play-filled" width="44" height="44" viewBox="0 0 24 24" stroke-width="1.5" stroke="#2c3e50" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M6 4v16a1 1 0 0 0 1.524 .852l13 -8a1 1 0 0 0 0 -1.704l-13 -8a1 1 0 0 0 -1.524 .852z" stroke-width="0" fill="currentColor" /></svg>';
var volume;
var artist;
var cancion;
var hora;
const radioButton = document.getElementById('radiobutton');
const player = document.getElementById('player');



//function initPlayer(){
    function initPlayerSDK(){
        console.log( 'TD Player SDK is ready' );
        //Player SDK is ready to be used, this is where you can instantiate a new TDSdk instance.
        //Player configuration: list of modules        
        var tdPlayerConfig = {
        coreModules: [{
                id: 'MediaPlayer',
                playerId: 'td_container',
                audioAdaptive: true,
                plugins: [ {id:"vastAd"}]
            }],
            playerReady: onPlayerReady,
            configurationError: onConfigurationError,
            moduleError: onModuleError,
            adBlockerDetected: onAdBlockerDetected            
        };
        //Player instance
        streaming = new TDSdk( tdPlayerConfig );        
        streaming.addEventListener( 'stream-status', getStatus );
        streaming.addEventListener( 'ad-playback-complete', completeAd );
        streaming.addEventListener( 'ad-playback-start', startAd );
        streaming.addEventListener( 'ad-playback-error', errorAd );
       
    }
    
     function getStatus(s){
        local_status = s.data.code;        
         console.log(local_status);
         if( local_status == 'GETTING_STATION_INFORMATION' || local_status == 'LIVE_CONNECTING' || local_status == 'LIVE_BUFFERING' ){
            document.getElementById('loading').classList.add('show');
            document.getElementById('loading').classList.remove('hide');
            document.getElementById('play-pause').classList.remove('show');
            document.getElementById('play-pause').classList.add('hide');    
         }
         if (local_status == 'LIVE_PLAYING'){                        
            document.getElementById('play-pause').innerHTML = buttonPause;
            document.getElementById('loading').classList.remove('show');
            document.getElementById('loading').classList.add('hide');
            document.getElementById('play-pause').classList.add('show');
            document.getElementById('play-pause').classList.remove('hide'); 
            
         }
         if(local_status == 'LIVE_STOP' || local_status == 'LIVE_PAUSE') {
            document.getElementById('loading').classList.remove('show');
            document.getElementById('loading').classList.add('hide');
            document.getElementById('play-pause').classList.add('show');
            document.getElementById('play-pause').classList.remove('hide'); 
            document.getElementById('play-pause').innerHTML = buttonPlay;            
         }

     }
     

    function completeAd(e){        
        streaming.play({
            station:'XEOYEFM',
            trackingParameters:{
            Dist: 'WebOye'
            }
        });        
      }

      function startAd(e){
        console.log(local_status);                
        streaming.playAd( 'vastAd', { url:'https://pubads.g.doubleclick.net/gampad/ads?sz=600x360&iu=/21799830913/Oye/VASTPrueba&ciu_szs=600x360&impl=s&gdfp_req=1&env=vp&output=vast&unviewed_position_start=1&url=[referrer_url]&description_url=[description_url]&correlator=[timestamp]' } );
      }
      
      function pause(){
        streaming.pause();
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
        console.log('stopped');
        streaming.stop();
      }

   
      function errorAd(e){        
        streaming.play({
            station:'XEOYEFM',
            trackingParameters:{
            Dist: 'WebOye'
            }
        });
        
      }
    /* Callback function called to notify that the SDK is ready to be used */
    function onPlayerReady(){                
        console.log('streaming ready');        
        document.getElementById('loading').classList.remove('show');
        document.getElementById('loading').classList.add('hide');
        document.getElementById('play-pause').classList.add('show');
        document.getElementById('play-pause').classList.remove('hide'); 
        vol = streaming.getVolume();
        console.log(vol);

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

    initPlayerSDK();        
        volume = document.getElementById('vol');
        volume.addEventListener('input', function(){
            //console.log(volume.value);
            streaming.setVolume(volume.value);

        });

        function getInfoMusic(){
            fetch("https://cdn.nrm.com.mx/cdn/oye/playlist/cancion.json")
            .then((res) => {
                if (!res.ok) {
                    throw new Error
                        ('HTTP error! Status: ${res.status}');
                }
                return res.json();
            })
            .then((data) => {
                
                switch( data.categoria ){
                    case 'PCRADIOS' :
                        artist = 'CORTE';
                        cancion = '';
                    break;
                    case 'OYE-DEBRAYE':
                        artist = 'EL DEBRAYE';
                        cancion = '';
                    break;
                    case 'OYE-TURNOS':
                        artist = 'EL DEBRAYE';
                        cancion = '';
                    break;                    
                    case 'OYE-CAP':
                        artist = 'CORTE';
                        cancion = '';
                    break;
                    case 'OYE-PRO':
                        artist = data.artista;
                        cancion = data.title;
                        hora = data.hora_real;
                    break;
                    case 'OYE-MUS':
                        artist = data.artista;
                        cancion = data.title;
                        hora = data.hora_real;
                    break;
                    default:
                        artist = data.artista;
                        cancion = data.title;
                        hora = data.hora_real;
                    break;
                    

                } 
                
                if (cancion == ''){
                    document.getElementById('infoMusic').innerHTML = artist;
                }else{
                    document.getElementById('infoMusic').innerHTML = artist + ' / ' + cancion;
                }
            })
           // console.log('repetido');   
        }
        getInfoMusic();
        setInterval( getInfoMusic, 30000);
        
/* abrir barra*/
const openbarra = function(){
    player.classList.remove('h-0');
    player.classList.add('h-16');
    player.classList.add('border-4');    
}

const hidebarra = function(){
    player.classList.remove('h-16');
    player.classList.add('h-0');
    player.classList.remove('border-4');                
}

const transitionBarra = function(){    
    hidebarra();
    setTimeout( function(){        
        openbarra();
    }, 500);
}

const radioActive = function(){
    $('#player-inner').addClass('active');
    $('#player-v-podcast').removeClass('active');
    $('#player-v-video').removeClass('active');
}

const podcastActive = function(){
    $('#player-inner').removeClass('active');
    $('#player-v-podcast').addClass('active');
    $('#player-v-video').removeClass('active');
}

const videoActive = function(){
    $('#player-inner').removeClass('active');
    $('#player-v-podcast').removeClass('active');
    $('#player-v-video').addClass('active');
}

const radioStop = function(){
        streaming.pause();
        $('#player').attr('data-status','init');                
        hidebarra();
        $('#player-inner').removeClass('active');
}


const playerstatus = function(){
    var state  = $('#player').attr('data-status');
    return state;
};



const playstopRadio = function(){
            console.log(local_status);
            const getplayingstatus = playerstatus();
            console.log(getplayingstatus);
            if (getplayingstatus == 'init'){
                openbarra();
            }

            if(getplayingstatus == 'podcast-playing'){
                transitionBarra();
                const containerpodcast  = document.getElementById('iframepodcast');
                containerpodcast.innerHTML ='';                
            }                
                                               
            if( local_status == null || local_status == 'undefined' || local_status == '' || local_status == 'LIVE_STOP' ){                
                //streaming.playAd( 'vastAd', { url:'https://pubads.g.doubleclick.net/gampad/ads?sz=600x360&iu=/21799830913/Oye/VASTPrueba&ciu_szs=600x360&impl=s&gdfp_req=1&env=vp&output=vast&unviewed_position_start=1&url=[referrer_url]&description_url=[description_url]&correlator=[timestamp]' } );
                streaming.play({
                    station:'XEOYEFM',
                    trackingParameters:{
                    Dist: 'WebOye'
                    }
                });             
             $('#player').attr('data-status','radio-playing');
             transitionBarra(); 
             radioActive();   
            }else if( local_status == 'LIVE_PLAYING' || local_status == 'GETTING_STATION_INFORMATION' || local_status == 'LIVE_CONNECTING' || local_status == 'LIVE_BUFFERING'){
                
                radioStop();
            }
};


$('#radiobutton').on('click',function(){    
        playstopRadio();      
});

$('#return-live').on('click',function(){    
       playstopRadio();    
});


$('#play-pause').on('click', function(){
    playstopRadio();
});

/* podcast*/ 



  

/* NAVIGATION */ 
document.addEventListener('astro:before-preparation', ev => {
    console.log('insert spin');    
    document.querySelector('main').classList.add('loading');    
    document.querySelector('.preloader').classList.add('showpreloader');
});


document.addEventListener('astro:page-load', ev => {
    console.log('pageload');
    document.querySelector('main').classList.remove('loading');    
    document.querySelector('.preloader').classList.remove('showpreloader');
    const getplayingstatus = playerstatus();

    const imagenNota = document.getElementById("imagen-nota");
    if( imagenNota ){
        const imgNotaOriginal = imagenNota.getElementsByTagName('img');
        const imgNotaOriginal2 = imgNotaOriginal[0].getAttribute('src');
        imagenNota.style.backgroundImage = "url("+imgNotaOriginal2+")";
    }
    
    
    if( getplayingstatus == 'podcast-playing'){
        const containerpodcast  = document.getElementById('iframepodcast');
        containerpodcast.innerHTML ='';
        hidebarra();
    }

    $('.audiopod').each(function(){   
        $(this).on('click',function(){
            radioStop();
            podcastActive();
            transitionBarra();

            const ifr = $(this).find('.data-iframe').attr('data-iframe');
            const ifrsrc = ifr.split('src="');
            const src = ifrsrc[1].split('"');
            //const playerpodcast = document.getElementById('playerpodcast');
            const containerpodcast  = document.getElementById('iframepodcast');
            containerpodcast.innerHTML ='';
            const playerpodcast = document.createElement('iframe');
            playerpodcast.setAttribute('src',src[0]+"?image=0&share=0&download=1&description=0&follow=0");
            playerpodcast.setAttribute('width','300');
            playerpodcast.setAttribute('height','300');
            playerpodcast.setAttribute('frameborder','0');
            playerpodcast.setAttribute('allow','autoplay');
            

            //console.log(playerpodcast);
            containerpodcast.appendChild(playerpodcast);            
            const ply =  new playerjs.Player(playerpodcast);
            ply.on('ready', ()=> {
                $('#player').attr('data-status','podcast-playing');
                playerpodcast.classList.add('iframestyle');
                ply.play(); 
            });            


        });
    });
   
});

