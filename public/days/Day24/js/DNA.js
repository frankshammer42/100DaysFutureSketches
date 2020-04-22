//Set Up Variables
let scene;
let camera;
let container;
let raycaster;
let renderer;
let controls;
//DNA Test
let DNA;
let DNAHuman = [];

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
    camera.position.z = 1000;
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

    // let start = new THREE.Vector3(-200, 0, 0);
    // let end = new THREE.Vector3(200, 0, 0);
    // dnaLine = new Line(start, end, 10, 1000);
    // scene.add(dnaLine.line);
    // let center = new THREE.Vector3(0, 0, 0);
    // let rotation = new THREE.Vector3(0.5*Math.PI, 0, 0);
    // DNA = new DNAStructure(center, rotation);
    // scene.add(DNA.dna);
    createHumanDNA();
    moveToFar();
}

function createHumanDNA(){
    let numberOfDNA = 50;
    for (let i=0; i<numberOfDNA; i++){
        let boundingSize = 10000;
        let randomX = Math.random() * boundingSize - boundingSize/2;
        let randomY = Math.random() * boundingSize - boundingSize/2;
        let randomZ = Math.random() * boundingSize - boundingSize/2;
        let position = new THREE.Vector3(randomX, randomY, randomZ);
        let randomXrotation = Math.random() * Math.PI * 2;
        let randomYrotation = Math.random() * Math.PI * 2;
        let randomZrotation = Math.random() * Math.PI * 2;
        // let rotation = new THREE.Vector3(randomXrotation, randomYrotation, randomZrotation);
        let rotation = new THREE.Vector3(0,0,0);
        let newDNA = new DNAStructure(position, rotation);
        DNAHuman.push(newDNA);
        scene.add(newDNA.dna);
    }
}

// function createDNA(){
//     let startPosition = new THREE.Vector3(0, 2500, 0);
//     let lineGap = 100;
//     let initRotation  = 0.5 * Math.PI;
//     let numberOfLinesPerCycle = 20;
//     let rotationUnit = Math.PI * 2 / numberOfLinesPerCycle;
//     let numberOfLines = 200;
//     let halfLineLength = 300;
//     for (let i=0; i<numberOfLines; i++){
//         let currentPosition = new THREE.Vector3(0, startPosition.y-i*lineGap, 0);
//         let currentYrotation = initRotation + rotationUnit*i;
//         let currentHalfLength = halfLineLength + 100*Math.cos(currentYrotation);
//         let start = new THREE.Vector3(-currentHalfLength, 0, 0);
//         let end = new THREE.Vector3(currentHalfLength, 0, 0);
//         let dLine = new Line(start, end, 10, 1000);
//         dLine.lineCenter.position.copy(currentPosition);
//         dLine.lineCenter.rotation.y = currentYrotation;
//         scene.add(dLine.lineCenter);
//         DNA.push(dLine);
//     }
// }

function moveToFar(){
    let target = new THREE.Vector3(0, 0, 13690);
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

function animate(){
    console.log(controls.object.position);
    for (let i=0; i<DNAHuman.length; i++){
        DNAHuman[i].update();
    }
    TWEEN.update();
    controls.update(); // controls.update();
    requestAnimationFrame( animate );
    render();
}

function render() {
    renderer.render( scene, camera );
}










