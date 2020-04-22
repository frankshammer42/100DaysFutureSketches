class CubesStructure {
    constructor(center, rotation){
        this.separatedDistance = 4000;
        this.targetDistance = 600;
        this.closeSpeed = 0.9;
        this.cubes = [];
        let cube0  = new Cube(this.separatedDistance, 0,0, 500, 100, 100, 2, false);
        let cube1  = new Cube(-this.separatedDistance, 0,0, 500, 100, 100, 2, true);
        let cube2  = new Cube(0, 0, -this.separatedDistance, 100, 100, 500, 0, false);
        let cube3  = new Cube(0, 0, this.separatedDistance, 100, 100, 500, 0,  true);
        this.cubes.push(cube0);
        this.cubes.push(cube1);
        this.cubes.push(cube2);
        this.cubes.push(cube3);
        this.structureCenter = new THREE.Group();
        this.structureCenter.add(cube0.cubeCenter);
        this.structureCenter.add(cube1.cubeCenter);
        this.structureCenter.add(cube2.cubeCenter);
        this.structureCenter.add(cube3.cubeCenter);
        this.structureCenter.rotation.x = rotation.x;
        this.structureCenter.rotation.y = rotation.y;
        this.structureCenter.rotation.z = rotation.z;
        this.structureCenter.position.copy(center);
        this.rotXspeed = 0.0016 * Math.random() - 0.0008;
        this.rotYspeed = 0.0016 * Math.random() - 0.0008;
        this.rotZspeed = 0.0016 * Math.random() - 0.0008;
        this.tweenTime = 60000;
    }

    update(){
        this.structureCenter.rotation.x += this.rotXspeed;
        this.structureCenter.rotation.y += this.rotYspeed;
        this.structureCenter.rotation.z += this.rotZspeed;
        if (this.cubes[0].cubeCenter.position.x > this.targetDistance){
            this.cubes[0].cubeCenter.position.x -= this.closeSpeed;
            this.cubes[1].cubeCenter.position.x += this.closeSpeed;
            this.cubes[2].cubeCenter.position.z += this.closeSpeed;
            this.cubes[3].cubeCenter.position.z -= this.closeSpeed;
        }
    }

    moveOrigin(){
        let target = new  THREE.Vector3(0, 0, 0);
        let deepTripPosition = new TWEEN.Tween( this.structureCenter.position )
            .to( {
                x: target.x,
                y: target.y,
                z: target.z
            }, this.tweenTime)
            .easing( TWEEN.Easing.Cubic.InOut ).onUpdate( function () {
            })
            .start();
    }


}