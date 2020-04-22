class SinCon{
    constructor(left, right, amplitude){
        this.left = left;
        this.right = right;
        this.segmentCount = 100;
        this.sinGeometry = new THREE.BufferGeometry();
        this.sinPositions = new Float32Array(this.segmentCount*3);
        this.sinGeometry.addAttribute("position", new THREE.BufferAttribute(this.sinPositions, 3));
        this.material = new THREE.LineBasicMaterial({ color: 0xFFFFFF });
        this.sinLine = new THREE.Line( this.sinGeometry,  this.material);
        this.sinLine.geometry.dynamic = true;
        for (let i=0; i < this.segmentCount*3; i++){
            this.sinLine.geometry.attributes.position.array[i] = 0;
        }
        this.amplitude = amplitude;
        this.createSinLine();
        this.rotationSpeed = Math.random()*0.01;
    }

    createSinLine(){
        let xDist = this.right.x - this.left.x;
        let xUnit = xDist / (this.segmentCount-1);
        let positionArray = this.sinLine.geometry.attributes.position.array;
        for (let i=0; i<this.segmentCount; i++){
            let currentX = i*xUnit + this.left.x;
            let currentY = this.amplitude * Math.sin(Math.PI * (i/(this.segmentCount-1)));
            positionArray[i*3] = currentX;
            positionArray[i*3+1] = currentY;
            positionArray[i*3+2] = 0;
        }
        this.sinLine.geometry.setDrawRange(0,  this.segmentCount);
        this.sinLine.geometry.attributes.position.needsUpdate = true;
    }

    update(){
        this.sinLine.position.x += Math.random() * 1.2;
        // this.sinLine.position.y += Math.random();
        // this.sinLine.position.z += Math.random();
        this.sinLine.rotation.x += this.rotationSpeed;
        // this.sinLine.rotation.y += this.rotationSpeed;
        // this.sinLine.rotation.z += this.rotationSpeed;
        this.createSinLine();
    }
}