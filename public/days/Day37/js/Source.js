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
        this.transline0 = null;
        this.transline1 = null;
        this.transline2 = null;
        this.translineDrawProgress = 0;
        this.createTransLines();
        //Transmission Line Updated Related
        this.currentTransLineIndex = 0; //max 2
        //Filtered out by layer 0 and layer 1
        this.control0 = 0.8;
        this.filteredBy0 = Math.random() < 0.5;
        this.filteredBy1 = Math.random() < 0.1 && this.filteredBy0;
        //Reverse
        this.reverse  = false;
        this.canReverse = this.filteredBy0 && this.filteredBy1;
        this.spread = false;
        this.spreadX = Math.random() - 0.5;
        this.spreadZ = 0.5 + Math.random();
    }


    createTransLines(){
        let translineGeometry = new THREE.BufferGeometry();
        let translinePosition = new Float32Array( this.numberOfLinePoints*3);
        translineGeometry.addAttribute("position", new THREE.BufferAttribute(translinePosition, 3));
        this.transline0 = new THREE.Line(translineGeometry, this.material);
        this.transline0.geometry.dynamic = true;
        for (let i=0; i < this.numberOfLinePoints; i++){
            this.transline0.geometry.attributes.position.array[i] = 0;
        }
        this.transline0.geometry.setDrawRange(0,  this.translineDrawProgress);
        this.transline0.geometry.attributes.position.needsUpdate = true;
        //this.translines.push(transline);
        let translineGeometry1 = new THREE.BufferGeometry();
        let translinePosition1 = new Float32Array( this.numberOfLinePoints*3);
        translineGeometry1.addAttribute("position", new THREE.BufferAttribute(translinePosition1, 3));
        this.transline1 = new THREE.Line(translineGeometry1, this.material);
        this.transline1.geometry.dynamic = true;
        for (let i=0; i < this.numberOfLinePoints; i++){
            this.transline1.geometry.attributes.position.array[i] = 0;
        }
        this.transline1.geometry.setDrawRange(0,  this.translineDrawProgress);
        this.transline1.geometry.attributes.position.needsUpdate = true;

        let translineGeometry2 = new THREE.BufferGeometry();
        let translinePosition2 = new Float32Array( this.numberOfLinePoints*3);
        translineGeometry2.addAttribute("position", new THREE.BufferAttribute(translinePosition2, 3));
        this.transline2 = new THREE.Line(translineGeometry2, this.material);
        this.transline2.geometry.dynamic = true;
        for (let i=0; i < this.numberOfLinePoints; i++){
            this.transline2.geometry.attributes.position.array[i] = 0;
        }
        this.transline2.geometry.setDrawRange(0,  this.translineDrawProgress);
        this.transline2.geometry.attributes.position.needsUpdate = true;
        // translineGeometry = new THREE.BufferGeometry();
        // translinePosition = new Float32Array( this.numberOfLinePoints*3);
        // translineGeometry.addAttribute("position", new THREE.BufferAttribute(translinePosition, 3));
        // this.transline1 = new THREE.Line(translineGeometry, this.material);
        // this.transline1.geometry.dynamic = true;
        // for (let i=0; i < this.numberOfLinePoints; i++){
        //     this.transline1.geometry.attributes.position.array[i] = 0;
        // }
        // this.transline1.geometry.setDrawRange(0,  this.translineDrawProgress);
        // this.transline1.geometry.attributes.position.needsUpdate = true;
    }


    getPositionOffset(v1, v2){
        return new THREE.Vector3(v2.x-v1.x, v2.y-v1.y, v2.z-v1.z);
    }

    updateTransmissionLine(layer0_pos, layer1_pos, layer2_pos){
        this.translineDrawProgress = 0;
        // let transline = this.translines[index];
        let currentCenter = new THREE.Vector3(this.center[0], this.center[1], this.center[2]);
        let offsetVector = this.getPositionOffset(currentCenter, layer0_pos);
        let singleUnitDir = new THREE.Vector3(offsetVector.x/this.numberOfLinePoints, offsetVector.y/this.numberOfLinePoints, offsetVector.z/this.numberOfLinePoints);
        for (let i=0; i<this.numberOfLinePoints; i++){
            this.transline0.geometry.attributes.position.array[i*3] = currentCenter.x + singleUnitDir.x*i;
            this.transline0.geometry.attributes.position.array[i*3+1] = currentCenter.y + singleUnitDir.y*i;
            this.transline0.geometry.attributes.position.array[i*3+2] = currentCenter.z + singleUnitDir.z*i;
        }
        this.transline0.geometry.attributes.position.needsUpdate = true;

        //transline1
        offsetVector = this.getPositionOffset(layer0_pos, layer1_pos);
        singleUnitDir = new THREE.Vector3(offsetVector.x/this.numberOfLinePoints, offsetVector.y/this.numberOfLinePoints, offsetVector.z/this.numberOfLinePoints);
        for (let i=0; i<this.numberOfLinePoints; i++){
            this.transline1.geometry.attributes.position.array[i*3] = layer0_pos.x + singleUnitDir.x*i;
            this.transline1.geometry.attributes.position.array[i*3+1] = layer0_pos.y + singleUnitDir.y*i;
            this.transline1.geometry.attributes.position.array[i*3+2] = layer0_pos.z + singleUnitDir.z*i;
        }
        this.transline1.geometry.attributes.position.needsUpdate = true;

        //transline2
        offsetVector = this.getPositionOffset(layer1_pos, layer2_pos);
        singleUnitDir = new THREE.Vector3(offsetVector.x/this.numberOfLinePoints, offsetVector.y/this.numberOfLinePoints, offsetVector.z/this.numberOfLinePoints);
        for (let i=0; i<this.numberOfLinePoints; i++){
            this.transline2.geometry.attributes.position.array[i*3] = layer1_pos.x + singleUnitDir.x*i;
            this.transline2.geometry.attributes.position.array[i*3+1] = layer1_pos.y + singleUnitDir.y*i;
            this.transline2.geometry.attributes.position.array[i*3+2] = layer1_pos.z + singleUnitDir.z*i;
        }
        this.transline2.geometry.attributes.position.needsUpdate = true;
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
        if (!this.spread){
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
        }
        else{
            this.x += this.spreadX;
            this.z += this.spreadZ;
        }
        this.sourceCircle.position.copy(new THREE.Vector3(this.x, 0, this.z));

    }

    update(){
        if (!this.reverse){
            if (this.translineDrawProgress < this.numberOfLinePoints){
                let currentTransline = null;
                switch (this.currentTransLineIndex) {
                    case 0:
                        currentTransline = this.transline0;
                        break;
                    case 1:
                        currentTransline = this.transline1;
                        break;
                    case 2:
                        currentTransline = this.transline2;
                        break;
                }
                this.translineDrawProgress += 2;
                // let transline = this.translines[i];
                if ((this.currentTransLineIndex === 1 && this.filteredBy0 )|| (this.currentTransLineIndex === 2 && this.filteredBy1) || this.currentTransLineIndex === 0)
                    currentTransline.geometry.setDrawRange(0, this.translineDrawProgress);
                currentTransline.geometry.attributes.position.needsUpdate = true;
            }
            else{
                if (this.currentTransLineIndex !== 2){
                    this.translineDrawProgress = 0;
                }

                if (this.currentTransLineIndex < 2){
                    this.currentTransLineIndex += 1;
                }
                else {
                    this.transline0.geometry.setDrawRange(0, 0);
                    this.transline0.geometry.attributes.position.needsUpdate = true;
                    this.transline1.geometry.setDrawRange(0, 0);
                    this.transline1.geometry.attributes.position.needsUpdate = true;
                    this.transline2.geometry.setDrawRange(0, 0);
                    this.transline2.geometry.attributes.position.needsUpdate = true;
                    this.reverse = this.canReverse;
                    if (this.reverse){
                        this.translineDrawProgress = 0;
                        this.currentTransLineIndex = 2;
                    }
                    else{
                        this.spread = true;
                    }

                }
            }
        }
        else{
            if (this.translineDrawProgress < this.numberOfLinePoints) {
                let currentTransline = null;
                switch (this.currentTransLineIndex) {
                    case 0:
                        currentTransline = this.transline0;
                        break;
                    case 1:
                        currentTransline = this.transline1;
                        break;
                    case 2:
                        currentTransline = this.transline2;
                        break;
                }
                this.translineDrawProgress += 2;
                // let transline = this.translines[i];
                if ((this.currentTransLineIndex === 1 && this.filteredBy0) || (this.currentTransLineIndex === 2 && this.filteredBy1) || this.currentTransLineIndex === 0)
                    currentTransline.geometry.setDrawRange(this.numberOfLinePoints - this.translineDrawProgress, this.numberOfLinePoints);
                currentTransline.geometry.attributes.position.needsUpdate = true;
                if (this.friction > 0)
                    this.friction -= 0.000048;
                else
                    this.friction = 0;
            }
            else {
                if (this.currentTransLineIndex !== 0){
                    this.translineDrawProgress = 0;
                }
                else{
                    this.friction = 0;
                }
                if (this.currentTransLineIndex > 0){
                    this.currentTransLineIndex -= 1;
                }
            }

        }

        this.updateMovement();
    }

}
