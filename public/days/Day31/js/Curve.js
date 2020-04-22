function avg (v) {
    return v.reduce((a,b) => a+b, 0)/v.length;
}

class Curve{
    constructor(start){
        this.v = 30;
        this.turnAmount = 0.2;
        this.theta = Math.random()*this.turnAmount - this.turnAmount/2;
        this.start = start;
        this.segmentCount = 1000;
        this.geometry = new THREE.BufferGeometry();
        this.positions = new Float32Array((this.segmentCount)*3);
        this.geometry.addAttribute("position", new THREE.BufferAttribute(this.positions, 3));
        this.material = new THREE.LineBasicMaterial({ color: 0xFFFFFF });
        this.sourceCurve = new THREE.Line( this.geometry,  this.material);
        this.sourceCurve.geometry.dynamic = true;
        for (let i=0; i < this.segmentCount*3; i++){
            this.sourceCurve.geometry.attributes.position.array[i] = 0;
        }
        this.fullCircleDrawProgress = 0;
        this.sourceCurve.geometry.setDrawRange(0, this.fullCircleDrawProgress);
        this.sourceCurve.geometry.attributes.position.needsUpdate = true;
        this.createCurve();
        this.xrot = Math.random()*0.001 - 0.0005;
        this.yrot = Math.random()*0.001 - 0.0005;
        this.zrot = Math.random()*0.001 - 0.0005;
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


    createCurve(){
        // let updateAmount = [];
        // for (let i=0; i<this.segmentCount; i++){
        //     let updateTurnAmount = Math.random()*this.turnAmount - this.turnAmount/2;
        //     updateAmount.push(updateTurnAmount);
        // }
        // updateAmount = this.smoothOut(updateAmount, 0.1);
        let currentPosition = this.start;
        let currentTheta = this.theta;
        let positionArray = this.sourceCurve.geometry.attributes.position.array;
        for (let i=0; i<this.segmentCount; i++){
            let updateTurnAmount = Math.random()*this.turnAmount - this.turnAmount/2;
            // currentTheta += updateAmount[i];
            currentTheta += updateTurnAmount;
            let xUpdateAmount = Math.cos(currentTheta) * this.v;
            let yUpdateAmount = Math.sin(currentTheta) * this.v;
            currentPosition = new THREE.Vector3(currentPosition.x+xUpdateAmount, 0, currentPosition.z+yUpdateAmount);
            positionArray[i*3] = currentPosition.x;
            positionArray[i*3+1] = currentPosition.y;
            positionArray[i*3+2] = currentPosition.z;
        }
    }


    update(){
        this.fullCircleDrawProgress += 1;
        if(this.fullCircleDrawProgress < this.segmentCount){
            this.sourceCurve.geometry.setDrawRange(0, this.fullCircleDrawProgress);
            this.sourceCurve.geometry.attributes.position.needsUpdate = true;
        }
        this.sourceCurve.rotation.x += this.xrot;
        this.sourceCurve.rotation.y += this.yrot;
        this.sourceCurve.rotation.z += this.zrot;
    }

}
