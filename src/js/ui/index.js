export default class {
    constructor(state){
        this.element = document.getElementById("ui");
        this.state = state;
    }

    update(){
        this.updateStore();
    }

    updateStore(){
        this.element.textContent = `| Score: ${this.state.score} |`;
    }
}