class BadCircularThoughts {
    constructor(start_x, start_y){
        this.startVector = new THREE.Vector3(start_x, start_y, 0);
        this.friction = 0.99;
        this.vx = 0.0;
        this.vy = 0.0;
        this.x = start_x;
        this.y = start_y;
        this.pointGeometry = new THREE.BufferGeometry();
        this.position = new Float32Array(3);
        this.pointGeometry.addAttribute("position", new THREE.BufferAttribute(this.position, 3));
        this.pointMaterial = new THREE.PointsMaterial( {
            size: 2,  // This might be the size you are thinking of?
            sizeAttenuation: false,
        });
        this.lifePoint = new THREE.Points(this.pointGeometry, this.pointMaterial);
        this.lifePoint.geometry.dynamic = true;
        //Initialize Container
        this.containerGeometry = null;
        this.containerMaterial = null;
        this.container = null;
        this.radius = 80;
        this.segmentCount = 100;
        this.currentDrawRangeMin = 0;
        this.currentDrawRangeMax = this.segmentCount;
        this.createContainer();
    }

    createContainer(){
        let center = new THREE.Vector3(this.x, this.y, 0);
        this.container = new Circle(this.radius, center, 1);
    }

    insideCircle(){
        let startX = this.startVector.x;
        let startY = this.startVector.y;
        let xDist = Math.pow(startX-this.x, 2);
        let yDist = Math.pow(startY-this.y, 2);
        let radiusPow = this.radius*this.radius;
        return xDist + yDist < radiusPow;
    }

    update(){
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
        this.container.update();
        // this.container.center = [this.x, this.y];
        // this.container.update();
    }
}
