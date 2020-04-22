//Set Up Variables
let scene;
let camera;
let container;
let raycaster;
let renderer;
let controls;
//
let personPoint;
let personPoints = [];
let pointsGroup = new THREE.Group();
// init related var
let maxHeight = 5000;
let maxRadius = 1000;
// Center Line
let centerLine;

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
    camera.position.z = 5000;
    camera.far = 1000000;
    camera.updateProjectionMatrix();
    // geometry
    controls = new THREE.OrbitControls( camera, container );
    controls.addEventListener( 'change', render );
    scene = new THREE.Scene();
    scene.background =  new THREE.Color( 0x000000);
    // scene.background =  new THREE.Color( 0x000000);
    renderer = new THREE.WebGLRenderer( { antialias: true} );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.gammaInput = true;
    renderer.gammaOutput = true;
    container.appendChild( renderer.domElement );
    window.addEventListener( 'resize', onWindowResize, false );
    let start = new THREE.Vector3(0, 52000, 0);
    let end = new THREE.Vector3(0, 0, 0);
    centerLine = new Line(start, end, 2, 2000);
    addCircleLines();
    scene.add(pointsGroup);
    setTimeout(startArrival, 7000);
    setTimeout(moveCam, 7000);
}


function startArrival(){
    for (let i=0; i<personPoints.length; i++){
        personPoints[i].xRotateAngleSpeed = Math.random()*0.008;
        personPoints[i].zRotateAngleSpeed = Math.random()*0.008;
    }
}

function moveCam(){
    let target = new THREE.Vector3(0,0,30000);
    let tweenTime = 10000;
    let tweenCam = new TWEEN.Tween(controls.object.position).to({
        x: target.x,
        y: target.y,
        z: target.z
    }, tweenTime).easing(TWEEN.Easing.Cubic.InOut).onUpdate(function() {
        console.log(
        'wtf'
        );
    }).onComplete(() => (console.log("fuck")))
    .start();
}

function addCircleLines(){
    let randomScale = 1000;
    let totalNumber = 200;
    for (let i=0; i<totalNumber; i++){
        let randomInit = new THREE.Vector3(Math.random()*randomScale - randomScale/2, Math.random()*randomScale - randomScale/2, Math.random()*randomScale - randomScale/2);
        let newTrail = new PersonPoint(1600, 0, randomInit);
        // newTrail.xRotationAngle = Math.random()*Math.PI*2 - Math.PI;
        // newTrail.zRotationAngle = Math.random()*Math.PI*2 - Math.PI;
        newTrail.xRotationAngle = Math.PI*0.5 + (Math.random()*0.01 - 0.005);
        newTrail.zRotationAngle = 0;
        newTrail.rotateSpeed = Math.random()*0.02 - 0.5*0.02;
        newTrail.xRotateAngleSpeed = 0;
        newTrail.zRotateAngleSpeed = 0;
        newTrail.useOffset = false;
        personPoints.push(newTrail);
        // scene.add(newTrail.point);
        // scene.add(newTrail.trailLine);
        pointsGroup.add(newTrail.point);
        pointsGroup.add(newTrail.trailLine);
    }
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

function animate() {
    for (let i=0; i<personPoints.length; i++){
        personPoints[i].update();
    }
    TWEEN.update();
    // console.log(controls.object.position.z);
    controls.update(); // controls.update();
    requestAnimationFrame( animate );
    render();
}

function render() {
    renderer.render( scene, camera );
}

//Rotation Init Related Function
