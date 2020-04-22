//Set Up Variables
let scene;
let camera;
let container;
let raycaster;
let renderer;
let controls;
//
let cubeNumber = 100;
let cubes = [];
let halfLengthStep = 50;


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
    camera.position.z = 17975;
    camera.position.y = 1198;
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
    for (let i=0; i<cubeNumber; i++){
        let cubeHalfLength = i*halfLengthStep;
        let cube = new Cube(0,0,0, cubeHalfLength);
        scene.add(cube.container);
        cubes.push(cube);
    }


    let loader = new THREE.FontLoader();
    loader.load( 'js/fuckface.json', function ( font ) {
        let xMid, text;
        let color = 0xfffffff;
        let matDark = new THREE.LineBasicMaterial({
            color: color,
            side: THREE.DoubleSide
        });
        let matLite = new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: 0.4,
            side: THREE.DoubleSide
        });
        let message = "F**K";
        let shapes = font.generateShapes(message, 15);
        let geometry = new THREE.ShapeBufferGeometry(shapes);
        geometry.computeBoundingBox();
        xMid = -0.5 * (geometry.boundingBox.max.x - geometry.boundingBox.min.x);
        geometry.translate(xMid, 0, 0);
        text = new THREE.Mesh(geometry, matLite);
        text.position.z = 0;
        scene.add(text);
        // let holeShapes = [];
        // for (let i = 0; i < shapes.length; i++) {
        //     let shape = shapes[i];
        //     if (shape.holes && shape.holes.length > 0) {
        //         for (let j = 0; j < shape.holes.length; j++) {
        //             let hole = shape.holes[j];
        //             holeShapes.push(hole);
        //         }
        //     }
        // }
        // shapes.push.apply(shapes, holeShapes);
        // let lineText = new THREE.Object3D();
        // for (let i = 0; i < shapes.length; i++) {
        //     let shape = shapes[i];
        //     let points = shape.getPoints();
        //     let geometry = new THREE.BufferGeometry().setFromPoints(points);
        //     geometry.translate(xMid, 0, 0);
        //     let lineMesh = new THREE.Line(geometry, matDark);
        //     lineText.add(lineMesh);
        // }
        // scene.add(lineText);
    });
    let targetPosition = new THREE.Vector3(0, 17, 267);
    moveCamera(targetPosition, 50000);
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
    console.log(controls.object.position);
    for (let i=0; i<cubeNumber; i++){
        cubes[i].update();
    }
    TWEEN.update();
    controls.update(); // controls.update();
    requestAnimationFrame( animate );
    render();
}

function render() {
    renderer.render( scene, camera );
}










