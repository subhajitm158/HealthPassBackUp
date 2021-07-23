import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import config from '../Configuration/config.json';
import dot from './Assets/dot.png';
import DecryptData from '../Encryption/Decryption';
import EncryptData from '../Encryption/Encryption';

function LeftPanel() {
	const [imageUrl, setImageUrl] = useState('');
	const space = '  ';

	const generateQR = async (dataDec) => {
		try {
			const imageUrl = await QRCode.toDataURL(JSON.stringify(dataDec));
			setImageUrl(imageUrl);
		} catch (error) {
			console.error(error);
		}
	};

	const decodeJWT = () => {
		try {
			let dataDec = jwt.verify(
				DecryptData(sessionStorage.getItem('Final-token')),
				config['jwtKey'],
				{
					algorithm: 'HS256',
				},
			);
			generateQR(dataDec);
		} catch (err) {
			console.error(err);
		}
	};

	useEffect(() => {
		axios
			.get(config['details-route'], {
				headers: {
					'x-token-auth': DecryptData(sessionStorage.getItem('session')),
				},
			})
			.then((response) => {
				sessionStorage.setItem('Final-token', EncryptData(response.data));
				decodeJWT();
			})
			.catch(function (error) {
				console.log(error);
			});
	});

	const renderName = () => {
		try {
			return DecryptData(sessionStorage.getItem('Name'));
		} catch (err) {}
	};

	const renderDOB = () => {
		try {
			return DecryptData(sessionStorage.getItem('DOB'));
		} catch (err) {}
	};

	const renderPassExp1 = () => {
		try {
			return DecryptData(sessionStorage.getItem('PassExp')).substring(0, 10);
		} catch (err) {}
	};

	const renderPassExp2 = () => {
		try {
			return DecryptData(sessionStorage.getItem('PassExp')).substring(11, 19);
		} catch (err) {}
	};

	return (
		<div>
			<div className='leftBckImg-l'>
				<div className='lefttag-l'>
					<p className='lefttagText-l'>Covid-19 Vaccination</p>
				</div>
				{sessionStorage.getItem('session') ? (
					<div>
						<p className='leftName-l'>{renderName()}</p>
						<div className='leftQr-l'>
							<img src={imageUrl} alt='qrCode' className='leftQRImg-l' />
						</div>
					</div>
				) : null}
				<div className='leftText-l'>
					<p className='leftTexttxt-l'>
						Please have Photo ID available when presenting your Pass for
						Verification.
					</p>
				</div>
				{sessionStorage.getItem('session') ? (
					<div>
						<div className='leftDOB-l'>
							<p className='leftDOBLabel-l'>D.O.B.</p>
							<p className='leftDOBText-l'>{renderDOB()}</p>
						</div>
						<div className='leftExp-l'>
							<p className='leftExpLabel-l'>PASS EXPIRES</p>
							<p className='leftExpText-l'>
								{renderPassExp1() + space}
								<img src={dot} alt='dot' className='leftExpDot-l' />
								{space + renderPassExp2()}
							</p>
						</div>
					</div>
				) : null}
				<div className='leftPrintButton-l'>
					<button id='Print' className='leftPrintButtonBtn-l'>
						Print your Pass
					</button>
				</div>
				<div className='leftFAQ-l'>
					For more information about Excelsior Pass, please visit our{space}
					<a href='/api/details' className='leftFAQLink-l'>
						FAQ's
					</a>
				</div>
			</div>
		</div>
	);
}

export default LeftPanel;
