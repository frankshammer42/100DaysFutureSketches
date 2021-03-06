//Set Up Variables
let scene;
let camera;
let container;
let raycaster;
let renderer;
let controls;
//Rectangle
let rectangle;
let rectangles = [];
// Animation
let currentRectangleIndex = 0;
let gapTime;
let interval;
let numberToDeform = 5;




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
    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 10000 );
    camera.position.x = 0;
    camera.position.y = 0;
    camera.position.z = -60;
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
    //For generating rectangles
    let point0 = new THREE.Vector3(-20, 10, 0);
    let point1 = new THREE.Vector3(20, 10, 0);
    let point2 = new THREE.Vector3(20, -10, 0);
    let point3 = new THREE.Vector3(-20, -10, 0);
    rectangle = new Rectangle(point0, point1, point2, point3, 0);
    addFragmentedRectangles(rectangle);
    //For change event
    // gapTime = 2;
    // setInterval(setRectangleFree, gapTime);
    setTimeout(moveToSide, 4000);
}

function setRectangleFree(){
    console.log("what");
    if (currentRectangleIndex < rectangles.length){
        rectangles[currentRectangleIndex].deform = true;
        rectangles[currentRectangleIndex].initChange = true;
        currentRectangleIndex += 1;
    }
    else{
        clearInterval(interval);
    }
}

function addFragmentedRectangles(rectangle){
    rectangles.push(rectangle);
    scene.add(rectangle.rectangleCenter);
    // for (let i=0; i<4; i++){
    //     scene.add(rectangle.lines[i]);
    // }
    if (rectangle.cutRectangle0 !== null && rectangle.cutRectangle1 !== null){
        addFragmentedRectangles(rectangle.cutRectangle0);
        addFragmentedRectangles(rectangle.cutRectangle1);
    }
}

function moveToSide(){
    let target = new THREE.Vector3(-158, -2.118, 0.264);
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
    // console.log(controls.object.position);
    if (currentRectangleIndex < rectangles.length - 3){
        rectangles[currentRectangleIndex].deform = true;
        rectangles[currentRectangleIndex].initChange = true;
        rectangles[currentRectangleIndex + 1].deform = true;
        rectangles[currentRectangleIndex + 1].initChange = true;
        rectangles[currentRectangleIndex + 2].deform = true;
        rectangles[currentRectangleIndex + 2].initChange = true;
        currentRectangleIndex += 3;
    }
    for (let i=0; i<rectangles.length; i++){
        rectangles[i].update();
    }
    TWEEN.update();
    controls.update(); // controls.update();
    requestAnimationFrame( animate );
    render();
}

function render() {
    renderer.render( scene, camera );
}
