//Set Up Variables
let scene;
let camera;
let container;
let raycaster;
let renderer;
let controls;
//Create curves
let curve;
let curves = [];
let drawProcess = 0;
//Post Processing
let composer;
let clock ;
let wave;
let rgbShift;
let negative;
//GUI

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
            console.log("Received 'noteon' message (" + e.note.name + e.note.octave + ").");
        }
    );
    input.addListener('controlchange', "all",
        function (e) {
            // console.log(e);
            let scale;
            let value;
            switch (e.controller.number){
                case 3:
                    // console.log(e.data);
                    scale = e.data[2]/127;
                    value = scale*0.4;
                    // console.log(value);
                    rgbShift.material.uniforms.amplitude.value = value;
                    break;
                case 9:
                    scale = e.data[2]/127;
                    // console.log(scale);
                    rgbShift.material.uniforms.speed.value = scale;
                    break;
                case 12:
                    scale = e.data[2]/127;
                    value = scale;
                    console.log(scale);
                    wave.material.uniforms.intensity.value = scale;
                    console.log(wave.material.uniforms.intensity.value);
                    break;
                case 13:
                    scale = e.data[2]/127;
                    value = scale*3.5;
                    wave.material.uniforms.scale.value.x= value;
                    break;
                case 14:
                    console.log(e.data);
                    scale = e.data[2]/127;
                    value = scale*3.5;
                    // console.log(value);
                    wave.material.uniforms.scale.value.y= value;
                    break;
                case 15:
                    console.log(e.data);
                    scale = e.data[2]/127;
                    // console.log(value);
                    negative.material.uniforms.t.value = scale;
            }
        }
    );




    // let rgbShiftFolder = postEffectFolder.addFolder("rgb shift");
    // rgbShiftFolder.add(rgbShift.material.uniforms.amplitude, "value", 0.0, 0.4).name("amplitude");
    // rgbShiftFolder.add(rgbShift.material.uniforms.speed, "value", 0.0, 1.0).name("speed");
    //
    // let waveFolder = postEffectFolder.addFolder("wave");
    // waveFolder.add(wave.material.uniforms.intensity, "value", 0.0, 0.5).name("intensity");
    // waveFolder.add(wave.material.uniforms.scale.value, "x", 0.0, 3.5).name("scale x");
    // waveFolder.add(wave.material.uniforms.scale.value, "y", 0.0, 3.5).name("scale y");
});

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
    camera.position.x = 38250;
    camera.position.y = 39441;
    camera.position.z = 45788;
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
    //create Curve
    // let start = new THREE.Vector3(0, 0, 0);
    // curve = new Curve(start);
    // scene.add(curve.sourceCurve);
    createCurves();
    clock = new THREE.Clock();
    let kernel = [
        "varying vec2 vUv;",
        "void main() {",
        "vUv = uv;",
        "gl_Position = vec4(position, 1.0);",
        "}",
    ].join("\n");
    composer = new THREE.EffectComposer(renderer);
    let renderPass = new THREE.RenderPass( scene, camera );
    composer.addPass( renderPass );
    //Negative Pass
    let negativeShader =  [
        "uniform sampler2D tDiffuse;",
        "uniform float t;",
        "varying vec2 vUv;",
        "void main() {",
        "    vec2 uv = vUv;",
        "    vec4 sample = texture2D(tDiffuse, uv);",
        "    sample.rgb = mix(sample.rgb, 1.0 - sample.rgb, t);",
        "    gl_FragColor = sample;",
        "}"
    ].join("\n");
    negative = new THREE.ShaderPass({
        uniforms: {
            "tDiffuse": { type: "t", value: null },
            "t": { type: "f", value: 0.0},
        },
        vertexShader: kernel,
        fragmentShader: negativeShader
    });
    composer.addPass(negative);

    //Vignette Pass
    let vignetteShader = [
        "uniform float offset;",
        "uniform float darkness;",
        "uniform sampler2D tDiffuse;",
        "varying vec2 vUv;",
        "void main() {",
        "    vec4 texel = texture2D(tDiffuse, vUv);",
        "    vec2 uv = (vUv - vec2(0.5)) * vec2(offset);",
        "    gl_FragColor = vec4(mix(texel.rgb, vec3(1.0 - darkness), dot(uv, uv)), texel.a);",
        "}"
    ].join("\n");


    let vignette = new THREE.ShaderPass({
        uniforms: {
            tDiffuse: { type: "t", value: null },
            offset:   { type: "f", value: 0.75 },
            darkness: { type: "f", value: 0.2}
        },
        vertexShader: kernel,
        fragmentShader: vignetteShader
    });
    composer.addPass(vignette);

    let loader = new THREE.TextureLoader();
    let redshift = [
        "uniform sampler2D tDiffuse;",
        "uniform sampler2D tNoise;",
        "uniform float t;",
        "uniform float amplitude;",
        "uniform float time;",
        "uniform float speed;",
        "varying vec2 vUv;",
        "vec2 loop(vec2 p) {",
        "    p.x = mod(p.x, 1.0);",
        "    p.y = mod(p.y, 1.0);",
        "    return p;",
        "}",
        "vec4 rgbShift(vec2 p, vec4 shift) {",
        "    shift *= 2.0 * shift.w - 1.0;",
        "    vec2 rs = vec2(shift.x, -shift.y);",
        "    vec2 gs = vec2(shift.y, -shift.z);",
        "    vec2 bs = vec2(shift.z, -shift.x);",

        "    float r = texture2D(tDiffuse, loop(p + rs)).x;",
        "    float g = texture2D(tDiffuse, loop(p + gs)).y;",
        "    float b = texture2D(tDiffuse, loop(p + bs)).z;",
        "    return vec4(r, g, b, 1.0);",
        "}",
        "vec4 noise(vec2 p) {",
        "    return texture2D(tNoise, p);",
        "}",
        "vec4 vec4pow(vec4 v, float p) {",
        "    return vec4(pow(v.x, p), pow(v.y, p), pow(v.z, p), v.w);",
        "}",
        "void main() {",
        "    vec2 uv = vUv;",
        "    float amp = amplitude * t;",
        "    vec4 shift = vec4pow(noise(vec2(speed * time, 2.0 * speed * time / 25.0)), 8.0) * vec4(amp, amp, amp, 1.0);",
        "    gl_FragColor = rgbShift(uv, shift);",
        "}"
    ].join("\n");


    rgbShift = new THREE.ShaderPass({
        uniforms: {
            tDiffuse: { type: "t", value: null },
            tNoise: { type: "t", value: null },
            t: { type: "f", value: 1.0 },
            amplitude: { type: "f", value: 0.0},
            time: { type: "f", value: 0.0 },
            speed: { type: "f", value: 0.02 },
        },
        vertexShader: kernel,
        fragmentShader: redshift
    });
    loader.load("../../textures/random.png", (texture) => {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        rgbShift.uniforms.tNoise.value = texture;
    });

    composer.addPass(rgbShift);

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
    wave = new THREE.ShaderPass({
        uniforms: {
            tDiffuse: { type: "t", value: null },
            time: { type: "f", value: 0.0},
            t: { type: "f", value: 1.0 },
            intensity: { type: "f", value: 0.0},
            border: { type: "f", value: 0.1 },
            scale: { type: "v2", value: new THREE.Vector2(1.5, 1.5) },
        },
        vertexShader: kernel,
        fragmentShader: waveShader
    });

    composer.addPass(wave);
    // let postEffectFolder = gui.addFolder("post effects");
    // let negativeFolder = postEffectFolder.addFolder("negative");
    // negativeFolder.add(negative.material.uniforms.t, "value", 0.0, 1.0).name("t");
    //
    // let rgbShiftFolder = postEffectFolder.addFolder("rgb shift");
    // rgbShiftFolder.add(rgbShift.material.uniforms.amplitude, "value", 0.0, 0.4).name("amplitude");
    // rgbShiftFolder.add(rgbShift.material.uniforms.speed, "value", 0.0, 1.0).name("speed");
    //
    // let waveFolder = postEffectFolder.addFolder("wave");
    // waveFolder.add(wave.material.uniforms.intensity, "value", 0.0, 0.5).name("intensity");
    // waveFolder.add(wave.material.uniforms.scale.value, "x", 0.0, 3.5).name("scale x");
    // waveFolder.add(wave.material.uniforms.scale.value, "y", 0.0, 3.5).name("scale y");
}

function createCurves(){
    for (let i=0; i<5; i++){
        let randomX = Math.random()*20000 - 10000;
        let randomY = Math.random()*20000 - 10000;
        let randomZ = Math.random()*20000 - 10000;
        let start = new THREE.Vector3(randomX, randomY, randomZ);
        let newCurve = new Curve(start);
        // for (let j=0; j<newCurve.curveCircles.length; j++){
        //     scene.add(newCurve.curveCircles[j]);
        // }
        curves.push(newCurve);
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
    controls.update(); // controls.update();
    for (let i=0; i<curves.length; i++){
        if (drawProcess < curves[i].curveCircles.length){
            scene.add(curves[i].curveCircles[drawProcess].sourceCircle);
        }
        curves[i].update();
    }
    drawProcess+=1;
    // sc.update();
    // generateCircles(30, 20);
    // closureCircle.update();
    console.log(controls.object.position);
    TWEEN.update();
    requestAnimationFrame( animate );
    composer.render();
}

function render() {
    renderer.render( scene, camera );
}


