import React, { useContext, useLayoutEffect, useState, useEffect } from 'react';
import levelContext from './context/levelContext';
import { elementScrollIntoView } from 'seamless-scroll-polyfill';
import Modal from './Components/Modal';
import Footer from './Components/Footer';
import soundFile from './assets/noir.mp3';
import { FaVolumeMute, FaVolumeUp } from 'react-icons/fa';
import nodes from './textNodes';

function App() {
	const {
		textNode,
		mood,
		inventory,
		responses,
		decision,
		records,
		setLevelMood,
		setLevelInventory,
		setLevelNode,
		setResponses,
		setDecision,
		clearGameData,
		clearResponses,
		setRecords,
	} = useContext(levelContext);
	const [theNode, setTheNode] = useState();
	const [btnDisabled, setBtnDisabled] = useState(false);
	const [show, setShow] = useState(true);
	const [endGame, setEndGame] = useState(false);
	const [myAudio, setMyAudio] = useState();
	const [playing, setPlaying] = useState(false);
	const [content, setContent] = useState({
		title: 'Play game audio',
		body: 'Would you like game audio to play during your session?',
		type: 'decision',
		icon: '/assets/newspaper.png',
	});
	const textNodes = nodes;

	// Game audio section - useEffect to play and loop

	useEffect(() => {
		if (myAudio !== undefined) {
			myAudio.play();
			myAudio.loop = true;
		}
	}, [myAudio]);

	// Start game audio by setting state audio object to new audio and setting state playing to true
	const startAudio = () => {
		if (myAudio === undefined) {
			const url = soundFile;
			setMyAudio(new Audio(url));
		} else {
			myAudio.play();
		}
		setPlaying(true);
	};
	// Stop/Pause game audio when state audio is not undefined - set state playing to false
	const stopAudio = () => {
		if (myAudio !== undefined) {
			myAudio.pause();
		}
		setPlaying(false);
	};
	// Creating a toggle here so player has control via a button I'll add to UI
	const toggleSound = () => {
		playing ? stopAudio() : startAudio();
		setPlaying(!playing);
	};
	// Audio Modal HandleClose function at start of game to allow users to start audio at outset
	const handleClose = (decision) => {
		setShow(false);
		if (decision) {
			startAudio();
		}
	};
	// Quikc function to check if user minimized tab on mobile or desktop - stopAudio called if true
	const handleVisibilityChange = () => {
		if (document.hidden) {
			stopAudio();
		}
	};
	document.addEventListener('visibilitychange', handleVisibilityChange, false);

	// End Game Audio Section

	// Display End Game Modal
	const handleDismiss = () => {
		setShow(false);
		setEndGame(false);
		startAdventureGame();
	};

	const handleEndGame = () => {
		setContent({
			title: 'End Game Results',
			body: records,
			type: 'dismiss',
			icon: '/assets/newspaper.png',
		});
		setShow(true);
	};

	useEffect(() => {
		if (endGame) {
			handleEndGame();
		}
	}, [endGame]);

	// Text Decision Game Logic - handles player choices and updates various states based on node route

	const handleChoice = (option) => {
		setBtnDisabled(true);
		elementScrollIntoView(document.getElementById('scrollTarget'), {
			behavior: 'smooth',
		});
		setTimeout(() => {
			if (option.nextText === -1) {
				if (!!option.record) {
					setRecords(option.record);
				}
				return setEndGame(true);
			}
			if (!!option.record) {
				setRecords(option.record);
			}
			if (!!option.mood) {
				setLevelMood(option.mood);
			}
			if (!!option.inventory && !inventory.includes(option.inventory)) {
				setLevelInventory(option.inventory);
			}
			setDecision(option.text);
			setTheNode(option.nextText);
			setBtnDisabled(false);
		}, 800);
	};

	// Start function
	const startAdventureGame = () => {
		clearGameData();
		setBtnDisabled(false);
		setTheNode(1);
	};

	// Use Layout Effect to prevent component flashes on updates - sets new textnode and responses

	const showOption = (option) => {
		let shouldShow = false;
		if (option.requires === null) {
			shouldShow = true;
		}
		if (!!option.requires?.mood && option.requires?.mood === mood) {
			shouldShow = true;
		}
		if (
			!!option.requires?.inventory &&
			option.requires?.inventory.every((item) => inventory.includes(item))
			//inventory.includes(option.requires?.inventory)
		) {
			shouldShow = true;
		}
		if (
			!!option.disabled?.inventory &&
			option.disabled.inventory.every((item) => inventory.includes(item))
		) {
			shouldShow = false;
		}
		return shouldShow;
	};

	const showTextNode = () => {
		let textNodeIndex = theNode;
		clearResponses();
		const currentNode = textNodes.find((node) => node.id === textNodeIndex);
		setLevelNode(currentNode);
		let availableResponses = [];
		currentNode?.options.forEach((option) => {
			if (showOption(option)) {
				availableResponses.push(option);
			}
		});
		setResponses(availableResponses);
	};

	useLayoutEffect(() => {
		showTextNode();
	}, [theNode]);
	useLayoutEffect(() => {
		startAdventureGame();
	}, []);

	// *******************************************

	return (
		<div className='App'>
			<header className='header'>
				<a href='https://jcodes.page'>
					<img
						className='header-logo'
						src='/assets/jcodesGameSm.png'
						width='100'
						height='100'
						alt='jcodes logo'
					/>
				</a>
				<div>
					<button className='soundToggle' onClick={toggleSound}>
						{playing ? (
							<FaVolumeUp size={'24px'} />
						) : (
							<FaVolumeMute size={'24px'} />
						)}{' '}
						sound
					</button>
				</div>
			</header>
			{textNode !== null && responses.length > 0 ? (
				<>
					<section>
						<div className='hero'>
							<h1>Resume Noir</h1>
							<h6 className='subtext'>text adventure</h6>
						</div>
					</section>
					<main className='main'>
						{!!mood && (
							<div className='levelDetails' id='scrollTarget'>
								<div>
									<p>Mood: </p>
									<p>{mood}</p>
								</div>

								<p>Inventory: </p>
								{inventory.length > 0 ? (
									inventory.map((item) => <p key={Math.random()}>{item}</p>)
								) : (
									<p>empty</p>
								)}
							</div>
						)}
						<div className='adventureText' id='text'>
							{decision !== '' && (
								<span className='white-span'>{decision}</span>
							)}
							<p>{textNode.text}</p>
						</div>
						<div className='adventureResponse'>
							<p className='direction'>Make your choice</p>
							{responses.length > 0 &&
								responses.map((option, index) => {
									return (
										<button
											key={Math.random()}
											disabled={btnDisabled}
											className='btn adentureChoice'
											onClick={(e) => handleChoice(option)}>
											{option.text}
										</button>
									);
								})}
						</div>
					</main>
					<Footer />
				</>
			) : (
				<div
					style={{
						minHeight: '100vh',
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
					}}>
					...
				</div>
			)}
			<Modal
				show={show}
				handleClose={handleClose}
				handleDismiss={handleDismiss}
				content={content}
			/>
		</div>
	);
}

export default App;
