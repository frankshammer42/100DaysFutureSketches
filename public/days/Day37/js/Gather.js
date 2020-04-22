//Set Up Variables
let scene;
let camera;
let container;
let raycaster;
let renderer;
let controls;
//Source Circles
let numberOfCircles = 200;
let sc;
let srcCircles = [];
let layer0;
let layer0_points = [];
let layer1;
let layer1_points = [];
let layer2;
let layer2_points = [];


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
    camera.position.y = 5000;
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

    createLayer();
    createLayerFilterPosition();
    createSourceCircles();
    updateTransLines();
    setTimeout(moveFar, 12000);
}

function createLayer(){
    layer0 = new Cube(0,0,0, 1200, 100, 100);
    layer1 = new Cube(0, 0, -900, 500, 100, 100);
    layer2 = new Cube(0, 0, -2000, 100, 100, 100);
    scene.add(layer0.cubeCenter);
    scene.add(layer1.cubeCenter);
    scene.add(layer2.cubeCenter);
}

function createLayerFilterPosition(){
    for (let i=0; i<numberOfCircles; i++){
        let centerX = Math.random()*2200 - 1100;
        let centerY = 0;
        let centerZ = Math.random()*200 - 100;
        let layer0_point =  new THREE.Vector3(centerX, centerY, centerZ);
        layer0_points.push(layer0_point);

        let laye1CenterX  = Math.random()*900 - 450;
        let laye1CenterY  = 0;
        let laye1CenterZ  = Math.random()*200 - 100 - 900;
        let layer1_point =  new THREE.Vector3(laye1CenterX, laye1CenterY, laye1CenterZ);
        layer1_points.push(layer1_point);

        let laye2CenterX  = Math.random()*90 - 45;
        let laye2CenterY  = 0;
        let laye2CenterZ  = Math.random()*200 - 100 - 2000;
        let layer2_point =  new THREE.Vector3(laye2CenterX, laye2CenterY, laye2CenterZ);
        layer2_points.push(layer2_point);
    }
}

function createSourceCircles(){
    for (let i=0; i<numberOfCircles; i++){
        let centerX = Math.random()*5000 - 2500;
        let centerY = 0;
        let centerZ = Math.random()*300 + 1500;
        let srcCircle = new Source([centerX, centerY, centerZ], 50);
        scene.add(srcCircle.sourceCircle);
        scene.add(srcCircle.transline0);
        scene.add(srcCircle.transline1);
        scene.add(srcCircle.transline2);
        // for (let i=0; i<10; i++){
        //     scene.add(srcCircle.translines[i]);
        // }
        srcCircles.push(srcCircle);
    }
}

function distance(p1, p2){
    let diff_x = p1[0] - p2[0];
    let diff_y = p1[1] - p2[1];
    let diff_z = p1[2] - p2[2];
    let diffVector = new THREE.Vector3(diff_x, diff_y, diff_z);
    return diffVector.length();
}

function updateTransLines(){
    for (let i=0; i<numberOfCircles; i++){
        srcCircles[i].updateTransmissionLine(layer0_points[i], layer1_points[i], layer2_points[i]);
        // for (let j=i+1; j<numberOfCircles; j++){
        //     let offset = distance(srcCircles[i].center, srcCircles[j].center);
        //     if (offset < 800 && srcCircles[i].currentTransLineIndex < 10){
        //         // console.log("here?");
        //         let otherCircle = srcCircles[j];
        //         let otherPos = new THREE.Vector3(otherCircle.center[0], otherCircle.center[1], otherCircle.center[2]);
        //         srcCircles[i].updateTransmissionLine(otherPos, srcCircles[i].currentTransLineIndex);
        //         srcCircles[i].currentTransLineIndex += 1;
        //     }
        // }
    }
}

function moveFar(){
    console.log("start moving");
    let destination = new THREE.Vector3(0, 10000, 0);
    moveCamera(destination, 20000);
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
    for (let i=0; i<numberOfCircles; i++){
        srcCircles[i].update();
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


