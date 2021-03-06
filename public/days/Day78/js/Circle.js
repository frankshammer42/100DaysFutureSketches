class Circle{
    constructor(r, center, step){
        this.radius = r;
        this.center = center;
        this.circleSegment = 64;
        this.sourceCircle = null;
        this.drawProgressMin = Math.floor(Math.random()*(this.circleSegment));
        this.drawProgressMax = this.drawProgressMin + Math.floor((this.circleSegment+1 - this.drawProgressMin) * Math.random());
        this.createCircle(r, center);
        this.step = step;
        this.xrot = Math.random()*0.001 - 0.0005;
        this.yrot = Math.random()*0.001 - 0.0005;
        this.zrot = Math.random()*0.001 - 0.0005;
        this.maxRadius = this.radius + 4000;
        this.maxChange = 100;
        this.currentChangePrgress = 0;
        this.changeCounter = 0;
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
            let x = Math.cos(theta) * this.radius + this.center.x;
            let y = Math.sin(theta) * this.radius + this.center.y;
            let z = this.center.z;
            current_positions[i*3] = x;
            current_positions[i*3+1] = y;
            current_positions[i*3+2] = z;
        }
        // this.sourceCircle.geometry.setDrawRange(0, this.circleSegment+1);
        this.sourceCircle.geometry.setDrawRange(this.drawProgressMin, this.drawProgressMax);
        this.sourceCircle.geometry.attributes.position.needsUpdate = true;
    }

    update(){
        this.drawProgressMin -= 1;
        this.drawProgressMax += 1;
        if (this.drawProgressMin < 0){
            this.drawProgressMin = Math.floor(Math.random()*(this.circleSegment));
        }
        if (this.drawProgressMax > this.circleSegment + 1){
            this.drawProgressMax = this.drawProgressMin + Math.floor((this.circleSegment+1 - this.drawProgressMin) * Math.random());
        }
        this.sourceCircle.geometry.setDrawRange(this.drawProgressMin, this.drawProgressMax);
        this.sourceCircle.geometry.attributes.position.needsUpdate = true;
        // this.radius += Math.random()*2 - 1;
        // this.updateCircle();
        // this.sourceCircle.rotation.x += this.xrot;
        // this.sourceCircle.rotation.y += this.yrot;
        // this.sourceCircle.rotation.z += this.zrot;
        // this.currentChangePrgress += 1;
        // if (this.currentChangePrgress >= this.maxChange){
        //     this.xrot *= -1;
        //     this.yrot *= -1;
        //     this.zrot *= -1;
        //     this.currentChangePrgress = 0;
        //     this.changeCounter += 1;
        //     if (this.changeCounter % 2 === 0){
        //         this.xrot = Math.random()*0.001 - 0.0005;
        //         this.yrot = Math.random()*0.001 - 0.0005;
        //         this.zrot = Math.random()*0.001 - 0.0005;
        //     }
        // }
    }
}
