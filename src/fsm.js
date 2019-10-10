class FSM {
    /**
     * Creates new FSM instance.
     * @param config
     */
    constructor(config) {
        if (config) {
            this.config = config;
            this._undo = [];
            this._redo = [];
            this.state = config.initial;
        } else {
            throw new Error('FSM required configuration data');
        }
    }

    /**
     * Returns active state.
     * @returns {String}
     */
    getState() {
        return this.state;
    }

    /**
     * Goes to specified state.
     * @param state
     */
    changeState(state) {
        if (this.config.states.hasOwnProperty(state)) {
            this._undo.push(this.state);
            this.state = state;
            this._redo = [];
        } else {
            throw new Error('FSM has not this state');
        }
    }

    /**
     * Changes state according to event transition rules.
     * @param event
     */
    trigger(event) {
        let stateObj = this.config.states[this.state];
        if (stateObj.transitions.hasOwnProperty(event)) {
            this.changeState(stateObj.transitions[event]);
        } else {
            throw new Error('Event in current state isn\'t exist');
        }
    }

    /**
     * Resets FSM state to initial.
     */
    reset() {
        this.state = this.config.initial;
        this.clearHistory();
    }

    /**
     * Returns an array of states for which there are specified event transition rules.
     * Returns all states if argument is undefined.
     * @param event
     * @returns {Array}
     */
    getStates(event) {
        if (!event) {
            return Object.keys(this.config.states);
        } else {     
            let states = this.config.states;
            return Object.keys(states).filter(s=>states[s].transitions.hasOwnProperty(event));
        }
    }

    /**
     * Goes back to previous state.
     * Returns false if undo is not available.
     * @returns {Boolean}
     */
    undo() {
        if (this._undo.length > 0) {
            this._redo.push(this.state);
            this.state = this._undo.pop();            
        } else {
            return false;
        }
        return true;
    }

    /**
     * Goes redo to state.
     * Returns false if redo is not available.
     * @returns {Boolean}
     */
    redo() {
        if (this._redo.length > 0) {
            this._undo.push(this.state);
            this.state = this._redo.pop();
            return true;
        } else {
            return false;
        }
    }

    /**
     * Clears transition history
     */
    clearHistory() {
        this._undo = [];
        this._redo = [];
    }
}

module.exports = FSM;

/** @Created by Uladzimir Halushka **/
