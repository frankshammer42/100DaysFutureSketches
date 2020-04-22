//Set Up Variables
let scene;
let camera;
let container;
let raycaster;
let renderer;
let controls;
//Closure Circles
let closureCircle;
let closureCircles = [];
let circleGroups = [];
let currentBranchCircles = [];
let allBranchCircles = [];
let beginGenerate = true;
let numberOfHalfCircles = 20;

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
    camera.position.y = 35000;
    camera.position.z = 0;
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
    // closureCircle = new Circle([0,0,0], 200);
    // scene.add(closureCircle.meCircle);
    // generateCircles(50, 50);
    let centerPoint = new THREE.Vector3(0, 0, 0);
    generateCirclesColOnPoint(centerPoint, 600, numberOfHalfCircles, 2000, true);
    setInterval(chooseRandomCircleDisappear, 1000);
    setInterval(generateBranchCircles, 5000);

}


function generateBranchCircles(){
    numberOfHalfCircles -= 4;
    allBranchCircles = currentBranchCircles.slice();
    currentBranchCircles = [];
    if (numberOfHalfCircles > 0){
        for (let i=0; i<allBranchCircles.length; i++){
            console.log(allBranchCircles.length);
            let currentCircle = allBranchCircles[i];
            generateCirclesColOnPoint(currentCircle.meCircle.position, 600, numberOfHalfCircles, 2000, false, i%2===0);
        }
    }
    //let firstCircle = currentbranchcircles[0];
    //let secondCircle = currentBranchCircles[1];
    //generateCirclesColOnPoint(firstCircle.meCircle.position, 600, 18, 2000, false, true);
    //generateCirclesColOnPoint(secondCircle.meCircle.position, 600, 18, 2000, false, false);
}



function generateCirclesColOnPoint(centerPoint, stepLength, halfNumber, branchXoffset, beginBranch, leftBranch){
    let centerPointZ = centerPoint.z;
    let centerPointX = centerPoint.x;
    let beginZ = centerPointZ - stepLength*halfNumber;
    let endZ = centerPointZ + stepLength*halfNumber;
    let radius = 300;
    let newCircleGroup = new THREE.Group();
    let circlesTemp = [];

    for (let i=0; i<halfNumber; i++){
        let offsetZ = beginZ + i*stepLength;
        let circle = new Circle([centerPointX, 0, offsetZ], radius);
        // scene.add(circle.meCircle);
        newCircleGroup.add(circle.meCircle);
        closureCircles.push(circle);
        circlesTemp.push(circle);
    }
    let circle = new Circle([centerPointX, 0, centerPointZ], radius);
    newCircleGroup.add(circle.meCircle);
    closureCircles.push(circle);
    circlesTemp.push(circle);
    for (let i=0; i<halfNumber; i++){
        let offsetZ = endZ - i*stepLength;
        let circle = new Circle([centerPointX, 0, offsetZ], radius);
        // scene.add(circle.meCircle);
        newCircleGroup.add(circle.meCircle);
        closureCircles.push(circle);
        circlesTemp.push(circle);
    }


    if (beginBranch){
        beginGenerate = false;
        let firstIndex = Math.floor(Math.random()*circlesTemp.length);
        let secondIndex = Math.floor(Math.random()*circlesTemp.length);
        let firstCircle = circlesTemp[firstIndex];
        let secondCircle = circlesTemp[secondIndex];
        currentBranchCircles.push(firstCircle);
        currentBranchCircles.push(secondCircle);
        let firstZOffset = 50 - Math.random()*100;
        let secondZOffset = 50 - Math.random()*100;
        let firstCircleTarget =  new THREE.Vector3(firstCircle.center[0] - branchXoffset, 0, firstZOffset);
        let secondCircleTarget =  new THREE.Vector3(secondCircle.center[0] + branchXoffset, 0, secondZOffset);
        firstCircle.targetBranchPosition = firstCircleTarget;
        secondCircle.targetBranchPosition = secondCircleTarget;
        //Test
        firstCircle.moveToBranch(3000);
        secondCircle.moveToBranch(3000);
    }
    else{
        let firstIndex = Math.floor(Math.random()*circlesTemp.length);
        let secondIndex = Math.floor(Math.random()*circlesTemp.length);
        let firstCircle = circlesTemp[firstIndex];
        let secondCircle = circlesTemp[secondIndex];
        currentBranchCircles.push(firstCircle);
        currentBranchCircles.push(secondCircle);
        let firstZOffset = 50 - Math.random()*100;
        let secondZOffset = 50 - Math.random()*100;
        let firstCircleTarget = [];
        let secondCircleTarget = [];
        if (leftBranch){
            firstCircleTarget =  new THREE.Vector3(firstCircle.center[0] - branchXoffset, 0, firstZOffset);
            secondCircleTarget =  new THREE.Vector3(secondCircle.center[0] - branchXoffset, 0, secondZOffset);
        }
        else{
            firstCircleTarget =  new THREE.Vector3(firstCircle.center[0] + branchXoffset, 0, firstZOffset);
            secondCircleTarget =  new THREE.Vector3(secondCircle.center[0] + branchXoffset, 0, secondZOffset);
        }
        firstCircle.targetBranchPosition = firstCircleTarget;
        secondCircle.targetBranchPosition = secondCircleTarget;
        //Test
        firstCircle.moveToBranch(3000);
        secondCircle.moveToBranch(3000);
    }

    scene.add(newCircleGroup);
    circleGroups.push(newCircleGroup);
}


function generateCircles(rowNumber, colNumber){
    let startCenter = [-15000, 0, 15000];
    let radius = 300;
    let step = 600;
    for (let i=0; i<rowNumber; i++){
        let randomOffset = Math.random()*2000;
        let offsetX =i*step + startCenter[0];
        let newCircleGroup = new THREE.Group();
        for (let j=0; j<colNumber; j++){
            let offsetZ = j*step - startCenter[2] - randomOffset;
            let circle = new Circle([offsetX, 0, offsetZ], radius);
            // scene.add(circle.meCircle);
            newCircleGroup.add(circle.meCircle);
            closureCircles.push(circle);
        }
        scene.add(newCircleGroup);
        circleGroups.push(newCircleGroup);
    }
}

function moveSide(){
    console.log("start moving");
    let destination = new THREE.Vector3(-600, 0, 0);
    moveCamera(destination, 10000);
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

function chooseRandomCircleDisappear(){
    let numberOfCircles = Math.floor(Math.random()*4000);
    for (let i=0; i<closureCircles.length*0.75; i++){
        let index = chooseRandomSample(closureCircles.length);
        closureCircles[index].wu = true;
    }
}


function animate() {
    controls.update(); // controls.update();
    // console.log(controls.object.position);
    // generateCircles(30, 20);
    // closureCircle.update();
    TWEEN.update();
    for (let i=0; i<circleGroups.length; i++){
        let step = Math.random()*50;
        let dirIndicator = Math.random();
        if (dirIndicator > 0.5){
            step = step*-1;
        }
        circleGroups[i].position.z += step;
    }
    for (let i=0; i<closureCircles.length; i++){
        closureCircles[i].update();
    }
    requestAnimationFrame( animate );
    render();
}

function render() {
    renderer.render( scene, camera );
}


