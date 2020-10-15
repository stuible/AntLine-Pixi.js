export default class {
    constructor({ }) {
        this.gameOver = false
        this.gameStarted = false
        this.paused = false
        this._score = 0

        this.game = undefined;

        this._time = 0

        this.speedBonusStartTime = undefined

        this.speedPenalty = false;
    }

    reset() {
        this.gameOver = false
        this.gameStarted = false
        this.paused = false
        this._score = 0

        this._time = 0

        this.speedBonusStartTime = undefined

        this.speedPenalty = false;
    }

    updateTime(delta) {
        this._time += delta;
    }

    addPoints(points) {
        this._score += points
    }

    resetSpeedBonus() {
        this.speedBonusStartTime = this._time;
    }

    get score() {
        return Math.round(this._score)
    }

    get timeSinceSpeedBonusStarted() {
        // console.log(this._time);
        return this.speedBonusStartTime ? this._time - this.speedBonusStartTime : undefined;
    }

    // If it's been less than 3 seconds, enable playerSpeed bonus, if not, disable
    get speedBonus() {
        return this.timeSinceSpeedBonusStarted < 3000;
    }
}