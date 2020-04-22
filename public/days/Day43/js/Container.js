class Container{
    constructor(center, radius){
        this.segmentCount = 32;
        this.center = center;
        this.radius = radius;
        //TODO: Create Rotation
        this.geometry = new THREE.BufferGeometry();
        this.positions = new Float32Array(99);
        this.geometry.addAttribute("position", new THREE.BufferAttribute(this.positions, 3));
        this.material = new THREE.LineBasicMaterial({ color: 0xFFFFFF });
        this.container = new THREE.Line( this.geometry,  this.material);
        this.container.geometry.dynamic = true;
        for (let i=0; i < this.segmentCount*3; i++){
            this.container.geometry.attributes.position.array[i] = 0;
        }
        this.createCircle();
        this.currentDrawProgress = 33;
        this.container.geometry.setDrawRange(0, this.currentDrawProgress);
        this.container.geometry.attributes.position.needsUpdate = true;

    }

    createCircle(){
        //TODO: Let it move around
        let current_positions = this.container.geometry.attributes.position.array;
        for (let i=0; i<=this.segmentCount; i++){
            let theta = (i / this.segmentCount) * Math.PI * 2;
            let x = Math.cos(theta) * this.radius + this.center[0];
            let y = Math.sin(theta) * this.radius + this.center[1];
            let z = 0;
            current_positions[i*3] = x;
            current_positions[i*3+1] = y;
            current_positions[i*3+2] = z;
        }
    }

    update(){
        this.createCircle();
        this.container.geometry.attributes.position.needsUpdate = true;
    }


}
