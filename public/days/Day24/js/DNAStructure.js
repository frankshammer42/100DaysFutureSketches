class DNAStructure{
    constructor(position, rotation){
        this.dna = new THREE.Group();
        this.dnaLines = [];
        this.createDNA();
        this.dna.position.copy(position);
        this.dna.rotation.x = rotation.x;
        this.dna.rotation.y = rotation.y;
        this.dna.rotation.z = rotation.z;
    }

    createDNA(){
        let startPosition = new THREE.Vector3(0, 2500, 0);
        let lineGap = 25;
        let initRotation  = 0.5 * Math.PI;
        let numberOfLinesPerCycle = 80;
        let rotationUnit = Math.PI * 2 / numberOfLinesPerCycle;
        let numberOfLines = startPosition.y/lineGap * 2;
        let halfLineLength = 150;
        for (let i=0; i<numberOfLines; i++){
            let currentPosition = new THREE.Vector3(0, startPosition.y-i*lineGap, 0);
            let currentYrotation = initRotation + rotationUnit*i;
            let currentHalfLength = halfLineLength + 100*Math.cos(currentYrotation);
            let start = new THREE.Vector3(-currentHalfLength, 0, 0);
            let end = new THREE.Vector3(currentHalfLength, 0, 0);
            let dLine = new Line(start, end, 10, 1000);
            dLine.lineCenter.position.copy(currentPosition);
            dLine.lineCenter.rotation.y = currentYrotation;
            this.dnaLines.push(dLine);
            this.dna.add(dLine.lineCenter);
        }
    }

    update(){
        for (let i=0; i<this.dnaLines.length; i++){
            this.dnaLines[i].update();
        }
    }
}