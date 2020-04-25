//Set Up Variables
let scene;
let camera;
let container;
let raycaster;
let renderer;
let controls;
//Life point
let rowLives = 45;
let colLives = 90;
let lifePoint;
let circularThoughts = [];


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
    camera.position.y = 50;
    camera.position.z = 747;
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
    //
    // lifePoint = new BadCircularThoughts(0, 0);
    // scene.add(lifePoint.lifePoint);
    createBadCircularThoughts();
    moveToFar();
}

function moveToFar(){
    let target = new THREE.Vector3(0, 757, 11323);
    moveCamera(target, 25000);
}

function moveCamera(target, tweenTime){
    let deepTripPosition = new TWEEN.Tween( controls.object.position )
        .to( {
            x: target.x,
            y: target.y,
            z: target.z
        }, tweenTime)
        .easing( TWEEN.Easing.Cubic.InOut ).onUpdate( function () {
        })
        .start();
}

function createBadCircularThoughts(){
    let start_x = -5800*1.5;
    let start_y = -3000*1.5;
    let step = 200;
    let currentX = 0;
    let currentY = 0;
    for (let i=0; i<rowLives; i++){
        currentY = start_y + i*step;
        for (let j=0; j<colLives; j++){
            currentX = start_x + j*step;
            let newCircularThoughts = new BadCircularThoughts(currentX, currentY);
            scene.add(newCircularThoughts.lifePoint);
            scene.add(newCircularThoughts.container.sourceCircle);
            circularThoughts.push(newCircularThoughts);
        }
    }
}

function generateRandomNumberInRange(min, max) {
    let highlightedNumber = Math.random() * (max - min) + min;
    return highlightedNumber;
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

function animate() {
    TWEEN.update();
    controls.update(); // controls.update();
    for (let i=0; i<circularThoughts.length; i++){
        circularThoughts[i].update();
    }
    requestAnimationFrame( animate );
    render();
}

function render() {
    renderer.render( scene, camera );
}










