import createGame from './createGame';

import State from './state';

import UI from './ui';

window.onload = () => {

    // Global State
    const state = new State({});

    //UI
    const ui = new UI(state);

    state.game = createGame(state, ui)


}