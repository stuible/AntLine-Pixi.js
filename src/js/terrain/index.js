import * as PIXI from 'pixi.js'
import { sample } from 'lodash'

import { isTouching } from '../helpers/collision'

import Tunnel from './tunnel';
import Wall from './wall';
import { Candy, Stickyfloor } from './powerups';

import maze from './maze';


export default class {
    constructor({ player, grid, height, width }) {
        this.player = player

        this.terrainContainer = new PIXI.Container();
        this.tunnelContainer = new PIXI.Container();
        this.wallContainer = new PIXI.Container();
        this.powerupContainer = new PIXI.Container();

        this.originalWidth = width;

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
    }

    // Return path / tunnel cell based on X, Y location on grid, if it exists 
    getPathCell(x, y) {
        return this.pathCells.find(cell => cell.y == y * this.gridSize && cell.x == x * this.gridSize)
    }

    // Return wall cell based on X, Y location on grid, if it exists
    getWallCell(x, y) {
        return this.wallCells.find(cell => cell.y == y * this.gridSize && cell.x == x * this.gridSize)
    }

    maybeGeneratePowerup(x, y) {
        // Generates a number between 0 and 1
        const randomNumber = Math.random();

        // 5% Chance of a Candy
        if (randomNumber < 0.05) {
            console.log("Generated Candy!")
            const powerup = this.createPowerupCell('candy', x, y)
            this.powerupContainer.addChild(powerup.sprite);
            this.powerupCells.push(powerup);
        }
        // 5% Chance of a sticky floor but there there must be a candy spawned first
        else if(randomNumber < 0.1 && this.powerupCells.length > 0){
            console.log("Generated Sticky Floor")
            const powerup = this.createPowerupCell('stickyfloor', x, y)
            this.powerupContainer.addChild(powerup.sprite);
            this.powerupCells.push(powerup);
        }
    }

    generateNewPathCells() {

        const mazePath = this.maze.generate((this.player.position.x + ((this.width + 400) / 2)) / this.gridSize);

        //  For each new cell of maze
        if (mazePath) mazePath.forEach(cellData => {
            if (!cellData.walls) return; // Make sure the cell has wall data or lets skip it for now

            // Generate path / tunnel sprite for new cell and add display it on screen
            const cell = this.createPathCell(cellData.x, cellData.y)
            this.tunnelContainer.addChild(cell);
            this.pathCells.push(cell);

            // Generate wall sprites as well
            if (cellData.walls.top) {
                const wall = this.createWallCell(cellData.x, cellData.y - 1, ['bottom']);
                this.wallContainer.addChild(wall);
                this.wallCells.push(wall);
            }
            if (cellData.walls.bottom) {
                const wall = this.createWallCell(cellData.x, cellData.y + 1, ['top']);
                this.wallContainer.addChild(wall);
                this.wallCells.push(wall);
            }
            if (cellData.walls.left) {
                const wall = this.createWallCell(cellData.x - 1, cellData.y, ['right']);
                this.wallContainer.addChild(wall);
                this.wallCells.push(wall);
            }
            if (cellData.walls.right) {
                const wall = this.createWallCell(cellData.x + 1, cellData.y, ['left']);
                this.wallContainer.addChild(wall);
                this.wallCells.push(wall);
            }

            // Then (maybe) generate a powerup on this cell location
            this.maybeGeneratePowerup(cellData.x, cellData.y);

        })

        // If there were new mazePaths generated, lets prune the old ones
        if (mazePath.length > 0) {
            console.log(mazePath);
            this.prunePathCells();
            this.prunePowerupCells();
        }

    }

    createPathCell(x, y) {
        return new Tunnel({ x: this.gridSize * x, y: this.gridSize * y, size: this.gridSize }).sprite;
    }

    createWallCell(x, y, sides) {
        return new Wall({ x: this.gridSize * x, y: this.gridSize * y, size: this.gridSize, sides: sides }).sprite;
    }

    createPowerupCell(powerup, x, y) {
        switch (powerup) {
            case 'candy':
                return new Candy({ x: this.gridSize * x + (this.gridSize * 0.15), y: this.gridSize * y + (this.gridSize * 0.15), size: this.gridSize * 0.7 });
            case 'stickyfloor':
                return new Stickyfloor({ x: this.gridSize * x + (this.gridSize * 0.15), y: this.gridSize * y + (this.gridSize * 0.15), size: this.gridSize * 0.7 });
            default:
                return undefined;
        }
    }

    // Remove path and wall cells that the player has already passed and are behind them
    prunePathCells() {
        let xCutoff = this.player.position.x - (this.originalWidth / 2) - (this.gridSize * 2);

        let visibleWalls = this.wallCells.filter(cell => {
            if (cell.x > xCutoff) return true;
            else {
                this.wallContainer.removeChild(cell);
            }
        })

        let visiblePaths = this.pathCells.filter(cell => {
            if (cell.x > xCutoff) return true;
            else {
                this.tunnelContainer.removeChild(cell);
            }
        })

        this.pathCells = visiblePaths;
        this.wallCells = visibleWalls;
    }

    // Remove candy cells that the player has already passed and are behind them
    prunePowerupCells() {
        let xCutoff = this.player.position.x - (this.originalWidth / 2) - (this.gridSize * 2);
        // console.log(xCutoff);

        let visibleCandy = this.powerupCells.filter(powerup => {
            if (powerup.sprite.x > xCutoff) return true;
            else {
                this.powerupContainer.removeChild(powerup.sprite);
            }
        })

        this.powerupCells = visibleCandy;
        // console.log(this.powerupCells)
    }

    // Return powerup in powerup array by index
    getPowerupByIndex(index) {
        return this.powerupCells[index];
    }

    // Remove sprite and array item of powerup
    removePowerup(powerup) {
        this.powerupContainer.removeChild(powerup.sprite);
        this.powerupCells.splice(this.powerupCells.findIndex(powerUpInArray => powerUpInArray == powerup), 1);
    }

    // Get bounding boxes for 2 sprites
    rectsIntersect(a, b) {
        let aBox = a.getBounds();
        let bBox = b.getBounds();
        return isTouching(aBox, bBox);
    }

    // Returns powerup object if input sprite is touching one
    isTouchingPowerup(sprite) {
        for (let index = 0; index < this.powerupCells.length; index++) {
            if (this.rectsIntersect(this.powerupCells[index].sprite, sprite)) return this.powerupCells[index];
        }
        return false;
    }

    // Return true if input sprite is not touching any walls
    insideTunnel(sprite) {

        let foundIntersectingCell = false;
        this.wallCells.forEach(cell => {
            if (this.rectsIntersect(cell, sprite)) foundIntersectingCell = true;
        });
        return !foundIntersectingCell;
    }



}