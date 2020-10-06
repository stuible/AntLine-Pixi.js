export default class {
    constructor(app) {
        this.app = app
    }

    moveToward(sprite) {
        let cameraDestination = {
            x: sprite.x + 100,
            y: sprite.y
        }

        let bias = 0.96; // Weighted bias for camera follow spring function

        this.app.stage.pivot.x = this.app.stage.pivot.x * bias + cameraDestination.x * (1 - bias);
        this.app.stage.pivot.y = this.app.stage.pivot.y * bias + cameraDestination.y * (1 - bias);
        this.app.stage.position.x = this.app.renderer.width / 2;
        this.app.stage.position.y = this.app.renderer.height / 2;
    }
}