class Line {
    constructor(numberOfPoints) {
        this.lineGeometry = new THREE.BufferGeometry();
        this.linePosition = new Float32Array(numberOfPoints * 3);
        this.material = new THREE.LineBasicMaterial({color: 0xFFFFFF});
        this.lineGeometry.addAttribute("position", new THREE.BufferAttribute(this.linePosition, 3));
        this.line = new THREE.Line(this.lineGeometry, this.material);
        this.line.geometry.dynamic = true;
        this.line.frustumCulled = false;
        this.numberOfPoints = numberOfPoints;
        let currentStartY =  Math.random()*20;
        let currentStartX = -200;
        for (let i = 0; i < numberOfPoints * 3; i++) {
            this.line.geometry.attributes.position.array[i] = 0;
        }
        this.currentDrawRange = 0;
        this.line.geometry.setDrawRange(0, this.currentDrawRange);
        this.line.geometry.attributes.position.needsUpdate = true;
    }

    updateConnection(connectedMatrixPoints){
        this.currentDrawRange = connectedMatrixPoints.length;
        let currentPositionArray = this.line.geometry.attributes.position.array;
        for (let i=0; i<this.currentDrawRange; i++){
            let currentPosition = connectedMatrixPoints[i].refPointPos;
            this.line.geometry.attributes.position.array[i*3] = currentPosition.x;
            this.line.geometry.attributes.position.array[i*3+1] = currentPosition.y;
            this.line.geometry.attributes.position.array[i*3+2] = currentPosition.z;
        }
        this.line.geometry.setDrawRange(0, this.currentDrawRange);
        this.line.geometry.attributes.position.needsUpdate = true;
    }

    clearConnection(){
        this.currentDrawRange = 0;
        this.line.geometry.setDrawRange(0, this.currentDrawRange);
        this.line.geometry.attributes.position.needsUpdate = true;
    }

    update(){
    }
}
