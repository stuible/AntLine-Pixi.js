import * as PIXI from 'pixi.js'
import keyboard from './controls/keyboard'
import { sample, cloneDeep } from 'lodash';

import player from './sprites/player';
import antlion from './sprites/antlion';

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

//Terrain
let tunnelContainer = new PIXI.Container();
app.stage.addChild(tunnelContainer);

const terrainGridSize = 100;
let terrainGridWidth = player.position.x + app.renderer.width / terrainGridSize;
const terrainGridHeight = app.renderer.height / terrainGridSize;

let pathCells = [];

const currentPathIndex = {
    x: 0,
    y: 3,
}

function generateNewPathCells() {
    terrainGridWidth = (player.position.x + app.renderer.width) / terrainGridSize;
    while (currentPathIndex.x < terrainGridWidth) {
        console.log("generating new path cell");
        const cell = createPathCell(currentPathIndex.x, currentPathIndex.y)
        tunnelContainer.addChild(cell);
        pathCells.push(cell);

        let possiblePathDirections = [];

        // If path is at the bottom of the screen
        if (currentPathIndex.y <= 0) {
            possiblePathDirections = ["up", "right"]
        }
        // If Path is at the top of the game
        else if (currentPathIndex.y >= terrainGridHeight) {
            possiblePathDirections = ["down", "right"]
        }
        // If the path is somewhere in between
        else {
            possiblePathDirections = ["up", "down", "right"]
        }

        switch (sample(possiblePathDirections)) {
            case "up":
                currentPathIndex.y++;
                break;
            case "down":
                currentPathIndex.y--;
                break;
            case "right":
                currentPathIndex.x++;
                break;
            default:
                currentPathIndex.x++
                break;
        }

    }
}

function prunePathCells() {
    let maxViewableCells = player.position.x + app.renderer.width / terrainGridSize;

    //Only keep the past x cells
    const cellsToKeep = 75;

    for (let index = 0; index < pathCells.length - cellsToKeep; index++) {
        tunnelContainer.removeChild(pathCells[index])

    }

    pathCells = pathCells.slice(-1 * cellsToKeep);
}




function insideTunnel(sprite) {
    let foundIntersectingCell = false;
    pathCells.forEach(cell => {
        if (rectsIntersect(cell, sprite)) foundIntersectingCell = true;
    });
    return foundIntersectingCell;
}

function rectsFullyIntersect(a, b) {
    // let aBox = a.getBounds();
    // let bBox = b.getBounds();

    // // console.log(aBox)
    // // console.log(bBox)

    // return  aBox.x + aBox.width > bBox.x &&
    //         aBox.x < bBox.x + bBox.width &&
    //         aBox.y + aBox.height > bBox.y &&
    //         aBox.y < bBox.y + bBox.height;
}

function rectsIntersect(a, b) {
    let aBox = a.getBounds();
    let bBox = b.getBounds();
    return aBox.x + aBox.width > bBox.x &&
        aBox.x < bBox.x + bBox.width &&
        aBox.y + aBox.height > bBox.y &&
        aBox.y < bBox.y + bBox.height;
}

function createPathCell(x, y) {
    const terrain = PIXI.Sprite.from(PIXI.Texture.WHITE);
    terrain.anchor.set(0);
    terrain.width = terrainGridSize;
    terrain.height = terrainGridSize;
    terrain.y = terrainGridSize * y;
    terrain.x = terrainGridSize * x;
    terrain.tint = "#FFFFFF";
    return terrain;
}



// Player
app.stage.addChild(player);
let playerSpeed = 5;


// Ant Lion
// app.stage.addChild(antlion);
let antlionSpeed = 2;


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



    //Generate New path
    generateNewPathCells();
    prunePathCells();


    let playerClone = cloneDeep(player);

    let playSpeedCurrent = playerSpeed;
    if (!insideTunnel(player)) playSpeedCurrent = 0;

    if (downKey.isDown) {
        playerClone.y += playSpeedCurrent;
        if (insideTunnel(playerClone)) player.y += playSpeedCurrent;
    }
    if (upKey.isDown) {
        playerClone.y -= playSpeedCurrent;
        if (insideTunnel(playerClone)) player.y -= playSpeedCurrent;
    }
    if (leftKey.isDown) {
        playerClone.x -= playSpeedCurrent;
        if (insideTunnel(playerClone)) player.x -= playSpeedCurrent;
    }
    if (rightKey.isDown) {
        playerClone.x += playSpeedCurrent;
        if (insideTunnel(playerClone)) player.x += playSpeedCurrent;
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