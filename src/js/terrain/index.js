import * as PIXI from 'pixi.js'
import { sample } from 'lodash'

import { isTouching } from '../helpers/collision'

import tunnel from './tunnel';
import wall from './wall';
import Powerup from './powerups';

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

        this.powerup = new Powerup();

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

    generateNewPathCells() {

        const mazePath = this.maze.generate((this.player.position.x + ((this.width + 400) / 2)) / this.gridSize);

        if (mazePath.length > 0) console.log(mazePath);

        if(mazePath) mazePath.forEach(cellData => {
            if(!cellData.walls) return;
            const cell = this.createPathCell(cellData.x, cellData.y)
            this.tunnelContainer.addChild(cell);
            this.pathCells.push(cell);

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

        })

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