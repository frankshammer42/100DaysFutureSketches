//Set Up Variables
let scene;
let camera;
let container;
let raycaster;
let renderer;
let controls;
// triangle related variables
let triangle;
let triangles = [];

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
    camera.position.z = -300;
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
    createTriangles();
}

function createTriangles(){
    let numberOfTriangles = 300;
    let yOffsetStep = 0.5;
    for (let i=0; i<numberOfTriangles; i++){
        let yOffset = 3 + yOffsetStep*i;
        let point0 = new THREE.Vector3(-50, 0, 0);
        let point1 = new THREE.Vector3(50, 0, 0);
        let point2 = new THREE.Vector3(0, yOffset, 0);
        let newTriangle = new Triangle(point0, point1, point2);
        scene.add(newTriangle.triangleCenter);
        // for (let i=0; i<3; i++){
        //     scene.add(newTriangle.lines[i]);
        // }
        triangles.push(newTriangle);
    }
}

function moveToSide(){
    let target = new THREE.Vector3(-9232, 18.5, -500);
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
    for (let i=0; i<triangles.length; i++){
        triangles[i].update();
    }
    console.log(controls.object.position);
    TWEEN.update();
    controls.update(); // controls.update();
    requestAnimationFrame( animate );
    render();
}

function render() {
    renderer.render( scene, camera );
}










