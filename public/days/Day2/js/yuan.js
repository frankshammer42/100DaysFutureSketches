//Set Up Variables
let scene;
let camera;
let container;
let raycaster;
let renderer;
let controls;
//life
let life;
let people = [];


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
    camera.position.z = 3200;
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
    createPeopleAttracted();
    // createPeopleNonAttracted();

}


function generateRandomNumberInRange(min, max) {
    let highlightedNumber = Math.random() * (max - min) + min;
    return highlightedNumber;
}

function createPeopleAttracted() {
    for (let i=0; i<2; i++){
        let start_x = generateRandomNumberInRange(-200, 200);
        let start_y = generateRandomNumberInRange(-200, 200);
        let start_z = generateRandomNumberInRange(-200, 200);
        let end_x = generateRandomNumberInRange(-200, 200);
        let end_y = generateRandomNumberInRange(-200, 200);
        let end_z = generateRandomNumberInRange(-200, 200);
        let newLife = new PersonLife([start_x, start_y, start_z], [end_x, end_y, end_z]);
        newLife.chooseToClose = true;
        scene.add(newLife.line);
        people.push(newLife);
        if (i%2 === 1){
            people[i-1].theOther = people[i];
            people[i].theOther = people[i-1];
        }
    }
}

function createPeopleNonAttracted(){
    for (let i=0; i<2; i++){
        let start_x = generateRandomNumberInRange(-10000, 5000);
        let start_y = generateRandomNumberInRange(-200, 200);
        let start_z = generateRandomNumberInRange(-200, 200);
        let end_x = generateRandomNumberInRange(-10000, -5000);
        let end_y = generateRandomNumberInRange(-200, 200);
        let end_z = generateRandomNumberInRange(-200, 200);
        let newLife = new PersonLife([start_x, start_y, start_z], [end_x, end_y, end_z]);
        scene.add(newLife.line);
        people.push(newLife);
    }
    people[2].theOther = people[3];
    people[3].theOther = people[2];
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

function animate() {
    controls.update(); // controls.update();
    for (let i=0; i<people.length; i++){
        people[i].update();
    }
    requestAnimationFrame( animate );
    render();
}

function render() {
    renderer.render( scene, camera );
}










