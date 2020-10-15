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

    currentScoreLeaderboardWorthy(){
        if(this.state.highscores.length < 5) return true;
        let largerThanAtLeastOneEntry = false;
        this.state.highscores.forEach(highscore => {
            if(this.props.score > highscore.score) largerThanAtLeastOneEntry = true;
        })
        return largerThanAtLeastOneEntry;
    }

    // Save
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

        // Sort by score
        newHighscores.sort(function (a, b) {
            return b.score - a.score;
        });

        newHighscores = newHighscores.slice(0, 5)

        this.setState({ lastNameEntered: this.state.name, highscores: newHighscores }, () => {
            this.saveHighscores();
        });

    }

    render() {
        const NewHighscore = (props) => {
            if (!this.state.submitted && this.currentScoreLeaderboardWorthy()) {
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