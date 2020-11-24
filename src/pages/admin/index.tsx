import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import styled from 'styled-components';
import Path from '../../common/path';
import { AdminContextProvider } from './context/admin-context';
import { AdminMenu } from './menu';
import { Tasks } from './tasks';

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
	> div[data-widget='console-favorite-container'][data-pinned=true] + main {
		margin-top: var(--console-favorite-pinned-height);
		height: calc(100vh - var(--console-favorite-pinned-height));
	}
`;

const AdminIndex = () => {
	return <AdminContextProvider>
		<Container>
			<AdminMenu/>
			<main>
				<Switch>
					<Route path={Path.ADMIN_TOPICS}><Tasks/></Route>
					<Route path={Path.ADMIN_REPORTS}><Tasks/></Route>
					<Route path={Path.ADMIN_SPACES}><Tasks/></Route>
					<Route path={Path.ADMIN_PIPELINE}><Tasks/></Route>
					<Route path={Path.ADMIN_USER_GROUPS}><Tasks/></Route>
					<Route path={Path.ADMIN_USERS}><Tasks/></Route>
					<Route path={Path.ADMIN_TASKS}><Tasks/></Route>
					<Route path='*'><Redirect to={Path.ADMIN_TASKS}/></Route>
				</Switch>
			</main>
		</Container>
	</AdminContextProvider>;
};

export default AdminIndex;