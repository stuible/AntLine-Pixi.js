import * as PIXI from 'pixi.js'

import { isTouching } from '../helpers/collision'

export default class {
    constructor({ speed }) {
        this.sprite = PIXI.Sprite.from("assets/ant-1.png");
        this.sprite.anchor.set(0.5);
        this.sprite.width = 50;
        this.sprite.height = 50;
        this.sprite.y = 350;
        this.sprite.x = 30;
        // this.sprite.tint = 0xFF0000;

        this.speedBonus = false;

        this._speedBonusIncrease = 10;

        this._speed = speed ? speed : 5;
    }

    isTouching(sprite) {
        let aBox = this.sprite.getBounds();
        let bBox = sprite.getBounds();
        return isTouching(aBox, bBox);
    }

    get speed() {
        if(this.speedBonus) return this._speed + this._speedBonusIncrease;
        else return this._speed;
    }

    get x() {
        return this.sprite.x;
    }
    get y() {
        return this.sprite.y;
    }
    get height() {
        return this.sprite.height;
    }
    get width() {
        return this.sprite.width;
    }
    get position() {
        return this.sprite.position;
    }

    set x(x) {
        this.sprite.x = x;
    }
    set y(y) {
        this.sprite.y = y;
    }
    set height(h) {
        this.sprite.height = h;
    }
    set width(w) {
        this.sprite.width = w;
    }
}