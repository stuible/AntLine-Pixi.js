import Highscore from './highscores';

import React from 'react';
import ReactDom from 'react-dom'

export default class {
    constructor(state) {
        this.rootElement = document.getElementById("ui");
        this.state = state;

        this.score = this.state.score;

        this.highscore = new Highscore(this.element);
        this.render();

        this.react = React.createElement;
    }

    update() {
        this.updateStore();
        console.log('updating')
    }

    updateStore() {
        ReactUI.setState({ score: this.state.score, gameOver: this.state.gameOver })
    }

    render() {

        ReactDom.render(<UIComponent score={this.score} ref={ReactUI => { window.ReactUI = ReactUI }} />, this.rootElement);
    }
}

class UIComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = { score: 0, gameOver: false };
    }

    handleRestartGame() {
        location.reload();
    }

    render() {
        const ScoreComponent = (props) => (
            <div id="score">
                | {props.score} |
            </div>
        );

        const ShowIfGameOver = props => {
            if (props.gameOver) {
                return (
                    <div id="game-over">
                        <div>Game Over</div>
                        <Highscore score={this.state.score} />
                        <button onClick={this.handleRestartGame}>Play Again</button>
                    </div>
                )
            }
            else return null;
        }

        return (
            <div>
                <ScoreComponent score={this.state.score} />
                <ShowIfGameOver gameOver={this.state.gameOver} />
            </div>

        );
    }
}