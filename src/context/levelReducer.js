import {
	SET_LEVEL_MOOD,
	SET_LEVEL_NODE,
	SET_LEVEL_INVENTORY,
	SET_RESPONSES,
	SET_DECISION,
	CLEAR_GAME_DATA,
} from './levelActions';

const levelReducer = (state, action) => {
	const { type, payload } = action;
	switch (type) {
		case SET_LEVEL_MOOD:
			return {
				...state,
				mood: payload,
			};
		case SET_LEVEL_INVENTORY:
			return {
				...state,
				inventory: [payload, ...state.inventory],
			};
		case SET_LEVEL_NODE:
			return {
				...state,
				textNode: payload,
			};
		case SET_RESPONSES:
			return {
				...state,
				responses: payload,
			};
		case SET_DECISION:
			return {
				...state,
				decision: payload,
			};
		case CLEAR_GAME_DATA:
			return {
				textNode: null,
				mood: 'neutral',
				inventory: [],
				choices: [],
				responses: [],
				decision: '',
			};
		default:
			return state;
	}
};

export default levelReducer;
