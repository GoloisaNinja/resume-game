import React, { useContext, useLayoutEffect, useState, useEffect } from 'react';
import levelContext from './context/levelContext';

function App() {
	const {
		textNode,
		mood,
		inventory,
		responses,
		decision,
		setLevelMood,
		setLevelInventory,
		setLevelNode,
		setResponses,
		setDecision,
		clearGameData,
		clearResponses,
	} = useContext(levelContext);
	const [theNode, setTheNode] = useState();
	const textNodes = [
		{
			id: 1,
			text: `It's 3am, you are tired and you've got a headache that feels 10 times larger
				than your actual head. You've been running on stale coffee and nicotine gum for 2 straight days.
				The crummy little diner you find yourself in, on this cold and rainy night, does serve food. But calling
				it food would proabaly be a stretch.  You asked one of your informants to meet you here.  You've been tracing 
				down a lead
				for several months in connection with your biggest case - and you finally caught a break.  
				You got a name.  Just a name.
				It's not much, but it's a place to start.  Your informant took the name and was supposed to pass it around his underworld contacts.  Shake some trees.  
				He should've been here an hour ago. Just 
				as you are thinking of getting up to call him from the diner payphone, he bursts through the door, causing 
				the bell on the door to nearly fall off the string
				it's attached to and making the waitress jump about 3ft out of her skin.  He runs over to you wild-eyed.  "JUST WHAT HAVE YOU GOTTEN ME INTO!?"`,
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
			text: `You stand up a little and gesture for your informant 
				to sit down.  He looks crazed.  He is soaking wet - obviously been out in the rain a while.  You notice 
				he has a black eye, a busted lip, and the breast pocket of his rain coat is ripped - but maybe it was 
				always that way.  Your infomant isn't known for his fashion sense.  You slide your mug of stale coffee towards 
				him and he drains it in one go.  "Just look into this name you told me, just see what you can find out. 
				Easy job. Good money. IT'S NEVER GOOD MONEY AND EASY AT THE SAME TIME!
				Well I found something out alright - AND IT'S GOING TO GET US BOTH KILLED! Just take a look at this!"  
				He removes a soaking wet file from the depths of his torn rain coat.  He slides it towards you.  The file looks like its seen better days.  
				The left corner is torn and there are several blood spatters and coffee mug rings randomly disbursed across the front.`,
			options: [
				{
					text: `Is that blood!? What did you do? I'm not touching that file!`,
					nextText: 3,
					requires: { mood: 'tense' },
				},
				{
					text: `Finally, some hard evidence! Should I be worried about your face?`,
					inventory: 'File',
					nextText: 4,
					requires: { mood: 'calm' },
				},
				{
					text: `I'll take the file, but why don't you just give me the short version slimeball.`,
					inventory: 'File',
					nextText: 4,
					mood: 'neutral',
					requires: null,
				},
			],
		},
		{
			id: 3,
			text: `From the look of your informant, he's been through hell and back to get whatever is in that file.  
			But you're just a private investigator, the last thing you need in your life is to be connected to physical
			evidence of an assault or worse.  You can feel your blood pressure rising and the adrenaline kicking in. You
			are tense and on edge and you know it.  Your informant starts yelling again.  "YOU SENT ME INTO THE DEEPEST
			DARKEST HOLES I KNOW TO GET YOU INFO ON THAT NAME, I GOT BEATEN TO WITHIN AN INCH OF MY LIFE - AND NOW YOU AINT EVEN GONNA LOOK AT IT??  OH THAT IS RICH! 
			YOU KNOW WHAT? I DON'T EVEN CARE, TAKE THE FILE, DON'T TAKE THE FILE. I DID MY PART, NOW YOU PAY ME MONEY!  I NEED
			TO GET OUT OF TOWN. TONIGHT! AND YOU KNOW WHAT, YOU SHOULD TOO!`,
			options: [
				{
					text: `You think I'm paying you for some soggy, blood stained file, just because you took a few punches?`,
					nextText: 5,
					requires: null,
				},
				{
					text: `Will you please just slow, down! Tell me what happened, and we'll figure this out.`,
					mood: 'calm',
					nextText: 4,
					requires: null,
				},
			],
		},
		{
			id: 4,
			text: `Your informant starts talking to you 
			in hushed tones.  "I had to go to Eddie's on fourth.  You know the place.  
			Eddie and his guys tuned me up pretty good just for asking about that name you're so hot and bothered about.  He and 
			his guys got some call and took off.  If one of Eddie's girls hadn't come along, I'd still
			be zip-tied to a support beam.  Anyway, before I left Eddie's shop, I took a peek in his files, the ones he keeps 
			in his office. I thought I'd just find some files, turns out Eddie had more than just files."  
			Your informant starts reaching into his raincoat again.
			You hear the sound of breaking glass first.  Then your informant slumps over in the booth.  Then the shrill screams 
			of the waitress ring out.  The last noise you hear before the crummy little diner goes as silent as a tomb, is the sound of screeching tires, and 
			an engine revving as a car barrels away into the night.`,
			options: [
				{
					text: `Your informant is dead. No case is worth this. Time to leave before the cops show.`,
					nextText: 5,
					requires: null,
				},
				{
					text: `You are in shock, but the adrenaline has you laser focused. Your informant was reaching for something - you could check...`,
					inventory: 'Key',
					mood: 'shook',
					nextText: 7,
					requires: null,
				},
				{
					text: `Well - this night could've gone better, especially for your informant. At least you got the file - back to the office before the cops show.`,
					requires: { mood: 'neutral', inventory: 'File' },
					nextText: 6,
				},
			],
		},
		{
			id: 5,
			text: `Maybe being a private investigator was a bad idea. The cops show up just as you're trying to run 
			down the alley by the diner. It's going to be a long night, and it looks like that mystery you were digging into 
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
			text: `You barely got away from the scene before you heard the cops locking down the area. You get to your building and take the 
			stairs up to your small, cramped, office.  You close the blinds before turning on the light to read the file.  It 
			is still pretty wet - but thankfully the documents are still readable.  Looks like Eddie was looking into this Jonathan 
			Collins character, same as you.  Eddie had tracked him down to the Empire State and was trying to recruit him. 
			For that he needed more details on this Collins guy's background.  There's a sticky note with an address on it - looks like the county records building 
			downtown - the sticky note has a number on it, but it's too short to be a phone number.  There's also a card with a number on it - card just says TRU LTD. 
			This number is too long to be a phone number...`,
			options: [
				{
					text: `County records building won't be open for hours - I could break in and have a look around.`,
					nextText: 8,
					mood: 'aggresive',
					inventory: 'Sticky Note',
					requires: null,
				},
				{
					text: `I recognize this TRU LTD - pretty sure Delores used to run the phones for them. I should drop by her place.`,
					nextText: 9,
					mood: 'inquisitive',
					inventory: 'Business Card',
					requires: null,
				},
			],
		},
		{
			id: 7,
			text: `You can hear the police sirens approaching. the waitress is still screaming. You quickly start 
			feeling the front interior pockets of your dead informant's rain coat.  You feel something heavy inside 
			the lower left pocket.  The police sirens sound impossibly close now.  But you have to see this through! 
			Finally, you extricate a large key from the pocket.  The key has a keyring attached that says "Lou Lou's Storage" 
			on it.  You know that place!  It's downtown on the other side of the tracks - not the best part of town, but 
			Lou Lou's is a place that rents storage units.  The key has 126 etched into it.`,
			options: [
				{
					text: `There's gotta be something worth killing over at that storage unit. No time to waste!`,
					nextText: 10,
					mood: 'intruigued',
					requires: null,
				},
				{
					text: `Eddie could be heading to the storage unit...heading back to the office to read the file is the smart play.`,
					nextText: 6,
					mood: 'careful',
					requires: { inventory: 'File' },
				},
			],
		},
		{
			id: 8,
			text: `The last thing you need is more cops, but it's the County Records building, security can't be
			that intense.  After a very wet walk in the rain, you arrive at the building.  It's completely dark. 
			Workers won't start arriving for a few hours. You make your way around the back of the building - after working
			a case for a wife of one of the county clerks, you happen to know that this county clerk likes to take 
			unscheduled smoke breaks and usually leaves a book of matches blocking the latch of the door by the loading
			bay.  Sure enough, the door pulls right open.  Easy!  Too easy! Just because the door wasn't locked, doesn't
			mean that it still wasn't connected to an alarm!`,
			options: [
				{
					text: `Police are still on the other side of town, you might have a few minutes to look around.`,
					nextText: 11,
					mood: 'burgled',
					requires: null,
				},
				{
					text: `This is way too risky now - best just to head to the storage unit and take my chances with Eddie.`,
					nextText: 10,
					mood: 'life is short',
					requires: { inventory: 'Key' },
				},
				{
					text: `There was a business card from the file back at the office - I should go back there and grab it. Then go see Delores.`,
					nextText: 6,
					mood: 'careful',
					requires: null,
				},
				{
					text: `Suddenly a car screeches to a halt just behind you! It's Horton and Hazel! You jump in!`,
					nextText: 12,
					mood: 'wildcard',
					requires: null,
				},
			],
		},
		{
			id: 9,
			text: `Dolores and you go way back. She helps on cases from time to time. Still, it's probably best if
			you don't mention the diner.  You ring her apartment number and say it's you.  You can tell by how hard 
			she hits the buzzer to let you in that she's not happy. "DO YOU KNOW WHAT TIME IT IS? MY GOD YOU ARE 
			SOAKING WET!" You tell her you're sorry, but it's important - you show her the card.  "Yeah, this is 
			from TRU alright. Toys R Us.  Place shut down years ago. You ask her about the number.  "Hold on - I'm 
			pretty sure that's an employee ID number.  I still have a bankers box around here somewhere with old 
			staff info - I used to run their phones 'ya know."  After some digging, she hands you a file marked with
			the employee number that matches the card.  Jonathan Collins - employed from year 2000 to 2004. Title: 
			Store Manager and World Leader of Action (actual title). Accomplishments include building a Bike Repair 
			Ticketing System using Visual Basic. "Looks like your guy was some kind of manager." This is too clean - there 
			has to be more. Delores notices your frustrated expression. "Look, if you need more, you could go talk to 
			Millie down at the speakeasy. When TRU closed down, she set a lot of those people up with jobs all over the 
			city. But you know Millie, just don't show up empty handed..."`,
			options: [
				{
					text: `Delores you are a genius - I should go see Millie at the underground bar - can I borrow a hundred bucks?`,
					nextText: 13,
					inventory: 'Money',
					mood: 'wealthy',
					requires: null,
				},
				{
					text: `Millie is nothing but trouble and chances are she'd just lie - I've got this storage key - time to go see what it unlocks. Can I borrow some wire?`,
					nextText: 10,
					inventory: 'Wire',
					mood: 'Millie is a pain',
					requires: { inventory: 'Key' },
				},
			],
		},
		{
			id: 10,
			text: `You head across town and cross the tracks to make your approach on foot. It's still raining
			cats and dogs and you can barely hear yourself think over the drenching sound of rushing water.  Lou Lou's 
			storage looks empty - no cars, and a bare minimum of lights.  What the hell, you only live once.  You dash 
			across the empty lot and make for unit 126.  You find it quickly enough and the key fits the unit lock.  You 
			hesitate only for a moment before raising the door. A fluorescent bulb flickers to life and shows and empty unit. 
			Empty save for one document in the center of the floor.  "It's not going to tell you much." A deep, gravely 
			voice says from behind you.  Horrified, you turn to see Eddie, flanked by several of his men.  "Knew you'd 
			come here. Knew you couldn't let it go."  No one moves. You can barely breathe. "They told me you were like 
			a dog with a bone, told me you don't let cases go. You're here about Jonthan Collins right?  You're here to find 
			out why his name keeps popping up in your cases.  That piece of paper - the one that you are going to die over, it 
			says that Jonathan Collins worked for a company called Maines Paper and Food.  Worked there between 2014 and 2020 
			as a data specialist and programmer.  He built a truck tracker with integrated emails using a complex Verizon GPS API. He also built and deployed 
			an integrated dashboard for account specialists that created an automated workflow process." You think about 
			telling Eddie that you CAN let this go - that it doesn't really matter. This Jonathan Collins sounds like a normal guy. 
			A nerd. A dork.  What could Eddie possible want with a guy like that?  "You are probably wondering what I could possibly want 
			with a guy like that. I need him to build me a website, maybe a Twitter bot.  It's all about the social media 
			these days."`,
			options: [
				{
					text: `Hey Eddie - LOOK BEHIND YOU!`,
					nextText: 16,
					mood: 'unwise',
					requires: null,
				},
				{
					text: `Do you like FireWorks Eddie?`,
					nextText: 17,
					mood: 'james bond',
					requires: { inventory: 'Wire' },
				},
			],
		},
		{
			id: 11,
			text: `You dash inside - there isn't going to be much time.  There's a computer terminal behind a large
			wooden desk just beyond the loading dock. Thankfully, it looks like a community terminal for the dock 
			staff and so it has the username and password taped to the monitor.  You access the main record database 
			and type in the short number from the sticky note.  A record for a Lineage Logistics comes up. It looks like 
			a global supply chain and logistics company.  The number also points to an Employee record for Jonathan Collins. 
			He's listed as a System Administrator and Developer.  Looks as though his main focuses at this company were Java, 
			MS SQL Server, and an enterprise system called SAP.  It appears he started working there in mid 2020 after another 
			employer was shut down due to the global pandemic.  You are just clicking to open a hidden folder named 
			"raspi_12617" when several armed police officers burst through chamber door.`,
			options: [
				{
					text: `Good luck explaining this to the judge. GAME OVER`,
					nextText: -1,
					requires: null,
				},
			],
		},
		{
			id: 12,
			text: `Horton smiles at you. "We heard you ran into trouble at the diner, and last we talked to that informant
			you've been dogging, he was working an angle at the records building - so we took a chance you'd be here." 
			Horton and Hazel are not what you'd call criminals, but they aren't exactly squeaky clean either. The brother/sister 
			duo are known for their love of holidays in the sun, and for their friendship with Millie.  Millie is an underground 
			speakeasy owner with her ear to the ground. Hazel speaks up from the backseat. "Millie told us to bring you to her, that 
			your going to get yourself killed if you keep poking around this case. Says she's got some answers for you.`,
			options: [
				{
					text: `Finally - something is going right tonight.`,
					nextText: 13,
					requires: null,
				},
			],
		},
		{
			id: 13,
			text: `You arrive at the speakeasy.  Despite the hour you can still hear the sound of music coming from below. 
			You need a password to get into the easy, that is unless Millie sent for you.  You knock on the heavy steel door 
			and a partition slides over, revealing two searching eyes.  Upon seeing you, the partition slams shut and the door opens. 
			"She's in the office." This is all the extremely large doorman says to you, and you don't press.  After a pat down, 
			you walk into Millie's office - she's all business.  "I'm looking at a dead person. DEAD. Do you even know what you
			are digging up? Oh I heard about the diner - got that poor fool killed and for what? A name, an address? You are chasing 
			ghosts. And I can't have you chasing THIS ghost. Now I MIGHT be willing to share some info, but you know 
			the house rules - you don't come to me empty handed. So what you got for me?"`,
			options: [
				{
					text: `Millie, you know me - normally I'd have something for you, but tonight has been rough!`,
					nextText: 14,
					mood: 'uh-oh',
					requires: null,
				},
				{
					text: `I've got the Millie Tax right here - how's one hundred large sound?`,
					nextText: 15,
					mood: 'flush',
					requires: { inventory: 'Money' },
				},
			],
		},
		{
			id: 14,
			text: `Millie almost smiles as she has a few of her goons drag you away. "You know the rules - you 
			know them all too well." The last thing you see is dark hood being put over your head.`,
			options: [
				{
					text: `Never break the house rules, it's a rule. GAME OVER`,
					nextText: -1,
					requires: null,
				},
			],
		},
		{
			id: 15,
			text: `One of Millie's goons grabs the hundred dollar bill from your hand and passes it to Millie.
			She positively seethes. 
			"You come to my club, my business, my EMPIRE, and you bring this?" The awkward silence in the 
			room settles into an uncomfortable quiet that feels like it actually has mass.  You and me go back, 
			so you know what I'm going to do? I'm going to give you just enough to keep your mind swirling around. 
			Because I'd hate to throw you in the hole I'm going to throw you in without something to think about." 
			You get up to try and leave - this was a bad idea, you knew Millie was trouble. But her goons have you 
			and there's no point trying to escape from what is probably 900lbs of goon. "You've been tracking this 
			Jonathan Collins right? He's been showing up in your cases right? A digital trace here, a name on flash 
			drive there. You don't know the half of it - you really don't. But here's something for you. Between 2004
			and 2014 he was in finance." She pulls out a small piece of paper with another number on it.  "See this? 
			This was his FINRA id. That's the Financial Industry Regulatory Authority.  He was a broker.  Worked for 
			global banks like HSBC and global broker dealers like Linsco Private Ledger. Word on the street is, that 
			even though he was in finance, his true passion was always programming. So he went off the financial grid 
			in 2014 for some kind of tech job. I don't know why you thought you 
			could investigate him and not draw attention to yourself. Doesn't matter now.  All you need to know is 
			that your investigation is OVER." As her goons are dragging you to god knows where, it hits you. This 
			Jonathan Collins must be tied up with Millie somehow - why didn't you see it sooner?`,
			options: [
				{
					text: `You don't need to be thrown into the Lion's den, you walked yourself right in. GAME OVER`,
					nextText: -1,
					requires: null,
				},
			],
		},
		{
			id: 16,
			text: `This always works in the movies. But this isn't a movie. Eddie and his crew don't even blink. 
			The first shot hurts. You don't really feel the rest. You feel warm at first, and then very, very 
			cold. You wonder if it'll ever stop raining. And then. It does.`,
			options: [
				{
					text: `You didn't actually expect that to work did you? GAME OVER`,
					nextText: -1,
					requires: null,
				},
			],
		},
		{
			id: 17,
			text: `The approach to Lou Lou's was way too easy. You knew that. Eddie might lack a website and 
			a social media presence, but he's not missing his brain. Good thing for you that you made that little 
			detour up the front of the storage facility.  Sure, it cost you your shoes, but that's a small price 
			to pay for staying alive.  You took the wire you borrowed from Delores and crimped between your two
			shoes. You don't ever want to connect the circuit between two powerlines.  Not only is it illegal, 
			it basically turns the transformer into a bomb. A bomb which very conveniently blows up just before 
			Eddie and his crew are about to start putting holes in you.  The nearby transformer explosion knocks 
			Eddie and his crew to the ground and temporarily blinds them with extreme flash of light.  Just long enough 
			for you to grab the single piece of paper in the storage unit, and run for the hills.  This investigation 
			isn't over, you've just reached the tip of the iceburg with this Jonathan Collins guy.  You have a lot more 
			than when you started - but you know, there's even more left to uncover...`,
			options: [
				{
					text: `You survived to learn more! BEST ENDING ACHIEVED!`,
					nextText: -1,
					requires: null,
				},
			],
		},
	];
	const handleChoice = (option) => {
		if (option.nextText === -1) {
			return startAdventureGame();
		}
		if (!!option.mood) {
			setLevelMood(option.mood);
		}
		if (!!option.inventory && !inventory.includes(option.inventory)) {
			setLevelInventory(option.inventory);
		}
		setDecision(option.text);
		setTheNode(option.nextText);
	};

	const startAdventureGame = () => {
		clearGameData();
		setTheNode(1);
	};
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
				inventory.includes(option.requires?.inventory)
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
					<a href='https://jcodes.blog'>blog</a>
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
							<div className='levelDetails'>
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
		</div>
	);
}

export default App;
