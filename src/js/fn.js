document.addEventListener('astro:before-preparation', ev => {
    console.log('insert spin');
    /*document.querySelector('main').style.opacity = 0.3;*/
    document.querySelector('main').classList.add('loading');
    document.getElementsByClassName('preloader')[0].style.display('block');
});


document.addEventListener('astro:page-load', ev => {
    console.log('pageload');
    /*document.querySelector('main').style.opacity = 1;*/
    document.querySelector('main').classList.remove('loading');
    document.getElementsByClassName('preloader')[0].style.display('none');
});
