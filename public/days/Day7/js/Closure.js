//Set Up Variables
let scene;
let camera;
let container;
let raycaster;
let renderer;
let controls;
//Closure Circles
let closureCircle;
let closureCircles = [];


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
    camera.position.x = 8116;
    camera.position.y = 4616;
    camera.position.z = -14758;
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
    // closureCircle = new ClosureCircle([0,0,0], 200);
    // scene.add(closureCircle.closureCircle);
    generateCircles(50, 30);
    // moveCloser();
    setTimeout(MoveUp, 8000);
}


function moveCloser(){
    moveCamera(new THREE.Vector3(0, 3560, 0), 20000);
}

function moveFront(){
    moveCamera(new THREE.Vector3(680, 293, 3481), 10000);
}

function MoveUp(){
    moveCamera(new THREE.Vector3(580, 35780, -1318), 20000);
}

function generateCircles(rowNumber, colNumber){
    let startCenter = [-5000, 0, 5000];
    let radius = 300;
    let step = 800;
    for (let i=0; i<rowNumber; i++){
        let offsetX =i*step + startCenter[0];
        for (let j=0; j<colNumber; j++){
            let offsetZ = j*step - startCenter[2];
            let circle = new ClosureCircle([offsetX, 0, offsetZ], radius);
            scene.add(circle.centerGroup);
            closureCircles.push(circle);
        }
    }
}

function StartComplete(){
    for (let i=0; i<closureCircles.length; i++){
        closureCircles[i].keepRotate = false;
        closureCircles[i].startComplete = true;
    }
}

function MoveToEnd(){
    for (let i=0; i<closureCircles.length; i++){
        closureCircles[i].moveToTarget(6000);
    }
}

function EndRotation(){
    for (let i=0; i<closureCircles.length; i++){
        closureCircles[i].keepRotate = false;
        closureCircles[i].moveToTargetRotation(6000);
    }
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
        }).onComplete(StartComplete)
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

function animate() {
    console.log(controls.object.position);
    controls.update(); // controls.update();
    TWEEN.update();
    for (let i=0; i<closureCircles.length; i++){
        closureCircles[i].update();
    }
    requestAnimationFrame( animate );
    render();
}

function render() {
    renderer.render( scene, camera );
}


