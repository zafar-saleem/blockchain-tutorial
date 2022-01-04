import { useEffect, useState } from 'react';

import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

import 'bootstrap/dist/css/bootstrap.min.css';

import Web3 from 'web3';
import { CONTRACT_ABI, CONTRACT_ADDRESS } from './config';

function App() {
	const [account, setAccountState] = useState();
	const [myContract, setmyContractState] = useState();
	const [balanceToken, setBalanceTokenState] = useState();
	//const [contacts, setContacts] = useState([]);

	useEffect(() => {
		async function load() {
			//collegamento alla blockchain tramite metamask
			const web3 = new Web3(Web3.givenProvider /* || 'http://localhost:7545' */);

			//assegniamo alla variabile account l'account attuamente selezionato in metamask
			const accounts = await web3.eth.requestAccounts();
			setAccountState(accounts[0]);

			//assegniamo alla variabile myContract il riferimento al contratto
			const myContractResponse = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
			setmyContractState(myContractResponse);

			const balanceTokenResponse = await myContractResponse.methods.balanceOf(accounts[0]).call();
			const balanceTokenResponseConverted = web3.utils.fromWei(balanceTokenResponse);
			setBalanceTokenState(balanceTokenResponseConverted);

			//riassegniamo alla variabile account, il nuovo account selezionato in metamask dall'utente
			window.ethereum.on('accountsChanged', async function (accounts) {
				setAccountState(accounts[0]);
				const balanceTokenResponse = await myContractResponse.methods.balanceOf(accounts[0]).call();
				const balanceTokenResponseConverted = web3.utils.fromWei(balanceTokenResponse);
				setBalanceTokenState(balanceTokenResponseConverted);
			});

			/*
			const counter = await myContract.methods.count().call();

			for (var i = 1; i <= counter; i++) {
				const contact = await myContract.methods.contacts(i).call();
				setContacts((contacts) => [...contacts, contact]);
			}
			*/

		}

		load();
	}, []);

	return (
		<div>
			<Navbar bg="dark" variant="dark">
					<Container>
						<Navbar.Brand href="#home">
							<img
								alt=""
								src="/logo.svg"
								width="30"
								height="30"
								className="d-inline-block align-top"
							/>{' '}
							React Bootstrap
						</Navbar.Brand>
					</Container>
				</Navbar>
				
			<Container>
				<Row>
					<Col><Button variant="primary">Primary</Button>{' '}</Col>
					<Col><Card>
						<Card.Img variant="top" src="older.js/100px160" />
						<Card.Body>
							<Card.Title>Card title</Card.Title>
							<Card.Text>
								This is a wider card with supporting text below as a natural lead-in to
								additional content. This content is a little bit longer.
							</Card.Text>
						</Card.Body>
						<Card.Footer>
							<small className="text-muted">Last updated 3 mins ago</small>
						</Card.Footer>
					</Card></Col>
				</Row>
				<Row>
					<Col><p>Your account is: {account}</p></Col>
					<Col><p>Your balance is: {balanceToken}</p></Col>
					<Col>3 of 3</Col>
				</Row>
			</Container>
		</div>
				
	);
}

export default App;
