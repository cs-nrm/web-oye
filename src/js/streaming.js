var streaming;
var local_status = '';
var live = [{}];
var status = [{}];


$(document).ready(function(){
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

        $('#play-pause').on('click', function(){
            console.log(local_status);
            console.log(live); 
            console.log(live.status);            
            streaming.playAd( 'vastAd', { url:'https://pubads.g.doubleclick.net/gampad/ads?sz=600x360&iu=/21799830913/Oye/VASTPrueba&ciu_szs=600x360&impl=s&gdfp_req=1&env=vp&output=vast&unviewed_position_start=1&url=[referrer_url]&description_url=[description_url]&correlator=[timestamp]' } );
        });
    }
    
     function getStatus(s){
        local_status = s.data.code;
        live.status = local_status;        
         //console.log(local_status);       
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
        //Play the stream: station is TRITONRADIOMUSIC
        console.log('streaming ready');
        document.getElementById('loading').classList.remove('show');
        document.getElementById('loading').classList.add('hide');
        document.getElementById('play-pause').classList.add('show');
        document.getElementById('play-pause').classList.remove('hide');
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
      
    /*    
        document.getElementById('play-pause').addEventListener('click', function(){               
            console.log(local_status);
            streaming.playAd( 'vastAd', { url:'https://pubads.g.doubleclick.net/gampad/ads?sz=600x360&iu=/21799830913/Oye/VASTPrueba&ciu_szs=600x360&impl=s&gdfp_req=1&env=vp&output=vast&unviewed_position_start=1&url=[referrer_url]&description_url=[description_url]&correlator=[timestamp]' } );
        });    
    */
   
        
});
