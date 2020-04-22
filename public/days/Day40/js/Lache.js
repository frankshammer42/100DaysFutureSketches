//Set Up Variables
let scene;
let camera;
let container;
let raycaster;
let renderer;
let controls;
// Lache Pairs
let connectedPair;
let sinConnections  = [];
let pairs = [];


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
    camera.position.z = 100;
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
    // lifePoint = new ConnectedPair(0, 0);
    // scene.add(lifePoint.lifePoint);
    // connectedPair = new ConnectedPair(20);
    // scene.add(connectedPair.leftPoint);
    // scene.add(connectedPair.rightPoint);
    // for (let i=0; i<connectedPair.connectionList.length; i++){
    //     scene.add(connectedPair.connectionList[i].sinLine);
    // }
    // scene.add(connectedPair.pair);
    // for (let i=0; i<20; i++){
    //     let leftPos  = new THREE.Vector3(connectedPair.leftX, connectedPair.leftY, 0);
    //     let rightPos  = new THREE.Vector3(connectedPair.rightX, connectedPair.rightY, 0);
    //     let sinCon = new SinCon(leftPos, rightPos, (i)*10);
    //     scene.add(sinCon.sinLine);
    //     sinConnections.push(sinCon);
    // }
    // for (let i=0; i<20; i++){
    //     let leftPos  = new THREE.Vector3(connectedPair.leftX, connectedPair.leftY, 0);
    //     let rightPos  = new THREE.Vector3(connectedPair.rightX, connectedPair.rightY, 0);
    //     let sinCon = new SinCon(leftPos, rightPos, (i+1)*-10);
    //     scene.add(sinCon.sinLine);
    //     sinConnections.push(sinCon);
    // }
    createPairs();
    // connectedPair = new ConnectedPair(100, new THREE.Vector3(0,0,0), new THREE.Vector3(0,0,0));
    // scene.add(connectedPair.pair);
}

function createPairs(){
    let range = 1500;
    for  (let i=0; i<12; i++){
        // let x = Math.random()*range - range/2;
        let x = i*1000 - 6000;
        // let y = Math.random()*range - range/2;
        // let z = Math.random()*range - range/2;
        let y = 0;
        let z = 0;
        // let size = Math.random()*50 + 20;
        let size = 200;
        let xRot = 0;
        let yRot = 0;
        let zRot = 0.5 * Math.PI - (i+1)/12 * Math.PI*2;
        // let yRot = 0;
        // let zRot = 0;
        let connectedPair = new ConnectedPair(size, new THREE.Vector3(x,y,z), new THREE.Vector3(xRot, yRot, zRot));
        // let connectedPair = new ConnectedPair(size, new THREE.Vector3(x,y,z), new THREE.Vector3(0, 0, 0));
        connectedPair.speed = 10;
        // connectedPair.speed = 2;
        scene.add(connectedPair.pair);
        pairs.push(connectedPair);
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
    for (let i=0; i<pairs.length; i++){
        pairs[i].update();
    }
    // connectedPair.update();
    controls.update(); // controls.update();
    console.log(controls.object.position);
    requestAnimationFrame( animate );
    render();
}

function render() {
    renderer.render( scene, camera );
}










