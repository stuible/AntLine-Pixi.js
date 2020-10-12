export default class {
    constructor(sprite) {
        this.sprite = sprite

    }

    closestEquivalentAngle(from, to) {
        var delta = ((((to - from) % 360) + 540) % 360) - 180;
        return from + delta;
    }

    getAngleFromDirections(directions) {

        let targetAngle = 0;

        if (directions.includes("up")) {
            targetAngle = 270;
        }
        if (directions.includes("down")) {
            targetAngle = 90;
        }
        if (directions.includes("left")) {
            targetAngle = 180;
        }
        if (directions.includes("right")) {
            targetAngle = 0;
        }

        if (directions.includes("up") && directions.includes("right")) {
            targetAngle = 315;
        }
        if (directions.includes("down") && directions.includes("right")) {
            targetAngle = 45;
        }
        if (directions.includes("up") && directions.includes("left")) {
            targetAngle = 225;
        }
        if (directions.includes("down") && directions.includes("left")) {
            targetAngle = 135;
        }

        return this.closestEquivalentAngle(this.sprite.angle, targetAngle);

    }

    getAngleFromRiseRun(rise, run){
        return Math.atan2(rise, run) * 180 / Math.PI
    }
}