import React from 'react';
import { Route, Switch } from 'react-router-dom';
import styled from 'styled-components';
import BackgroundImage from '../../assets/console-background.png';
import Path from '../../common/path';
import { ConsoleContextProvider } from './context/console-context';
import Menu from './menu';
import { Notification } from './notification';

const Container = styled.div.attrs({
	'data-widget': 'console-container'
})`
	display: flex;
	color: var(--console-font-color);
	> main {
		flex-grow: 1;
		display: flex;
		height: 100vh;
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
			<main>
				<Switch>
					<Route path={Path.CONSOLE_NOTIFICATION}><Notification/></Route>
					<Route path='*'><Notification/></Route>
				</Switch>
			</main>
		</Container>
	</ConsoleContextProvider>;
}