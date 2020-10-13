import * as PIXI from 'pixi.js'
import keyboard from './controls/keyboard'
import { cloneDeep } from 'lodash';

import State from './state';

import { Player, Antlion } from './sprites';
import Terrain from './terrain';

import Camera from './camera';
import UI from './ui';

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
    const player = new Player({ speed: 5, state: state });

    // Ant Lion
    const antlion = new Antlion({ speed: 5.5 });

    // Terrain
    const terrain = new Terrain({ player: player, width: app.renderer.width, height: app.renderer.height * 2, grid: 100 });

    // Add elements to stage
    app.stage.addChild(terrain.container);
    app.stage.addChild(player.sprite);
    app.stage.addChild(player.hitbox); // Hitbox has to be added to the stage in order for collition detection to work (aparently)
    app.stage.addChild(antlion.sprite);

    app.ticker.add((delta) => {

        if (state.paused) return;

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

        // Let player / antlion know this is a new frame
        player.update(delta);
        antlion.update(delta);

        let playerClone = cloneDeep(player.hitbox);

        if (downKey.isDown) {
            playerClone.y += player.speed;
            if (terrain.insideTunnel(playerClone)) player.move("down");
            playerClone.y -= player.speed;
        }
        if (upKey.isDown) {
            playerClone.y -= player.speed;
            if (terrain.insideTunnel(playerClone)) player.move("up");
            playerClone.y += player.speed;
        }
        if (leftKey.isDown) {
            playerClone.x -= player.speed;
            if (terrain.insideTunnel(playerClone)) player.move("left");
            playerClone.x += player.speed;
        }
        if (rightKey.isDown) {
            playerClone.x += player.speed;
            if (terrain.insideTunnel(playerClone)) player.move("right");
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
        const powerup = terrain.isTouchingPowerup(player.sprite);

        // If the powerful is not false, remove the powerup and apply it's powers to the player
        if (powerup.type) {
            switch (powerup.type) {
                case 'candy':
                    console.log("touching candy")
                    terrain.removePowerup(powerup);
                    state.resetSpeedBonus();
                    state.addPoints(10);
                    break;
                case 'stickyfloor':
                    console.log("touching sticky floor")
                    state.speedPenalty = true;
                    break;
                default:
                    state.speedPenalty = false;
                    break;
            }
        }
        // No powerups on the current cell
        else {
            state.speedPenalty = false;
        }

        // If Antlion is behind the player, follow the paths to get closer to player, of not, target player directly
        if (antlion.x < player.x) {
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
        }
        else {
            antlion.moveToward(player.x, player.y);
        }


        // If Ant lion is super behind, teleport it offscreen so it has a chance
        if(antlion.x < player.x - terrain.originalWidth){
            antlion.x = player.x - terrain.originalWidth;
        }

    });
}

