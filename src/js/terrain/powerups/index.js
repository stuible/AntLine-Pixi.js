import * as PIXI from 'pixi.js'

export default class {
    constructor(){

    }

    createItemCell(x, y) {
        const terrain = PIXI.Sprite.from(PIXI.Texture.WHITE);
        terrain.anchor.set(0);
        terrain.width = this.gridSize;
        terrain.height = this.gridSize;
        terrain.y = this.gridSize * y;
        terrain.x = this.gridSize * x;
        terrain.tint = "#FFFFFF";
        return terrain;
    }
}