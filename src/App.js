import React, { useContext, useLayoutEffect, useState, useEffect } from 'react';
import levelContext from './context/levelContext';
import { elementScrollIntoView } from 'seamless-scroll-polyfill';
import Modal from './Components/Modal';
import Footer from './Components/Footer';
import soundFile from './assets/noir.mp3';
import { FaVolumeMute, FaVolumeUp } from 'react-icons/fa';

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
	const textNodes = [
		{
			id: 1,
			text: `It's 3am, you are tired and you've got a headache that feels 10 times larger
				than your actual head. You've been running on stale coffee and nicotine gum for 2 straight days.
				You caught a case a week ago.  A mysterious letter asking you to look into a name. Jonathan Collins. 
				If the letter hadn't had 500 large in it, you probably would've laughed it off.  So you start asking
				around. Pretty soon, you keep spotting the same car following you. Now you're intrigued.  Who is
				this Jon guy? Someone wants you looking into him, and someone isn't happy that you are.  One of your old pals
				Marlow, told you to meet him here, at this crummy diner. Said for half the score he could crack your case wide open. He
				also said he'd be here an hour ago.  Suddenly, he bursts through the door. He's drenched from the rain.
				"WE GOTTA GET OUTTA TOWN OR WE'RE DEAD!`,
			options: [
				{
					text: `Slow down, slow down. Tell me what the problem is.`,
					mood: 'calm',
					requires: null,
					nextText: 2,
				},
				{
					text: `Keep your voice down, you sound like a lunatic!`,
					mood: 'tense',
					requires: null,
					nextText: 2,
				},
			],
		},
		{
			id: 2,
			text: `Marlow sits down roughly and begins looking out the diner windows like an agitated ferret. He grabs
			your coffee mug and drains it in one gulp. He starts talking in a hushed and gasping voice. "This guy you're looking
			into, it's bad, you've upset some powerful people, people who now want you dead! And now they're following
			me! It took me an hour just to shake 'em!" He pulls a file out from inside his raincoat. You notice the file
			is covered in blood...`,
			options: [
				{
					text: `Is that blood!? What did you do? I'm not touching that file!`,
					nextText: 3,
					requires: { mood: 'tense' },
				},
				{
					text: `Finally, some hard evidence! Should I be worried about all this blood?`,
					inventory: 'File',
					nextText: 4,
					requires: { mood: 'calm' },
				},
				{
					text: `I'm not in the mood for the theatrics Marlow - just gimme the file.`,
					inventory: 'File',
					nextText: 4,
					mood: 'neutral',
					requires: null,
				},
			],
		},
		{
			id: 3,
			text: `Marlow grabs you roughly by the shoulders. "Do you have any idea what I went through to get that!" 
			His eyes shift to the file on the table. "I thought this would be easy money - a quick 250 bucks. But this
			guy your mysterious benefactor wants you looking into, he's connected to something. There are a whole
			lot of people who don't want either of us to live to see the sun come up just for asking about him! You
			and me go way back and I'm telling you, you HAVE to see what's in this file!"`,
			options: [
				{
					text: `You think I'm paying you for some soggy, blood stained file, just because you and I go back? No chance.`,
					nextText: 5,
					requires: null,
				},
				{
					text: `First, just slow down! Tell me what happened, and we'll figure this out.`,
					mood: 'calm',
					nextText: 4,
					requires: null,
				},
			],
		},
		{
			id: 4,
			text: `Marlow wipes his mouth with the back of his hand. You suddenly realize it looks like he's aged 10 
			years since he walked in. "I got a tip from Fast Eddie, you know Eddie, to go see The Rook about this Collins guy
			you've been paid to look into. Eddie said The Rook could help, said The Rook used to run with him, 
			probably had some contact info or whereabouts." You know The Rook as a seedy information broker that got
			his nickname because of an unhealthy attachment to chess. Marlow goes on. "So anyway, 
			I get to The Rook's car shop and it's quiet.  Too quiet. I find The Rook out in back, he's gut shot.  The 
			Rook hands me this file and tells me to run - that we never should've asked about this Collins guy. Then I found..." 
			Marlow begins reaching for his pocket when the sound of breaking glass consumes the diner. Marlow slumps over in 
			the booth and the waitress starts screaming. You see red tail lights speeding away into the rain soaked night.`,
			options: [
				{
					text: `Your old friend is dead. No case is worth this. Time to leave before the cops show.`,
					nextText: 5,
					requires: null,
				},
				{
					text: `Marlow is dead. You've got a file at least. You should get back to your office before the cops show.`,
					requires: { mood: 'neutral', inventory: ['File'] },
					nextText: 6,
				},
				{
					text: `The cops will be here any minute - but Marlow was reaching for something wasn't he?`,
					mood: 'shook',
					nextText: 7,
					requires: null,
				},
			],
		},
		{
			id: 5,
			text: `Maybe being a private investigator was a bad idea. The cops show up just as you're trying to run 
			down the alley by the diner. They don't believe that you were just on 
			an evening jog. Now it looks like that mystery you were digging into 
			is never going to get solved...`,
			options: [
				{
					text: `You are arrested and disgraced. GAME OVER`,
					nextText: -1,
					requires: null,
				},
			],
		},
		{
			id: 6,
			text: `You barely get away from the scene before you hear the cops locking down the area. 
			You get back to your building and take the 
			stairs up to your small, cramped, office.  You close the blinds before turning on the light and opening Marlow's file.  
			It is still pretty wet from the all the rain. You gently open it up an start combing though the contents.  
			Looks like The Rook didn't have much on this Collins guy. There is a crumpled, old piece of paper on letterhead
			from a place called Secur-a-Doc. The paper has a small hologram logo on it and it references aisle number 126. There is 
			a strange word typed below the aisle refernce. "SURSYOT". The only other
			item in the file is business card for a company you've never heard of called "FPD LLC". The address on the 
			card is downtown. There's something written on the back. "Simulare".`,
			options: [
				{
					text: `The storage unit is sure to have some answers - it's time to find out what Marlow died for.`,
					nextText: 19,
					mood: 'determined',
					requires: { inventory: ['Key'] },
				},
				{
					text: `FPD is a total mystery - and total mysteries intrigue you.`,
					nextText: 9,
					mood: 'inquisitive',
					inventory: 'Business Card',
					requires: null,
				},
				{
					text: `Secur-a-Doc is like a bank for records - you've always wanted to rob a bank.`,
					nextText: 8,
					mood: 'aggresive',
					inventory: 'Secur-a-Doc Paper',
					requires: null,
				},
			],
		},
		{
			id: 7,
			text: `You can hear the police sirens approaching. the waitress is still screaming. You quickly start 
			feeling around in Marlow's pockets. The sirens seem impossible close - maybe this wasn't such a good
			idea. But then you feel it! There's something heavy in Marlow's left inner pocket. This must be what he
			was reaching for! You can literally hear the police cars barreling towards the diner. Finally you pull
			a key free from Marlow's jacket. The key has a keyring attached that you recognize. It's for a place
			called Lou Lou's.  It's a storage mall across the tracks that rents units. The key has the number
			126 etched into it.`,
			options: [
				{
					text: `There's gotta be something worth killing over at that storage unit. No time to waste!`,
					nextText: 19,
					mood: 'hasty',
					inventory: 'Key',
					requires: null,
				},
				{
					text: `Whoever killed Marlow could be waiting at that storage unit - the smart play is going 
					back to the office to read this file.`,
					nextText: 6,
					mood: 'careful',
					inventory: 'Key',
					requires: { inventory: ['File'] },
				},
			],
		},
		{
			id: 8,
			text: `You are thouroughly soaked as you approach the large glass doors of Secur-a-Doc. The doors are locked.  Of
			course they are, it's neary 4am.  This place had to be part of The Rook's file for a reason. Your 
			head is really pounding now. You are stressed, one of your friends is dead, and now this lead might 
			be dead too. In your frustration you pull on the doors violently.  So violently that a loud alarm 
			starts blaring from inside Secur-a-Doc. This could not have gone worse! 
			You glance feverishly around. There is a keypad by the door, 
			obviously there for members to enter their access codes to gain entry. There's also a heavy metal 
			garbage can just by the stairs.`,
			options: [
				{
					text: `You don't have much time, you need to smash the glass doors 
					open with the metal garbage can and get inside to aisle 126!.`,
					nextText: 11,
					mood: 'dramatic',
					requires: null,
				},
				{
					text: `The keypad has to be the way - entering the right keycode might disable the alarm.`,
					nextText: 10,
					mood: 'deliberate',
					requires: { inventory: ['Secur-a-Doc Paper'] },
				},
				{
					text: `This is a dead end and the cops will be here any minute - best to go back to the office
					and read the file again.`,
					nextText: 6,
					mood: 'scared',
					requires: null,
				},
				{
					text: `Enough fooling around - it's time to check out this storage locker.`,
					nextText: 19,
					mood: 'exasperated',
					requires: { inventory: ['Key'] },
				},
			],
		},
		{
			id: 9,
			text: `The rain is still coming down in buckets as you approach a nondescript building in the red light
			district. There isn't even a sign. The only indicator that this is FPD LLC is a small buzzer next to the
			door with a plastic label that has a faded embossing of FPD on it.  You pull on the door, but it's locked
			tight. You notice there's a security camera watching you from the corner above the door. You wave at it, but 
			nothing happens.  You finally press the buzzer and a voice that sounds like it's been run through gravel says
			"State your name".`,
			options: [
				{
					text: `You state your name and that you are a P.I. - honesty is the best policy.`,
					nextText: 13,
					mood: 'honest',
					requires: null,
				},
				{
					text: `The back of the card. "Simulare". That's latin for pretend. You say you're Jonathan Collins.`,
					nextText: 14,
					mood: 'imposter',
					requires: null,
				},
			],
		},
		{
			id: 10,
			text: `The keypad is not just numeric - it's a full keyboard. My god the passkey could be anything! You do not 
			have much time before the cops are going to rain on your already rainy parade.  Think! THINK!`,
			options: [
				{
					text: `The Secur-a-Doc paper from the file has that weird word on it - try "SURSYOT"`,
					nextText: 16,
					mood: 'thoughtful',
					requires: { inventory: ['Secur-a-Doc Paper'] },
				},
				{
					text: `Try "Password"`,
					nextText: 16,
					mood: 'ridiculous',
					requires: null,
				},
				{
					text: `The Secur-a-Doc paper from the file has that weird word on it but also a number - try "SURSYOT126"`,
					nextText: 17,
					mood: 'big brain',
					requires: { inventory: ['Secur-a-Doc Paper'] },
				},
			],
		},
		{
			id: 11,
			text: `The jackhammer in your head is relentless and you don't have time for this! In a fury you 
			grab the heavy metal garbage can, take a few steps back, and heave it through the glass doors of 
			Secur-a-Doc.  The glass shatters easliy and the alarm continues to blare. You dash inside towards the 
			main chamber and notice there are only 20 or so aisles. There's no aisle 126! How can this be? You 
			hurridly start running from aisle to aisle but each aisle is secured with ANOTHER keypad! The disbelief 
			only just starts to set in as the police storm past the broken doors of Secur-a-Doc, guns raised. As
			you are being loaded into the back of squad car, you can't help but feel you were setup and that Marlow 
			died for nothing.`,
			options: [
				{
					text: `Good luck explaining all this to the judge. GAME OVER`,
					nextText: -1,
					requires: null,
				},
			],
		},
		{
			id: 12,
			text: `You're head is in a fog as you walk through the rain back to the diner. You have a very, very,
			bad feeling about this. Why did this Collins guy make a secret recording of Marlow and someone else
			talking about digging up his past? All you know is that nothing is as it seems, and nothing confirms 
			that more than walking up to the diner where Marlow died earlier - and seeing that the diner looks 
			as good as new. No broken window, no dead body, no cops, and a new waitress behind the counter. As you
			are standing there in disbelief, you don't even see the bike messenger ride up to you. "Hey! Package 
			for you! You're the PI right? Guy said you'd be here. Literally right here. Said you'd be in shock too. 
			Kinda creepy how right he was. Anyway, here you go!" He hands you a small box and rides away. Now you are
			in an even deeper state of disbelief. You open the box in the pouring rain. There's a plastic bag with 
			a small circuit board inside, and a picture of the circuit board hooked into an electrical box beside 
			a storage unit door marked 126. The logo on the door is Lou Lou's Storage. There's one more thing 
			in the box.  It's a chess piece. It's a Rook.`,
			options: [
				{
					text: `Enough is enough, it's time to go to this storage unit`,
					nextText: 19,
					inventory: 'Circuit Board',
					requires: { inventory: ['Key'] },
				},
				{
					text: `I need to head out to Rook's place and find out what's really going on here.`,
					nextText: 22,
					inventory: 'Circuit Board',
					requires: null,
				},
			],
		},
		{
			id: 13,
			text: `The man with a voice like gravel tells you to enter and buzzes you in.  There is a small and 
			cozy reception area just beyond the vestibule.  There are some fashion magazines spread out on
			a tiny coffee table set between four plush chairs. The man behind the reception desk beckons you over.  "Welcome to FPD - please sign in." 
			He passes you a clipboard with a single sheet of paper that asks for a name and a time of visit. Looks like you
			are the sole visitor today.  You awkwardly sign your name and set the time at just after 4am.  The man 
			makes a movement indicating that you take a seat.  There's muzak being piped through a speaker system. 
			Eventually, a well dressed man steps out and asks that you follow him. He shows you to small room - not 
			unlike an examination room, except there's no medical equipment.  There is just a small desk, a lamp and
			two chairs. "Please wait here for your consultation." You begin to ask just what this is all about, but the
			man has already exited the room. To your horror, you hear him lock you in. You frantically begin pulling on the
			door, but it doesn't budge. The muzak cuts out and all you can hear is the distinct hiss of gas being 
			pumped into the room through the ventilation system. The last thing you remember is your pounding headache, and 
			the feeling that you'll probably never wake up.`,
			options: [
				{
					text: `You really thought you were finally getting somewhere. GAME OVER`,
					nextText: -1,
					requires: null,
				},
			],
		},
		{
			id: 14,
			text: `The buzzer sounds and you open the door to FPD LLC.  The interior reminds you of a dentist office.
			The large man behind the reception desk steps out and approaches you. You know this office is connected
			to this Jonathan Collins guy, you just don't know how.  And you're banking on the hope that anyone in here
			has never actually met him.  "Mr. Collins, welcome. I have you listed as a cobalt member." You give a 
			single nod and hope that it was convincing.  "Excellent. As a cobalt member the access to your vault 
			room is granted by validation of the security method you set up at account opening." The very large 
			man holds out his hand expectantly.`,
			options: [
				{
					text: `You hand him the Secur-a-Doc Paper. Maybe that weird word is a password too?`,
					nextText: 18,
					requires: { inventory: ['Secur-a-Doc Paper'] },
				},
				{
					text: `You grab the large man's hand and do the "Super Snap Double Pump Explode" - a secret handshake
					you invented in middle school.`,
					nextText: 15,
					requires: null,
				},
				{
					text: `You hand him the FPD LLC card. Maybe that writing on the back is a password too?`,
					nextText: 15,
					requires: null,
				},
			],
		},
		{
			id: 15,
			text: `The large man stares at you for several tense seconds. He smiles broadly and you breathe a
			massive sigh of relief. Unfortunately, as he pulls a pistol from his holster and places it against
			your forehead, you can't help but think that big sigh was the last breathe you'll ever get to take.`,
			options: [
				{
					text: `Pretty sure you failed the security validation. GAME OVER`,
					nextText: -1,
					requires: null,
				},
			],
		},
		{
			id: 16,
			text: `The keypad buzzes loudly and displays a message saying "Invalid Entry Code". You may not get
			too many more tries at this before the cops show up! Better try another code - FAST!`,
			options: [
				{
					text: `You hit the reset button the keypad`,
					nextText: 10,
					requires: null,
				},
			],
		},
		{
			id: 17,
			text: `"Entry Code - Accepted" Finally, the alarm goes silent and you hear a click as the Secur-a-Doc
			doors unlock.  You step inside and see small chamber - too small to hold 126 aisles! You pull out the
			Secur-a-Doc Paper once again and read it over.  Aisle 126.  As you look at the aisle labels you realize 
			each aisle is subdivided by section. There's no aisle 126, but there is an aisle 12-6. That has to be it!
			The section is secured by the same kind of keypad out front - on a whim, you enter the same code and the
			locking mechanism clicks open.  Inside the document storage locker there is a single file marked "Toys R Us". 
			My god, that's the word on the paper, just reversed.  The file looks to be an employment record. **Jonathan 
			Collins - employed 2000 - 2004. Title: Store Manager and World Leader (actual title). Accomplishments: 
			Created a Ticketing system for bicycle repair orders using Visual Basic.** Once again, you can hear 
			police sirens approaching, they must checking out the alarm after all! It's not much to go on, but it 
			is more than you had before. There has got to be more to this puzzle! Time to get out of here and 
			head back to the office before you get put in cuffs!`,
			options: [
				{
					text: `**Acquired Toys R Us Employment Record**`,
					nextText: 6,
					inventory: 'TRU Record',
					requires: null,
					record: 'ToysRUs',
				},
			],
		},
		{
			id: 18,
			text: `The large man takes the Secur-a-Doc Paper from you.  He makes a quick move towards his pistol
			holster and you think your little game of imposter is about to be all over.  But instead, he grabs 
			for some kind of scanner that 
			sits in another holster, just behind the pistol.  He uses the device to scan the hologram on the 
			Secur-a-Doc Paper. He seems satisfied with the readout, and hands it back to you. "Very good Mr. Collins. 
			Right this way please." He 
			leads you to a small office door, number 126. "Take all the time you need." He then vanishes back 
			down the hall.  Apparently the most secure vaults, are the ones disguised as medical offices. You enter
			the small, spartan, room and begin to look around. There is only a desk. You quickly start searching the
			drawers. You find an old cassette deck - there's a tape inside. You press play. The tape crackles to life.
			It's clearly a bugged conversation between two people that didn't know they were being listened to. 
			A familiar voice fills your ears. "Look, stop worrying. I'll find the guy. 
			The furthest I could get on his past was the finance job.  This Collins guy was a
			broker - has a Financial Industry Regulatory Authority record and everything. Worked with HSBC Bank, First
			Niagara, Linsco Private Ledger and Key Bank between 2004 and 2014. I've got a P.I. friend that should be 
			able to dig up more." The tape cuts out there. That voice. That was Marlow. You need to get back to the
			diner pronto. You've got a very bad feeling...`,
			options: [
				{
					text: `**Acquired Finance Employment Record**`,
					nextText: 12,
					inventory: 'Finance Record',
					requires: null,
					record: 'HSBC/Finance',
				},
			],
		},
		{
			id: 19,
			text: `Lou Lou's Storage looms out of the rainy darkness like a glowing, hot pink, oasis. This time of 
			night the place is completely empty save for the giant pink neon sign. You approach unit 126. You fish 
			the unit key from your pocket. There's a large electrical box next to the door, and the door has a thick 
			padlock attached to it.`,
			options: [
				{
					text: `Unlock the padlock and open the door. Time to find out what secrets lay beyond.`,
					nextText: 20,
					mood: 'daring',
					requires: { inventory: ['Key'] },
				},
				{
					text: `That's the electrical box from the picture - probably best to hook up the circuit board before 
					trying the lock.`,
					nextText: 21,
					mood: 'legend',
					requires: { inventory: ['Circuit Board', 'Key'] },
				},
				{
					text: `Keys are overrated - bash the lock!`,
					nextText: 20,
					requires: null,
				},
			],
		},
		{
			id: 20,
			text: `Just as you begin to raise the door after dealing with the padlock, you hear the hot sizzle of the 
			large electrical box next to the door. It occurs to you that someone must have rigged the door as 
			some kind booby trap. The electrical box explodes and sends an untold number of volts and amps through
			your body. You are thrown nearly 20 feet backwards into the door of another unit. The rain helps
			to extinguish your electrified corpse.`,
			options: [
				{
					text: `Quite the shocking ending. GAME OVER.`,
					nextText: -1,
					requires: null,
				},
			],
		},
		{
			id: 21,
			text: `You carefully attach circuit board in the same way as the picture indicates. Once it's hooked up,
			a light on the board goes green. You bend down and unlock the massive padlock.  As you open the door to 
			the unit a flourescent bulb flickers to life inside the unit. The unit is completely empty, but for a 
			small cell phone in the center of the unit. It rings the moment you see it.  You approach gingerly, 
			almost expecting it explode. The caller ID lists the number as "Unknown". You hit answer. "Hello 
			there Private Investigator. I'm the man you were hired to find, my name is Jonathan Collins. I think 
			by now you've realized your "friend" Marlow was anything but. He's been trying to track me down for 
			some time. He wants to hire me for some kind of job. I started as a System Admin, and was promoted to Developer at a 
			global logistics company called Lineage Logistics since 2020, and honestly, I only like to work for 
			the heroes, not the villians.  So I've been trying to hide my past as much as possible from Marlow. 
			You've uncovered a lot about me tonight, but there's so much more. But for now, you need to run. 
			Marlow is still out there, and he'll be hunting both of us now. Don't worry, I'll leave you some 
			more clues. I know you like to follow things through till the end, I'm the same way.  Be talking to
			you real soon Investigator." Taped to the bottom of the phone is plane ticket to New York. Looks like 
			this mystery is just getting started!`,
			options: [
				{
					text: `**Acquired Lineage Employment Record** Reached the Final Level! But did you
					find all the employment records? GAME OVER.`,
					nextText: -1,
					requires: null,
					record: 'Lineage Logistics',
				},
			],
		},
		{
			id: 22,
			text: `Rook's place is quiet as a tomb. You half expected there to be cops everywhere. You carefully
			make your way inside the darkened building. You slide along the shadows until you reach Rook's office.
			Just like Marlow said, Rook is laying on the floor, gunshot wound to the stomach. But much to your surprise,
			Rook is still breathing.  You rush over. Rook coughs several times. Wet, bloody coughs. He doesn't have long. 
			"Hey, its the Private Investigator, and look at that. You're not dead. Wish I could say the same for me. I was
			going to warn you. Warn you that it was Marlow that hired you in the first place. Warn you that Marlow just wanted 
			you to uncover as much as you could about this Collins guy. Warn you that he was going to fake his own death to
			motivate you, and then once he got what he needed he was going to kill you too.  But Marlow got wind I knew 
			about his little plan, so he snuck in here and shot me." Rook looks bad, real bad. "Did you get the storage
			unit key? You gotta get there, you gotta get there before Marlow. And one more thing. Marlow didn't realize that 
			I actually worked with Jon at a place called Maines Paper and Food - here take this." Rook hands you an employment record. 
			"Jon was data specialist and programmer. He built a truck tracker with integrated email notifications and a program
			dashboard with workflow capabilities similar to Trello Boards. I worked with him there from 2014 to 2020. Then 
			I got into the data broker game. That didn't work out for me did it?" Rook laughs, coughs, and then slips away. 
			Marlow was behind this whole thing. Behind it all. Pulling the string the whole time. It's time to get to the 
			storage unit. Can't let Marlow get there first.`,
			options: [
				{
					text: `**Acquired Maines Employment Record**`,
					inventory: 'Maines Record',
					nextText: 19,
					requires: null,
					record: 'Maines',
				},
			],
		},
	];
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

	useEffect(() => {
		if (endGame) {
			setContent({
				title: 'End Game Results',
				body: records,
				type: 'dismiss',
				icon: '/assets/newspaper.png',
			});
			setShow(true);
		}
	}, [endGame]);

	// Text Decision Game Logic - handles player choices and updates various states based on node route

	const handleChoice = (option) => {
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
		elementScrollIntoView(document.getElementById('scrollTarget'), {
			behavior: 'smooth',
		});
	};

	// Start function
	const startAdventureGame = () => {
		clearGameData();
		setTheNode(1);
	};

	// Use Layout Effect to prevent component flashes on updates - sets new textnode and responses

	useLayoutEffect(() => {
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
			return shouldShow;
		};
		const showTextNode = (textNodeIndex) => {
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
		showTextNode(theNode);
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
							<FaVolumeUp size={'2.4rem'} />
						) : (
							<FaVolumeMute size={'2.4rem'} />
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
