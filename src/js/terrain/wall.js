
import * as PIXI from 'pixi.js'

export default class {
    constructor({ x, y, size, sides }) {
        this.sprite = PIXI.Sprite.from(PIXI.Texture.WHITE);
        this.setSprite(sides);
        this.sprite.anchor.set(0.5);
        this.sprite.width = size;
        this.sprite.height = size;
        this.sprite.y = y + (size / 2);
        this.sprite.x = x + (size / 2);
        this.sprite.tint = 0x999999;
    }

    setSprite(sides){
        if(sides.includes("bottom")){
            this.sprite.texture = PIXI.Texture.from('assets/wall/single.png')
        }
        else if(sides.includes("top")){
            this.sprite.texture = PIXI.Texture.from('assets/wall/single.png')
            this.sprite.angle = 180
        }
        else if(sides.includes("left")){
            this.sprite.texture = PIXI.Texture.from('assets/wall/single.png')
            this.sprite.angle = 90
        }
        else if(sides.includes("right")){
            this.sprite.texture = PIXI.Texture.from('assets/wall/single.png')
            this.sprite.angle = 270
        }
    }
}