import React, { useReducer } from 'react';
import LevelContext from './levelContext';
import levelReducer from './levelReducer';
import {
	SET_LEVEL_MOOD,
	SET_LEVEL_NODE,
	SET_LEVEL_INVENTORY,
	SET_RESPONSES,
	CLEAR_RESPONSES,
	SET_DECISION,
	CLEAR_GAME_DATA,
	UPDATE_RECORDS,
} from './levelActions';

const LevelState = ({ children }) => {
	const initialState = {
		textNode: null,
		mood: 'neutral',
		inventory: [],
		responses: [],
		decision: '',
		records: {
			ToysRUs: false,
			'HSBC/Finance': false,
			Maines: false,
			'Lineage Logistics': false,
		},
	};

	const [state, dispatch] = useReducer(levelReducer, initialState);

	// Level Functions

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
	// Clear Level Responses
	const clearResponses = () => {
		dispatch({
			type: CLEAR_RESPONSES,
		});
	};
	// Set Level Decision
	const setDecision = (decision) => {
		dispatch({
			type: SET_DECISION,
			payload: decision,
		});
	};
	// Set Records
	const setRecords = (recordToUpdate) => {
		dispatch({
			type: UPDATE_RECORDS,
			payload: recordToUpdate,
		});
	};
	// Clear game data to initial state
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
				responses: state.responses,
				decision: state.decision,
				records: state.records,
				setLevelMood,
				setLevelNode,
				setLevelInventory,
				setResponses,
				setDecision,
				clearGameData,
				clearResponses,
				setRecords,
			}}>
			{children}
		</LevelContext.Provider>
	);
};

export default LevelState;
