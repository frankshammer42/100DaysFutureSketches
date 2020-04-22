function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

class MingLine {
    constructor(position, horizontal){
        this.beginPosition = position;
        this.horizontal = horizontal;
        this.geometry = new THREE.BufferGeometry();
        this.positions = new Float32Array(6);
        this.geometry.addAttribute("position", new THREE.BufferAttribute(this.positions, 3));
        this.material = new THREE.LineBasicMaterial( { color: 0xffffff, linewidth: 1});
        this.line = new THREE.Line( this.geometry,  this.material);
        this.targetLinePosition = this.generateTargetLinePosition();
        this.lineGroup = new THREE.Group();
        this.lineGroup.add(this.line);
        this.initPosition();
    }

    generateTargetLinePosition(){
        let offset = Math.random()*120000;
        offset = offset - 60000;
        let verticalOffset = Math.random()*180000;
        verticalOffset = verticalOffset - 90000;
        if (this.horizontal){
            return new THREE.Vector3(this.beginPosition.x, offset, 0);
        }
        else{
            return new THREE.Vector3(verticalOffset, this.beginPosition.y, 0);
        }
    }


    initBeginEnd(start, end){
        let current_positions = this.line.geometry.attributes.position.array;
        current_positions[0] = start[0];
        current_positions[1] = start[1];
        current_positions[2] = start[2];
        current_positions[3] = end[0];
        current_positions[4] = end[1];
        current_positions[5] = end[2];
    }

    initPosition(){
        let current_positions = this.line.geometry.attributes.position.array;
        if (!this.horizontal){
            let start = [0,100,0];
            let end = [0,-100,0];
            this.initBeginEnd(start, end);
        }
        else{
            let start = [100,0,0];
            let end = [-100,0,0];
            this.initBeginEnd(start, end);
        }
        this.geometry.setDrawRange(0, 2);
        this.lineGroup.position.copy(this.beginPosition);
    }

    moveLineBack(tweenTime){
        let deepTripPosition = new TWEEN.Tween( this.lineGroup.position )
            .to( {
                x: this.beginPosition.x,
                y: this.beginPosition.y,
                z: this.beginPosition.z
            }, tweenTime)
            .easing( TWEEN.Easing.Cubic.InOut ).onUpdate( function () {
                console.log();
            })
            .start().onComplete(
                () => {
                    this.moveLineTarget(4000);
                }
            );
    }


    moveLineTarget(tweenTime){
        console.log("start move");
        let deepTripPosition = new TWEEN.Tween( this.lineGroup.position )
            .to( {
                x: this.targetLinePosition.x,
                y: this.targetLinePosition.y,
                z: this.targetLinePosition.z
            }, tweenTime)
            .easing( TWEEN.Easing.Cubic.InOut ).onUpdate( function () {
                console.log();
            })
            .start().onComplete(
                () => {
                    this.targetLinePosition = this.generateTargetLinePosition();
                    this.moveLineBack(2000);
                }
            );
    }

    destroy(scene){
        scene.remove(this.line);
    }

    update(){
    }
}