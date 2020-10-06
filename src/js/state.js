export default class {
    constructor({}){
        this.gameOver = false
        this.paused = false
        this._score = 0
    }
    
    addPoints(points){
        this._score += points
    }

    get score(){
        return Math.round(this._score)
    }
}