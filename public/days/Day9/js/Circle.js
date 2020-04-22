class Circle{
    constructor(center, radius){
        this.ultimatePI  =  Math.PI;
        this.segmentCount = 160;
        this.center = center;
        this.radius = radius;
        this.targetRadius = radius;
        //TODO: Create Rotation
        this.geometry = new THREE.BufferGeometry();
        this.positions = new Float32Array((this.segmentCount+1)*3);
        this.geometry.addAttribute("position", new THREE.BufferAttribute(this.positions, 3));
        this.material = new THREE.LineBasicMaterial({ color: 0xFFFFFF });
        this.meCircle = new THREE.Line( this.geometry,  this.material);
        this.meCircle.geometry.dynamic = true;
        for (let i=0; i < this.segmentCount*3; i++){
            this.meCircle.geometry.attributes.position.array[i] = 0;
        }
        this.fullCircleDrawProgress = this.segmentCount + 1;
        this.createCircle();
        this.meCircle.geometry.setDrawRange(0, this.fullCircleDrawProgress);
        this.meCircle.geometry.attributes.position.needsUpdate = true;
        this.regrow = false;
        this.growSpeed = Math.random()*10;
        this.wu = false;
        this.targetBranchPosition = null;
    }

    createCircle(){
        let current_positions = this.meCircle.geometry.attributes.position.array;
        for (let i=0; i<=this.segmentCount; i++){
            let theta = (i / this.segmentCount) * this.ultimatePI * 2;
            let x = Math.cos(theta) * this.radius + this.center[0];
            let y = 0;
            let z = Math.sin(theta) * this.radius + this.center[2];
            current_positions[i*3] = x;
            current_positions[i*3+1] = y;
            current_positions[i*3+2] = z;
        }
        this.meCircle.geometry.attributes.position.needsUpdate = true;
    }

    growth(){
        this.radius += this.growSpeed;
        if (this.radius >= this.targetRadius){
            this.radius = this.targetRadius;
            this.regrow = false;
            this.wu = false;
        }
        this.createCircle();
    }

    disappear(){
        this.radius -= this.growSpeed;
        if (this.radius > 0){
            this.createCircle();
        }
        else{
            this.regrow = true;
        }
    }

    update(){
        if (this.wu){
            if (this.regrow){
                this.growth();
            }
            else{
                this.disappear();
            }
        }
    }

    moveToBranch(tweenTime){
        let deepTripPosition = new TWEEN.Tween( this.meCircle.position )
            .to( {
                x: this.targetBranchPosition.x,
                y: this.targetBranchPosition.y,
                z: this.targetBranchPosition.z
            }, tweenTime)
            .easing( TWEEN.Easing.Cubic.InOut ).onUpdate( function () {
                // console.log("whatever man");
            })
            .start();
    }
}
