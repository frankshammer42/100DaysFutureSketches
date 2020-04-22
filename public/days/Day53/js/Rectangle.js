class Rectangle{
    constructor(point0, point1, point2, point3, layer){
        this.point0 = point0;
        this.point1 = point1;
        this.point2 = point2;
        this.point3 = point3;
        this.width = Math.abs(this.point0.x - this.point1.x);
        this.height = Math.abs(this.point0.y - this.point3.y);
        this.horizontalProb = Math.random();
        this.lines = [];
        this.lineMaterial = new THREE.LineBasicMaterial({ color: 0xFFFFFF });
        this.cutRectangle0 = null;
        this.cutRectangle1 = null;
        this.rectangleCenter = new THREE.Group();
        this.layer = layer;
        this.createRectangle();
        if (this.width > 0.5 && this.height > 0.5){
            this.cutRectangle();
        }
        // if (this.layer < 4){
        //     this.cutRectangle();
        // }
        this.speed = Math.random()*2 - 1;
        // this.speed = 0;
        this.counter = 0;
        this.counterMax = 200;
    }

    createRectangleLine(point0, point1){
        let lineGeometry = new THREE.Geometry();
        lineGeometry.vertices.push(point0);
        lineGeometry.vertices.push(point1);
        lineGeometry.verticesNeedUpdate = true;
        let line = new THREE.Line(lineGeometry, this.lineMaterial);
        this.rectangleCenter.add(line);
        this.lines.push(line);
    }

    createRectangle(){
        this.createRectangleLine(this.point0, this.point1);
        this.createRectangleLine(this.point1, this.point2);
        this.createRectangleLine(this.point2, this.point3);
        this.createRectangleLine(this.point3, this.point0);
    }

    cutRectangle(){
        let indicator = Math.random();
        if (indicator < this.horizontalProb){
            //Cut horizontally
            let distVect = new THREE.Vector3().subVectors(this.point0, this.point3).normalize();
            let portion = 0.5*this.height;
            distVect = distVect.multiplyScalar(portion);
            let cutPointLeft = new THREE.Vector3().subVectors(this.point0, distVect);
            let cutPointRight = new THREE.Vector3(cutPointLeft.x + this.width, cutPointLeft.y, 0);
            this.cutRectangle0 = new Rectangle(this.point0, this.point1, cutPointRight, cutPointLeft, this.layer+1);
            this.cutRectangle1 = new Rectangle(cutPointLeft, cutPointRight, this.point2, this.point3, this.layer+1);
        }
        else{
            //Cut Vertically
            let distVect = new THREE.Vector3().subVectors(this.point1, this.point0).normalize();
            let portion = 0.5*this.width;
            distVect = distVect.multiplyScalar(portion);
            let cutPointTop = new THREE.Vector3().addVectors(this.point0, distVect);
            let cutPointBottom = new THREE.Vector3(cutPointTop.x, cutPointTop.y - this.height, 0);
            this.cutRectangle0 = new Rectangle(this.point0, cutPointTop, cutPointBottom, this.point3, this.layer+1);
            this.cutRectangle1 = new Rectangle(cutPointTop, this.point1, this.point2, cutPointBottom, this.layer+1);
        }
    }

    update(){
        this.rectangleCenter.position.z += this.speed;
        this.counter += 1;
        if (this.counter > this.counterMax){
            console.log("return");
            this.counter = 0;
            this.speed *= -1;
            if (this.rectangleCenter.position.z === 0){
                if (this.speed < 0){
                    this.speed = -Math.random();
                }
                else{
                    this.speed = Math.random();
                }
            }
        }
    }
}