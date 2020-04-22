class ClosureCircle{
    constructor(center, radius, rotation){
        this.segmentCount = 160;
        this.center = center;
        this.radius = radius;
        //TODO: Create Rotation
        this.circleGroup = new THREE.Group();
        this.geometry = new THREE.BufferGeometry();
        this.positions = new Float32Array((this.segmentCount+1)*3);
        this.geometry.addAttribute("position", new THREE.BufferAttribute(this.positions, 3));
        this.material = new THREE.LineBasicMaterial({ color: 0xFFFFFF });
        this.closureCircle = new THREE.Line( this.geometry,  this.material);
        this.closureCircle.geometry.dynamic = true;
        for (let i=0; i < this.segmentCount*3; i++){
            this.closureCircle.geometry.attributes.position.array[i] = 0;
        }
        this.fullCircleDrawProgress = this.segmentCount + 1;
        this.startDrawNumber = Math.floor(Math.random()*this.fullCircleDrawProgress);
        this.endDrawNumber = Math.floor(Math.random()*(this.fullCircleDrawProgress - this.startDrawNumber) + this.startDrawNumber);
        this.centerGroup  = new THREE.Group();
        this.target = new THREE.Vector3(0,0,0);
        this.createCircle();
        this.closureCircle.geometry.setDrawRange(this.startDrawNumber, this.endDrawNumber);
        this.closureCircle.geometry.attributes.position.needsUpdate = true;
        this.rotationSpeed = Math.random()*0.01;
        this.circleGroup.add(this.closureCircle);
        this.keepRotate = true;
        this.startComplete = false;
    }

    createCircle(){
        let current_positions = this.closureCircle.geometry.attributes.position.array;
        let yValue = Math.random()*6000;
        for (let i=0; i<=this.segmentCount; i++){
            let theta = (i / this.segmentCount) * Math.PI * 2;
            let x = Math.cos(theta) * this.radius;
            let y = 0;
            let z = Math.sin(theta) * this.radius;
            current_positions[i*3] = x;
            current_positions[i*3+1] = y;
            current_positions[i*3+2] = z;
        }
        this.circleGroup.position.copy(new THREE.Vector3(this.center[0], yValue, this.center[2]));
        this.target.x = this.center[0];
        this.target.x = 0;
        this.target.x = this.center[2];
        this.centerGroup.add(this.circleGroup);

        // this.closureCircle.position.set = new THREE.Vector3(this.center[0], yValue, this.center[1]);
        // this.closureCircle.rotation.x = Math.random();
        // this.closureCircle.rotation.y = Math.random();
        // this.closureCircle.rotation.z = Math.random();
        // //current_positions[this.segmentCount*3] = current_positions[0];
        //current_positions[this.segmentCount*3+1] = current_positions[1];
        //current_positions[this.segmentCount*3+2] = current_positions[2];
    }

    update(){
        if (this.keepRotate){
            this.centerGroup.rotation.y +=this.rotationSpeed;
        }
        if (this.startComplete){
            this.startDrawNumber = this.startDrawNumber - 1;
            this.endDrawNumber = this.endDrawNumber + 1;
            if (this.endDrawNumber > this.fullCircleDrawProgress){
                this.endDrawNumber = this.fullCircleDrawProgress;
            }
            if (this.startDrawNumber < 0){
                this.startDrawNumber = 0;
            }
            this.closureCircle.geometry.setDrawRange(this.startDrawNumber, this.endDrawNumber);
            this.closureCircle.geometry.attributes.position.needsUpdate = true;
        }


        // let current_positions = this.closureCircle.geometry.attributes.position.array;
        // for (let i=1; i<current_positions.length; i=i+3){
        //     let speed = Math.random();
        //     let speedIndicator = Math.random();
        //     if (speedIndicator > 0.5){
        //         speed = -1*speed;
        //     }
        //     current_positions[i] += speed*10;
        // }
        // this.closureCircle.geometry.attributes.position.needsUpdate = true;
    }




}
