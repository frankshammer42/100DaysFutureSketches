class MatrixPoint{
    constructor(id, dimension, position, x, y, z){
        this.matrixID = id;
        this.matrixWidth = dimension.x;
        this.matrixHeight = dimension.y;
        this.matrixDepth = dimension.z;
        this.xNumber = x;
        this.yNumber = y;
        this.zNumber = z;
        this.refPointPos = position;
        this.pointGeometry = new THREE.BufferGeometry();
        this.position = new Float32Array(3);
        this.pointGeometry.addAttribute("position", new THREE.BufferAttribute(this.position, 3));
        this.pointMaterial = new THREE.PointsMaterial( {
            size: 2,  // This might be the size you are thinking of?
            sizeAttenuation: false,
            needsUpdate: true
        });
        this.matrixReferencePoint = new THREE.Points(this.pointGeometry, this.pointMaterial);
        this.matrixReferencePoint.geometry.dynamic = true;
        this.setReferencePointPos();
        this.scale = 0.01;
        this.speedUpdated = false;
        this.xSpeed = (Math.random() - 0.5)*this.scale;
        this.ySpeed = (Math.random() - 0.5)*this.scale;
        this.zSpeed = (Math.random() - 0.5)*this.scale;
        this.clockwiseRotate = (this.xNumber%2 === 0)?1:-1;
        this.rotateSpeed = 0.01*this.clockwiseRotate;
        this.resetCounter = 0;
        this.rotateCounter = 0;
        this.rotateCounterMax = 200;
        this.startRotate = false;
        //Scale of the material
        this.scaleSpeed = -1;
        this.counter = 0;
        this.maxCounter = 2;
    }



    setReferencePointPos(){
        let refPointPosArray = this.matrixReferencePoint.geometry.attributes.position.array;
        refPointPosArray[0] = this.refPointPos.x;
        refPointPosArray[1] = this.refPointPos.y;
        refPointPosArray[2] = this.refPointPos.z;
        this.matrixReferencePoint.geometry.setDrawRange(0, 1);
        this.matrixReferencePoint.geometry.attributes.position.needsUpdate = true;
    }

    update(){
        if (this.startRotate){
            if (this.rotateCounter < this.rotateCounterMax){
                let axis = new THREE.Vector3(1,1,1);
                this.refPointPos.applyAxisAngle(axis, this.rotateSpeed);
                let refPointPosArray = this.matrixReferencePoint.geometry.attributes.position.array;
                refPointPosArray[0] = this.refPointPos.x;
                refPointPosArray[1] = this.refPointPos.y;
                refPointPosArray[2] = this.refPointPos.z;
            }
            else{
                this.rotateCounter = 0;
                this.rotateSpeed *= -1;
                this.resetCounter++;
                if (this.resetCounter === 2){
                    this.rotateSpeed = 0;
                }
            }
            this.rotateCounter++;
        }

        if (this.counter < this.maxCounter){
            this.pointMaterial.size += this.scaleSpeed;
            this.pointMaterial.needsUpdate = true;
        }
        else{
            this.counter = 0;
            this.scaleSpeed *= -1;
        }
        this.counter++;
        // if (this.scale !== 0 && !this.speedUpdated){
        //     this.xSpeed *= this.scale;
        //     this.ySpeed *= this.scale;
        //     this.zSpeed *= this.scale;
        //     this.speedUpdated = true;
        // }
        // this.refPointPos.x  += this.xSpeed;
        // this.refPointPos.y  += this.ySpeed;
        // this.refPointPos.z  += this.zSpeed;
        // refPointPosArray[0] = this.refPointPos.x;
        // refPointPosArray[1] = this.refPointPos.y;
        // refPointPosArray[2] = this.refPointPos.z;
        this.matrixReferencePoint.geometry.setDrawRange(0, 1);
        this.matrixReferencePoint.geometry.attributes.position.needsUpdate = true;
    }
}