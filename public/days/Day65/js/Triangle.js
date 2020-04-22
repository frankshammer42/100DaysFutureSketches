class Triangle{
    constructor(point0, point1, point2){
        //Assume point2 is the thing we are gonna grow
        this.point0 = point0;
        this.point1 = point1;
        this.point2 = point2;
        this.lines = [];
        this.lineMaterial = new THREE.LineBasicMaterial({ color: 0xFFFFFF });
        this.triangleCenter = new THREE.Group();
        this.createTriangle();
        this.maxSpeed = 0.05;
        this.rotateSpeed = Math.random()*this.maxSpeed - this.maxSpeed/2;
    }

    createLine(point0, point1){
        let lineGeometry = new THREE.Geometry();
        lineGeometry.vertices.push(point0);
        lineGeometry.vertices.push(point1);
        lineGeometry.verticesNeedUpdate = true;
        let line = new THREE.Line(lineGeometry, this.lineMaterial);
        this.triangleCenter.add(line);
        this.lines.push(line);
    }

    createTriangle(){
        this.createLine(this.point0, this.point1);
        this.createLine(this.point0, this.point2);
        this.createLine(this.point1, this.point2);
    }

    update(){
        this.triangleCenter.rotation.x += this.rotateSpeed;
        this.triangleCenter.rotation.y += this.rotateSpeed;
        this.triangleCenter.rotation.z += this.rotateSpeed;
    }
}