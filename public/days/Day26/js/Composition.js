//Set Up Variables
let scene;
let camera;
let container;
let raycaster;
let renderer;
let controls;
//Knots Test
let knot;
let knots = [];


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
    camera.position.y = 0;
    camera.position.z = 19507;
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

    // let start = new THREE.Vector3(0, 2000, 0);
    // let end = new THREE.Vector3(0, -2000, 0);
    // knot= new Line(start, end, 1, 1000, 500);
    // scene.add(knot.lineCenter);
    createKnots();
}

function moveToFar(){
    let target = new THREE.Vector3(0, 0, 13690);
    moveCamera(target, 25000);
}

function createKnots(){
    let boundingSize = 12000;
    for (let i=0; i<300; i++){
        let randomX = Math.random() * boundingSize - boundingSize/2;
        let randomY = Math.random() * boundingSize - boundingSize/2;
        let randomZ = Math.random() * boundingSize - boundingSize/2;
        let position = new THREE.Vector3(randomX, randomY, randomZ);
        let randomXrotation = Math.random() * Math.PI * 2;
        let randomYrotation = Math.random() * Math.PI * 2;
        let randomZrotation = Math.random() * Math.PI * 2;
        let start = new THREE.Vector3(0, 4000, 0);
        let end = new THREE.Vector3(0, -4000, 0);
        let indexToChange = 200 + Math.floor(Math.random()*800);
        let newKnot = new Line(start, end, 1, 2000, indexToChange);
        newKnot.lineCenter.position.copy(new THREE.Vector3(randomX, randomY, randomZ));
        scene.add(newKnot.lineCenter);
        knots.push(newKnot);
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

function animate(){
    // knot.update();
    for (let i=0; i<knots.length; i++){
        knots[i].update();
    }
    // console.log(controls.object.position);
    TWEEN.update();
    controls.update(); // controls.update();
    requestAnimationFrame( animate );
    render();
}

function render() {
    renderer.render( scene, camera );
}










