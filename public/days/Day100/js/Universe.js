//Set Up Variables
let scene;
let camera;
let container;
let raycaster;
let renderer;
let controls;
//
let gui;
let stats;
// rotatio
//Post Processing
let composer;
let clock ;
let wave;
let universe;
let canvas;
let shaderMoveTweenTimeObject = {shaderMoveTweenTime: 2000}  ;


// WebMidi.enable(function (err) {
//     if (err) {
//         console.log("WebMidi could not be enabled.", err);
//     } else {
//         console.log("WebMidi enabled!");
//     }
//     console.log(WebMidi.inputs);
//     input = WebMidi.inputs[0];
//     input.addListener('controlchange', "all",
//         function (e) {
//             console.log(e);
//             let scale;
//             let value;
//             switch (e.controller.number){
//                 case 3:
//                     // console.log(e.data);
//                     scale = e.data[2]/127;
//                     let boxControlDiff = 10000 - 10;
//                     value = scale*boxControlDiff + 10;
//                     universe.material.uniforms.boxSizeControl.value = value;
//                     // console.log(value);
//                     break;
//                 case 9:
//                     scale = e.data[2]/127;
//                     universe.material.uniforms.brightnessScale.value = 1- scale ;
//                     // console.log(scale);
//                     break;
//                 case 12:
//                     scale = e.data[2]/127;
//                     value = scale*2000;
//                     universe.material.uniforms.brightnessFreq.value = value ;
//                     break;
//                 case 13:
//                     scale = e.data[2]/127;
//                     value = 1 + 99*scale;
//                     universe.material.uniforms.movementFreq.value = value ;
//                     break;
//                 case 14:
//                     scale = e.data[2]/127;
//                     value = 100 + (10000 - 100) * scale;
//                     shaderMoveTweenTimeObject.shaderMoveTweenTime= value ;
//                     break;
//                 case 15:
//                     scale = e.data[2]/127;
//                     value = scale;
//                     universe.material.uniforms.xOffset.value = value ;
//                     break;
//             }
//         }
//     );
//     input.addListener('noteon', "all",
//         function (e) {
//             switch (e.note.name) {
//                 case "C#":
//                     moveShaderCam(10, 10);
//                     break
//                 case "G":
//                     moveShaderCam(1000, 1000);
//                     break;
//             }
//         }
//     );
// });



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
    //container = document.getElementById( 'container' );
    canvas = document.createElement( 'canvas' );
    canvas.id = "container";
    // request full screen
    // function openFullscreen() {
    //     if (canvas.requestFullscreen) {
    //         canvas.requestFullscreen();
    //     } else if (canvas.mozRequestFullScreen) { /* Firefox */
    //         canvas.mozRequestFullScreen();
    //     } else if (canvas.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
    //         canvas.webkitRequestFullscreen();
    //     } else if (canvas.msRequestFullscreen) { /* IE/Edge */
    //         canvas.msRequestFullscreen();
    //     }
    // }
    // document.body.onmousedown = function() {
    //     openFullscreen();
    // };
    let context = canvas.getContext( 'webgl2', { alpha: false, antialias: false } );
    // camera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 0.1, 4000 );
    // camera.position.z = 500;
    // camera
    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 10000 );
    camera.position.x = 0;
    camera.position.y = 0;
    camera.position.z = 5000;
    camera.far = 1000000;
    camera.updateProjectionMatrix();
    // geometry
    controls = new THREE.OrbitControls( camera, canvas );
    controls.addEventListener( 'change', render );
    scene = new THREE.Scene();
    scene.background =  new THREE.Color( 0x000000);
    // scene.background =  new THREE.Color( 0x000000);
    renderer = new THREE.WebGLRenderer( { antialias: true, canvas: canvas, context: context} );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.gammaInput = true;
    renderer.gammaOutput = true;
    document.body.appendChild( renderer.domElement );
    // container.appendChild( renderer.domElement );
    window.addEventListener( 'resize', onWindowResize, false );

    // stats = createStats();
    // setTimeout(moveCam, 7000);
    clock = new THREE.Clock();
    let kernel = [
        "varying vec2 vUv;",
        "void main() {",
            "vUv = uv;",
            "gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);",
        "}",
    ].join("\n");
    composer = new THREE.EffectComposer(renderer);
    let renderPass = new THREE.RenderPass( scene, camera );
    composer.addPass( renderPass );
    //Negative Pass
    let waveShader = [
        "uniform sampler2D tDiffuse;",
        "uniform float time;",
        "uniform float t;",
        "uniform vec2 scale;",
        "uniform float intensity;",
        "uniform float border;",
        "varying vec2 vUv;",
        "vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}",
        "vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}",
        "float snoise3(vec3 v){",
        "    const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;",
        "    const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);",
        "    vec3 i  = floor(v + dot(v, C.yyy) );",
        "    vec3 x0 =   v - i + dot(i, C.xxx) ;",
        "    vec3 g = step(x0.yzx, x0.xyz);",
        "    vec3 l = 1.0 - g;",
        "    vec3 i1 = min( g.xyz, l.zxy );",
        "    vec3 i2 = max( g.xyz, l.zxy );",
        "    vec3 x1 = x0 - i1 + 1.0 * C.xxx;",
        "    vec3 x2 = x0 - i2 + 2.0 * C.xxx;",
        "    vec3 x3 = x0 - 1. + 3.0 * C.xxx;",
        "    i = mod(i, 289.0 );",
        "    vec4 p = permute( permute( permute(",
        "        i.z + vec4(0.0, i1.z, i2.z, 1.0 ))",
        "        + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))",
        "        + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));",

        "    float n_ = 1.0/7.0; // N=7",
        "    vec3  ns = n_ * D.wyz - D.xzx;",
        "    vec4 j = p - 49.0 * floor(p * ns.z *ns.z);  //  mod(p,N*N)",
        "    vec4 x_ = floor(j * ns.z);",
        "    vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)",
        "    vec4 x = x_ *ns.x + ns.yyyy;",
        "    vec4 y = y_ *ns.x + ns.yyyy;",
        "    vec4 h = 1.0 - abs(x) - abs(y);",
        "    vec4 b0 = vec4( x.xy, y.xy );",
        "    vec4 b1 = vec4( x.zw, y.zw );",
        "    vec4 s0 = floor(b0)*2.0 + 1.0;",
        "    vec4 s1 = floor(b1)*2.0 + 1.0;",
        "    vec4 sh = -step(h, vec4(0.0));",
        "    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;",
        "    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;",
        "    vec3 p0 = vec3(a0.xy,h.x);",
        "    vec3 p1 = vec3(a0.zw,h.y);",
        "    vec3 p2 = vec3(a1.xy,h.z);",
        "    vec3 p3 = vec3(a1.zw,h.w);",
        "    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));",
        "    p0 *= norm.x;",
        "    p1 *= norm.y;",
        "    p2 *= norm.z;",
        "    p3 *= norm.w;",
        "    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);",
        "    m = m * m;",
        "return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),",
        "dot(p2,x2), dot(p3,x3) ) );",
        "}",
        "void main() {",
        "    vec2 uv = vUv;",

        "    float d = t * intensity * smoothstep(0.0, border, uv.x) * smoothstep(1.0, 1.0 - border, uv.x) * smoothstep(0.0, border, uv.y) * smoothstep(1.0, 1.0 - border, uv.y);",
        "    uv.x += (snoise3(vec3(uv * scale, time)) - 0.5) * d;",
        "    uv.y += (snoise3(vec3(uv.yx * scale, time)) - 0.5) * d;",

        "    gl_FragColor = texture2D(tDiffuse, uv);",
        "}",
    ].join("\n");
    // wave = new THREE.ShaderPass({
    //     uniforms: {
    //         tDiffuse: { type: "t", value: null },
    //         time: { type: "f", value: 0.0},
    //         t: { type: "f", value: 1.0 },
    //         intensity: { type: "f", value: 0.0},
    //         border: { type: "f", value: 0.1 },
    //         scale: { type: "v2", value: new THREE.Vector2(1.5, 1.5) },
    //     },
    //     vertexShader: kernel,
    //     fragmentShader: waveShader
    // });
    // composer.addPass(wave);


    let universeShader = `
        uniform float boxSizeControl;
        uniform float brightnessScale;
        uniform float brightnessFreq;
        uniform float movementFreq;
        uniform float xOffset;
        uniform float yOffset;
        
        uniform vec3 iResolution;
        uniform float iTime;
        
        varying vec2 vUv;
        #define ss(a, b, t) smoothstep(a, b, t)
        float distLine(vec2 p, vec2 a, vec2 b){
            vec2 pa = p - a;
            vec2 ba = b - a;
            float t = clamp(dot(pa, ba)/dot(ba, ba), 0., 1.);
            return length(pa - ba*t);    
        }
        
        float Line(vec2 p, vec2 a, vec2 b){
            float d = distLine(p, a, b);
            float scale = 10.;
            float m = ss(0.03, 0.015, d);
            float lineLength = length(a-b);
            m *= ss(1.5, 0.18, lineLength);    
            return m;
        }

        float n21(vec2 p){
            p = fract(p*vec2(233.34, 851.73));
            p += dot(p, p+343.3);
            return fract(p.x*p.y);
        }

        vec2 n22(vec2 p){
            float n = n21(p);
            return vec2(n, n21(p+n));
        }

        vec2 getPos(vec2 id, vec2 offset){
            vec2 n = n22(id + offset)*iTime;
            return sin(n*movementFreq)*0.4 + offset;     // this is gold here
        } 

        void main()
        {   
            float boxSize = boxSizeControl;
            vec2 fragCoord = gl_FragCoord.xy;
            vec2 uv = (fragCoord - 0.5*iResolution.xy)/iResolution.y; //So here why this line will make the aspect ratio correct? 
            uv.x += xOffset;
            uv.y += yOffset;
            vec2 gv = fract(uv*boxSize) - .5;
            vec2 gvID = floor(uv*boxSize);
            
            float m = 0.0;
            vec2 nps[9];
            
            int i = 0;
            for(float y=-1.0; y<=1.0; y++){
                 for(float x=-1.01; x<=1.0; x++){
                     nps[i] = getPos(gvID, vec2(x, y));
                     i++;
                 }
            }
            
            for(int i=0; i<9; i++){
                m += Line(gv, nps[4], nps[i]);
                vec2 diffVec = (gv - nps[i])*200.0*brightnessScale*cos(brightnessFreq*iTime);
                float brightSparkle = 1.0 / length(diffVec);
                m += brightSparkle;
            }
            m += Line(gv, nps[1], nps[3]);
            m += Line(gv, nps[1], nps[5]);
            m += Line(gv, nps[7], nps[3]);
            m += Line(gv, nps[7], nps[5]);
            vec3 col = vec3(m);
            gl_FragColor  = vec4(col, 1.0);
        }
    `;
    universe = new THREE.ShaderPass({
        uniforms: {
            boxSizeControl: {type: "f", value: 1000},
            brightnessScale: {type: "f", value: 1},
            brightnessFreq: {type: "f", value: 0},
            movementFreq: {type: "f", value: 1},
            xOffset: {type: "f", value: 0},
            yOffset: {type: "f", value: 0},
            iTime: { type: "f", value: 0.0},
            iResolution: {value: new THREE.Vector3(canvas.width, canvas.height, 1)}
        },
        vertexShader: kernel,
        fragmentShader: universeShader
    });
    composer.addPass(universe);

    gui = new dat.GUI();
    gui.add(universe.material.uniforms.boxSizeControl, "value", 1, 10000).name("Box Size");
    gui.add(universe.material.uniforms.brightnessScale, "value", 0, 1).name("Brightness");
    gui.add(universe.material.uniforms.brightnessFreq, "value", 0, 2000).name("BrightnessFreq");
    gui.add(universe.material.uniforms.movementFreq, "value", 0, 100).name("MovementFreq");
    gui.add(universe.material.uniforms.xOffset, "value", -100, 100).name("x offset");
    gui.add(universe.material.uniforms.yOffset, "value", -100, 100).name("y offset");

    //move cam
    let farObject = {moveFar: function () {
            moveShaderCam(10, 1000);
        }};
    gui.add(farObject, 'moveFar');

    let closeObject = {moveClose: function () {
            moveShaderCam(1000, 10);
        }};
    gui.add(closeObject, 'moveClose');

    gui.add(shaderMoveTweenTimeObject, "shaderMoveTweenTime", 100, 10000).name("Tween Time");

}

function createStats() {
    let stats = new Stats();
    stats.setMode(0);
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '0';
    stats.domElement.style.top = '0';
    document.body.appendChild( stats.dom );
    return stats;
}

function moveCam(){
    let target = new THREE.Vector3(0,0,30000);
    let tweenTime = 10000;
    let tweenCam = new TWEEN.Tween(controls.object.position).to({
        x: target.x,
        y: target.y,
        z: target.z
    }, tweenTime).easing(TWEEN.Easing.Cubic.InOut).onUpdate(function() {
        console.log(
        'wtf'
        );
    }).onComplete(() => (console.log("fuck")))
    .start();
}

function moveShaderCam(current, target){
    target = {x: target};
    let toTween = {x: universe.material.uniforms.boxSizeControl.value};
    let tweenShaderCam = new TWEEN.Tween(toTween).to({
        x: target.x
        }, shaderMoveTweenTimeObject.shaderMoveTweenTime).easing(TWEEN.Easing.Cubic.InOut).onUpdate(function(){
            universe.material.uniforms.boxSizeControl.value = toTween.x;
        }
    ).start();
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

function animate() {
    // stats.begin();
    universe.uniforms.iTime.value  = clock.getElapsedTime();
    TWEEN.update();
    // console.log(controls.object.position.z);
    controls.update(); // controls.update();
    composer.render();
    // stats.end();
    requestAnimationFrame( animate );
    // render();
}

function render() {
    renderer.render( scene, camera );
    stats.update();
}

//Rotation Init Related Function
