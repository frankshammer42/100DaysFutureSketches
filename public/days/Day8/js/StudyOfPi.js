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
    camera.position.x = 0;
    camera.position.y = 550;
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
    // closureCircle = new Circle([0,0,0], 500);
    // scene.add(closureCircle.piStudyCircle);
    generateCircles(1, 40);
    setTimeout(moveSide, 5000);
}


function generateCircles(rowNumber, colNumber){
    let startCenter = [-5000, 0, 5000];
    let radius = 300;
    let step = 800;
    let rotation_single = 2*Math.PI/colNumber;
    for (let i=0; i<rowNumber; i++){
        let offsetX =i*step + startCenter[0];
        for (let j=0; j<colNumber; j++){
            let offsetZ = j*step - startCenter[2];
            let circle = new Circle([offsetX, 0, offsetZ], radius, j, rotation_single*j);
            scene.add(circle.piStudyCircle);
            closureCircles.push(circle);
        }
    }
}

function moveSide(){
    console.log("start moving");
    let destination = new THREE.Vector3(-600, 0, 0);
    moveCamera(destination, 10000);
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

function animate() {
    controls.update(); // controls.update();
    // console.log(controls.object.position);
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


