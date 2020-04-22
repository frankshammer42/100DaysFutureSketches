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
let maxSegmentCount = 32;


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
    camera.position.x = -36806.65;
    camera.position.y = 3041;
    camera.position.z = 74.02;
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
    step = 100;
    let start = new THREE.Vector3(-4000, 2000, 0);
    let end = new THREE.Vector3(4000, 2000, 0);
    // line = new Line(start, end, 5, 4000);
    // scene.add(line.line);
    // cube = new Cube(50,0,0, 500, 2000, 500);
    // cube.stepLength = 2;
    // scene.add(cube.cubeCenter);
    // scene.add(cube.container);
    // setTimeout(moveToSide, 10000);
    // cube  = new Cube(0, 0,0, 100, 500, 100, 2, false);
    // scene.add(cube.cubeCenter);
    createCircleCubes(1500);




    // let cube1  = new Cube(-250, 0,0, 100, 500, 100, 2, true);
    // scene.add(cube1.cubeCenter);
    // let cube2  = new Cube(0, 0,-250, 100, 500, 100, 0, false);
    // scene.add(cube2.cubeCenter);
    // let cube3  = new Cube(0, 0,250, 100, 500, 100, 0,  true);
    // scene.add(cube3.cubeCenter);
    // cubes.push(cube0);
    // cubes.push(cube1);
    // cubes.push(cube2);
    // cubes.push(cube3);
}

function moveToSide(){
    let target = new THREE.Vector3(-9232, 18.5, -500);
    moveCamera(target, 25000);
}


function createCircleCubes(radius){
    for (let i=0; i<maxSegmentCount; i++){
        let theta = (i/maxSegmentCount) * 2 * Math.PI;
        let x = Math.cos(theta)*radius;
        let z = Math.sin(theta)*radius;
        let newCube;
        if (i > maxSegmentCount/2){
            newCube  = new Cube(x, -15000, z, 100, 500, 100, 2, true);
        }
        else{
            newCube  = new Cube(x, -15000, z, 100, 500, 100, 2, true);
        }
        newCube.cubeCenter.rotation.y = 2*Math.PI - theta;
        scene.add(newCube.cubeCenter);
        cubes.push(newCube);
    }
}







// function createCities(){
//     for (let i=0; i<500; i++){
//         // let currentX = start.x + i*step;
//         let randomX = generateRandomNumberInRange(-2000, 2000);
//         let randomY = generateRandomNumberInRange(-2000, 2000);
//         let randomZ = generateRandomNumberInRange(-2000, 2000);
//         // let randomRotationStep = generateRandomNumberInRange(-0.01, 0.01);
//         let randomRotationStep = generateRandomNumberInRange(0, 1);
//         if (randomRotationStep > 0.5){
//             randomRotationStep = -0.01;
//         }
//         else{
//             randomRotationStep = 0.01;
//         }
//         // let newCube = new Cube(currentX, start.y, -1000, 50, 200, 50);
//         let newCube = new Cube(randomX, randomY, randomZ, 50, 200, 50);
//         newCube.stepLength = Math.random()*10;
//         newCube.rotationStep = randomRotationStep;
//         scene.add(newCube.cubeCenter);
//         cubes.push(newCube);
//     }
//     // for (let i=0; i<80; i++){
//     //     let currentX = start.x + i*step;
//     //     let newCube = new Cube(currentX, -start.y, 0, 50, 200, 50);
//     //     newCube.stepLength = Math.random()*10;
//     //     scene.add(newCube.container);
//     //     cubes.push(newCube);
//     // }
// }

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
    // cube.update();
    console.log(controls.object.position);
    for (let i=0; i<cubes.length; i++){
        cubes[i].update();
        if (cubes[i].replicate){
            let newCube = new Cube(cubes[i].x, cubes[i].y, cubes[i].z, 100, 500, 100, cubes[i].rotationAxis, cubes[i].positiveRotation);
            newCube.cubeCenter.rotation.y = cubes[i].cubeCenter.rotation.y;
            scene.add(newCube.cubeCenter);
            cubes[i].alreadyReplicated = true;
            cubes[i].replicate = false;
            cubes[i].upSpeed *= 0.6;
            cubes.push(newCube);
        }
    }
    // line.update();
    TWEEN.update();
    controls.update(); // controls.update();
    requestAnimationFrame( animate );
    render();
}

function render() {
    renderer.render( scene, camera );
}










