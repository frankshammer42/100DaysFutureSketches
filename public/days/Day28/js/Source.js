class Source{
    constructor(center, radius){
        this.ultimatePI  =  Math.PI;
        this.segmentCount = 160;
        this.center = center;
        this.radius = radius;
        this.geometry = new THREE.BufferGeometry();
        this.positions = new Float32Array((this.segmentCount+1)*3);
        this.geometry.addAttribute("position", new THREE.BufferAttribute(this.positions, 3));
        this.material = new THREE.LineBasicMaterial({ color: 0xFFFFFF });
        this.sourceCircle = new THREE.Line( this.geometry,  this.material);
        this.sourceCircle.geometry.dynamic = true;
        for (let i=0; i < this.segmentCount*3; i++){
            this.sourceCircle.geometry.attributes.position.array[i] = 0;
        }
        this.fullCircleDrawProgress = this.segmentCount + 1;
        this.createCircle();
        this.sourceCircle.geometry.setDrawRange(0, this.fullCircleDrawProgress);
        this.sourceCircle.geometry.attributes.position.needsUpdate = true;
        this.resetCounter = 0;
        this.resetThreshold = 100;
        this.origPosition = true;
        this.updateRotationSpeed();
        this.randomZSpeed = Math.random()*8-4;
    }

    updateRotationSpeed(){
        this.rotationXSpeed = Math.random()*0.01 - 0.005;
        this.rotationYSpeed = Math.random()*0.01 - 0.005;
        this.rotationZSpeed = Math.random()*0.01 - 0.005;
    }

    createCircle(){
        let current_positions = this.sourceCircle.geometry.attributes.position.array;
        for (let i=0; i<=this.segmentCount; i++){
            let theta = (i / this.segmentCount) * this.ultimatePI * 2;
            let x = Math.cos(theta) * this.radius;
            let y = 0;
            let z = Math.sin(theta) * this.radius;
            current_positions[i*3] = x;
            current_positions[i*3+1] = y;
            current_positions[i*3+2] = z;
        }
        this.sourceCircle.geometry.attributes.position.needsUpdate = true;
        this.sourceCircle.position.copy(new THREE.Vector3(this.center[0], 0, this.center[2]));
    }

    update(){
        this.resetCounter += 1;
        if (this.resetCounter > this.resetThreshold){
            this.origPosition = !this.origPosition;
            if (this.origPosition){
                this.updateRotationSpeed();
                this.randomZSpeed = Math.random()*2 -1;
                //this.resetThreshold = Math.floor(Math.random()*20);
            }
            else{
                this.rotationXSpeed *= -1;
                this.rotationYSpeed *= -1;
                this.rotationZSpeed *= -1;
                this.randomZSpeed *= -1;
            }
            this.resetCounter = 0;
        }
        this.sourceCircle.rotation.x += this.rotationXSpeed;
        this.sourceCircle.rotation.y += this.rotationYSpeed;
        this.sourceCircle.rotation.z += this.rotationZSpeed;
        this.sourceCircle.position.z += this.randomZSpeed;
    }

}
