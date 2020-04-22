class Wormhole{
    constructor(center, radius, rotation){
        this.segmentCount = 480;
        this.center = center;
        this.radius = radius;
        //TODO: Create Rotation
        this.geometry = new THREE.BufferGeometry();
        this.positions = new Float32Array((this.segmentCount+1)*3);
        this.geometry.addAttribute("position", new THREE.BufferAttribute(this.positions, 3));
        this.material = new THREE.LineBasicMaterial({ color: 0xFFFFFF });
        this.wormhole = new THREE.Line( this.geometry,  this.material);
        this.wormhole.geometry.dynamic = true;
        for (let i=0; i < this.segmentCount*3; i++){
            this.wormhole.geometry.attributes.position.array[i] = 0;
        }
        this.createCircle();
        // this.speed = Math.floor(Math.random()*5);
        this.speed = 2;
        this.currentDrawProgress = 0;
        this.wormhole.geometry.setDrawRange(0, this.currentDrawProgress);
        this.wormhole.geometry.attributes.position.needsUpdate = true;
        this.rotationX = 0.1;
        this.rotationY = 0.2;

    }

    createCircle(){
        //TODO: Let it move around
        let current_positions = this.wormhole.geometry.attributes.position.array;
        for (let i=0; i<=this.segmentCount; i++){
            let theta = (i / this.segmentCount) * Math.PI * 2;
            let x = Math.cos(theta) * this.radius + this.center[0];
            let y = this.center[1];
            let z = Math.sin(theta) * this.radius;
            current_positions[i*3] = x;
            current_positions[i*3+1] = y;
            current_positions[i*3+2] = z;
        }
    }

    update(){
        this.wormhole.geometry.setDrawRange(0, this.currentDrawProgress);
        this.wormhole.geometry.attributes.position.needsUpdate = true;
        this.currentDrawProgress += this.speed;
        if (this.currentDrawProgress >= this.segmentCount){
            this.currentDrawProgress = this.segmentCount;
            this.rotationX = 0.03;
            this.rotationY = 0.04;
            // this.currentDrawProgress = 0;
        }
    }


}
