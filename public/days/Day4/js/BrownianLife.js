class BrownianLife {
    constructor(start_x, start_y){
        this.startVector = new THREE.Vector3(start_x, start_y, 0);
        this.friction = 0.99;
        this.vx = 0.0;
        this.vy = 0.0;
        this.x = start_x;
        this.y = start_y;
        //Point Geometry
        this.pointGeometry = new THREE.BufferGeometry();
        this.position = new Float32Array(3);
        this.pointGeometry.addAttribute("position", new THREE.BufferAttribute(this.position, 3));
        this.pointMaterial = new THREE.PointsMaterial( {
            size: 2,  // This might be the size you are thinking of?
            sizeAttenuation: false,
        });
        this.lifePoint = new THREE.Points(this.pointGeometry, this.pointMaterial);
        this.lifePoint.geometry.dynamic = true;
        //Line Geometry
        this.lineGeometry = new THREE.BufferGeometry();
        this.linePositions = new Float32Array(6);
        this.lineGeometry.addAttribute("position", new THREE.BufferAttribute(this.linePositions, 3));
        this.material = new THREE.LineBasicMaterial( { color: 0xffffff, linewidth: 1});
        this.lineProcess = new THREE.Line( this.lineGeometry,  this.material);
        this.lineProcess.geometry.dynamic = true;
        // for (let i=0; i < 6000; i++){
        //     this.lineProcess.geometry.attributes.position.array[i] = 0;
        // }
        this.currentStepNumber = 0;
        this.maxStepNumber = 1000;
        this.stepLength = 10;
        //Initialize Container
        this.containerGeometry = null;
        this.containerMaterial = null;
        this.container = null;
        this.radius = 80;
        this.createContainer();
        this.on = true;
    }

    createContainer(){
        // this.container = new Container([this.x, this.y], 25);
        let segmentCount = 32;
        this.containerGeometry = new THREE.Geometry();
        this.containerMaterial = new THREE.LineBasicMaterial({ color: 0xFFFFFF });
        for (let i = 0; i <= segmentCount; i++) {
            let theta = (i / segmentCount) * Math.PI * 2;
            this.containerGeometry.vertices.push(
                new THREE.Vector3(
                    Math.cos(theta) * this.radius + this.x,
                    Math.sin(theta) * this.radius + this.y,
                    0));
        }
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
        let prevX = this.x;
        let prevY = this.y;
        this.x += this.vx;
        this.y += this.vy;
        if (this.insideCircle()){
            this.vx += Math.random() * 0.2 - 0.1;
            this.vy += Math.random() * 0.2 - 0.1;
        }
        else{
            this.vx += (this.startVector.x - this.x)*0.015;
            this.vy += (this.startVector.y - this.y)*0.015;
        }
        this.vx *= this.friction;
        this.vy *= this.friction;
        let currentParticlePosition = this.lifePoint.geometry.attributes.position.array;
        currentParticlePosition[0] = this.x;
        currentParticlePosition[1] = this.y;
        this.pointGeometry.setDrawRange(0, 1);
        this.lifePoint.geometry.attributes.position.needsUpdate = true;
        // this.currentStepNumber += 1;
        // if (this.currentStepNumber + 1< this.maxStepNumber){
        //     let current_positions = this.lineProcess.geometry.attributes.position.array;
        //     current_positions[this.currentStepNumber*3]  =  prevX;
        //     current_positions[this.currentStepNumber*3 + 1]  =  prevY;
        //     current_positions[this.currentStepNumber*3 + 2]  =  this.currentStepNumber * this.stepLength;
        //     current_positions[this.currentStepNumber*3 + 3]  =  this.x;
        //     current_positions[this.currentStepNumber*3 + 4]  =  this.y;
        //     current_positions[this.currentStepNumber*3 + 5]  =  this.currentStepNumber * this.stepLength;
        //     this.lineGeometry.setDrawRange(0, this.currentStepNumber);
        //     this.lineProcess.geometry.attributes.position.needsUpdate = true;
        // }
        let current_positions = this.lineProcess.geometry.attributes.position.array;
        current_positions[0] = this.x;
        current_positions[1] = this.y;
        current_positions[2] = 0;
        current_positions[3] = this.x;
        current_positions[4] = this.y;
        current_positions[5] = -10000;
        if (this.on){
            this.lineGeometry.setDrawRange(0, 2);
        }
        else{
            this.lineGeometry.setDrawRange(0, 0);
        }
        this.lineProcess.geometry.attributes.position.needsUpdate = true;


        // this.container.center = [this.x, this.y];
        // this.container.update();
    }
}
