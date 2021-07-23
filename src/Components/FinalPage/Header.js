import React, { Component } from 'react';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import config from '../Configuration/config.json';
import DecryptData from '../Encryption/Decryption';
import EncryptData from '../Encryption/Encryption';

class Header extends Component {
	constructor() {
		super();
		this.state = {
			encodedData: '',
			data: [],
		};
	}

	componentDidMount() {
		axios
			.get(config['details-route'], {
				headers: {
					'x-token-auth': DecryptData(sessionStorage.getItem('session')),
				},
			})
			.then((response) => {
				this.setState({ encodedData: response.data }, () => {
					this.setValues(this.decodeJWT());
				});
			})
			.catch(function (error) {
				console.log(error);
			});
	}

	decodeJWT = () => {
		try {
			let dataDec = jwt.verify(this.state.encodedData, config['jwtKey'], {
				algorithm: 'HS256',
			});
			this.setState({ data: dataDec }, () => {});
			return dataDec;
		} catch (err) {
			console.error(err);
		}
	};

	setValues = (dataDec) => {
		try {
			sessionStorage.setItem(
				'Name',
				EncryptData(
					dataDec.payload.credentialSubject.recipient.givenName +
						' ' +
						dataDec.payload.credentialSubject.recipient.middleName,
				),
			);
			sessionStorage.setItem(
				'DOB',
				EncryptData(dataDec.payload.credentialSubject.recipient.birthDate),
			);
			sessionStorage.setItem(
				'PassExp',
				EncryptData(dataDec.payload.expirationDate),
			);
		} catch (err) {
			console.error(err);
		}
	};

	renderName = () => {
		try {
			return DecryptData(sessionStorage.getItem('Name'));
		} catch (err) {}
	};

	render() {
		return (
			<div>
				<h1>Hi, {this.renderName()}. Here's your Pass.</h1>
				<p>
					Your pass is now active. Be sure to save your pass before you leave.
				</p>
			</div>
		);
	}
}

export default Header;
