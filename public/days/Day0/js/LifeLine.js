class LifeLine {
    constructor(start, end, growing){
        this.maxCount = 2000;
        this.growing = growing;
        this.growing_speed = 20;
        if (!growing){
            this.geometry = new THREE.BufferGeometry();
            this.positions = new Float32Array(6);
            this.geometry.addAttribute("position", new THREE.BufferAttribute(this.positions, 3));
            this.material = new THREE.LineBasicMaterial( { color: 0xffffff, linewidth: 1});
            this.line = new THREE.Line( this.geometry,  this.material);
        }
        else{
            this.geometry = new THREE.BufferGeometry();
            this.positions = new Float32Array(10000);
            this.geometry.addAttribute("position", new THREE.BufferAttribute(this.positions, 3));
            this.material = new THREE.LineBasicMaterial( { color: 0xffffff, linewidth: 1});
            this.line = new THREE.Line( this.geometry,  this.material);
            this.line.geometry.dynamic = true;
            for (let i=0; i < 10000; i++){
                this.line.geometry.attributes.position.array[i] = 0;
            }
        }
        this.current_vertex_count = 2;
        this.initPosition(start, end);
        this.wormholes = [];
        this.wormhole_pivots = [];
        this.wormhole_centers = [];
        this.universe = new THREE.Group();
        // this.universe.add(this.line);
        this.startY = start[1];
        this.endY = end[1];
        this.createWormholes();
    }

    initPosition(start, end){
        let current_positions = this.line.geometry.attributes.position.array;
        let index = 0;
        current_positions[0] = start[0];
        current_positions[1] = start[1];
        current_positions[2] = start[2];
        current_positions[3] = end[0];
        current_positions[4] = end[1];
        current_positions[5] = end[2];
        console.log("LifeLine Initialized");
        this.geometry.setDrawRange(0, 2);
    }


    createWormholes(){
        for (let i=0; i<20; i++){
            let theta = Math.random() * Math.PI * 2;
            let radius = 30;
            // let x = Math.cos(theta) * radius;
            // let z = Math.sin(theta) * radius;
            let dist = this.endY - this.startY;
            let offset = Math.random() * dist + this.startY;
            let wormholeContainer = new Wormhole([0,0,0],radius,0);
            let pivot = new THREE.Group();
            let dir = -1;
            let dirDeter = Math.random();
            if (dirDeter > 0.5){
                dir = 1;
            }
            pivot.position.copy(new THREE.Vector3(dir*radius, offset, 0));
            pivot.add(wormholeContainer.wormhole);
            let center = new THREE.Group();
            center.add(pivot);
            this.wormholes.push(wormholeContainer);
            this.wormhole_pivots.push(pivot);
            this.wormhole_centers.push(center);
            this.universe.add(center);
        }
    }



    destroy(scene){
        scene.remove(this.line);
    }

    update(){
        if (this.growing){
            this.current_vertex_count += 1;
            if (this.current_vertex_count < this.maxCount){
                let current_positions = this.line.geometry.attributes.position.array;
                current_positions[this.current_vertex_count*3] = 0;
                current_positions[this.current_vertex_count*3 + 1] = current_positions[(this.current_vertex_count-1)*3+1] - this.growing_speed;
                current_positions[this.current_vertex_count*3 + 2] = 0;
                this.geometry.setDrawRange(0, this.current_vertex_count);
                this.line.geometry.attributes.position.needsUpdate = true;
            }
        }
        for (let i=0; i<this.wormholes.length; i++){
            this.wormholes[i].wormhole.rotation.x += Math.random()*this.wormholes[i].rotationX;
            this.wormhole_centers[i].rotation.y += Math.random()*this.wormholes[i].rotationY;
            this.wormholes[i].update();
        }
    }
}
