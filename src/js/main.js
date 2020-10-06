import * as PIXI from 'pixi.js'
import keyboard from './controls/keyboard'
import { cloneDeep } from 'lodash';

import State from './state';

import Player from './sprites/player';
import Antlion from './sprites/antlion';
import Terrain from './terrain';

const app = new PIXI.Application({
    // width: 1080,
    // height: 720,
    resizeTo: document.querySelector('#game-wrapper'),
    backgroundColor: 0x1099bb,
    view: document.querySelector('#game')
});


//Key Inputs
let downKey = keyboard("ArrowDown");
let upKey = keyboard("ArrowUp");
let leftKey = keyboard("ArrowLeft");
let rightKey = keyboard("ArrowRight");
// downKey.press = () => {
//     console.log("press down")
// };

// Global State
const state = new  State({});

// Player
const player = new Player({speed: 5});

// Ant Lion
const antlion = new Antlion({speed: 3});

// Terrain
const terrain = new Terrain({ player: player, width: app.renderer.width, height: app.renderer.height, grid: 100 })

// Add elements to stage
app.stage.addChild(terrain.container);
app.stage.addChild(player.sprite);
app.stage.addChild(antlion.sprite);


app.ticker.add((delta) => {

    // Add points as time passes
    state.addPoints(delta / 50);

    // Follow player with "camera"
    let cameraDestination = {
        x: player.position.x + 100,
        y: player.position.y
    }

    
    let bias = 0.96; // Weighted bias for camera follow spring function

    app.stage.pivot.x = app.stage.pivot.x * bias + cameraDestination.x * (1 - bias);
    app.stage.pivot.y = app.stage.pivot.y * bias + cameraDestination.y * (1 - bias);
    app.stage.position.x = app.renderer.width / 2;
    app.stage.position.y = app.renderer.height / 2;


    // Generate New paths & walls
    terrain.update();

    let playerClone = cloneDeep(player.sprite);

    let playSpeedCurrent = player.speed;
    // if (!terrain.insideTunnel(player.sprite)) playSpeedCurrent = 0;

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

    //Check if Player is touching Antlion
    if(player.isTouching(antlion.sprite) && !state.gameOver){
        state.gameOver = true;
        alert("YOU LOSE! SCORE: " + state.score);
    }


    // Get the next path cell to the right of the antlion, we'll use this to give the antlion a place to go
    let antlionTargetCell = terrain.maze.path.filter(cell => cell.x >= antlion.x / terrain.gridSize)[0]

    // If theres a cell to move to, get its pixel location
    if (antlionTargetCell) {
        const antlionTarget = {
            x: (antlionTargetCell.x * terrain.gridSize) + terrain.gridSize / 2,
            y: (antlionTargetCell.y * terrain.gridSize) + terrain.gridSize / 2
        }
        // console.log(antlionTarget)

        // Move Ant Lion towards the next cell of the maze
        var run = antlionTarget.x - antlion.x;
        var rise = antlionTarget.y - antlion.y;
        var length = Math.sqrt((rise * rise) + (run * run));
        var unitX = run / length;
        var unitY = rise / length;

        antlion.x += unitX * antlion.speed;
        antlion.y += unitY * antlion.speed;
    }

});