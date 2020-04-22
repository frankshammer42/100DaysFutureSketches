class Line {
    constructor(start, end, step, numberOfPoints, sinStart, sinNumber, yMax) {
        this.yMax = yMax;
        this.sinNumber = sinNumber;
        this.sinStart = sinStart;
        this.sinEnd = sinStart + sinNumber;
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
        this.line.geometry.setDrawRange(0, this.numberOfPoints);
        this.line.geometry.attributes.position.needsUpdate = true;
        this.step = step;
        this.start = start;
        this.end = end;
        this.peakVal = Math.random() - 0.5;
        this.rotSpeed = Math.random() * 0.1 - 0.05;
        this.createData(start, end);
    }

    createData(start, end) {
        //This assumes horizontal shit
        let xDiff = end.x - start.x;
        let unit = xDiff / this.numberOfPoints;
        let points = this.line.geometry.attributes.position.array;
        for (let i=0; i<this.numberOfPoints; i++){
            points[i*3] = start.x + unit*i;
            if (i < this.sinStart || i > this.sinEnd){
                points[i*3+1] = start.y;
            }
            else{
                let currentTheta = Math.PI * ((i-this.sinStart)/this.sinNumber);
                let sinValue = Math.sin(currentTheta)*this.yMax;
                points[i*3+1] = sinValue + start.y;
            }
            points[i*3+2] = 0;
        }
    }

    update(){
        // this.line.rotation.x += this.rotSpeed;
        this.sinStart += 1;
        this.yMax += this.peakVal;
        if (this.yMax >= 200){
            this.peakVal *= -1;
        }

        this.sinEnd = this.sinStart + this.sinNumber;
        if (this.sinStart >= this.numberOfPoints){
            this.sinStart = 0;
        }
        this.createData(this.start, this.end);
        this.line.geometry.attributes.position.needsUpdate = true;
    }
}