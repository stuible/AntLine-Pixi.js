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

    get difficultyString() {
        switch (this.difficulty) {
            case 0:
                return 'Easy';
            case 1:
                return 'Less Easy';
            case 2:
                return 'Getting Harder';
            case 3:
                return 'Hardest';

            default:
                return 3
                break;
        }
    }

    get difficulty() {
        if (this._time > 120000) { // After 2 minutes
            console.log('hardest');
            return 3
        }
        else if (this._time > 60000) { // After 1 minute
            console.log('medium');
            return 2
        }
        else if (this._time > 5000) { // After 5 seconds
            console.log('easy');
            return 1
        }
        console.log('start');
        return 0
    }

    get antlionSpeed() {
        switch (this.difficulty) {
            case 0:
                return this.playerSpeed;
            case 1:
                return this.playerSpeed + 0.5;
            case 2:
                return this.playerSpeed + 0.75;
            case 3:
                return this.playerSpeed + 1.5;

            default:
                return 3
                break;
        }
    }

    get playerSpeed() {
        switch (this.difficulty) {
            case 0:
                return 3
            case 1:
                return 4
            case 2:
                return 5
            case 3:
                return 7

            default:
                return 3
                break;
        }
    }
}