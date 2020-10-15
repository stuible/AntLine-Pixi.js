import React from 'react';
import localStorage from 'local-storage';

export default class extends React.Component {
    constructor(props) {
        super(props);
        this.state = { highscores: [], lastNameEntered: '', name: '', submitted: false };

    }

    componentDidMount() {

        const highscores = localStorage.get('highscores');
        console.log(highscores)
        if (highscores) {
            this.setState({ highscores: highscores })
        }

        const lastNameEntered = localStorage.get('lastNameEntered');
        if (lastNameEntered) {
            this.setState({ lastNameEntered: lastNameEntered, name: lastNameEntered })
        }

    }

    saveHighscores() {
        localStorage.set('highscores', this.state.highscores)
        localStorage.set('lastNameEntered', this.state.lastNameEntered)
    }

    handleNameInputChange(event) {
        this.setState({ name: event.target.value });
    }

    handleSubmitHighScore() {
        let newHighscores = this.state.highscores;
        newHighscores.push({ name: this.state.name, score: this.props.score })

        this.setState({ lastNameEntered: this.state.name, highscores: newHighscores }, () => {
            this.saveHighscores();
        });

    }

    render() {
        const NewHighscore = (props) => {
            if (!this.state.submitted && this.props.score > 5) {
                return (
                    <div id="new-highscore">
                        <label>Name</label><input type="text" onChange={event => this.handleNameInputChange(event)} value={this.state.name}></input>
                        <button onClick={event => this.handleSubmitHighScore(event)}>Submit</button>
                    </div>
                );
            }
        }

        return (
            <div>
                <h2 className="leaderboard-title">High Scores</h2>
                {NewHighscore()}
                <ol className="highscore-list">
                    {this.state.highscores.map((highscore, index) => (
                        <li key={index}>
                            Name: {highscore.name} | Score: {highscore.score}
                        </li>
                    ))}
                </ol>
            </div>
        );
    }
}