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
        });
        this.matrixReferencePoint = new THREE.Points(this.pointGeometry, this.pointMaterial);
        this.matrixReferencePoint.geometry.dynamic = true;
        this.setReferencePointPos();
    }


    setReferencePointPos(){
        let refPointPosArray = this.matrixReferencePoint.geometry.attributes.position.array;
        refPointPosArray[0] = this.refPointPos.x;
        refPointPosArray[1] = this.refPointPos.y;
        refPointPosArray[2] = this.refPointPos.z;
        this.matrixReferencePoint.geometry.setDrawRange(0, 1);
        this.matrixReferencePoint.geometry.attributes.position.needsUpdate = true;
    }
}