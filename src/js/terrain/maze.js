import { sample } from 'lodash'

export default class {
    constructor({ height, width }) {

        this.height = height;
        this.width = width;

        this.path = [];
        this.pathCalcIndex = 0;

        this.currentPathGeneratorIndex = {
            x: 0,
            y: 3,
        }

        this.previousPathGeneratorXIndex = this.currentPathGeneratorIndex.x - 1;

    }

    generate(newWidth) {
        this.width = newWidth;
        const newPathsGenerated = this.generatePath();
        if (newPathsGenerated) {
            this.calculateWalls();

            const newPaths = this.path.filter(cell => cell.x > this.previousPathGeneratorXIndex && cell.x < this.currentPathGeneratorIndex.x - 1);

            this.previousPathGeneratorXIndex = this.currentPathGeneratorIndex.x - 2;

            return newPaths;
        }
        else return false;


    }

    pruneMaze(){
        
    }

    calculateWalls() {
        this.path.forEach((cell, index) => {

            const walls = {
                top: false, bottom: false, left: false, right: false
            }

            //Check if cell exists above, if not add a wall
            if (!this.getCell(cell.x, cell.y - 1)) walls.top = true;

            //Check if cell exists below, if not add a wall
            if (!this.getCell(cell.x, cell.y + 1)) walls.bottom = true;

            //Check if cell exists to the left, if not add a wall
            if (!this.getCell(cell.x - 1, cell.y)) walls.left = true;

            //Check if cell exists to the right, if not add a wall
            if (!this.getCell(cell.x + 1, cell.y)) walls.right = true;

            this.updateMazeCellWalls(cell.x, cell.y, walls);

        });
    }

    generatePath() {
        let newPaths = false;
        // Generate width of maze
        while (this.currentPathGeneratorIndex.x < this.width) {
            console.log("generating new path cell");
            newPaths = true;

            this.addMazeCell(this.currentPathGeneratorIndex.x, this.currentPathGeneratorIndex.y);

            let possiblePathDirections = [];

            // If path is at the bottom of the screen
            if (this.currentPathGeneratorIndex.y <= 0) {
                possiblePathDirections = ["up", "right"]
            }
            // If Path is at the top of the game
            else if (this.currentPathGeneratorIndex.y >= this.height) {
                possiblePathDirections = ["down", "right"]
            }
            // If the path is somewhere in between
            else {
                possiblePathDirections = ["up", "down", "right"]
            }

            switch (sample(possiblePathDirections)) {
                case "up":
                    this.currentPathGeneratorIndex.y++;
                    break;
                case "down":
                    this.currentPathGeneratorIndex.y--;
                    break;
                case "right":
                    this.currentPathGeneratorIndex.x++;
                    break;
                default:
                    this.currentPathGeneratorIndex.x++
                    break;
            }

        }

        return newPaths;
    }



    addMazeCell(x, y, walls = undefined) {
        if (this.getCell(x, y)) return;

        this.path.push({
            x: x,
            y: y,
            walls: walls ? {
                top: walls.top ? walls.top : false,    // Top/Up has a wall/blocked if true, boolean 
                left: walls.bottom ? wallsbottom : false,   // Left has a wall/blocked if true, boolean
                bottom: walls.left ? walls.left : false,  // Bottom/Down has a wall/blocked if true, boolean
                right: walls.right ? wallsright : false,
            } : undefined
        })
    }

    updateMazeCellWalls(x, y, { top, bottom, left, right }) {

        var newPathData = this.path.map(cell => {
            if (cell.x == x && cell.y == y)
                return Object.assign({}, cell, { walls: { top, bottom, left, right } })
            return cell
        });

        this.path = newPathData;

    }

    getCell(x, y) {
        return this.path.find(cell => cell.x == x && cell.y == y)
    }
}