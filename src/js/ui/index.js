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
        ReactUI.setState({ score: this.state.score, gameOver: this.state.gameOver, gameStarted: this.state.gameStarted })
    }

    render() {

        ReactDom.render(<UIComponent state={this.state} ui={this} ref={ReactUI => { window.ReactUI = ReactUI }} />, this.rootElement);
    }
}

class UIComponent extends React.Component {
    constructor(props) {
        super(props);
        this.gameState = props.state
        this.state = { score: 0, gameOver: false, gameStarted: false };

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
    
    handleStartGame(){
        this.gameState.gameStarted = true;
        document.querySelector('#game').classList.remove('overlay');
    }

    render() {
        const ScoreComponent = (props) => (
            <div id="score">
                {'< ' + props.score + ' >'}
            </div>
        );

        const GameOverlay = props => {
            if (props.gameOver) {
                return (
                    <div id="game-overlay">
                        <div>Game Over</div>
                        <Highscore score={this.state.score} />
                        <button onClick={this.handleRestartGame}>Play Again</button>
                    </div>
                )
            }
            else if (!props.gameStarted) return (
                <div id="game-overlay">
                    <div className="title" style={{fontSize: '3em'}}>Ant Line</div>
                    <br/>
                    <img src='/assets/Arrows.png' />
                    <p>Use the arrow keys to run away from the Ant Lion as fast as you can!</p>
                    <p>You may find things that both help and harm you along your way so watch out...</p>
                    <button onClick={this.handleStartGame}>Start Game</button>
                </div>
            )
            else return null
        }

        return (
            <div>
                <ScoreComponent score={this.state.score} />
                <GameOverlay gameOver={this.state.gameOver} gameStarted={this.state.gameStarted}/>
            </div>

        );
    }
}