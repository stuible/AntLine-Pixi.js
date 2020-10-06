import * as PIXI from 'pixi.js'

const antlion = PIXI.Sprite.from(PIXI.Texture.WHITE);
antlion.anchor.set(0.5);
antlion.width = 75;
antlion.height = 75;
antlion.y = 350;
antlion.x = -200;
antlion.tint = 0xC29D00;

export default antlion;