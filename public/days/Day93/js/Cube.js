class Cube {
    constructor(start_x, start_y, start_z, halfLengthFront, halfLengthSide, halfLengthDepth, rotationAxis, positiveRotation){
        this.startY = start_y;
        this.x = start_x;
        this.y = start_y;
        this.z = start_z;
        this.containerGeometry = null;
        this.containerMaterial = null;
        this.container = null;
        this.halfLengthFront = halfLengthFront;
        this.halfLengthSide = halfLengthSide;
        this.halfLengthDepth = halfLengthDepth;
        this.cubeCenter = new THREE.Group();
        this.cubeCenter.position.copy(new THREE.Vector3(this.x, this.y, this.z));
        this.createContainer();
        this.upSpeed = 20;
        if (positiveRotation){
            this.rotationSpeed = 0.01;
        }
        else{
            this.rotationSpeed = -0.01;
        }
        this.upThreshold = this.startY + 800*Math.random();
        this.rotationAxis = rotationAxis;
        this.positiveRotation = positiveRotation;
        this.replicate = false;
        this.alreadyReplicated = false;
        this.outside = true;
        this.outsideVelocityScaler = Math.random();
    }

    vectorAdd(v1, v2){
        return new THREE.Vector3(v1.x+v2.x, v1.y+v2.y, v1.z+v2.z);
    }

    createContainer(){
        // this.container = new Container([this.x, this.y], 25);
        if (this.containerGeometry !== null){
            this.containerGeometry.vertices = [];
        }
        let segmentCount = 32;
        if (this.containerGeometry === null){
            this.containerGeometry = new THREE.Geometry();
            this.containerMaterial = new THREE.LineBasicMaterial({ color: 0xFFFFFF });
        }
        let center = new THREE.Vector3(0, 0, 0);
        let vertex0 = this.vectorAdd(center, new THREE.Vector3(-this.halfLengthFront, this.halfLengthSide, -this.halfLengthDepth));
        let vertex1 = this.vectorAdd(center, new THREE.Vector3(this.halfLengthFront, this.halfLengthSide, -this.halfLengthDepth));
        let vertex2 = this.vectorAdd(center, new THREE.Vector3(-this.halfLengthFront, -this.halfLengthSide, -this.halfLengthDepth));
        let vertex3 = this.vectorAdd(center, new THREE.Vector3(this.halfLengthFront, -this.halfLengthSide, -this.halfLengthDepth));
        let vertex4 = this.vectorAdd(center, new THREE.Vector3(-this.halfLengthFront, this.halfLengthSide, this.halfLengthDepth));
        let vertex5 = this.vectorAdd(center, new THREE.Vector3(this.halfLengthFront, this.halfLengthSide, this.halfLengthDepth));
        let vertex6 = this.vectorAdd(center, new THREE.Vector3(-this.halfLengthFront, -this.halfLengthSide, this.halfLengthDepth));
        let vertex7 = this.vectorAdd(center, new THREE.Vector3(this.halfLengthFront, - this.halfLengthSide, this.halfLengthDepth));
        this.containerGeometry.vertices.push(vertex0);
        this.containerGeometry.vertices.push(vertex1);
        this.containerGeometry.vertices.push(vertex3);
        this.containerGeometry.vertices.push(vertex2);
        this.containerGeometry.vertices.push(vertex0);
        this.containerGeometry.vertices.push(vertex4);
        this.containerGeometry.vertices.push(vertex5);
        this.containerGeometry.vertices.push(vertex1);
        this.containerGeometry.vertices.push(vertex0);
        this.containerGeometry.vertices.push(vertex4);
        this.containerGeometry.vertices.push(vertex6);
        this.containerGeometry.vertices.push(vertex7);
        this.containerGeometry.vertices.push(vertex5);
        this.containerGeometry.vertices.push(vertex4);
        this.containerGeometry.vertices.push(vertex6);
        this.containerGeometry.vertices.push(vertex2);
        this.containerGeometry.vertices.push(vertex0);
        this.containerGeometry.vertices.push(vertex1);
        this.containerGeometry.vertices.push(vertex5);
        this.containerGeometry.vertices.push(vertex7);
        this.containerGeometry.vertices.push(vertex3);
        this.containerGeometry.verticesNeedUpdate = true;
        this.container = new THREE.Line(this.containerGeometry, this.containerMaterial);
        this.cubeCenter.add(this.container);
        this.cubeCenter.position.copy(new THREE.Vector3(this.x, this.y, this.z));
    }

    update(){
        if (this.y < this.upThreshold){
            this.y += this.upSpeed;
            let outVector = new THREE.Vector3(this.x, 0, this.z);
            outVector.normalize();
            outVector.multiplyScalar(50);
            if (this.outside){
                this.x += outVector.x*this.outsideVelocityScaler;
                this.z += outVector.z*this.outsideVelocityScaler;
            }
            else{
                this.x -= outVector.x*this.outsideVelocityScaler;
                this.z -= outVector.z*this.outsideVelocityScaler;
            }
            this.cubeCenter.position.copy(new THREE.Vector3(this.x, this.y, this.z));
        }
        else{
            if (!this.replicate && !this.alreadyReplicated){
                this.replicate = true;
            }
            // this.y += this.upSpeed;
            this.cubeCenter.position.copy(new THREE.Vector3(this.x, this.y, this.z));
            switch (this.rotationAxis) {
                case 0:
                    this.container.rotation.x += this.rotationSpeed;
                    if (this.positiveRotation){
                        this.z += this.upSpeed/2;
                    }
                    else{
                        this.z -= this.upSpeed/2;
                    }
                    this.cubeCenter.position.copy(new THREE.Vector3(this.x, this.y, this.z));
                    break;
                case 1:
                    this.container.rotation.y += this.rotationSpeed;
                    break;
                case 2:
                    this.container.rotation.z += this.rotationSpeed;
                    if (this.positiveRotation){
                        this.x -= this.upSpeed/2;
                    }
                    else{
                        this.x += this.upSpeed/2;
                    }
                    this.cubeCenter.position.copy(new THREE.Vector3(this.x, this.y, this.z));
                    break;
            }
        }
    }
}