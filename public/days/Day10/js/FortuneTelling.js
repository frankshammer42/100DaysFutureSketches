//Set Up Variables
let scene;
let camera;
let container;
let raycaster;
let renderer;
let controls;
//Fortune Telling
let fortuneLine;
let fortuneLines = [];


//Main Loop------------------------------------------------------
init();
animate();

//Scene Related Function-------------------------------------------------------------------------------------------------------
function reset_scene(){
    console.log("Reset the Scene");
    for( let i = scene.children.length - 1; i >= 0; i--) {
        let obj = scene.children[i];
        scene.remove(obj);
    }
}

function init() {
    // ---------------------Env Set Up
    raycaster = new THREE.Raycaster();
    container = document.getElementById( 'container' );
    // camera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 0.1, 4000 );
    // camera.position.z = 500;
    // camera
    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 10000 );
    camera.position.z = 3200;
    camera.position.y = 300;
    camera.far = 1000000;
    camera.updateProjectionMatrix();
    // geometry
    controls = new THREE.OrbitControls( camera, container );
    controls.addEventListener( 'change', render );
    scene = new THREE.Scene();
    renderer = new THREE.WebGLRenderer( { antialias: true} );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.gammaInput = true;
    renderer.gammaOutput = true;
    container.appendChild( renderer.domElement );
    window.addEventListener( 'resize', onWindowResize, false );
    let initPosition  = new THREE.Vector3(0, 0, 0);
    //fortuneLine = new MingLine(initPosition, false);
    //scene.add(fortuneLine.lineGroup);
    generateFortuneLines();
}


function generateRandomNumberInRange(min, max) {
    let highlightedNumber = Math.random() * (max - min) + min;
    return highlightedNumber;
}

function generateFortuneLines(){
    let rowNumber = 400;
    let colNumber = 800;
    let lineLength = 200;
    let startPosition = -80000;
    for (let i=0; i<colNumber; i++){
        let currentPosition = startPosition + i*lineLength;
        let position = new THREE.Vector3(currentPosition, 0, 0);
        let fl = new MingLine(position, true);
        scene.add(fl.lineGroup);
        fl.moveLineTarget(4000);
        fortuneLines.push(fl);
    }
    for (let i=0; i<rowNumber; i++){
        let currentPosition = -40000 + i*lineLength;
        let position = new THREE.Vector3(0, currentPosition, 0);
        let fl = new MingLine(position, false);
        scene.add(fl.lineGroup);
        fl.moveLineTarget(4000);
        fortuneLines.push(fl);
    }
}


function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

function animate() {
    controls.update(); // controls.update();
    TWEEN.update();
    requestAnimationFrame( animate );
    render();
}

function render() {
    renderer.render( scene, camera );
}










