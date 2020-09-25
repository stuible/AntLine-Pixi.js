import * as PIXI from 'pixi.js'

const player = PIXI.Sprite.from(PIXI.Texture.WHITE);
player.anchor.set(0.5);
player.width = 50;
player.height = 50;
player.y = 350;
player.x = 30;
player.tint = 0xFF0000;

export default player;