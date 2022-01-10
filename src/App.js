import { useEffect, useState } from 'react';

import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Placeholder from 'react-bootstrap/Placeholder';

import 'bootstrap/dist/css/bootstrap.min.css';

import Web3 from 'web3';
import { CONTRACT_ABI, CONTRACT_ADDRESS } from './config';

import scae_logo_image from './scae_logo.jpg'; // Tell webpack this JS file uses this image
import scae_token_image from './scae_token.png'; // Tell webpack this JS file uses this image
import membership_image from './membership.png'; // Tell webpack this JS file uses this image
import integrity_image from './lock.png'; // Tell webpack this JS file uses this image

function App() {
	const [account, setAccountState] = useState();
	const [myContract, setmyContractState] = useState();
	const [registrationStatus, setRegistrationStatus] = useState(false);
	const [balanceToken, setBalanceTokenState] = useState(0);
	const [verifiedFinalMerkleRoot, setVerifiedFinalMerkleRoot] = useState("?");
	const [intermediateMerkleRootsVineyardList, setIntermediateMerkleRootsVineyardList] = useState([]);
	const [finalMerkleRootVineyard, setFinalMerkleRootVineyard] = useState();
	const [intermediateMerkleRootsCellarList, setIntermediateMerkleRootsCellarList] = useState([]);
	const [finalMerkleRootCellar, setFinalMerkleRootCellar] = useState(0);

	useEffect(() => {
		async function load() {
			//collegamento alla blockchain tramite metamask
			const web3 = new Web3(Web3.givenProvider /* || 'http://localhost:7545' */);

			//assegniamo alla variabile account l'account attuamente selezionato in metamask
			const accounts = await web3.eth.requestAccounts();
			setAccountState(accounts[0]);

			//assegniamo alla variabile myContract il riferimento al contratto
			const myContractInstance = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
			setmyContractState(myContractInstance);

			/* FUNZIONA, AGGIUNGERE ELEMENTI A LISTA
			const counter = await myContract.methods.count().call();
			for (var i = 1; i <= counter; i++) {
				const contact = await myContract.methods.contacts(i).call();
				setContacts((contacts) => [...contacts, contact]);
			}
			*/


			/*
			//riassegniamo alla variabile account, il nuovo account selezionato in metamask dall'utente ed aggiorniamo tutti i componenti
			window.ethereum.on('accountsChanged', async function (accounts) {
				setAccountState(accounts[0]);

				const verifyRegistrationResponse = await myContractInstance.methods._verifyRegistration(accounts[0]).call();
				setRegistrationStatus(verifyRegistrationResponse);

				const balanceOfResponse = await myContractInstance.methods.balanceOf(accounts[0]).call();
				const balanceOfResponseConverted = web3.utils.fromWei(balanceOfResponse);
				setBalanceTokenState(balanceOfResponseConverted);

				const getIntermediateMerkleRootsVineayrdResponse = await myContractInstance.methods._getIntermediateMerkleRoots(accounts[0], "vineyard").call();
				for (var i = 0; i < getIntermediateMerkleRootsVineayrdResponse.length; i++) {
					setIntermediateMerkleRootsVineyardList(getIntermediateMerkleRootsVineayrdResponse);
				}

				const getFinalMerkleRootVineyardResponse = await myContractInstance.methods._getFinalMerkleRoot(accounts[0], "vineyard").call();
				setFinalMerkleRootVineyard(getFinalMerkleRootVineyardResponse);
			});
			*/
			


			while (true) {
				await sleep(1000);
				const verifyRegistrationResponse = await myContractInstance.methods._verifyRegistration(accounts[0]).call();
				setRegistrationStatus(verifyRegistrationResponse);

				const balanceOfResponse = await myContractInstance.methods.balanceOf(accounts[0]).call();
				const balanceOfResponseConverted = web3.utils.fromWei(balanceOfResponse);
				setBalanceTokenState(balanceOfResponseConverted);

				const getIntermediateMerkleRootsVineayrdResponse = await myContractInstance.methods._getIntermediateMerkleRoots("vineyard").call();
				for (var i = 0; i < getIntermediateMerkleRootsVineayrdResponse.length; i++) {
					setIntermediateMerkleRootsVineyardList(getIntermediateMerkleRootsVineayrdResponse);
				}

				const getFinalMerkleRootVineyardResponse = await myContractInstance.methods._getFinalMerkleRoot(accounts[0], "vineyard").call();
				if(getFinalMerkleRootVineyardResponse!="0x0000000000000000000000000000000000000000000000000000000000000000"){
					setFinalMerkleRootVineyard(getFinalMerkleRootVineyardResponse);
				}
			}

		}

		load();
	}, []);

	return (
		<div>
			<Navbar id="navbar">
				<Container>
					<Navbar.Brand className="text-center">
						<img
							alt=""
							src={scae_logo_image}
							width="30"
							height="30"
							className="d-inline-block align-top"
						/>{' '}
						Smart and Connected Agrifood Ecosystem
					</Navbar.Brand>
				</Container>
			</Navbar>

			<Container id="container2">
				<Row>
					<Col>
						<Card id="cardRegistrazione" className="text-center">
							{/*<Card.Header id="cardheader">CardHeader</Card.Header>*/}
							<Card.Img id="image" variant="top" src={membership_image} className="card-img-top rounded mx-auto d-block" />
							<Card.Body>
								<Card.Title id="cardtitle">{registrationStatus.toString()}</Card.Title>
								<Card.Text> Stato della tua registrazione al programma SCAE </Card.Text>
								<Button id="cardbutton" variant="primary" onClick={() => setBalanceTokenState(balanceToken)} >Aggiorna</Button>
							</Card.Body>
							<Card.Footer id="cardfooter"> <b>Registrazione</b> </Card.Footer>
						</Card>
					</Col>
					<Col>
						<Card id="cardToken" className="text-center">
							{/*<Card.Header id="cardheader">CardHeader</Card.Header>*/}
							<Card.Img id="image" variant="top" src={scae_token_image} className="card-img-top rounded mx-auto d-block" />
							<Card.Body>
								<Card.Title id="cardtitle">{balanceToken}</Card.Title>
								<Card.Text> Ecco il saldo dei token che hai guadagnato finora aderendo al programma SCAE </Card.Text>
								<Button id="cardbutton" variant="primary" onClick={() => setBalanceTokenState(balanceToken)} >Aggiorna</Button>
							</Card.Body>
							<Card.Footer id="cardfooter"> <b>Token</b> </Card.Footer>
						</Card>
					</Col>
					<Col>
						<Card id="cardToken" className="text-center">
							{/*<Card.Header id="cardheader">CardHeader</Card.Header>*/}
							<Card.Img id="image" variant="top" src={integrity_image} className="card-img-top rounded mx-auto d-block" />
							<Card.Body>
								<Card.Title id="cardtitle">{verifiedFinalMerkleRoot}</Card.Title>
								<Card.Text> Controlla l'integrità dei dati presenti su IOTA, verificando che la merkle root generata a partire
									da essi corrisponda con quella già presente in ETHEREUM </Card.Text>
								<Button id="cardbutton" variant="primary" onClick={() => setBalanceTokenState(balanceToken)}>Verifica</Button>
							</Card.Body>
							<Card.Footer id="cardfooter"> <b>Integrità dei Dati</b> </Card.Footer>
						</Card>
					</Col>
				</Row>
				<Row>
					<Col>
						<ListGroup id="list" className="text-center">
							<ListGroup.Item id="listgroupitemtitle"><b>Merkle Roots Intermedie Vineyard</b></ListGroup.Item>
							{
								Object.keys(intermediateMerkleRootsVineyardList).map((element, index) => (
									<ListGroup.Item key={`${intermediateMerkleRootsVineyardList[index]}-${index}`}>
										<b>{index}: </b>{intermediateMerkleRootsVineyardList[index]}
									</ListGroup.Item>
								))
							}
						</ListGroup>
					</Col>
					<Col>
						<ListGroup id="list" className="text-center">
							<ListGroup.Item id="listgroupitemtitle"><b>Merkle Root Finale Vineyard</b></ListGroup.Item>
							<ListGroup.Item key={`${finalMerkleRootVineyard}`}>
								{finalMerkleRootVineyard}
							</ListGroup.Item>
						</ListGroup>
					</Col>
				</Row>
			</Container>
		</div>

	);
}

//you can leave the sleep constant
async function sleep(milliseconds) {
	return new Promise(resolve => setTimeout(resolve, milliseconds))
}

export default App;
