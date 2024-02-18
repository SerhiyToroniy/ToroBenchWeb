import $ from 'jquery';

var index = 0;
var tests = new Array();
var displays = new Array();
var factors = new Array();
var scores = new Array();

function addTestItem(name, display, factor) {
    tests[index] = name;
    displays[index] = display;
    factors[index] = factor;
    index++;
}

function firstTest() {
    $('#info').show();
    index = -1;
    nextTest();
}

function nextTest() {
    index++;
    if (index < tests.length) {
        var oTestFrame = document.getElementById('testframe');
        //alert(tests[index] + ".html?inner=1")
        oTestFrame.src = tests[index] + ".html?inner=1";
    } else {
        onFinish();
    }
}

function callBack(msg) {
    var data = 0;
    if (typeof msg == 'object' && msg.data) {
        msg = msg.data;
    }
    if (msg.length > 16) {
        data = msg.slice(16);
    }

    scores[index] = parseInt(data * factors[index]);
    console.log(displays[index] + ' : ' + scores[index]);

    nextTest();
}

function preloadFile(file) {
    try {
        // XHR to request a JS and a CSS  
        var xhr = new XMLHttpRequest();
        xhr.open('GET', file, false);
        xhr.send('');
    } catch (e) {
    }
}

function preloadAll() {
    preloadFile("img/skybox/nx.jpg");
    preloadFile("img/skybox/ny.jpg");
    preloadFile("img/skybox/nz.jpg");
    preloadFile("img/skybox/px.jpg");
    preloadFile("img/skybox/py.jpg");
    preloadFile("img/skybox/pz.jpg");
    preloadFile("img/invaders/bullet.png");
    preloadFile("img/invaders/enemy-bullet.png");
    preloadFile("img/invaders/explode.png");
    preloadFile("img/invaders/invader.png");
    preloadFile("img/invaders/invader32x32x4.png");
    preloadFile("img/invaders/player.png");
    preloadFile("img/balls.png");
    preloadFile("img/rain.png");
    preloadFile("img/bg.jpg");
    preloadFile("img/bg_01.png");
    preloadFile("img/button.png");
    preloadFile("img/line.png");
    preloadFile("img/logo-150.png");
    preloadFile("img/starfield.jpg");
    preloadFile("js/phaser.min.js");
    preloadFile("js/three.min.js");
    preloadFile("js/earley-boyer.js");
    preloadFile("js/regexp.js");
    preloadFile("js/code-load.js");
    preloadFile("js/testharness.js");
    preloadFile("js/crypto.js");
    preloadFile("js/raytrace.js");
    preloadFile("js/deltablue.js");
    preloadFile("js/richards.js");
    preloadFile("js/navier-stokes.js");
    preloadFile("js/base.js");
    preloadFile("js/splay.js");
    preloadFile("js/modernizr.js");
    preloadFile("js/fpsmeter.js");
    preloadFile("js/test2d.js");
    preloadFile("js/tree.js");
    preloadFile("js/CSS3DRenderer.js");
    preloadFile("js/animatedframestest.js");
    preloadFile("js/tween.min.js");
    preloadFile("js/uiperftest.js");
    preloadFile("js/bootstrap-collapse.js");
    preloadFile("js/run.js");
    preloadFile("js/test2d2.js");
    preloadFile("js/stats.min.js");
    preloadFile("js/bootstrap-transition.js");
    preloadFile("js/mbProcessBar/ProcessBar.js");
    preloadFile("js/mbProcessBar/style.css");
    preloadFile("js/mbProcessBar/styletest.css");
    preloadFile("css/bootstrap.css");
    preloadFile("css/animate.min.css");
    preloadFile("css/docs.css");
    preloadFile("css/style.css");
    preloadFile("css/styletest.css");
    preloadFile("css/bootstrap-responsive.css");
    preloadFile("css/normalize.css");
    preloadFile("css/antutu.css");
}

export function load() {

    //setViewport(480);

    /*title = document.getElementById('');
     //title.style.fontSize = "32px";
     title.style.display = '';*/


    title.style.fontSize = "18px";
    title.style.display = 'block';


    if ('addEventListener' in document) {
        window.addEventListener('message', callBack, false);
    } else if ('attachEvent' in document) {
        window.attachEvent('onmessage', callBack);
    }
    // return 
    setTimeout(function() {
        index = 0;
        addTestItem("octane", "JavaScript", 1);
        addTestItem("layout", "Layout", 24);
        addTestItem("svg_inline", "SVG", 36);       // android 4.4 and above
        addTestItem("periodic", "Periodic", 36);  // android 4.0 and above
        addTestItem("tree", "Tree", 36);
        addTestItem("birds", "Birds", 48);     // android 4.0 and above
        addTestItem("game", "Invaders", 36);
        addTestItem("collision", "Collision", 48);

        preloadAll();

        /*
         title = document.getElementById('title');
         title.innerHTML = '';
         title.style.display = 'none';
         */
        //$('.loader').hide();

        var title = document.getElementById('title');
        title.innerHTML = '';
        title.style.display = 'none';

        var oTestFrame = document.getElementById('testframe');
        oTestFrame.style.display = 'block';

        firstTest();
    }, 100);

}

function onFinish() {
    $('.header').hide();
    var oTestFrame = document.getElementById('testframe');
    oTestFrame.src = "testscore.html";
    var info = document.getElementById('info');
     info.style.display = 'none';
}