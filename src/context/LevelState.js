import React, { useReducer } from 'react';
import LevelContext from './levelContext';
import levelReducer from './levelReducer';
import {
	SET_CHOICES,
	SET_LEVEL_MOOD,
	SET_LEVEL_NODE,
	SET_LEVEL_INVENTORY,
	SET_RESPONSES,
	SET_DECISION,
	CLEAR_GAME_DATA,
} from './levelActions';

const LevelState = ({ children }) => {
	const initialState = {
		textNode: null,
		mood: 'neutral',
		inventory: [],
		choices: [],
		responses: [],
		decision: '',
	};

	const [state, dispatch] = useReducer(levelReducer, initialState);

	// Level Functions

	// Set Choices

	const setChoices = (choiceArr) => {
		dispatch({
			type: SET_CHOICES,
			payload: choiceArr,
		});
	};

	// Set Level Mood
	const setLevelMood = (details) => {
		dispatch({
			type: SET_LEVEL_MOOD,
			payload: details,
		});
	};
	// Set Level Node
	const setLevelNode = (node) => {
		dispatch({
			type: SET_LEVEL_NODE,
			payload: node,
		});
	};
	// Set Level Inventory
	const setLevelInventory = (items) => {
		dispatch({
			type: SET_LEVEL_INVENTORY,
			payload: items,
		});
	};
	// Set Level Responses
	const setResponses = (responses) => {
		dispatch({
			type: SET_RESPONSES,
			payload: responses,
		});
	};
	// Set Level Decision
	const setDecision = (decision) => {
		dispatch({
			type: SET_DECISION,
			payload: decision,
		});
	};
	const clearGameData = () => {
		dispatch({
			type: CLEAR_GAME_DATA,
		});
	};
	return (
		<LevelContext.Provider
			value={{
				textNode: state.textNode,
				mood: state.mood,
				inventory: state.inventory,
				choices: state.choices,
				responses: state.responses,
				decision: state.decision,
				setChoices,
				setLevelMood,
				setLevelNode,
				setLevelInventory,
				setResponses,
				setDecision,
				clearGameData,
			}}>
			{children}
		</LevelContext.Provider>
	);
};

export default LevelState;
