class ClosureCircle{
    constructor(center, radius, rotation){
        this.segmentCount = 160;
        this.center = center;
        this.radius = radius;
        //TODO: Create Rotation
        this.geometry = new THREE.BufferGeometry();
        this.positions = new Float32Array((this.segmentCount+1)*3);
        this.geometry.addAttribute("position", new THREE.BufferAttribute(this.positions, 3));
        this.material = new THREE.LineBasicMaterial({ color: 0xFFFFFF });
        this.closureCircle = new THREE.Line( this.geometry,  this.material);
        this.closureCircle.geometry.dynamic = true;
        for (let i=0; i < this.segmentCount*3; i++){
            this.closureCircle.geometry.attributes.position.array[i] = 0;
        }
        this.skipLinesNumber = 0;
        this.currentDrawProgress = this.segmentCount + 1;
        this.strugleSpeed = [];
        this.createCircle();
        this.closureCircle.geometry.setDrawRange(0, this.currentDrawProgress);
        this.closureCircle.geometry.attributes.position.needsUpdate = true;
    }

    createCircle(){
        for (let i=0; i<this.segmentCount; i++){
            let speed = Math.random();
            let speedIndicator = Math.random();
            if (speedIndicator > 0.5){
                speed = -1*speed;
            }
            this.strugleSpeed.push(speed);
        }
        console.log(this.strugleSpeed);
        this.strugleSpeed.push(this.strugleSpeed[0]);
        //TODO: Let it move around
        let current_positions = this.closureCircle.geometry.attributes.position.array;
        for (let i=this.skipLinesNumber; i<this.segmentCount; i++){
            let theta = (i / this.segmentCount) * Math.PI * 2;
            let x = Math.cos(theta) * this.radius + this.center[0];
            let y = Math.random() * 100 ;
            let z = Math.sin(theta) * this.radius + this.center[2];
            current_positions[(i-this.skipLinesNumber)*3] = x;
            current_positions[(i-this.skipLinesNumber)*3+1] = y;
            current_positions[(i-this.skipLinesNumber)*3+2] = z;
        }
        current_positions[this.segmentCount*3] = current_positions[0];
        current_positions[this.segmentCount*3+1] = current_positions[1];
        current_positions[this.segmentCount*3+2] = current_positions[2];

    }

    update(){
        let current_positions = this.closureCircle.geometry.attributes.position.array;
        for (let i=1; i<current_positions.length; i=i+3){
            let speed = Math.random();
            let speedIndicator = Math.random();
            if (speedIndicator > 0.5){
                speed = -1*speed;
            }
            current_positions[i] += speed*10;
        }
        this.closureCircle.geometry.attributes.position.needsUpdate = true;
    }


}
