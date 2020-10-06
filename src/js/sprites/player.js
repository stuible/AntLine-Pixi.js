import * as PIXI from 'pixi.js'



export default class {
    constructor({speed}) {
        this.sprite = PIXI.Sprite.from(PIXI.Texture.WHITE);
        this.sprite.anchor.set(0.5);
        this.sprite.width = 50;
        this.sprite.height = 50;
        this.sprite.y = 350;
        this.sprite.x = 30;
        this.sprite.tint = 0xFF0000;

        this.speed = speed ? speed : 5;
    }

    get x(){
        return this.sprite.x;
    }
    get y(){
        return this.sprite.y;
    }
    get height(){
        return this.sprite.height;
    }
    get width(){
        return this.sprite.width;
    }
    get position(){
        return this.sprite.position;
    }

    set x(x){
        this.sprite.x = x;
    }
    set y(y){
        this.sprite.y = y;
    }
    set height(h){
        this.sprite.height = h;
    }
    set width(w){
        this.sprite.width = w;
    }
}