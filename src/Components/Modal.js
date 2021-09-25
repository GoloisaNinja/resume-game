import React from 'react';
import { FaCheck, FaTimes } from 'react-icons/fa';

const Modal = ({ show, handleClose, handleDismiss, content }) => {
	return (
		show && (
			<>
				<div className='modalStyle'>
					<div>
						<img className='modal-icon' src={content.icon} alt='detective' />
					</div>

					<h2 style={{ marginBottom: '2rem' }}>{content.title}</h2>
					{content.type === 'dismiss' ? (
						<ul className='records'>
							{Object.entries(content.body).map((object, index) => (
								<li className='record' key={index}>
									{object[0]}:{' '}
									{object[1] === true ? (
										<>
											<FaCheck className='check' />{' '}
											<span className='record-result-pass'>ACQUIRED</span>
										</>
									) : (
										<>
											<FaTimes className='times' />{' '}
											<span className='record-result-fail'>FAILED</span>
										</>
									)}
								</li>
							))}
						</ul>
					) : (
						<p style={{ marginBottom: '2rem' }}>{content.body}</p>
					)}

					<div className='buttonDiv'>
						{content.type === 'decision' ? (
							<>
								<button
									className='modalButton1'
									onClick={(e) => handleClose(false)}>
									cancel
								</button>
								<button
									className='modalButton2'
									onClick={(e) => handleClose(true)}>
									confirm
								</button>
							</>
						) : (
							<>
								<button
									className='modalDismissButton1'
									onClick={(e) => handleDismiss()}>
									dismiss
								</button>
							</>
						)}
					</div>
				</div>
				<div className='modalOverlay'></div>
			</>
		)
	);
};
export default Modal;
