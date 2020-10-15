import * as PIXI from 'pixi.js'
import keyboard from './controls/keyboard'

import { Player, Antlion } from './sprites';
import Terrain from './terrain';

import Camera from './camera';

export default function (state, ui) {
    const app = new PIXI.Application({
        // width: 1080,
        // height: 720,
        resizeTo: document.querySelector('#game'),
        backgroundColor: 0xffffff,
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

    terrain.update(); //Generate terrain manually before entering loop

    app.ticker.add((delta) => {

        if (state.paused || !state.gameStarted) return;

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

        let playerClone = player.hitbox;

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
            state.paused = true;
            document.querySelector('#game').classList.add('overlay');

            ui.update(); //update UI one last time
            // alert("YOU LOSE! SCORE: " + state.score);
            // console.log("YOU LOSE! SCORE: " + state.score)

            // if (confirm("Game Over !  |  SCORE: " + state.score + "  |  Play Again?")) {
            //     location.reload();
            // } else {
            //     state.paused = true;
            // }

        }

        // Get the index of the powerup that the player is touching (if it is)
        const powerup = terrain.isTouchingPowerup(player.sprite);

        // If the powerup is not undefined, remove the powerup (if appropriate) and apply it's powers to the player
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
        // Player is not touching a powerup
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
        const antlionTrailingMax = (terrain.originalWidth / 2) + terrain.gridSize;

        if (antlion.x < player.x - antlionTrailingMax) {
            antlion.x = player.x - antlionTrailingMax;
        }

    });

    return app;
}