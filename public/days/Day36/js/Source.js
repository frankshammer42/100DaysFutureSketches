class Source{
    constructor(center, radius){
        this.ultimatePI  =  Math.PI;
        this.segmentCount = 160;
        this.center = center;
        this.x = this.center[0];
        this.z = this.center[2];
        this.vx = 0.0;
        this.vz = 0.0;
        this.friction = 0.99;
        this.movementRadius = 30;
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

        //Transmission Line Related
        this.numberOfLinePoints = 500;
        this.inRangePosition = null;
        this.translines = [];
        this.translineDrawProgress = 0;
        this.createTransLines();


        //Transmission Line Updated Related
        this.currentTransLineIndex = 0; //max 9
    }

    createTransLines(){
        for (let i=0; i<10; i++){
            let translineGeometry = new THREE.BufferGeometry();
            let translinePosition = new Float32Array( this.numberOfLinePoints*3);
            translineGeometry.addAttribute("position", new THREE.BufferAttribute(translinePosition, 3));
            let transline = new THREE.Line(translineGeometry, this.material);
            transline.geometry.dynamic = true;
            for (let i=0; i < this.numberOfLinePoints; i++){
                transline.geometry.attributes.position.array[i] = 0;
            }
            transline.geometry.setDrawRange(0,  this.translineDrawProgress);
            transline.geometry.attributes.position.needsUpdate = true;
            this.translines.push(transline);
        }
    }


    getPositionOffset(v1, v2){
        return new THREE.Vector3(v2.x-v1.x, v2.y-v1.y, v2.z-v1.z);
    }

    updateTransmissionLine(otherPosition, index){
        this.translineDrawProgress = 0;
        let transline = this.translines[index];
        let currentCenter = new THREE.Vector3(this.center[0], this.center[1], this.center[2]);
        let offsetVector = this.getPositionOffset(currentCenter, otherPosition);
        let singleUnitDir = new THREE.Vector3(offsetVector.x/this.numberOfLinePoints, offsetVector.y/this.numberOfLinePoints, offsetVector.z/this.numberOfLinePoints);
        for (let i=0; i<this.numberOfLinePoints; i++){
            transline.geometry.attributes.position.array[i*3] = currentCenter.x + singleUnitDir.x*i;
            transline.geometry.attributes.position.array[i*3+1] = currentCenter.y + singleUnitDir.y*i;
            transline.geometry.attributes.position.array[i*3+2] = currentCenter.z + singleUnitDir.z*i;
        }
        transline.geometry.attributes.position.needsUpdate = true;
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

    insideMovementCircle(){
        let startX = this.center[0];
        let startZ = this.center[2];
        let xDist = Math.pow(startX-this.x, 2);
        let zDist = Math.pow(startZ-this.z, 2);
        let radiusPow = this.movementRadius*this.movementRadius;
        return xDist + zDist < radiusPow;
    }

    updateMovement(){
        this.x += this.vx;
        this.z += this.vz;
        if (this.insideMovementCircle()){
            this.vx += Math.random() * 1 - 0.5;
            this.vz += Math.random() * 1 - 0.5;
        }
        else{
            this.vx += (this.center[0] - this.x)*0.015;
            this.vz += (this.center[2] - this.z)*0.015;
        }
        this.vx *= this.friction;
        this.vz *= this.friction;
        this.sourceCircle.position.copy(new THREE.Vector3(this.x, 0, this.z));
    }

    update(){
        if (this.translineDrawProgress < this.numberOfLinePoints){
            this.translineDrawProgress += 2;
            for (let i=0; i<10; i++){
                let transline = this.translines[i];
                transline.geometry.setDrawRange(0, this.translineDrawProgress);
                transline.geometry.attributes.position.needsUpdate = true;
                if (this.friction > 0)
                    this.friction -= 0.000048;
                else
                    this.friction = 0;
            }
        }
        else{
            this.friction = 0;
        }
        this.updateMovement();
    }

}
