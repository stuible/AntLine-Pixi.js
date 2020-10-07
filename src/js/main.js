import * as PIXI from 'pixi.js'
import keyboard from './controls/keyboard'
import { cloneDeep } from 'lodash';

import State from './state';

import Player from './sprites/player';
import Antlion from './sprites/antlion';
import Terrain from './terrain';

import Camera from './camera';
import UI from './ui';

import Candy from './terrain/powerups/candy';

window.onload = () => {
    const app = new PIXI.Application({
        // width: 1080,
        // height: 720,
        resizeTo: document.querySelector('#game'),
        backgroundColor: 0x111111,
        // view: document.querySelector('#game')
    });

    document.querySelector('#game').appendChild(app.view);

    console.log({ "Web GL Supported": PIXI.utils.isWebGLSupported(), "Web GL Enabled": app.renderer.type == PIXI.RENDERER_TYPE.WEBGL })


    //Key Inputs
    let downKey = keyboard("ArrowDown");
    let upKey = keyboard("ArrowUp");
    let leftKey = keyboard("ArrowLeft");
    let rightKey = keyboard("ArrowRight");
    // downKey.press = () => {
    //     console.log("press down")
    // };

    // Global State
    const state = new State({});

    //UI
    const ui = new UI(state);

    // Camera
    const camera = new Camera(app);

    // Player
    const player = new Player({ speed: 5 });

    // Ant Lion
    const antlion = new Antlion({ speed: 4.5 });

    // Terrain
    const terrain = new Terrain({ player: player, width: app.renderer.width, height: app.renderer.height, grid: 100 });

    // Add elements to stage
    app.stage.addChild(terrain.container);
    app.stage.addChild(player.sprite);
    app.stage.addChild(antlion.sprite);

    app.ticker.add((delta) => {

        if(state.paused) return;

        // Update global state with change in time (ms) since last loop
        state.updateTime(app.ticker.elapsedMS);

        // Add points as time passes
        if (!state.gameOver) state.addPoints(app.ticker.elapsedMS / 1000);

        // Follow player with "camera"
        camera.moveToward(player);

        //Update UI
        ui.update();

        // Generate New paths & walls
        terrain.update();

        let playerClone = cloneDeep(player.sprite);

        if (downKey.isDown) {
            playerClone.y += player.speed;
            if (terrain.insideTunnel(playerClone)) player.y += player.speed;
            playerClone.y -= player.speed;
        }
        if (upKey.isDown) {
            playerClone.y -= player.speed;
            if (terrain.insideTunnel(playerClone)) player.y -= player.speed;
            playerClone.y += player.speed;
        }
        if (leftKey.isDown) {
            playerClone.x -= player.speed;
            if (terrain.insideTunnel(playerClone)) player.x -= player.speed;
            playerClone.x += player.speed;
        }
        if (rightKey.isDown) {
            playerClone.x += player.speed;
            if (terrain.insideTunnel(playerClone)) player.x += player.speed;
            playerClone.x -= player.speed;
        }

        //Check if Player is touching Antlion
        if (player.isTouching(antlion.sprite) && !state.gameOver) {
            state.gameOver = true;
            // alert("YOU LOSE! SCORE: " + state.score);
            console.log("YOU LOSE! SCORE: " + state.score)

            if (confirm("Game Over !  |  SCORE: " + state.score + "  |  Play Again?")) {
                location.reload();
              } else {
                state.paused = true;
              } 
            
        }

        // Get the index of the powerup that the player is touching (if it is)
        const powerupIndex = terrain.isTouchingPowerup(player.sprite);

        // If the index is not false, remove the powerup and apply it's powers to the player
        if(powerupIndex !== false){
            console.log("touching powerup:")
            terrain.removePowerupByIndex(powerupIndex);
            state.resetSpeedBonus();
            state.addPoints(10);
        }

        // If it's been less than 3 seconds, enable playerSpeed bonus, if not, disable
        if(state.speedBonus) player.speedBonus = true;
        else player.speedBonus = false;


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
            antlion.moveToward(antlionTarget.x, antlionTarget.y);
        }

    });
}

