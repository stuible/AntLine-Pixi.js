import * as PIXI from 'pixi.js'

export default class {
    constructor(sprite, { textures, speed }) {
        this.sprite = sprite

        this.spriteTextures = []

        textures.forEach(textureImage => {
            this.spriteTextures.push(PIXI.Texture.from(textureImage))
        });

        this.spriteTextureIndex = 0;

        this._timeSinceAnimation = 0;

        this._speed = speed ? speed : 1;

        this.enabled = true;

    }

    set speed(speed){
        this._speed = speed;
    }

    update(delta) {
        this._timeSinceAnimation += delta;
        if (this._timeSinceAnimation > this._speed && this.enabled) {
            if (this.spriteTextureIndex < this.spriteTextures.length - 1) this.spriteTextureIndex++;
            else this.spriteTextureIndex = 0;

            this.sprite.texture = this.spriteTextures[this.spriteTextureIndex]

            this._timeSinceAnimation = 0;
        }
    }
}