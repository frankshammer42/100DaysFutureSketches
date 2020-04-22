class Cube {
    constructor(start_x, start_y, start_z, halfLength, numberOfPointsForLine){
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
        this.halfLength = halfLength;
        this.cubeCenter = new THREE.Group();
        this.cubeCenter.position.copy(new THREE.Vector3(this.x, this.y, this.z));
        this.createContainer();
        this.speedX = Math.random() * 0.0008 - 0.0004;
        this.speedY = Math.random() * 0.0008 - 0.0004;
        this.lifeLine = new LifeLine(new THREE.Vector3(0,0,0), numberOfPointsForLine, halfLength, 10);
        this.cubeCenter.add(this.lifeLine.line);
        this.goNext = false;
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
        let vertex0 = this.vectorAdd(center, new THREE.Vector3(-this.halfLength, this.halfLength, -this.halfLength));
        let vertex1 = this.vectorAdd(center, new THREE.Vector3(this.halfLength, this.halfLength, -this.halfLength));
        let vertex2 = this.vectorAdd(center, new THREE.Vector3(-this.halfLength, -this.halfLength, -this.halfLength));
        let vertex3 = this.vectorAdd(center, new THREE.Vector3(this.halfLength, -this.halfLength, -this.halfLength));
        let vertex4 = this.vectorAdd(center, new THREE.Vector3(-this.halfLength, this.halfLength, this.halfLength));
        let vertex5 = this.vectorAdd(center, new THREE.Vector3(this.halfLength, this.halfLength, this.halfLength));
        let vertex6 = this.vectorAdd(center, new THREE.Vector3(-this.halfLength, -this.halfLength, this.halfLength));
        let vertex7 = this.vectorAdd(center, new THREE.Vector3(this.halfLength, - this.halfLength, this.halfLength));
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
        this.cubeCenter.position.copy(this.startVector);
    }

    update(){
        this.lifeLine.update();
    }

    moveToTarget(tweenTime, target){
        let deepTripPosition = new TWEEN.Tween(this.cubeCenter.position)
            .to( {
                x: target.x,
                y: target.y,
                z: target.z
            }, tweenTime)
            .easing( TWEEN.Easing.Cubic.InOut ).onUpdate( function () {
            }).onComplete(() => {
                this.goNext = true;
                console.log("go next");
            })
            .start();
    }
}