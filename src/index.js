import React from 'react';
import LevelState from './context/LevelState';
import ReactDOM from 'react-dom';
import App from './App';

ReactDOM.render(
	<LevelState>
		<App />
	</LevelState>,
	document.getElementById('root')
);
