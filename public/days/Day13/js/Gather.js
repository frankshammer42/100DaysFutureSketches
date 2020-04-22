//Set Up Variables
let scene;
let camera;
let container;
let raycaster;
let renderer;
let controls;
//Source Circles
let numberOfCircles = 800;
let sc;
let srcCircles = [];


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
    camera.position.y = 3306;
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

    // sc = new Source([0,0,0], 50);
    // scene.add(sc.sourceCircle);
    // for (let i=0; i<10; i++){
    //     scene.add(sc.translines[i]);
    // }
    //
    // let sc_0 = new Source([100, 0, 145], 50);
    // scene.add(sc_0.sourceCircle);
    // for (let i=0; i<10; i++){
    //     scene.add(sc_0.translines[i]);
    // }
    // sc.updateTransmissionLine(new THREE.Vector3(sc_0.center[0], sc_0.center[1], sc_0.center[2]), 0);
    createSourceCircles();
    updateTransLines();
}

function createSourceCircles(){
    for (let i=0; i<numberOfCircles; i++){
        let centerX = Math.random()*5000 - 2500;
        let centerY = 0;
        let centerZ = Math.random()*5000 - 2500;
        let srcCircle = new Source([centerX, centerY, centerZ], 20);
        scene.add(srcCircle.sourceCircle);
        for (let i=0; i<10; i++){
            scene.add(srcCircle.translines[i]);
        }
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
        for (let j=i+1; j<numberOfCircles; j++){
            let offset = distance(srcCircles[i].center, srcCircles[j].center);
            console.log(offset);
            if (offset < 300 && srcCircles[i].currentTransLineIndex < 10){
                // console.log("here?");
                let otherCircle = srcCircles[j];
                let otherPos = new THREE.Vector3(otherCircle.center[0], otherCircle.center[1], otherCircle.center[2]);
                srcCircles[i].updateTransmissionLine(otherPos, srcCircles[i].currentTransLineIndex);
                srcCircles[i].currentTransLineIndex += 1;
            }
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


