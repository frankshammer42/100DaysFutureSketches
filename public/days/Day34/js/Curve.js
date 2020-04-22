function avg (v) {
    return v.reduce((a,b) => a+b, 0)/v.length;
}

class Curve{
    constructor(start){
        this.v = 500;
        this.turnAmount = 3;
        this.theta = Math.random()*this.turnAmount - this.turnAmount/2;
        this.start = start;
        this.segmentCount = 1000;
        // this.geometry = new THREE.BufferGeometry();
        // this.positions = new Float32Array((this.segmentCount)*3);
        // this.geometry.addAttribute("position", new THREE.BufferAttribute(this.positions, 3));
        // this.material = new THREE.LineBasicMaterial({ color: 0xFFFFFF });
        // this.sourceCurve = new THREE.Line( this.geometry,  this.material);
        // this.sourceCurve.geometry.dynamic = true;
        // for (let i=0; i < this.segmentCount*3; i++){
        //     this.sourceCurve.geometry.attributes.position.array[i] = 0;
        // }
        // this.fullCircleDrawProgress = 0;
        // this.sourceCurve.geometry.setDrawRange(0, this.fullCircleDrawProgress);
        // this.sourceCurve.geometry.attributes.position.needsUpdate = true;
        this.curveData = [];
        this.createCurveData();
        this.curveCircles = [];
        this.generateCurveCircles();
        this.xrot = Math.random()*0.001 - 0.0005;
        this.yrot = Math.random()*0.001 - 0.0005;
        this.zrot = Math.random()*0.001 - 0.0005;
        this.currentRadius = 1000;
        this.radiusStep = Math.random()*100 - 50;
    }

    generateCurveCircles(){
        let radius = 1000;
        for (let i=0; i<this.curveData.length; i++){
            let center = this.curveData[i];
            let sourceCircle = this.createCircle(radius, center);
            this.curveCircles.push(sourceCircle);
        }
    }

    updateCircle(index, currentRadius, center){
        let sourceCircle = this.curveCircles[index];
        let circleSegment = 64;
        let current_positions = sourceCircle.geometry.attributes.position.array;
        console.log(current_positions);
        for (let i=0; i<=circleSegment; i++){
            let theta = (i / circleSegment) * Math.PI * 2;
            let x = center.x;
            let y = Math.sin(theta) * currentRadius + center.y;
            let z = Math.cos(theta) * currentRadius + center.z;
            current_positions[i*3] = x;
            current_positions[i*3+1] = y;
            current_positions[i*3+2] = z;
        }
        sourceCircle.geometry.setDrawRange(0, circleSegment+1);
        sourceCircle.geometry.attributes.position.needsUpdate = true;
    }

    createCircle(r, center){
        let circleSegment = 64;
        let geometry = new THREE.BufferGeometry();
        let positions = new Float32Array((circleSegment+1)*3);
        geometry.addAttribute("position", new THREE.BufferAttribute(positions, 3));
        let material = new THREE.LineBasicMaterial({ color: 0xFFFFFF });
        let sourceCircle = new THREE.Line( geometry,  material);
        sourceCircle.geometry.dynamic = true;
        for (let i=0; i < circleSegment*3; i++){
            sourceCircle.geometry.attributes.position.array[i] = 0;
        }
        let current_positions = sourceCircle.geometry.attributes.position.array;
        for (let i=0; i<=circleSegment; i++){
            let theta = (i / circleSegment) * Math.PI * 2;
            let x = center.x;
            let y = Math.sin(theta) * r + center.y;
            let z = Math.cos(theta) * r + center.z;
            current_positions[i*3] = x;
            current_positions[i*3+1] = y;
            current_positions[i*3+2] = z;
        }
        sourceCircle.geometry.setDrawRange(0, circleSegment+1);
        sourceCircle.geometry.attributes.position.needsUpdate = true;
        return sourceCircle;
    }

    smoothOut (vector, variance) {
        let t_avg = avg(vector)*variance;
        let ret = Array(vector.length);
        for (let i = 0; i < vector.length; i++) {
            (function () {
                let prev = i>0 ? ret[i-1] : vector[i];
                let next = i<vector.length ? vector[i] : vector[i-1];
                ret[i] = avg([t_avg, avg([prev, vector[i], next])]);
            })();
        }
        return ret;
    }


    createCurveData(){
        let currentPosition = this.start;
        let currentTheta = this.theta;
        let updateAmountArray = [];
        for (let i=0; i<this.segmentCount; i++){
            let updateTurnAmount = Math.random()*this.turnAmount - this.turnAmount/2;
            updateAmountArray.push(updateTurnAmount);
        }
        updateAmountArray = this.smoothOut(updateAmountArray, 0.85);
        for (let i=0; i<this.segmentCount; i++){
            // let updateTurnAmount = Math.random()*this.turnAmount - this.turnAmount/2;
            currentTheta += updateAmountArray[i];
            // currentTheta += updateTurnAmount;
            let xUpdateAmount = Math.cos(currentTheta) * this.v;
            let yUpdateAmount = Math.sin(currentTheta) * this.v;
            currentPosition = new THREE.Vector3(currentPosition.x+xUpdateAmount, this.start.y, currentPosition.z+yUpdateAmount);
            this.curveData.push(currentPosition);
        }
    }


    update(){
        this.currentRadius += this.radiusStep;
        for (let i=0; i<this.curveCircles.length; i++){
            this.updateCircle(i, this.currentRadius, this.curveData[i]);
        }
        if (this.currentRadius < 200 || this.currentRadius > 8000){
            this.radiusStep *= -1;
        }

        // this.fullCircleDrawProgress += 1;
        // if(this.fullCircleDrawProgress < this.segmentCount){
        //     this.sourceCurve.geometry.setDrawRange(0, this.fullCircleDrawProgress);
        //     this.sourceCurve.geometry.attributes.position.needsUpdate = true;
        // }
        // this.sourceCurve.rotation.x += this.xrot;
        // this.sourceCurve.rotation.y += this.yrot;
        // this.sourceCurve.rotation.z += this.zrot;
    }

}
