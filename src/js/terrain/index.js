import * as PIXI from 'pixi.js'
import { sample } from 'lodash'

import tunnel from './tunnel';
import wall from './wall';


export default class {
    constructor({ player, grid, height, width }) {
        this.player = player

        this.terrainContainer = new PIXI.Container();
        this.tunnelContainer = new PIXI.Container();
        this.wallContainer = new PIXI.Container();

        this.height = height;
        this.width = width;


        this.terrainContainer.addChild(this.tunnelContainer);
        this.terrainContainer.addChild(this.wallContainer);

        this.gridSize = grid ? grid : 100;
        this.gridWidth = this.player.position.x + this.width / this.gridSize;
        this.gridHeight = this.height / this.gridSize;

        this.pathCells = [];
        this.wallCells = [];

        this.currentPathIndex = {
            x: 0,
            y: 3,
        }

        this.currentWallXIndex = 0;
    }

    get container() {
        return this.terrainContainer;
    }

    update() {
        this.generateNewPathCells();
        this.prunePathCells();
    }

    generateNewPathCells() {
        this.gridWidth = (this.player.position.x + ((this.width + 400) / 2)) / this.gridSize;
        console.log({ "this.width": this.width, "this.gridWidth": this.gridWidth })
        while (this.currentPathIndex.x < this.gridWidth) {
            console.log("generating new path cell");
            const cell = this.createPathCell(this.currentPathIndex.x, this.currentPathIndex.y)
            this.tunnelContainer.addChild(cell);
            this.pathCells.push(cell);

            let possiblePathDirections = [];

            // If path is at the bottom of the screen
            if (this.currentPathIndex.y <= 0) {
                possiblePathDirections = ["up", "right"]
            }
            // If Path is at the top of the game
            else if (this.currentPathIndex.y >= this.gridHeight) {
                possiblePathDirections = ["down", "right"]
            }
            // If the path is somewhere in between
            else {
                possiblePathDirections = ["up", "down", "right"]
            }

            switch (sample(possiblePathDirections)) {
                case "up":
                    this.currentPathIndex.y++;
                    break;
                case "down":
                    this.currentPathIndex.y--;
                    break;
                case "right":
                    this.currentPathIndex.x++;
                    break;
                default:
                    this.currentPathIndex.x++
                    break;
            }
        }
        // Return path cell based on X, Y location on grid, if it exists
        const getPathCell = (x, y) => {
            return this.pathCells.find(cell => cell.y == y * this.gridSize && cell.x == x * this.gridSize)
        }

        // Draw walls
        while (this.currentWallXIndex < this.gridWidth - 1) {
            // Iterate over the height of the terrain grid, one cell at a time until we find our first path cell
            for (let yIndex = -1; yIndex < this.gridHeight + 5; yIndex++) {

                // Runs if we've found a cell with a tunnel in it
                if (getPathCell(this.currentWallXIndex, yIndex)) {

                    // Draw a wall above the first tunnel cell found
                    const upperWall = this.createWallCell(this.currentWallXIndex, yIndex - 1);
                    this.wallContainer.addChild(upperWall);
                    this.wallCells.push(upperWall);

                    // Check if we need to build a wall to the left
                    if (!getPathCell(this.currentWallXIndex - 1, yIndex)) {
                        const leftWall = this.createWallCell(this.currentWallXIndex - 1, yIndex);
                        this.wallContainer.addChild(leftWall);
                        this.wallCells.push(leftWall);
                    }

                    // Check if we need to build a wall to the right
                    if (!getPathCell(this.currentWallXIndex + 1, yIndex)) {
                        const rightWall = this.createWallCell(this.currentWallXIndex + 1, yIndex);
                        this.wallContainer.addChild(rightWall);
                        this.wallCells.push(rightWall);
                    }

                    // Now lets move down until we find the end of of verticle path
                    for (let pathScanYIndex = yIndex; pathScanYIndex < this.gridHeight + 5; pathScanYIndex++) {

                        // If there's still a path here, lets see if we need to draw side walls
                        if (getPathCell(this.currentWallXIndex, pathScanYIndex)) {
                            // Check if we need to build a wall to the left
                            if (!getPathCell(this.currentWallXIndex - 1, pathScanYIndex)) {
                                const leftWall = this.createWallCell(this.currentWallXIndex - 1, pathScanYIndex);
                                this.wallContainer.addChild(leftWall);
                                this.wallCells.push(leftWall);
                            }

                            // Check if we need to build a wall to the right
                            if (!getPathCell(this.currentWallXIndex + 1, pathScanYIndex)) {
                                const rightWall = this.createWallCell(this.currentWallXIndex + 1, pathScanYIndex);
                                this.wallContainer.addChild(rightWall);
                                this.wallCells.push(rightWall);
                            }
                        }
                        // If there isn't a path lets draw our bottom wall
                        else {
                            const bottomWall = this.createWallCell(this.currentWallXIndex, pathScanYIndex);
                            this.wallContainer.addChild(bottomWall);
                            this.wallCells.push(bottomWall);

                            pathScanYIndex = 1000;
                        }
                    }

                    break;
                }

            }
            this.currentWallXIndex++;
        }

    }

    createPathCell(x, y) {
        const terrain = PIXI.Sprite.from(PIXI.Texture.WHITE);
        terrain.anchor.set(0);
        terrain.width = this.gridSize;
        terrain.height = this.gridSize;
        terrain.y = this.gridSize * y;
        terrain.x = this.gridSize * x;
        terrain.tint = "#FFFFFF";
        return terrain;
    }

    createWallCell(x, y) {
        const terrain = PIXI.Sprite.from(PIXI.Texture.WHITE);
        terrain.anchor.set(0);
        terrain.width = this.gridSize;
        terrain.height = this.gridSize;
        terrain.y = this.gridSize * y;
        terrain.x = this.gridSize * x;
        terrain.tint = Math.floor(Math.random() * 16777215);
        return terrain;
    }

    prunePathCells() {
        let maxViewableCells = this.player.position.x + this.width / this.gridSize;

        //Only keep the past x cells
        const pathCellsToKeep = 70;
        const wallCellsToKeep = 60;

        for (let index = 0; index < this.pathCells.length - pathCellsToKeep; index++) {
            this.tunnelContainer.removeChild(this.pathCells[index])
        }
        for (let index = 0; index < this.wallCells.length - wallCellsToKeep; index++) {
            this.wallContainer.removeChild(this.wallCells[index])
        }

        this.pathCells = this.pathCells.slice(-1 * pathCellsToKeep);
        this.wallCells = this.wallCells.slice(-1 * wallCellsToKeep);
    }




    insideTunnel(sprite) {
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


        let foundIntersectingCell = false;
        this.wallCells.forEach(cell => {
            if (rectsIntersect(cell, sprite)) foundIntersectingCell = true;
        });
        return !foundIntersectingCell;
    }




}