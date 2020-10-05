import * as PIXI from 'pixi.js'
import keyboard from './controls/keyboard'
import { cloneDeep } from 'lodash';

import player from './sprites/player';
import antlion from './sprites/antlion';
import Terrain from './terrain';

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

// Terrain
const terrain = new Terrain({ player: player, width: app.renderer.width - 600, height: app.renderer.height - 200, grid: 15 })
app.stage.addChild(terrain.container);

// Player
app.stage.addChild(player);
let playerSpeed = 5;


// Ant Lion
app.stage.addChild(antlion);
let antlionSpeed = 3;


app.ticker.add((delta) => {

    // FOllow player with "camera"
    let cameraDestination = {
        x: player.position.x + 100,
        y: player.position.y
    }

    // Weighted bias for camera follow spring function
    let bias = 0.96;

    app.stage.pivot.x = app.stage.pivot.x * bias + cameraDestination.x * (1 - bias);
    app.stage.pivot.y = app.stage.pivot.y * bias + cameraDestination.y * (1 - bias);
    app.stage.position.x = app.renderer.width / 2;
    app.stage.position.y = app.renderer.height / 2;


    //Generate New paths / walls
    terrain.update();

    let playerClone = cloneDeep(player);

    let playSpeedCurrent = playerSpeed;
    if (!terrain.insideTunnel(player)) playSpeedCurrent = 0;

    if (downKey.isDown) {
        playerClone.y += playSpeedCurrent;
        if (terrain.insideTunnel(playerClone)) player.y += playSpeedCurrent;
    }
    if (upKey.isDown) {
        playerClone.y -= playSpeedCurrent;
        if (terrain.insideTunnel(playerClone)) player.y -= playSpeedCurrent;
    }
    if (leftKey.isDown) {
        playerClone.x -= playSpeedCurrent;
        if (terrain.insideTunnel(playerClone)) player.x -= playSpeedCurrent;
    }
    if (rightKey.isDown) {
        playerClone.x += playSpeedCurrent;
        if (terrain.insideTunnel(playerClone)) player.x += playSpeedCurrent;
    }

    // Move Ant Lion towards player
    var run = player.x - antlion.x;
    var rise = player.y - antlion.y;
    var length = Math.sqrt((rise * rise) + (run * run));
    var unitX = run / length;
    var unitY = rise / length;

    antlion.x += unitX * antlionSpeed;
    antlion.y += unitY * antlionSpeed;
});