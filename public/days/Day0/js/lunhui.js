//Set Up Variables
let scene;
let camera;
let container;
let raycaster;
let renderer;
let controls;
// wormhole
let wormholeContainer;
let pivot;
let center;
let lifeline;
let lifeLines = [];


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
    camera.position.x = 2806;
    camera.position.y = 3119;
    camera.position.z = 4215;
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

    for (let i=0; i<100; i++){
        lifeline = new LifeLine([0,0,0], [0,1000,0], false);
        lifeline.universe.position.copy(new THREE.Vector3(Math.random()*2000, Math.random()*2000, Math.random()*2000));
        lifeline.universe.rotation.x = Math.random()*90;
        lifeline.universe.rotation.y = Math.random()*90;
        lifeline.universe.rotation.z = Math.random()*90;
        // scene.add(lifeline.line);
        scene.add(lifeline.universe);
        lifeLines.push(lifeline);
    }


    // for (let i=0; i<lifeline.wormholes.length; i++){
    //     scene.add(lifeline.wormhole_centers[i]);
    // }
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
    console.log(controls.object.position);
    // wormholeContainer.update();
    requestAnimationFrame( animate );
    render();
    // wormholeContainer.wormhole.position.y = 0;
    // pivot.rotation.y += 0.01;
    // pivot.rotation.x += 0.05;
    // wormholeContainer.wormhole.position.y = 190;
    // wormholeContainer.wormhole.rotation.y += 0.3;
    // wormholeContainer.wormhole.rotation.x += 0.03;
    // center.rotation.y  += 0.03;
    // wormholeContainer.wormhole.rotation.z += 0.03;
    for (let i=0; i<lifeLines.length; i++){
        lifeLines[i].update();
    }

    // lifeline.update();

}

function render() {
    renderer.render( scene, camera );
}










