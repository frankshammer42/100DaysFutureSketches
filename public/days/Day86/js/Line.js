class Line {
    constructor(start, end, numberOfPoints) {
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
        this.line.geometry.setDrawRange(0, this.numberOfPoints);
        this.line.geometry.attributes.position.needsUpdate = true;
        this.rotationX = Math.random()*0.01 - 0.005;
        this.rotationY = Math.random()*0.01 - 0.005;
        this.rotationZ = Math.random()*0.01 - 0.005;
        this.createData(start, end);
    }

    createData(start, end) {
        //This assumes horizontal shit
        let vecDiff = new THREE.Vector3(0, 0, 0);
        vecDiff.subVectors(end, start);
        vecDiff.multiplyScalar(1/this.numberOfPoints);
        let currentPoint = start.clone();
        let points = this.line.geometry.attributes.position.array;
        for (let i=0; i<this.numberOfPoints; i++){
            points[i*3] = currentPoint.x;
            points[i*3+1] = currentPoint.y;
            points[i*3+2] = currentPoint.z;
            currentPoint.add(vecDiff);
        }
        this.line.geometry.setDrawRange(0, this.numberOfPoints);
        this.line.geometry.attributes.position.needsUpdate = true;
    }

    update(){
        this.line.rotation.x += this.rotationX;
        this.line.rotation.y += this.rotationY;
        this.line.rotation.z += this.rotationZ;
    }
}
