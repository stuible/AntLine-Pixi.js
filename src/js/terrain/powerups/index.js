import * as PIXI from 'pixi.js'

export default class {
    constructor(){

    }

    createItemCell(x, y) {
        const item = PIXI.Sprite.from(PIXI.Texture.WHITE);
        item.anchor.set(0);
        item.width = this.gridSize;
        item.height = this.gridSize;
        item.y = this.gridSize * y;
        item.x = this.gridSize * x;
        item.tint = "#FFFFFF";
        return terrain;
    }
}