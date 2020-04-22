function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

class PersonLife {
    constructor(start, end){
        this.stepLength = 200;
        this.maxCount = 2000;
        this.growing_speed = 20;
        this.geometry = new THREE.BufferGeometry();
        this.positions = new Float32Array(10002);
        this.geometry.addAttribute("position", new THREE.BufferAttribute(this.positions, 3));
        this.material = new THREE.LineBasicMaterial( { color: 0xffffff, linewidth: 1});
        this.line = new THREE.Line( this.geometry,  this.material);
        this.line.geometry.dynamic = true;
        for (let i=0; i < 100002; i++){
            this.line.geometry.attributes.position.array[i] = 0;
        }
        this.current_vertex_count = 2;
        this.current_position = new THREE.Vector3(0,0,0);
        this.initPosition(start, end);
    }

    generateStep(probabilityArray){
        let index = getRandomInt(0, 100);
        let dirNumber = probabilityArray[index];
        switch (dirNumber) {
            case 0:
                return new THREE.Vector3(0,-this.stepLength,0);
            case 1:
                return new THREE.Vector3(this.stepLength*2,0,0);
            case 2:
                return new THREE.Vector3(-this.stepLength*2,0,0);
            case 3:
                return new THREE.Vector3(0,0,this.stepLength*2);
            case 4:
                return new THREE.Vector3(0,0,-this.stepLength*2);
            default:
                return new THREE.Vector3(0,0,0);
        }
    }

    initPosition(start, end){
        let current_positions = this.line.geometry.attributes.position.array;
        let index = 0;
        current_positions[0] = start[0];
        current_positions[1] = start[1];
        current_positions[2] = start[2];
        current_positions[3] = end[0];
        current_positions[4] = end[1];
        current_positions[5] = end[2];
        this.current_position = new THREE.Vector3(end[0], end[1], end[2]);
        console.log(this.current_position);
        console.log("PersonLife Initialized");
        this.geometry.setDrawRange(0, this.current_vertex_count);
    }

    destroy(scene){
        scene.remove(this.line);
    }

    update(){
        let probArray = [];
        for (let i=0; i<100; i++){
            let dirNumber = Math.floor(i/20);
            console.log(dirNumber);
            probArray.push(dirNumber);
        }
        let currentStep = this.generateStep(probArray);
        console.log(currentStep);
        this.current_position = this.current_position.add(currentStep);
        console.log(this.current_position);
        this.current_vertex_count += 1;
        if (this.current_vertex_count < this.maxCount){
            let current_positions = this.line.geometry.attributes.position.array;
            current_positions[this.current_vertex_count*3]  =  this.current_position.x;
            current_positions[this.current_vertex_count*3 + 1]  =  this.current_position.y;
            current_positions[this.current_vertex_count*3 + 2]  =  this.current_position.z;
            this.geometry.setDrawRange(0, this.current_vertex_count);
            this.line.geometry.attributes.position.needsUpdate = true;
        }
    }
}
