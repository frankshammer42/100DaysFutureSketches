class Circle{
    constructor(center, radius, segmentCount, rotation){
        this.rotation = rotation;
        this.ultimatePI  =  Math.PI;
        this.segmentCount = segmentCount;
        this.center = center;
        this.radius = radius;
        //TODO: Create Rotation
        this.geometry = new THREE.BufferGeometry();
        this.positions = new Float32Array((this.segmentCount+1)*3);
        this.geometry.addAttribute("position", new THREE.BufferAttribute(this.positions, 3));
        this.material = new THREE.LineBasicMaterial({ color: 0xFFFFFF });
        this.piStudyCircle = new THREE.Line( this.geometry,  this.material);
        this.piStudyCircle.geometry.dynamic = true;
        for (let i=0; i < this.segmentCount*3; i++){
            this.piStudyCircle.geometry.attributes.position.array[i] = 0;
        }
        this.fullCircleDrawProgress = this.segmentCount + 1;
        this.createCircle();
        this.piStudyCircle.geometry.setDrawRange(0, this.fullCircleDrawProgress);
        this.piStudyCircle.geometry.attributes.position.needsUpdate = true;
    }

    createCircle(){
        let current_positions = this.piStudyCircle.geometry.attributes.position.array;
        for (let i=0; i<=this.segmentCount; i++){
            let theta = (i / this.segmentCount) * this.ultimatePI * 2;
            let x = Math.cos(theta) * this.radius;
            let y = 0;
            let z = Math.sin(theta) * this.radius;
            current_positions[i*3] = x;
            current_positions[i*3+1] = y;
            current_positions[i*3+2] = z;
        }
        this.piStudyCircle.rotation.x = this.rotation;
    }

    update(){
        this.piStudyCircle.rotation.x += 0.008;
    }
}
