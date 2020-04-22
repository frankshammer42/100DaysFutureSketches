//Set Up Variables
let scene;
let camera;
let container;
let raycaster;
let renderer;
let controls;
//Create curves
let curve;
let curves = [];

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
    camera.position.x = 0;
    camera.position.y = 25000;
    camera.position.z = 0;
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
    //create Curve
    // let start = new THREE.Vector3(0, 0, 0);
    // curve = new Curve(start);
    // scene.add(curve.sourceCurve);
    createCurves();
}

function createCurves(){
    for (let i=0; i<500; i++){
        let start = new THREE.Vector3(0, 0, 0);
        let newCurve = new Curve(start);
        scene.add(newCurve.sourceCurve);
        curves.push(newCurve);
    }
}

function distance(p1, p2){
    let diff_x = p1[0] - p2[0];
    let diff_y = p1[1] - p2[1];
    let diff_z = p1[2] - p2[2];
    let diffVector = new THREE.Vector3(diff_x, diff_y, diff_z);
    return diffVector.length();
}

function moveSide(){
    console.log("start moving");
    let destination = new THREE.Vector3(-1558.75, 4464.33, 19432.96);
    moveCamera(destination, 9000);
}


function moveCamera(target, tweenTime){
    let deepTripPosition = new TWEEN.Tween( controls.object.position )
        .to( {
            x: target.x,
            y: target.y,
            z: target.z
        }, tweenTime)
        .easing( TWEEN.Easing.Cubic.InOut ).onUpdate( function () {
            console.log("whatever man");
        })
        .start();
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

function chooseRandomSample(max){
    let result = Math.floor(Math.random()*max);
    return result;
}

function animate() {
    controls.update(); // controls.update();
    for (let i=0; i<curves.length; i++){
        curves[i].update();
    }
    // sc.update();
    // generateCircles(30, 20);
    // closureCircle.update();
    TWEEN.update();
    requestAnimationFrame( animate );
    render();
}

function render() {
    renderer.render( scene, camera );
}


