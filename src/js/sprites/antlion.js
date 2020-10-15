import * as PIXI from 'pixi.js'

import { Rotation, Animation } from './utils';

export default class {
    constructor({ speed }) {
        this.sprite = PIXI.Sprite.from('assets/antlion/antlion-4.png');
        this.sprite.anchor.set(0.5);
        this.sprite.width = 75;
        this.sprite.height = 75;
        this.sprite.y = 350;
        this.sprite.x = -400;
        // this.sprite.tint = 0xC29D00;

        this.animator = new Animation(this.sprite, {
            textures: [
                'assets/antlion/antlion-1.png',
                'assets/antlion/antlion-2.png',
                'assets/antlion/antlion-3.png',
                'assets/antlion/antlion-4.png',
            ]
        });

        this.rotator = new Rotation(this.sprite);
        this.directions = [];

        this.speed = speed;

        this._targetAngle = 0;
    }

    update(delta, speed) {
        this.rotateTowardsAngle();
        this.animator.enabled = true;
        this.animator.speed = this.speed;
        this.animator.update(delta);
        this.speed = speed ? speed : this.speed;
    }

    moveToward(x, y){
        var run = x - this.x;
        var rise = y - this.y;
        var length = Math.sqrt((rise * rise) + (run * run));
        var unitX = run / length;
        var unitY = rise / length;

        this.x += unitX * this.speed;
        this.y += unitY * this.speed;

        // Update sprite's taget angle based on the directional degrees it's moving
        this._targetAngle =  this.rotator.getAngleFromRiseRun(rise, run);
    }

    rotateTowardsAngle() {
        let bias = 0.85; // Weighted bias for rotate spring function

        this.sprite.angle = this.sprite.angle * bias + this._targetAngle * (1 - bias);

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