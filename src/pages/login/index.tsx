import { faKey, faRocket, faUserAstronaut } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import dayjs from 'dayjs';
import React from "react";
import styled from 'styled-components';
import Background1 from '../../assets/login-background.png';
import Input from '../component/input';
import Logo from '../component/logo';
import { PrimaryObjectButton } from '../component/object-button';

const LoginContainer = styled.div`
	display: flex;
	flex-direction: column;
	min-width: 1000px;
	min-height: 100vh;
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
const LoginBody = styled.div`
	flex-grow: 1;
	display: flex;
	> div:first-child {
		display: flex;
		justify-content: flex-end;
		width: 55%;
		padding-top: 100px;
		padding-right: 150px;
	}
	> div:nth-child(2) {
		display: flex;
		flex-direction: column;
		padding-top: 100px;
		> div {
			width: 400px;
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
					}
					&:focus-within {
						box-shadow: var(--console-hover-shadow);
						background-color: var(--invert-color);
					}
					> svg:first-child {
						font-size: 1.05em;
						opacity: 0.7;
						width: 40px;
					}
					> input {
						flex-grow: 1;
						border: 0;
						border-radius: 0;
						padding-left: 0;
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
`;

const Login = () => {
	const hour = dayjs().hour();

	const hello = (hour < 5 || hour > 21) ? 'Good evening!' : (hour < 12 ? 'Good Morning!' : 'Good Afternoon!');

	return <LoginContainer>
		<LoginHeader>
			<Logo/>
			<span>Indexical Metrics <span>&</span> Measure Advisory</span>
		</LoginHeader>
		<LoginBody>
			<div>
				<Image/>
			</div>
			<div>
				<div>
					<div>{hello}</div>
					<div>
						<div>
							<FontAwesomeIcon icon={faUserAstronaut}/>
							<Input/>
						</div>
						<div>
							<FontAwesomeIcon icon={faKey}/>
							<Input/>
						</div>
					</div>
					<div>
						<PrimaryObjectButton>
							<FontAwesomeIcon icon={faRocket}/>
							<span>GO!</span>
						</PrimaryObjectButton>
					</div>
				</div>
			</div>
		</LoginBody>
	</LoginContainer>;
};

export default Login;