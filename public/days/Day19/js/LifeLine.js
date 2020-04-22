class LifeLine {
    constructor(center, numberOfPoints, halfLength, step){
        // if we use group center as center
        this.center = center;
        this.halfLength = halfLength;
        this.lowX =this.center.x - halfLength + 20;
        this.upperX = this.center.x + halfLength - 20;
        this.lowY = this.center.y - halfLength + 20;
        this.upperY = this.center.y + halfLength - 20;
        this.lowZ = this.center.z - halfLength + 20;
        this.upperZ = this.center.z + halfLength - 20;
        this.numberOfPoints = numberOfPoints;
        this.lineGeometry = new THREE.BufferGeometry();
        this.linePosition = new Float32Array(numberOfPoints * 3);
        this.material = new THREE.LineBasicMaterial({color: 0xFFFFFF});
        this.lineGeometry.addAttribute("position", new THREE.BufferAttribute(this.linePosition, 3));
        this.line = new THREE.Line(this.lineGeometry, this.material);
        this.line.geometry.dynamic = true;
        this.numberOfPoints = numberOfPoints;
        for (let i = 0; i < numberOfPoints * 3; i++) {
            this.line.geometry.attributes.position.array[i] = 0;
        }
        this.currentDrawingProgress = 0;
        this.line.geometry.setDrawRange(0, this.currentDrawingProgress);
        this.line.geometry.attributes.position.needsUpdate = true;
        this.step = step;
        this.createRandomPoints();
        this.uniqueInc = Math.random();
        this.startChange = false;
        setTimeout(()=>{this.startChange=true}, Math.random()*20);
    }

    inGrid(x, y, z){
        if (x < this.upperX && x > this.lowX && y < this.upperY && y > this.lowY && z > this.lowZ && z < this.upperZ){
            return true;
        }
        return false;
    }

    createRandomPoints(){
        let currentX = 0;
        let currentY = 0;
        let currentZ = 0;
        let step = 20.0;
        let points = this.line.geometry.attributes.position.array;
        for (let i=0; i<this.numberOfPoints; i++){
            let newX = currentX + Math.random()*step*2 - step;
            let newY = currentY + Math.random()*step*2 - step;
            let newZ = currentZ + Math.random()*step*2 - step;
            while (!this.inGrid(newX, newY, newZ)){
                newX = currentX + Math.random()*step*2 - step;
                newY = currentY + Math.random()*step*2 - step;
                newZ = currentZ + Math.random()*step*2 - step;
            }
            currentX = newX;
            currentY = newY;
            currentZ = newZ;
            points[i*3] = currentX;
            points[i*3+1] = currentY;
            points[i*3+2] = currentZ;
        }
        this.line.geometry.attributes.position.needsUpdate = true;
    }

    update(){
        if (this.startChange){
            this.currentDrawingProgress += this.step;
            if (this.currentDrawingProgress < this.numberOfPoints){
                this.line.geometry.setDrawRange(0, this.currentDrawingProgress);
                this.line.geometry.attributes.position.needsUpdate = true;
            }
            else{
                this.currentDrawingProgress = 0;
                this.createRandomPoints();
            }
        }
    }
}