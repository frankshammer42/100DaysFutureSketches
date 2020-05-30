//Set Up Variables
let scene;
let camera;
let container;
let raycaster;
let renderer;
let controls;
// Matrix Related
let matrix = [];
let widthNumber = 30;
let heightNumber = 10;
let depthNumber = 10;
let dimension = new THREE.Vector3(widthNumber, heightNumber, depthNumber);
let stepLength = 0.2;
//
let linesNumber = 20;
let lines = [];
let minConnectionNodes = 5;
let maxConnectionNodes = 20;
let intervalTime = 100; //May need to connect with BPM
let intervalChange = null;
// GUI
let gui = new dat.GUI();
// Got out
let currentIndexToMove = 0;



WebMidi.enable(function (err) {
    if (err) {
        console.log("WebMidi could not be enabled.", err);
    } else {
        console.log("WebMidi enabled!");
    }
    console.log(WebMidi.inputs);
    input = WebMidi.inputs[0];
    input.addListener('noteon', "all",
        function (e) {
            autoMove = !autoMove;
        }
    );
    input.addListener('controlchange', "all",
        function (e) {
            // console.log(e);
            let scale;
            let value;
            console.log(e.controller.number);
            switch (e.controller.number) {
                case 3:
                    scale = e.data[2] / 127;
                    value = scale * 100;
                    console.log(value);
                    minConnectionNodes = value;
                    break;
                case 9:
                    scale = e.data[2] / 127;
                    value = scale * 500;
                    console.log(value);
                    maxConnectionNodes = value;
                    break;
                case 12:
                    scale = 1 - e.data[2] / 127;
                    value = scale * 998 + 2;
                    intervalTime = value;
                    clearInterval(intervalChange);
                    intervalChange = setInterval(generateConnections, intervalTime);
                    break;
            }
        }
    );
});

//Utility ---- to get full screen
// let elem = document.getElementById("container");
// function openFullscreen() {
//     if (elem.requestFullscreen) {
//         elem.requestFullscreen();
//     } else if (elem.mozRequestFullScreen) { /* Firefox */
//         elem.mozRequestFullScreen();
//     } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
//         elem.webkitRequestFullscreen();
//     } else if (elem.msRequestFullscreen) { /* IE/Edge */
//         elem.msRequestFullscreen();
//     }
// }
// document.body.onmousedown = function() {
//     openFullscreen();
// };

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
    // Get Full Screen
    // ---------------------Env Set Up
    raycaster = new THREE.Raycaster();
    container = document.getElementById( 'container' );
    // camera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 0.1, 4000 );
    // camera.position.z = 500;
    // camera
    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 10000 );
    camera.position.x = 0;
    camera.position.y = 0;
    camera.position.z = 8;
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
    //create creature
    createMatrix();
    createLines();
    // generateConnections();
    intervalChange = setInterval(generateConnections, intervalTime);

    //Add GUI Value
    let options = {
        "minConn": 5,
        "maxConn": 500,
        "IntervalTime":2
    };
    gui.add(options, "minConn", 5, 100).listen().onChange((value)=>{
            minConnectionNodes = value;
        }
    );
    gui.add(options, "maxConn", 10,  500).listen().onChange((value)=>{
            maxConnectionNodes = value;
        }
    );
    gui.add(options, "IntervalTime", 2, 100).name('Interval Time').listen().onChange((value)=>{
            intervalTime = value;
            clearInterval(intervalChange);
            intervalChange = setInterval(generateConnections, intervalTime);
        }
    );
    //
    setInterval(addIndexToMove, 2);
}

function addIndexToMove(){
    currentIndexToMove += 2;
}

function createLines(){
    for (let i=0; i<linesNumber; i++){
        let newLine = new Line(1000);
        scene.add(newLine.line);
        lines.push(newLine);
    }
}

function getStartPos(){
    let width = widthNumber * stepLength;
    let height = heightNumber * stepLength;
    let depth = depthNumber * stepLength;
    let startPos = new THREE.Vector3(-width/2, -height/2, -depth/2);
    return startPos;
}

function getSampleDelta(){
    let samples = [-1, 0, 1];
    let randIndex = Math.floor(Math.random()*samples.length);
    return samples[randIndex];
}

function getNextCoord(matrixPoint){
    let currentX = matrixPoint.xNumber;
    let currentY = matrixPoint.yNumber;
    let currentZ = matrixPoint.zNumber;
    let xDelta = getSampleDelta();
    let yDelta = getSampleDelta();
    let zDelta = getSampleDelta();
    let nextX = currentX + xDelta;
    let nextY = currentY + yDelta;
    let nextZ = currentZ + zDelta;
    let result = [nextX, nextY, nextZ];
    return result;
}

function insideBoundary(coords){
    return coords[0] >= 0 && coords[0] < widthNumber && coords[1] >= 0 && coords[1] < heightNumber
        && coords[2] >= 0 && coords[2] < depthNumber;
}

function generateConnection(){
    let result = [];
    let currentConnectionNodesNumber = this.generateRandomNumberInRange(minConnectionNodes, maxConnectionNodes);
    currentConnectionNodesNumber = Math.floor(currentConnectionNodesNumber);
    let initNodeIndex = Math.floor(Math.random()*matrix.length);
    let initNode = matrix[initNodeIndex];
    result.push(initNode);
    for (let i=1; i<currentConnectionNodesNumber; i++){
        let currentCoord = getNextCoord(result[i-1]);
        if (insideBoundary(currentCoord)){
            let currentID = getID(currentCoord[0], currentCoord[1], currentCoord[2]);
            let currentNode = matrix[currentID];
            result.push(currentNode);
        }
        else{
            i -= 1;
        }
    }
    return result;
}

function generateConnections(){
    for (let i=0; i<linesNumber; i++){
        let connectionResult = generateConnection();
        if (connectionResult.length > 1){
            lines[i].updateConnection(connectionResult);
        }
    }
}

function getID(nextXNumber, nextYNumber, nextZNumber){
    let id = nextXNumber*depthNumber*heightNumber + nextYNumber*depthNumber + nextZNumber;
    return id;
}

function createMatrix(){
    let beginPos = getStartPos();
    let id = 0;
    for (let i=0; i<widthNumber; i++) {
        let currentX = beginPos.x + i*stepLength;
        for (let j = 0; j < heightNumber; j++){
            let currentY = beginPos.y + j*stepLength;
            for (let k=0; k<depthNumber; k++) {
                let currentID = id;
                // let checkID = i*depthNumber*heightNumber + j*depthNumber + k;
                let currentZ = beginPos.z + k*stepLength;
                let currentPosition = new THREE.Vector3(currentX, currentY, currentZ);
                let newMatrixPoint = new MatrixPoint(currentID, dimension, currentPosition, i, j, k);
                matrix.push(newMatrixPoint);
                scene.add(newMatrixPoint.matrixReferencePoint);
                id++;
            }
        }
    }
}

function distance(p1, p2){
    let diff_x = p1[0] - p2[0];
    let diff_y = p1[1] - p2[1];
    let diff_z = p1[2] - p2[2];
    let diffVector = new THREE.Vector3(diff_x, diff_y, diff_z);
    return diffVector.length();
}

function moveSide(){
    console.log("start moving");
    let destination = new THREE.Vector3(-1558.75, 4464.33, 19432.96);
    moveCamera(destination, 9000);
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
    for (let i=0; i<matrix.length; i++){
        if (i < currentIndexToMove){
            matrix[i].update();
        }
    }
    controls.update(); // controls.update();
    TWEEN.update();
    requestAnimationFrame( animate );
    render();
}

function render() {
    renderer.render( scene, camera );
}


