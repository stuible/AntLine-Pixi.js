import * as PIXI from 'pixi.js'

export default class {
    constructor({x, y, size}){
        this.sprite = PIXI.Sprite.from("assets/stickyfloor.png");
        this.sprite.anchor.set(0);
        this.sprite.width = size;
        this.sprite.height = size * 0.95;
        this.sprite.y = y;
        this.sprite.x = x;
        // this.sprite.tint = 0xF7E7A4;
    }

    get type(){
        return "stickyfloor"
    }
}