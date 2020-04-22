class Line {
    constructor(start, end, step, numberOfPoints, indexToChange, numberOfKnots) {
        this.circlePoints = 32;
        this.numberOfKnots = numberOfKnots;
        this.indexToChangeArray = [];
        this.horizontalShifts = [];
        this.createKnotsArrays();
        this.horizontalShift = Math.random()*1000 - 500;
        this.indexToChangeToCircle = indexToChange;
        this.lineGeometry = new THREE.BufferGeometry();
        this.linePosition = new Float32Array((numberOfPoints + (this.circlePoints + 1)*numberOfKnots) * 3);
        this.material = new THREE.LineBasicMaterial({color: 0xFFFFFF});
        this.lineGeometry.addAttribute("position", new THREE.BufferAttribute(this.linePosition, 3));
        this.line = new THREE.Line(this.lineGeometry, this.material);
        this.line.geometry.dynamic = true;
        this.numberOfPoints = numberOfPoints + this.circlePoints + 1;
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
        this.xSpeed = Math.random() * 10 - 5;
        this.ySpeed = Math.random() * 10 - 5;
        this.zSpeed = Math.random() * 10 - 5;
        this.zRotationSpeed = Math.random() * 0.02 - 0.01;
        this.xRotationSpeed = Math.random() * 0.002 - 0.001;
        this.changeToCircle = false;
    }

    createKnotsArrays() {
        let currentStart  = 0;
        for (let i=0; i<this.numberOfKnots; i++){
            let index = Math.floor(Math.random()*200 + currentStart);
            if (index > this.numberOfPoints - this.circlePoints){
                break;
            }
            let horizontalShift = Math.random()*1000 - 500;
            this.indexToChangeArray.push(index);
            this.horizontalShifts.push(horizontalShift);
            currentStart = index + this.circlePoints + 50;
        }
        console.log(this.horizontalShifts);
        console.log(this.indexToChangeArray);
    }


    createCircle(currentPointy, radius, currentIndex){
        let current_positions = this.line.geometry.attributes.position.array;
        let lastY = 0;
        for (let i=0; i<=this.circlePoints; i++){
            let theta = -(i / this.circlePoints) * Math.PI + 0.5*Math.PI;
            let x = Math.cos(theta) * radius;
            let y = Math.sin(theta) * radius + currentPointy;
            let z = 0;
            let pointIndex = i + currentIndex;
            current_positions[pointIndex*3] = x;
            current_positions[pointIndex*3+1] = y;
            current_positions[pointIndex*3+2] = z;
            lastY = y;
        }
        return lastY;
        // this.line.geometry.attributes.position.needsUpdate = true;
    }

    createData(start, end) {
        //This assumes vertical lines
        let xDiff = end.y - start.y;
        let unit = xDiff / this.numberOfPoints;
        let points = this.line.geometry.attributes.position.array;
        let currentStartY = start.y;
        let afterCircleIndex = 0;
        let currentKnotIndex = 0;
        for (let i=0; i<this.numberOfPoints; i++){
            if (!this.indexToChangeArray.includes(i)){
                points[i*3] = 0;
                points[i*3+1] = currentStartY + unit*afterCircleIndex;
                points[i*3+2] = 0;
                afterCircleIndex++;
            }
            else{
                points[i*3] = 0;
                points[i*3+1] = currentStartY + unit*afterCircleIndex;
                points[i*3+2] = 0;
                afterCircleIndex = 0;
                let circleCenterY = currentStartY + unit*i + this.horizontalShifts[currentKnotIndex];
                currentStartY = this.createCircle(circleCenterY, this.horizontalShifts[currentKnotIndex], i+1);
                this.changeToCircle = true;
                i = i + this.circlePoints + 1;
                currentKnotIndex++;
            }
        }
    }

    update(){
        this.lineCenter.position.x += this.xSpeed;
        this.lineCenter.position.y += this.ySpeed;
        this.lineCenter.position.z += this.zSpeed;
        this.line.rotation.y += this.zRotationSpeed;
        // this.line.rotation.z += this.xRotationSpeed;
        this.currentDrawingProgress += this.step;
        this.line.geometry.setDrawRange(0, this.currentDrawingProgress);
        this.line.geometry.attributes.position.needsUpdate = true;
    }
}