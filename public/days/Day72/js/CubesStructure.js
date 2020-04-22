class CubesStructure {
    constructor(center, rotation){
        this.separatedDistance = 1200;
        this.targetDistance = 600;
        this.closeSpeed = 8;
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
    }

    update(){
        // if (this.cubes[0].cubeCenter.position.x > this.targetDistance){
        this.cubes[0].cubeCenter.position.x -= this.closeSpeed;
        this.cubes[1].cubeCenter.position.x += this.closeSpeed;
        this.cubes[2].cubeCenter.position.z += this.closeSpeed;
        this.cubes[3].cubeCenter.position.z -= this.closeSpeed;

        // this.cubes[0].cubeCenter.position.y += this.closeSpeed;
        // this.cubes[1].cubeCenter.position.y += this.closeSpeed;
        // this.cubes[2].cubeCenter.position.y += this.closeSpeed;
        // this.cubes[3].cubeCenter.position.y += this.closeSpeed;

        // this.cubes[0].cubeCenter.rotation.y += this.closeSpeed*Math.random()*0.01;
        // this.cubes[1].cubeCenter.rotation.y += this.closeSpeed*Math.random()*0.01;
        // this.cubes[2].cubeCenter.rotation.y += this.closeSpeed*Math.random()*0.01;
        // this.cubes[3].cubeCenter.rotation.y += this.closeSpeed*Math.random()*0.01;
        // }
    }
}