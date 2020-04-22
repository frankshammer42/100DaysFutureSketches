class DiseaseLife {
    constructor(start_x, start_y, start_z){
        this.startVector = new THREE.Vector3(start_x, start_y, start_z);
        this.friction = 0.99;
        this.vx = 0.0;
        this.vy = 0.0;
        this.vz = 0.0;
        this.x = start_x;
        this.y = start_y;
        this.z = start_z;
        this.pointGeometry = new THREE.BufferGeometry();
        this.position = new Float32Array(3);
        this.pointGeometry.addAttribute("position", new THREE.BufferAttribute(this.position, 3));
        this.pointMaterial = new THREE.PointsMaterial( {
            size: 3,  // This might be the size you are thinking of?
            sizeAttenuation: false,
        });
        this.diseasePoint = new THREE.Points(this.pointGeometry, this.pointMaterial);
        this.diseasePoint.geometry.dynamic = true;
        //Initialize Container
        this.containerGeometry = null;
        this.containerMaterial = null;
        this.container = null;
        this.radius = 80;
        this.halfLength = 100;
        this.createContainer();
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
        let vertex0 = this.vectorAdd(center, new THREE.Vector3(-this.halfLength, this.halfLength, -this.halfLength));
        let vertex1 = this.vectorAdd(center, new THREE.Vector3(this.halfLength, this.halfLength, -this.halfLength));
        let vertex2 = this.vectorAdd(center, new THREE.Vector3(-this.halfLength, -this.halfLength, -this.halfLength));
        let vertex3 = this.vectorAdd(center, new THREE.Vector3(this.halfLength, -this.halfLength, -this.halfLength));
        let vertex4 = this.vectorAdd(center, new THREE.Vector3(-this.halfLength, this.halfLength, this.halfLength));
        let vertex5 = this.vectorAdd(center,  new THREE.Vector3(this.halfLength, this.halfLength, this.halfLength));
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


    // this.containerGeometry.vertices.push(vertex7);
        // this.containerGeometry.vertices.push(vertex5);
        // this.containerGeometry.vertices.push(vertex1);
        // this.containerGeometry.vertices.push(vertex5);
        // this.containerGeometry.vertices.push(vertex6);
        // this.containerGeometry.vertices.push(vertex7);
        // this.containerGeometry.vertices.push(vertex7);
        // this.containerGeometry.vertices.push(vertex6);
        // this.containerGeometry.vertices.push(vertex2);
        // this.containerGeometry.vertices.push(vertex0);
        // this.containerGeometry.vertices.push(vertex4);
        // for (let i = 0; i <= segmentCount; i++) {
        //     let theta = (i / segmentCount) * Math.PI * 2;
        //     this.containerGeometry.vertices.push(
        //         new THREE.Vector3(
        //             Math.cos(theta) * this.radius + this.x,
        //             Math.sin(theta) * this.radius + this.y,
        //             0));
        // }
        this.container = new THREE.Line(this.containerGeometry, this.containerMaterial);
    }

    insideCircle(){
        let startX = this.startVector.x;
        let startY = this.startVector.y;
        let xDist = Math.pow(startX-this.x, 2);
        let yDist = Math.pow(startY-this.y, 2);
        let radiusPow = this.radius*this.radius;
        if (xDist + yDist < radiusPow){
            return true;
        }
        else{
            return false;
        }
    }

    update(){
        this.x += this.vx;
        this.y += this.vy;
        this.z += this.vz;
        // if (this.insideCircle()){
        this.vx += Math.random() * 6 - 3;
        this.vy += Math.random() * 6 - 3;
        this.vz += Math.random() * 6 - 3;
        // }
        // else{
        //     this.vx += (this.startVector.x - this.x)*0.015;
        //     this.vy += (this.startVector.y - this.y)*0.015;
        // }
        this.vx *= this.friction;
        this.vy *= this.friction;
        this.vz *= this.friction;
        this.diseasePoint.position.copy(new THREE.Vector3(this.x, this.y, this.z));
        this.container.position.copy(new THREE.Vector3(this.x, this.y, this.z));
        // this.createContainer();
        // let currentParticlePosition = this.diseasePoint.geometry.attributes.position.array;
        // currentParticlePosition[0] = this.x;
        // currentParticlePosition[1] = this.y;
        // currentParticlePosition[2] = this.z;
        // this.pointGeometry.setDrawRange(0, 1);
        // this.diseasePoint.geometry.attributes.position.needsUpdate = true;
        // this.container.center = [this.x, this.y];
        // this.container.update();
    }
}