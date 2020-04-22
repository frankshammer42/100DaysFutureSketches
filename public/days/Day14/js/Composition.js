//Set Up Variables
let scene;
let camera;
let container;
let raycaster;
let renderer;
let controls;
//
let testCube;
let cubeNumber = 100;
let cubes = [];
let halfLengthStep = 50;


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
    camera.position.x = 4714;
    camera.position.y = 239;
    camera.position.z = 9;
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
    // testCube = new Cube(0,0,0, 100,100, 10);
    // scene.add(testCube.container);
    createCubes(200, 60);
    setInterval(intervalShuffle, 3000);
    setTimeout(moveAway, 8000);
}

function moveAway(){
    let target = new THREE.Vector3(47405.3, 2403.45, 90.50);
    moveCamera(target, 10000);
}

function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

function intervalShuffle(){
    shufflePosition(60);
}

function shufflePosition(stepLength){
    cubes = shuffle(cubes);
    let startCenter = [0, 0, -10000];
    for (let i=0; i<cubes.length; i++){
        let currentZ = startCenter[2] + i*stepLength;
        let target = new THREE.Vector3(0, 0, currentZ);
        cubes[i].moveToTarget(target, 1000);
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

function createCubes(numberOfCubes, stepLength){
    let startCenter = [0, 0, -10000];
    numberOfCubes = -1*startCenter[2] / stepLength * 2;
    console.log(numberOfCubes);
    for (let i=0; i<numberOfCubes; i++){
        let currentZ = startCenter[2] + i*stepLength;
        let size = Math.random()*500;
        let newCube = new Cube(0,0, currentZ, size, size, 30);
        scene.add(newCube.container);
        cubes.push(newCube);
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
    console.log(controls.object.position);
    TWEEN.update();
    for (let i=0; i<cubes.length; i++){
        cubes[i].update();
    }
    controls.update(); // controls.update();
    requestAnimationFrame( animate );
    render();
}

function render() {
    renderer.render( scene, camera );
}










