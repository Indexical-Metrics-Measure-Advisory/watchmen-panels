import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import styled from 'styled-components';
import Path from '../../common/path';
import { ConnectedSpace } from './connected-space';
import { ConsoleContextProvider } from './context/console-context';
import { Dashboard } from './dashboard';
import { Favorite } from './favorite';
import { Home } from './home';
import { ConsoleMenu } from './menu';
import { Inbox } from './message/inbox';
import { Notification } from './message/notification';
import { Messenger } from './messenger';
import { SettingsPanel as Settings } from './settings';
import { Timeline } from './timeline';

const Container = styled.div.attrs({
	'data-widget': 'console-container'
})`
	display: flex;
	color: var(--console-font-color);
	--toggle-negative-slider-color: var(--border-color);
	--toggle-positive-bg-color: var(--console-primary-color);
	--toggle-negative-bg-color: transparent;
	--toggle-positive-border-color: var(--console-primary-color);
	--toggle-negative-border-color: var(--border-color);
	> main {
		flex-grow: 1;
		display: flex;
		height: 100vh;
		overflow-y: scroll;
	}
	> div[data-widget='console-favorite-container'][data-pinned=true] + main {
		margin-top: var(--console-favorite-pinned-height);
		height: calc(100vh - var(--console-favorite-pinned-height));
	}
`;

const ConsoleIndex = () => {
	return <ConsoleContextProvider>
		<Container>
			<ConsoleMenu/>
			<Favorite/>
			<main>
				<Switch>
					<Route path={Path.CONSOLE_HOME}><Home/></Route>
					<Route path={Path.CONSOLE_CONNECTED_SPACE}><ConnectedSpace/></Route>
					<Route path={Path.CONSOLE_DASHBOARDS}><Dashboard/></Route>
					<Route path={Path.CONSOLE_INBOX}><Inbox/></Route>
					<Route path={Path.CONSOLE_NOTIFICATION}><Notification/></Route>
					<Route path={Path.CONSOLE_SETTINGS}><Settings/></Route>
					<Route path={Path.CONSOLE_TIMELINE}><Timeline/></Route>
					<Route path='*'><Redirect to={Path.CONSOLE_HOME}/></Route>
				</Switch>
			</main>
			<Messenger/>
		</Container>
	</ConsoleContextProvider>;
};

export default ConsoleIndex;