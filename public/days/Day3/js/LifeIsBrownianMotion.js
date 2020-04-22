//Set Up Variables
let scene;
let camera;
let container;
let raycaster;
let renderer;
let controls;
//Life point
let rowLives = 15;
let colLives = 30;
let lifePoint;
let lifePoints = [];


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
    camera.position.z = 4500;
    camera.position.y = 300;
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
    // lifePoint = new BrownianLife(0, 0);
    // scene.add(lifePoint.lifePoint);
    createLifePoints();
}

function createLifePoints(){
    let start_x = -2900;
    let start_y = -1500;
    let step = 200;
    let currentX = 0;
    let currentY = 0;
    for (let i=0; i<rowLives; i++){
        currentY = start_y + i*step;
        for (let j=0; j<colLives; j++){
            currentX = start_x + j*step;
            let newLifePoint = new BrownianLife(currentX, currentY);
            scene.add(newLifePoint.lifePoint);
            scene.add(newLifePoint.container);
            lifePoints.push(newLifePoint);
        }
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
    controls.update(); // controls.update();
    for (let i=0; i<lifePoints.length; i++){
        lifePoints[i].update();
    }
    requestAnimationFrame( animate );
    render();
}

function render() {
    renderer.render( scene, camera );
}










