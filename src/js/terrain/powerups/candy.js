import * as PIXI from 'pixi.js'

export default class {
    constructor({x, y, size}){
        this.sprite = PIXI.Sprite.from("assets/Candy-2@2x.png");
        this.sprite.anchor.set(0);
        this.sprite.width = size;
        this.sprite.height = size * 0.7;
        this.sprite.y = y;
        this.sprite.x = x;
        // this.sprite.tint = "#FFFFFF";
    }

    get type(){
        return "candy"
    }
}