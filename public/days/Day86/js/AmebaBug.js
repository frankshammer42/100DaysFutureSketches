class AmebaBug {
    constructor(r, center){
        this.radius = r;
        this.center = center;
        this.bugCircle = new Circle(r, center, 1);
        this.bugFeet = [];
        this.createFeet();
    }

    createFeet(){
        let current_circlePositions = this.bugCircle.sourceCircle.geometry.attributes.position.array;
        let numberOfPoints = current_circlePositions.length/3;
        for (let i=0; i<numberOfPoints; i++){
            let currentCirclePoint = new THREE.Vector3(0, 0, 0);
            currentCirclePoint.x = current_circlePositions[i*3];
            currentCirclePoint.y = current_circlePositions[i*3+1];
            currentCirclePoint.z = current_circlePositions[i*3+2];
            let endBugFeet = currentCirclePoint.clone().normalize().multiplyScalar(500).add(currentCirclePoint);
            let bugFoot = new Line(currentCirclePoint, endBugFeet, 100);
            this.bugFeet.push(bugFoot);
        }
    }

    update(){
        for (let i=0; i<this.bugFeet.length; i++){
            this.bugFeet[i].update();
        }
    }
}