import Highscore from './highscores';
import createGame from '../createGame';

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
        this.updateReact();
        // console.log('updating')
    }

    updateReact() {
        ReactUI.setState({ score: this.state.score, gameOver: this.state.gameOver, gameStarted: this.state.gameStarted, difficulty: this.state.difficultyString })
    }
    

    render() {
        ReactDom.render(<UIComponent state={this.state} ui={this} ref={ReactUI => { window.ReactUI = ReactUI }} />, this.rootElement);
    }
}

class UIComponent extends React.Component {
    constructor(props) {
        super(props);
        this.gameState = props.state
        this.state = { score: 0, gameOver: false, gameStarted: false, difficulty: '' };

        this.handleStartGame = this.handleStartGame.bind(this);
        this.handleRestartGame = this.handleRestartGame.bind(this);
    }

    handleRestartGame() {
        // location.reload();
        this.gameState.game.destroy(true);
        this.gameState.game = createGame(this.gameState, this.props.ui)
        this.gameState.reset();
        this.handleStartGame();
        this.props.ui.update();
    }

    handleStartGame() {
        this.gameState.gameStarted = true;
        document.querySelector('#game').classList.remove('overlay');
    }

    render() {
        const HUDComponent = (props) => (
            <div id="HUD">
                <div id="difficulty">
                    {'Difficulty: ' + props.difficulty}
                </div>
                <div id="score">
                    {'< ' + props.score + ' >'}
                </div>
            </div>

        );

        const GameOverlay = props => {
            if (props.gameOver) {
                return (
                    <div id="game-overlay">
                        <div className="title" style={{ fontSize: '2em' }}>Ant Line</div>
                        <h1 style={{ fontSize: '1.25em', marginBottom: 0 }}>Game Over :(</h1>
                        <Highscore score={this.state.score} />
                        <button onClick={this.handleRestartGame}>Play Again</button>
                    </div>
                )
            }
            else if (!props.gameStarted) return (
                <div id="game-overlay">
                    <div className="title" style={{ fontSize: '3em' }}>Ant Line</div>
                    <br />
                    <img src='/assets/Arrows.png' />
                    <p>Use the arrow keys to run away from the Ant Lion as fast as you can!</p>
                    <p>The Game will start slow but get harder.</p>
                    <p>You may find things that both help and harm you along your way so watch out...</p>
                    <button onClick={this.handleStartGame}>Start Game</button>
                </div>
            )
            else return null
        }

        return (
            <div>
                <HUDComponent score={this.state.score} difficulty={this.state.difficulty}/>
                <GameOverlay gameOver={this.state.gameOver} gameStarted={this.state.gameStarted} />
            </div>

        );
    }
}