import React from 'react';
import styled from 'styled-components';
import BackgroundImage from '../../assets/console-background.png';
import { ConsoleContextProvider } from './context/console-context';
import Menu from './menu';

const Container = styled.div.attrs({
	'data-widget': 'console-container'
})`
	color: var(--console-font-color);
	> main {
		width: 100vw;
		display: flex;
		overflow: hidden;
		&:before {
			content: '';
			position: fixed;
			left: 0;
			top: 0;
			width: 100vw;
			height: 100vh;
			z-index: -1;
			pointer-events: none;
			user-select: none;
			filter: brightness(1.5) opacity(0.1);
			background-repeat: no-repeat;
			background-position: left calc(var(--margin) * 3) bottom calc(var(--margin) * 3);
			background-size: 300px;
			background-image: url(${BackgroundImage});
			transform: rotateY(180deg);
		}
	}
`;

export default () => {
	return <ConsoleContextProvider>
		<Container>
			<Menu/>
			<main/>
		</Container>
	</ConsoleContextProvider>;
}