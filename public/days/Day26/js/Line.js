class Line {
    constructor(start, end, step, numberOfPoints, indexToChange) {
        this.circlePoints = 32;
        this.horizontalShift = Math.random()*1000 - 500;
        this.indexToChangeToCircle = indexToChange;
        this.lineGeometry = new THREE.BufferGeometry();
        this.linePosition = new Float32Array((numberOfPoints + this.circlePoints) * 3);
        this.material = new THREE.LineBasicMaterial({color: 0xFFFFFF});
        this.lineGeometry.addAttribute("position", new THREE.BufferAttribute(this.linePosition, 3));
        this.line = new THREE.Line(this.lineGeometry, this.material);
        this.line.geometry.dynamic = true;
        this.numberOfPoints = numberOfPoints + this.circlePoints;
        for (let i = 0; i < numberOfPoints * 3; i++) {
            this.line.geometry.attributes.position.array[i] = 0;
        }
        this.currentDrawingProgress = 0;
        this.line.geometry.setDrawRange(0, this.currentDrawingProgress);
        this.line.geometry.attributes.position.needsUpdate = true;
        this.step = step;
        this.lineCenter = new THREE.Group();
        this.createData(start, end);
        this.lineCenter.add(this.line);
        this.zSpeed = Math.random() * 10 - 5;
        this.zRotationSpeed = Math.random() * 0.02 - 0.01;
    }

    createCircle(currentPointy, radius, currentIndex){
        let current_positions = this.line.geometry.attributes.position.array;
        for (let i=0; i<=this.circlePoints; i++){
            let theta = -(i / this.circlePoints) * Math.PI + 0.5*Math.PI;
            let x = Math.cos(theta) * radius;
            let y = Math.sin(theta) * radius + currentPointy;
            let z = 0;
            let pointIndex = i + currentIndex;
            current_positions[pointIndex*3] = x;
            current_positions[pointIndex*3+1] = y;
            current_positions[pointIndex*3+2] = z;
        }
        // this.line.geometry.attributes.position.needsUpdate = true;
    }

    createData(start, end) {
        //This assumes vertical lines
        let xDiff = end.y - start.y;
        let unit = xDiff / this.numberOfPoints;
        let points = this.line.geometry.attributes.position.array;
        let changeToCircle = false;
        let currentStartY = start.y;
        for (let i=0; i<this.numberOfPoints; i++){
            if (i !== this.indexToChangeToCircle){
                points[i*3] = 0;
                points[i*3+1] = currentStartY + unit*i;
                points[i*3+2] = 0;
            }
            else{
                points[i*3] = 0;
                points[i*3+1] = currentStartY + unit*i;
                points[i*3+2] = 0;
                let circleCenterY = currentStartY + unit*i + this.horizontalShift;
                this.createCircle(circleCenterY, this.horizontalShift, i+1);
                currentStartY = currentStartY + 2*this.horizontalShift + unit*i;
                i = i + this.circlePoints + 1;
            }
        }
    }

    update(){
        this.lineCenter.position.z += this.zSpeed;
        this.line.rotation.y += this.zRotationSpeed;
        this.currentDrawingProgress += this.step;
        console.log(this.currentDrawingProgress);
        this.line.geometry.setDrawRange(0, this.currentDrawingProgress);
        this.line.geometry.attributes.position.needsUpdate = true;
    }
}