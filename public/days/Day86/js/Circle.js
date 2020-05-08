class Circle{
    constructor(r, center, step){
        this.radius = r;
        this.center = center;
        this.circleSegment = 1000;
        this.sourceCircle = null;
        this.createCircle(r, center);
        this.step = step;
        this.xrot = Math.random()*0.001 - 0.0005;
        this.yrot = Math.random()*0.001 - 0.0005;
        this.zrot = Math.random()*0.001 - 0.0005;
        this.maxRadius = this.radius + 4000;
    }

    createCircle(r, center){
        let circleSegment = 64;
        let geometry = new THREE.BufferGeometry();
        let positions = new Float32Array((this.circleSegment+1)*3);
        geometry.addAttribute("position", new THREE.BufferAttribute(positions, 3));
        let material = new THREE.LineBasicMaterial({ color: 0xFFFFFF });
        this.sourceCircle = new THREE.Line( geometry,  material);
        this.sourceCircle.geometry.dynamic = true;
        for (let i=0; i < circleSegment*3; i++){
            this.sourceCircle.geometry.attributes.position.array[i] = 0;
        }
        this.updateCircle();
    }

    updateCircle(){
        let current_positions = this.sourceCircle.geometry.attributes.position.array;
        for (let i=0; i<=this.circleSegment; i++){
            let theta = (i / this.circleSegment) * Math.PI * 2;
            let x = this.center.x;
            let y = Math.sin(theta) * this.radius + this.center.y;
            let z = Math.cos(theta) * this.radius + this.center.z;
            current_positions[i*3] = x;
            current_positions[i*3+1] = y;
            current_positions[i*3+2] = z;
        }
        this.sourceCircle.geometry.setDrawRange(0, this.circleSegment+1);
        this.sourceCircle.geometry.attributes.position.needsUpdate = true;
    }

    update(){
    }
}