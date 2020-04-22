class Line {
    constructor(start, end, step, numberOfPoints) {
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
        this.currentDrawingProgress = this.numberOfPoints;
        this.line.geometry.setDrawRange(0, this.currentDrawingProgress);
        this.line.geometry.attributes.position.needsUpdate = true;
        this.step = step;
        this.lineCenter = new THREE.Group();
        this.createData(start, end);
        this.lineCenter.add(this.line);
        this.zSpeed = Math.random() * 20 - 10;
        this.updateMaxTime = 600;
        this.currentUpdateTime = 0;
        this.stayShape = false;
        this.stayShapeCount = 0;
        this.stayShapeCountMax = 300;
        this.spreading = true;
    }

    createData(start, end) {
        //This assumes horizontal shit
        let xDiff = end.x - start.x;
        let unit = xDiff / this.numberOfPoints;
        let points = this.line.geometry.attributes.position.array;
        for (let i=0; i<this.numberOfPoints; i++){
            points[i*3] = start.x + unit*i;
            points[i*3+1] = 0;
            points[i*3+2] = 0;
        }
    }

    update(){
        this.line.rotation.y += 0.04;
        if (!this.stayShape){
            this.line.position.z += this.zSpeed;
            this.currentUpdateTime += 1;
            if (this.currentUpdateTime === this.updateMaxTime){
                this.zSpeed *= -1;
                if (!this.spreading){
                    this.stayShape = true;
                    this.zSpeed = Math.random()*20 - 10;
                }
                this.currentUpdateTime = 0;
                this.spreading = !this.spreading;
            }
        }
        else{
            this.stayShapeCount += 1;
            if (this.stayShapeCount >= this.stayShapeCountMax){
                this.stayShapeCount = 0;
                this.stayShape = false;
            }
        }
    }
}