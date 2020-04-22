class ConnectedPair {
    constructor(halfSize, position, rotation){
        this.leftPoint = null;
        this.rightPoint = null;
        this.leftY = 0;
        this.rightY = 0;
        this.leftX = -halfSize;
        this.rightX = halfSize;
        this.pair = new THREE.Group();
        this.createPairPoints();
        //Connection Related Variables
        this.pointGeometryLeft;
        this.pointGeometryRight;
        this.connectionNumber = 100;
        this.connectionList = [];
        this.amplitudeUnit = 10;
        this.speed = 1;
        this.createSinConnections();
        this.pair.position.x = position.x;
        this.pair.position.y = position.y;
        this.pair.position.z = position.z;
        this.pair.rotation.x = rotation.x;
        this.pair.rotation.y = rotation.y;
        this.pair.rotation.z = rotation.z;
    }

    createSinConnections(){
        for (let i=0; i<this.connectionNumber/2; i++){
            let leftPos  = new THREE.Vector3(this.leftX, this.leftY, 0);
            let rightPos  = new THREE.Vector3(this.rightX, this.rightY, 0);
            let sinCon = new SinCon(leftPos, rightPos, (i)*this.amplitudeUnit);
            this.pair.add(sinCon.sinLine);
            this.connectionList.push(sinCon);
        }
        for (let i=0; i<this.connectionNumber/2; i++){
            let leftPos  = new THREE.Vector3(this.leftX, this.leftY, 0);
            let rightPos  = new THREE.Vector3(this.rightX, this.rightY, 0);
            let sinCon = new SinCon(leftPos, rightPos, (i+1)*-this.amplitudeUnit);
            this.pair.add(sinCon.sinLine);
            this.connectionList.push(sinCon);
        }
    }

    createPairPoints(){
        this.pointGeometryLeft = new THREE.BufferGeometry();
        let positionLeft = new Float32Array(3);
        this.pointGeometryRight = new THREE.BufferGeometry();
        let positionRight = new Float32Array(3);
        this.pointGeometryLeft.addAttribute("position", new THREE.BufferAttribute(positionLeft, 3));
        this.pointGeometryRight.addAttribute("position", new THREE.BufferAttribute(positionRight, 3));
        let pointMaterial = new THREE.PointsMaterial( {
            size: 6,  // This might be the size you are thinking of?
            sizeAttenuation: false,
        });
        this.leftPoint = new THREE.Points(this.pointGeometryLeft, pointMaterial);
        this.rightPoint = new THREE.Points(this.pointGeometryRight, pointMaterial);
        let leftPointPosition = this.leftPoint.geometry.attributes.position.array;
        let rightPointPosition = this.rightPoint.geometry.attributes.position.array;
        leftPointPosition[0] = 0;
        leftPointPosition[1] = 0;
        rightPointPosition[0] = 0;
        rightPointPosition[1] = 0;
        this.rightPoint.geometry.dynamic = true;
        this.leftPoint.geometry.dynamic = true;
        this.leftPoint.position.x = this.leftX;
        this.rightPoint.position.x = this.rightX;
        this.pair.add(this.leftPoint);
        this.pair.add(this.rightPoint);
    }

    update(){
        this.leftX -= this.speed;
        this.rightX += this.speed;
        if (this.leftX < -800 || this.leftX > -20){
            this.speed *= -1;
        }
        this.leftPoint.position.x = this.leftX;
        this.rightPoint.position.x = this.rightX;
        let left = new THREE.Vector3(this.leftX, 0, 0);
        let right = new THREE.Vector3(this.rightX, 0, 0);
        for (let i=0; i<this.connectionList.length/2; i++){
            this.connectionList[i].left = left;
            this.connectionList[i].right = right;
            this.connectionList[i].amplitude = i * 10 * (1 - (-this.leftX/1000));
            this.connectionList[i].update();
        }
        for (let i=0; i<this.connectionList.length/2; i++){
            this.connectionList[i + this.connectionList.length/2].left = left;
            this.connectionList[i + this.connectionList.length/2].right = right;
            this.connectionList[i + this.connectionList.length/2].amplitude = -1*(i+1) * 10 * (1 - (-this.leftX/1000));
            this.connectionList[i + this.connectionList.length/2].update();
        }
    }
}
