document.addEventListener('astro:before-preparation', ev => {
    console.log('insert spin');
    //document.querySelector('main').style.opacity = 0.3;
    document.querySelector('main').classList.add('loading');
    //document.querySelector('.preloader').style.display = 'block';
    document.querySelector('.preloader').classList.add('showpreloader');
});


document.addEventListener('astro:page-load', ev => {
    console.log('pageload');
    //document.querySelector('main').style.opacity = 1;
    document.querySelector('main').classList.remove('loading');
    //document.querySelector('.preloader').style.display = 'none';
    document.querySelector('.preloader').classList.remove('showpreloader');
});
