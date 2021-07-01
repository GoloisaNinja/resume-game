import React from 'react';
import { FaCopyright } from 'react-icons/fa';

const Footer = () => {
	const currentYear = new Date().getFullYear();
	return (
		<footer>
			<img
				className='header-logo'
				src='/assets/jcodesGameSm.png'
				width='90'
				height='90'
				alt='jcodes logo'
			/>
			<div>
				<p>
					JCODES Games <FaCopyright /> {currentYear}
				</p>
				<p>Music: Signs To Nowhere</p>
				<p>by Shane Ivers</p>
				<p>
					courtesy of{' '}
					<a href='https://www.silvermansound.com'>Silverman Sound</a>
				</p>
				<p>
					Modal Icon by <a href='https://www.freepik.com'>Freepik</a>
				</p>
			</div>
		</footer>
	);
};

export default Footer;
