import * as PIXI from 'pixi.js'
import { sample } from 'lodash'

import { isTouching } from '../helpers/collision'

import Tunnel from './tunnel';
import Wall from './wall';
import { Candy } from './powerups';

import maze from './maze';


export default class {
    constructor({ player, grid, height, width }) {
        this.player = player

        this.terrainContainer = new PIXI.Container();
        this.tunnelContainer = new PIXI.Container();
        this.wallContainer = new PIXI.Container();
        this.powerupContainer = new PIXI.Container();

        this.height = height;
        this.width = width;

        this.terrainContainer.addChild(this.tunnelContainer);
        this.terrainContainer.addChild(this.wallContainer);
        this.terrainContainer.addChild(this.powerupContainer);

        this.gridSize = grid ? grid : 100;
        this.gridWidth = this.player.position.x + this.width / this.gridSize;
        this.gridHeight = this.height / this.gridSize;

        this.pathCells = [];
        this.wallCells = [];
        this.powerupCells = [];

        this.maze = new maze({ height: this.gridHeight, width: this.gridWidth });

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

    // Return path cell based on X, Y location on grid, if it exists
    getPathCell(x, y) {
        return this.pathCells.find(cell => cell.y == y * this.gridSize && cell.x == x * this.gridSize)
    }

    getWallCell(x, y) {
        return this.wallCells.find(cell => cell.y == y * this.gridSize && cell.x == x * this.gridSize)
    }

    maybeGeneratePowerup(x, y){
        // Generates a number between 0 and 1
        const randomNumber = Math.random(); 

        // 5% Chance
        if(randomNumber < 0.05){
            console.log("Generated Powerup!")
            const powerup = this.createPowerupCell('candy', x, y)
            this.powerupContainer.addChild(powerup);
            this.powerupCells.push(powerup);
        }
    }

    generateNewPathCells() {

        const mazePath = this.maze.generate((this.player.position.x + ((this.width + 400) / 2)) / this.gridSize);

        if (mazePath.length > 0) console.log(mazePath);

        //  For each new cell of maze
        if(mazePath) mazePath.forEach(cellData => {
            if(!cellData.walls) return; // Make sure the cell has wall data or lets skip it for now

            // Generate path / tunnel sprite for new cell and add display it on screen
            const cell = this.createPathCell(cellData.x, cellData.y)
            this.tunnelContainer.addChild(cell);
            this.pathCells.push(cell);

            // Generate wall sprites as well
            if (cellData.walls.top) {
                const wall = this.createWallCell(cellData.x, cellData.y - 1);
                this.wallContainer.addChild(wall);
                this.wallCells.push(wall);
            }
            if (cellData.walls.bottom) {
                const wall = this.createWallCell(cellData.x, cellData.y + 1);
                this.wallContainer.addChild(wall);
                this.wallCells.push(wall);
            }
            if (cellData.walls.left) {
                const wall = this.createWallCell(cellData.x - 1, cellData.y);
                this.wallContainer.addChild(wall);
                this.wallCells.push(wall);
            }
            if (cellData.walls.right) {
                const wall = this.createWallCell(cellData.x + 1, cellData.y);
                this.wallContainer.addChild(wall);
                this.wallCells.push(wall);
            }

            // Then (maybe) generate a powerup on this cell location
            this.maybeGeneratePowerup(cellData.x, cellData.y);

        })

    }

    createPathCell(x, y) {
        return new Tunnel({x: this.gridSize * x, y: this.gridSize * y, size: this.gridSize}).sprite;
    }

    createWallCell(x, y) {
        return new Wall({x: this.gridSize * x, y: this.gridSize * y, size: this.gridSize}).sprite;
    }

    createPowerupCell(powerup, x, y) {
        switch (powerup) {
            case 'candy':
                return new Candy({x: this.gridSize * x + (this.gridSize * 0.15), y: this.gridSize * y + (this.gridSize * 0.15), size: this.gridSize * 0.7}).sprite;
            default:
                return undefined;
        }
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
        function rectsIntersect(a, b) {
            let aBox = a.getBounds();
            let bBox = b.getBounds();
            return isTouching(aBox, bBox);
        }

        let foundIntersectingCell = false;
        this.wallCells.forEach(cell => {
            if (rectsIntersect(cell, sprite)) foundIntersectingCell = true;
        });
        return !foundIntersectingCell;
    }

}