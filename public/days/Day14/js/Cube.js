class Cube {
    constructor(start_x, start_y, start_z, halfLengthFront, halfLengthSide, halfLengthDepth){
        this.startVector = new THREE.Vector3(start_x, start_y, start_z);
        this.friction = 0.99;
        this.vx = 0.0;
        this.vy = 0.0;
        this.vz = 0.0;
        this.x = start_x;
        this.y = start_y;
        this.z = start_z;
        this.containerGeometry = null;
        this.containerMaterial = null;
        this.container = null;
        this.halfLengthFront = halfLengthFront;
        this.halfLengthSide = halfLengthSide;
        this.halfLengthDepth = halfLengthDepth;
        this.createContainer();
        this.speedX = Math.random() * 0.08 - 0.04;
        this.speedY = Math.random() * 0.08 - 0.04;
        this.speedZ = Math.random() * 0.08 - 0.04;
        this.increaseRate = 1.0002;
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
        this.containerGeometry = new THREE.Geometry();
        this.containerMaterial = new THREE.LineBasicMaterial({ color: 0xFFFFFF });
        let center = new THREE.Vector3(this.x, this.y, this.z);
        let vertex0 = this.vectorAdd(center, new THREE.Vector3(-this.halfLengthFront, this.halfLengthSide, -this.halfLengthDepth));
        let vertex1 = this.vectorAdd(center, new THREE.Vector3(this.halfLengthFront, this.halfLengthSide, -this.halfLengthDepth));
        let vertex2 = this.vectorAdd(center, new THREE.Vector3(-this.halfLengthFront, -this.halfLengthSide, -this.halfLengthDepth));
        let vertex3 = this.vectorAdd(center, new THREE.Vector3(this.halfLengthFront, -this.halfLengthSide, -this.halfLengthDepth));
        let vertex4 = this.vectorAdd(center, new THREE.Vector3(-this.halfLengthFront, this.halfLengthSide, this.halfLengthDepth));
        let vertex5 = this.vectorAdd(center,  new THREE.Vector3(this.halfLengthFront, this.halfLengthSide, this.halfLengthDepth));
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
        this.container = new THREE.Line(this.containerGeometry, this.containerMaterial);
        this.container.position.copy(new THREE.Vector3(this.x, this.y, this.z));
    }

    moveToTarget(target, tweenTime){
        let deepTripPosition = new TWEEN.Tween(this.container.position)
            .to( {
                x: target.x,
                y: target.y,
                z: target.z
            }, tweenTime)
            .easing( TWEEN.Easing.Cubic.InOut ).onUpdate( function () {
            })
            .start();
    }



    update(){
        // this.container.rotation.x += this.speedX;
        // this.container.rotation.y += this.speedY;
        this.container.rotation.z += this.speedZ;
        // this.speedX *= this.increaseRate;
        // this.speedY *= this.increaseRate;
        // this.speedZ *= this.increaseRate;
    }
}