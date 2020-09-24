import * as PIXI from 'pixi.js'
import keyboard from './keyboard'

const app = new PIXI.Application({
    width: 1080,
    height: 720,
    backgroundColor: 0x1099bb,
    view: document.querySelector('#game')
});

//Key Inputs
let downKey = keyboard("ArrowDown");
let upKey = keyboard("ArrowUp");
let leftKey = keyboard("ArrowLeft");
let rightKey = keyboard("ArrowRight");
downKey.press = () => {
    console.log("press down")
};

const texture = PIXI.Texture.from('assets/bunny.png');
const bunny = new PIXI.Sprite(texture);

// Player
const player = PIXI.Sprite.from(PIXI.Texture.WHITE);
player.anchor.set(0.5);
player.width = 50;
player.height = 50;
player.y = 200;
player.x = 600;
player.tint = 0xFF0000;
app.stage.addChild(player);

let playerSpeed = 5;


// Ant Lion
const antlion = PIXI.Sprite.from(PIXI.Texture.WHITE);
antlion.anchor.set(0.5);
antlion.width = 75;
antlion.height = 75;
antlion.y = 200;
antlion.x = 50;
antlion.tint = "#eb4034";
app.stage.addChild(antlion);

let antlionSpeed = 2;


// bunny.anchor.set(0.5);
// bunny.x = 160
// bunny.y = 160
// app.stage.addChild(bunny);

app.ticker.add((delta) => {

    if (downKey.isDown) {
        player.y += playerSpeed;
    }
    if (upKey.isDown) {
        player.y -= playerSpeed;
    }
    if (leftKey.isDown) {
        player.x -= playerSpeed;
    }
    if (rightKey.isDown) {
        player.x += playerSpeed;
    }

    var run = player.x - antlion.x;
    var rise = player.y - antlion.y;
    var length = Math.sqrt((rise * rise) + (run * run)); //pseudocode
    var unitX = run / length;
    var unitY = rise / length;

    antlion.x += unitX * antlionSpeed;
    antlion.y += unitY * antlionSpeed;
});