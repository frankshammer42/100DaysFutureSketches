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
    camera.position.z = 32808;
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
    //
    let start = new THREE.Vector3(0, 52000, 0);
    let end = new THREE.Vector3(0, 0, 0);
    centerLine = new Line(start, end, 2, 2000);
    // scene.add(centerLine.line);

    // light
    // getLight();
    //model
    // loadModel();

    // addPoints();
    // addOnePoint();
    // addRehoboamLines0();
    addRehoboamLines();
}

function addRehoboamLines(){
    let initPosition = new THREE.Vector3(-10000, 0, 0);
    let totalNumber = 200;
    let startRadius = 1000;
    let gap = startRadius/(totalNumber/2);
    for (let i=0; i<totalNumber/2; i++){
        let currentHeight = i*gap;
        let currentRadius = Math.sqrt(Math.pow(startRadius,2) - Math.pow(currentHeight, 2));
        personPoint = new PersonPoint(currentRadius, currentHeight, initPosition);
        scene.add(personPoint.point);
        scene.add(personPoint.trailLine);
        personPoints.push(personPoint);
        personPoint = new PersonPoint(currentRadius, -currentHeight, initPosition);
        scene.add(personPoint.point);
        scene.add(personPoint.trailLine);
        personPoints.push(personPoint);
    }
}

function addRehoboamLines0(){
    let startHeight = 0;
    let gap = 100;
    let totalNumber = 500;
    let startRadius = 50;
    let initPosition = new THREE.Vector3(-10000, 0, 0);
    let sphereRadius = 0;
    for (let i=0; i<totalNumber/2; i++){
        let height = startHeight + i*gap;
        let radius = startRadius + i*gap;
        personPoint = new PersonPoint(radius, height, initPosition);
        scene.add(personPoint.point);
        scene.add(personPoint.trailLine);
        personPoints.push(personPoint);
        sphereRadius = radius;
    }
    for (let i=totalNumber/2; i<totalNumber-1; i++){
        let height = startHeight + i*gap;
        let radius = sphereRadius - (i - totalNumber/2)*gap;
        personPoint = new PersonPoint(radius, height, initPosition);
        scene.add(personPoint.point);
        scene.add(personPoint.trailLine);
        personPoints.push(personPoint);
    }
}

function addOnePoint(){
    let initPosition = new THREE.Vector3(-10000, 0, 0);
    let randomHeight = Math.random()*maxHeight;
    let randomRadius = Math.random()*maxRadius ;
    personPoint = new PersonPoint(randomRadius, randomHeight, initPosition);
    scene.add(personPoint.point);
    scene.add(personPoint.trailLine);
    personPoints.push(personPoint);
}

function addPoints(){
    let initPosition = new THREE.Vector3(-10000, 0, 0);
    for (let i=0; i<500; i++) {
        let randomHeight = Math.random()* maxHeight;
        // let randomRadius = Math.random()*maxRadius * Math.random() + 200; //For QingMing Structure
        let randomRadius = Math.random()* maxRadius + 200;
        personPoint = new PersonPoint(randomRadius, randomHeight, initPosition);
        scene.add(personPoint.point);
        scene.add(personPoint.trailLine);
        personPoints.push(personPoint);
    }
}

function loadModel() {
    var loader = new THREE.OBJLoader();
    loader.load('/models/building2.obj', function(object) {
        //object.rotation.z = Math.PI;
        scene.add(object);
        // object.scale.x *= 2000;
        // object.scale.y *= 2000;
        // object.scale.z *= 2000;
        object.position.x = -45000;
        object.position.y = -33800;
        object.position.z = 8000;
        object.scale.x *= 2000;
        object.scale.y *= 2000;
        object.scale.z *= 2000;
        console.log(object.position);
        // document.querySelector('h1').style.display = 'none';
    });
}

function getLight() {
    let light = new THREE.PointLight(0xffffff, 1, 0);
    light.position.set(1, 1, 1);

    let ambientLight = new THREE.AmbientLight(0x111111, 0.01);
    ambientLight.position.set(100, 100, 0);
    scene.add(ambientLight);

    let keyLight = new THREE.DirectionalLight(new THREE.Color('hsl(30%, 100%, 75%)'), 1.0);
    keyLight.position.set(-100, 0, 100);
    light.castShadow = true;
    light.shadow.camera.near = 0.1;
    light.shadow.camera.far = 25;

    let fillLight = new THREE.DirectionalLight(0x111111, 0.8, 0.2);
    fillLight.position.set(100, 0, -100);
    let backLight = new THREE.DirectionalLight(0xffffff, 1.0);

    backLight.position.set(100, 0, 50).normalize();
    keyLight.position.set(-100, 1, 100);

    light.castShadow = true;
    light.shadow.camera.near = 0.1;
    light.shadow.camera.far = 100;

    scene.add(fillLight);
    scene.add(backLight);
}

function moveCamera(target, tweenTime, finishFunction){
    let deepTripPosition = new TWEEN.Tween( camera.position )
        .to( {
            x: target.x,
            y: target.y,
            z: target.z
        }, tweenTime)
        .easing( TWEEN.Easing.Cubic.InOut ).onUpdate( function () {
        }).onComplete(() => finishFunction())
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
