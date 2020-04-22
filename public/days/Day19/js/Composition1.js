//Set Up Variables
let scene;
let camera;
let container;
let raycaster;
let renderer;
let controls;
//
let cube;
let cubeNumber = 100;
let cubes = [];
let line;
let step;
let lifeLine;
let currentToGo = 0;


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
    camera.position.y = 971;
    camera.position.z = 8325;
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
    // cube = new Cube(0,400,60,100, 2000);
    // scene.add(cube.cubeCenter);
    // step = 100;
    // lifeLine = new LifeLine(new THREE.Vector3(0,0,0), 1000, 100, 1);
    // scene.add(lifeLine.line);

    createCities();
    setTimeout(createMove, 8000);
}

function moveToSide(){
    let target = new THREE.Vector3(-9232, 18.5, -500);
    moveCamera(target, 25000);
}

function createMove(){
    let originVector  = new THREE.Vector3(0, 0, 0);
    for (let i=0; i<cubes.length; i++) {
        let tweenTime  = generateRandomNumberInRange(5000, 10000);
        cubes[i].moveToTarget(tweenTime, originVector);
    }
}


function createCities(){
    let start = new THREE.Vector3(-4000, 2000, 0);
    let originVector  = new THREE.Vector3(0, 0, 6000);
    for (let i=0; i<17238; i++){
        // let currentX = start.x + i*step;
        // let randomX = generateRandomNumberInRange(-20000, 20000);
        // let randomY = generateRandomNumberInRange(-20000, 20000);

        let randomZ = generateRandomNumberInRange(-20000, 20000);
        let randomTheta = Math.random()*Math.PI*2;
        let randomR = generateRandomNumberInRange(15000, 20000);
        let randomX = randomR*Math.cos(randomTheta);
        let randomY = randomR*Math.sin(randomTheta);
        let tweenTime  = generateRandomNumberInRange(5000, 10000);

        // let randomRotationStep = generateRandomNumberInRange(-0.01, 0.01);
        // let randomRotationStep = generateRandomNumberInRange(0, 1);
        // if (randomRotationStep > 0.5){
        //     randomRotationStep = -0.01;
        // }
        // else{
        //     randomRotationStep = 0.01;
        // }
        // let newCube = new Cube(currentX, start.y, -1000, 50, 200, 50);
        let newCube;
        if (i === 0){
            newCube = new Cube(0, 0, 6000, 100, 1000);
        }
        else{
            newCube = new Cube(randomX, randomY, randomZ, 100, 1000);
        }
        scene.add(newCube.cubeCenter);
        cubes.push(newCube);
        // if (i === currentToGo){
        //     newCube.moveToTarget(tweenTime, originVector);
        // }
    }
    // for (let i=0; i<80; i++){
    //     let currentX = start.x + i*step;
    //     let newCube = new Cube(currentX, -start.y, 0, 50, 200, 50);
    //     newCube.stepLength = Math.random()*10;
    //     scene.add(newCube.container);
    //     cubes.push(newCube);
    // }
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
    // lifeLine.update();
    // cube.update();
    let total_number = 0;
    for (let i=0; i<cubes.length; i++){
        cubes[i].update();
        if (cubes[i].goNext){
            total_number += 1;
        }
    }
    document.getElementById("overlay").innerText = total_number.toString();

    // let originVector = new THREE.Vector3(0,0,6000);
    // let tweenTime  = generateRandomNumberInRange(100, 1000);
    // if (cubes[currentToGo].goNext){
    //     currentToGo += 1;
    //     if (currentToGo < cubes.length){
    //         cubes[currentToGo].moveToTarget(tweenTime, originVector);
    //     }
    // }
    // line.update();
    TWEEN.update();
    controls.update(); // controls.update();
    requestAnimationFrame( animate );
    render();
}

function render() {
    renderer.render( scene, camera );
}










