import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import styled from 'styled-components';
import Path from '../../common/path';
import { ConsoleContextProvider } from './context/console-context';
import Menu from './menu';
import { Inbox } from './message/inbox';
import { Notification } from './message/notification';
import { Messenger } from './messenger';

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
					<Route path={Path.CONSOLE_INBOX}><Inbox/></Route>
					<Route path={Path.CONSOLE_NOTIFICATION}><Notification/></Route>
					<Route path='*'><Redirect to={Path.CONSOLE_NOTIFICATION}/></Route>
				</Switch>
			</main>
			<Messenger/>
		</Container>
	</ConsoleContextProvider>;
}