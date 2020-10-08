import * as PIXI from 'pixi.js'

import { isTouching } from '../helpers/collision'

export default class {
    constructor({ speed }) {
        this.sprite = PIXI.Sprite.from("assets/ant2-2x.png");
        this.sprite.anchor.set(0.5);
        this.sprite.width = 50;
        this.sprite.height = 50;
        this.sprite.y = 350;
        this.sprite.x = 30;

        // Hidden Hitbox sprite that doesn't rotate
        this.hitbox = PIXI.Sprite.from(PIXI.Texture.WHITE);
        this.hitbox.anchor.set(0.5);
        this.hitbox.width = this.sprite.width;
        this.hitbox.height = this.sprite.height;
        this.hitbox.y = this.sprite.y ;
        this.hitbox.x = this.sprite.x;
        this.hitbox.tint = 0xFF0000;
        this.hitbox.visible = false;

        this.directions = [];
        this._targetAngle = 0;

        this.speedBonus = false;

        this._speedBonusIncrease = 5;

        this._speed = speed ? speed : 5;
    }

    isTouching(sprite) {
        let aBox = this.sprite.getBounds();
        let bBox = sprite.getBounds();
        return isTouching(aBox, bBox);
    }

    get speed() {
        if (this.speedBonus) return this._speed + this._speedBonusIncrease;
        else return this._speed;
    }

    get x() {
        return this.hitbox.x;
    }
    get y() {
        return this.hitbox.y;
    }
    get height() {
        return this.hitbox.height;
    }
    get width() {
        return this.hitbox.width;
    }
    get position() {
        return this.hitbox.position;
    }

    set x(x) {
        this.sprite.x = x;
        this.hitbox.x = x;
    }
    set y(y) {
        this.sprite.y = y;
        this.hitbox.y = y;
    }
    set height(h) {
        this.sprite.height = h;
        this.hitbox.height = h;
    }
    set width(w) {
        this.sprite.width = w;
        this.hitbox.width = w;
    }

    update() {
        this.directions = [];
        this.rotateTowardsAngle();
    }

    rotateSpriteByDirection() {
        if (this.directions.includes("up")) {
            this._targetAngle = 270;
        }
        if (this.directions.includes("down")) {
            this._targetAngle = 90;
        }
        if (this.directions.includes("left")) {
            this._targetAngle = 180;
        }
        if (this.directions.includes("right")) {
            this._targetAngle = 0;
        }

        if (this.directions.includes("up") && this.directions.includes("right")) {
            this._targetAngle = 315;
        }
        if (this.directions.includes("down") && this.directions.includes("right")) {
            this._targetAngle = 45;
        }
        if (this.directions.includes("up") && this.directions.includes("left")) {
            this._targetAngle = 225;
        }
        if (this.directions.includes("down") && this.directions.includes("left")) {
            this._targetAngle = 135;
        }
    }

    rotateTowardsAngle() {
        let bias = 0.85; // Weighted bias for rotate spring function

        // Wrap rotations to avoid angles greater than 360 or less than 0
        if(this.sprite.angle < 0) this.sprite.angle - 360;
        if(this.sprite.angle >= 359) this.sprite.angle - 360;

        // If we're crossing over the 360 -> 0 angle line, go the short way
        if(this._targetAngle - this.sprite.angle >= 260){
            console.log("going from right to up")
            this._targetAngle = -90;
            // this.sprite.angle = this.sprite.angle * bias - this._targetAngle * (1 - bias);
        }
        // If we're crossing over the 0 -> 360 angle line, go the short way
        // else if(this._targetAngle - this.sprite.angle <= -260){
        //     this._targetAngle = 360;
        //     this.sprite.angle = this.sprite.angle * bias + this._targetAngle * (1 - bias);
        // }
        // Use spring function to rotate ant towards target angel
        else {
            this.sprite.angle = this.sprite.angle * bias + this._targetAngle * (1 - bias);
        }
    }

    move(direction) {
        switch (direction) {
            case "up":
                this.y -= this.speed;
                break;
            case "down":
                this.y += this.speed;
                break;
            case "left":
                this.x -= this.speed;
                break;
            case "right":
                this.x += this.speed;
                break;
            default:
                return;
        }
        this.directions.push(direction);
        this.rotateSpriteByDirection();
    }
}