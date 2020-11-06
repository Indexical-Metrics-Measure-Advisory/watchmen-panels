import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import styled from 'styled-components';
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
		overflow-y: scroll;
	}
`;

export default () => {
	return <ConsoleContextProvider>
		<Container>
			<Menu/>
			<main>
				<Switch>
					<Route path={Path.CONSOLE_NOTIFICATION}><Notification/></Route>
					<Route path='*'><Redirect to={Path.CONSOLE_NOTIFICATION}/></Route>
				</Switch>
			</main>
		</Container>
	</ConsoleContextProvider>;
}