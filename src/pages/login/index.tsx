import { faKey, faRocket, faUserAstronaut } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import dayjs from 'dayjs';
import React, { useEffect, useRef, useState } from "react";
import { useHistory } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import Background2 from '../../assets/login-background-avoid.png';
import Background1 from '../../assets/login-background.png';
import Path from '../../common/path';
import { saveAccount } from '../../services/account/account-session';
import { login } from '../../services/login/login';
import { Account } from '../../services/login/types';
import Input from '../component/input';
import Logo from '../component/logo';
import { PrimaryObjectButton } from '../component/object-button';

const LoginContainer = styled.div`
	display: flex;
	flex-direction: column;
	min-width: 1000px;
	min-height: calc(100vh - 60px);
	margin-bottom: 60px;
`;
const LoginHeader = styled.div`
	display: flex;
	align-items: center;
	height: 64px;
	margin: 0 var(--margin);
	> svg:first-child {
		width: 40px;
		height: 40px;
	}
	> span:nth-child(2) {
		font-variant: petite-caps;
		font-family: var(--console-title-font-family);
		font-size: 24px;
		font-style: italic;
		margin-left: calc(var(--margin) / 3);
		opacity: 0.9;
		text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.3);
		> span {
			font-size: 16px;
			opacity: 0.8;
		}
	}
`;
const Ing = keyframes`
	0%, 100% {
		color: var(--invert-color);
	}
	50% {
		color: var(--console-favorite-color);
	}
`;
const LoginBody = styled.div`
	flex-grow: 1;
	display: flex;
	> div:first-child {
		display: flex;
		justify-content: flex-end;
		width: 55%;
		padding-top: 120px;
		padding-right: 150px;
	}
	> div:nth-child(2) {
		display: flex;
		flex-direction: column;
		padding-top: 120px;
		> div {
			width: 450px;
			border: var(--border);
			border-radius: calc(var(--border-radius) * 3);
			padding: 0 var(--margin);
			> div:first-child {
				display: flex;
				align-items: center;
				height: 40px;
				margin-top: var(--margin);
				font-family: var(--console-title-font-family);
				font-size: 1.2em;
			}
			> div:nth-child(2) {
				display: grid;
				grid-template-columns: 1fr;
				grid-row-gap: var(--margin);
				margin-top: 40px;
				> div {
					display: flex;
					align-items: center;
					border-bottom: var(--border);
					border-top-left-radius: calc(var(--border-radius) * 2);
					border-top-right-radius: calc(var(--border-radius) * 2);
					&:hover {
						box-shadow: var(--console-shadow);
						background-color: var(--invert-color);
						// for avoid chrome auto fill background
						> input {
							box-shadow: 0 0 0 1000px var(--invert-color) inset;
						}
					}
					&:focus-within {
						box-shadow: var(--console-hover-shadow);
						background-color: var(--invert-color);
						// for avoid chrome auto fill background
						> input {
							box-shadow: 0 0 0 1000px var(--invert-color) inset;
						}
					}
					> svg:first-child {
						font-size: 1.05em;
						opacity: 0.7;
						width: 40px;
						color: var(--console-primary-color);
					}
					> input {
						flex-grow: 1;
						border: 0;
						border-radius: 0 calc(var(--border-radius) * 2) 0 0;
						padding-left: 0;
						font-size: var(--font-size);
						// for avoid chrome auto fill background
						box-shadow: 0 0 0 1000px var(--bg-color) inset;
						&:first-line {
							font-size: var(--font-size);
							font-family: var(--console-title-font-family);
							color: var(--console-font-color);
						}
					}
				}
			}
			> div:last-child {
				display: grid;
				grid-template-columns: 1fr;
				padding-bottom: var(--margin);
				> div:first-child {
					display: flex;
					align-items: flex-end;
					height: 40px;
					padding-bottom: 12px;
				}
				> button {
					display: flex;
					justify-self: end;
					align-items: center;
					justify-content: center;
					height: 32px;
					min-width: 120px;
					font-family: var(--console-title-font-family);
					font-weight: var(--font-demi-bold);
					> svg {
						font-size: 1em;
						margin-right: 16px;
						&[data-ing=true] {
							animation: ${Ing} 1200ms linear infinite;
						}
					}
				}
			}
		}
	}
`;
const Image = styled.div`
	width: 400px;
	height: 320px;
	background-image: url(${Background1});
	background-repeat: no-repeat;
	background-position: center center;
	filter: drop-shadow(4px 2px 6px rgba(0, 0, 0, 0.7));
	&[data-avoid=true] {
		background-image: url(${Background2});
	}
`;
const Error = styled.div`
	font-family: var(--console-title-font-family);
	font-size: 0.8em;
	color: var(--console-danger-color);
	opacity: 0.7;
	white-space: nowrap;
	transition: all 200ms ease-in-out;
	&:empty {
		opacity: 0;
	}
`;

const Login = () => {
	const history = useHistory();
	const nameRef = useRef<HTMLInputElement>(null);
	const credentialRef = useRef<HTMLInputElement>(null);
	const [ account, setAccount ] = useState<Account>({} as Account);
	const [ avoid, setAvoid ] = useState(false);
	const [ ing, setIng ] = useState(false);
	const [ error, setError ] = useState('');
	useEffect(() => {
		nameRef.current && nameRef.current.focus() && nameRef.current.select();
	}, []);

	const onValueChange = (prop: keyof Account) => (event: React.ChangeEvent<HTMLInputElement>) => {
		setAccount({ ...account, [prop]: event.target.value });
	};
	const onNameFocused = () => nameRef.current!.select();
	const onPasswordFocused = () => {
		credentialRef.current!.select();
		setAvoid(true);
	};
	const onPasswordBlurred = () => setAvoid(false);
	const onLoginClicked = async () => {
		if ((account.name || '').trim().length === 0) {
			setError('Please tell me who are you, my friend.');
			nameRef.current!.focus();
			return;
		}
		if ((account.credential || '').trim().length === 0) {
			setError('Credential is required to enjoy the journey.');
			credentialRef.current!.focus();
			return;
		}
		setError('');
		setIng(true);

		try {
			const { pass, admin, error } = await login(account);
			if (!pass) {
				setError(error || 'Name or credential cannot be identified now.');
				return;
			}

			saveAccount((account.name || '').trim(), admin);
			if (admin) {
				history.replace(Path.ADMIN);
			} else {
				history.replace(Path.CONSOLE);
			}
		} catch {
			setError('Unpredicted error occurred, contact administrator for more information.');
		} finally {
			setIng(false);
		}
	};

	const hour = dayjs().hour();
	const hello = (hour < 5 || hour > 21) ? 'Good evening!' : (hour < 12 ? 'Good Morning!' : 'Good Afternoon!');

	return <LoginContainer>
		<LoginHeader>
			<Logo/>
			<span>Indexical Metrics <span>&</span> Measure Advisory</span>
		</LoginHeader>
		<LoginBody>
			<div>
				<Image data-avoid={avoid}/>
			</div>
			<div>
				<div>
					<div>{hello}</div>
					<div>
						<div>
							<FontAwesomeIcon icon={faUserAstronaut}/>
							<Input value={account.name || ''} onChange={onValueChange('name')}
							       onFocus={onNameFocused}
							       ref={nameRef}/>
						</div>
						<div>
							<FontAwesomeIcon icon={faKey}/>
							<Input type="password"
							       value={account.credential || ''} onChange={onValueChange('credential')}
							       onFocus={onPasswordFocused} onBlur={onPasswordBlurred}
							       ref={credentialRef}/>
						</div>
					</div>
					<div>
						<Error>{error}</Error>
						<PrimaryObjectButton onClick={onLoginClicked}>
							<FontAwesomeIcon icon={faRocket} data-ing={ing}/>
							<span>GO !</span>
						</PrimaryObjectButton>
					</div>
				</div>
			</div>
		</LoginBody>
	</LoginContainer>;
};

export default Login;