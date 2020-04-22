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
        this.deform = true;
        this.deformCounter = 0;
        this.deformMax = 100;
        // if (this.layer < 4){
        //     this.cutRectangle();
        // }
        this.speedScale = 0.4;
        this.rotateScale = 0.05;
        this.xSpeed = Math.random()*this.speedScale - this.speedScale/2;
        this.ySpeed = Math.random()*this.speedScale - this.speedScale/2;
        this.zSpeed = Math.random()*this.speedScale - this.speedScale/2;
        this.zRotateSpeed = Math.random()*this.rotateScale - this.rotateScale/2;
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
        if (this.deform){
            this.rectangleCenter.position.x += this.xSpeed;
            this.rectangleCenter.position.y += this.ySpeed;
            this.rectangleCenter.position.z += this.zSpeed;
            this.rectangleCenter.rotation.y += this.zRotateSpeed;
            this.counter += 1;
            if (this.counter > this.counterMax){
                this.counter = 0;
                this.xSpeed *= -1;
                this.ySpeed *= -1;
                this.zSpeed *= -1;
                this.zRotateSpeed *= -1;
                if (this.rectangleCenter.position.z<=0.01 && this.rectangleCenter.position.z >= -0.01){
                    this.deform = false;
                    this.xSpeed = Math.random()*this.speedScale-this.speedScale/2;
                    this.ySpeed = Math.random()*this.speedScale-this.speedScale/2;
                    if (this.zSpeed < 0){
                        this.zSpeed = -Math.random()*this.speedScale/2;
                    }
                    else{
                        this.zSpeed = Math.random()*this.speedScale/2;
                    }
                    this.zRotateSpeed = Math.random()*this.rotateScale - this.rotateScale/2;
                }
            }
        }
        else{
            this.deformCounter += 1;
            if (this.deformCounter >= this.deformMax){
                this.deformCounter = 0;
                this.deform = true;
            }
        }
    }
}