import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import styled from 'styled-components';
import Path from '../../common/path';
import { AdminContextProvider } from './context/admin-context';
import { AdminMenu } from './menu';
import { Pipeline } from './pipeline';
import { Reports } from './report';
import { Spaces } from './space';
import { Tasks } from './task';
import { Topics } from './topic';
import { Users } from './user';
import { UserGroups } from './user-group';
import { Home } from './home';

const Container = styled.div.attrs({
	'data-widget': 'console-container'
})`
	display                        : flex;
	color                          : var(--console-font-color);
	--toggle-negative-slider-color : var(--border-color);
	--toggle-positive-bg-color     : var(--console-primary-color);
	--toggle-negative-bg-color     : transparent;
	--toggle-positive-border-color : var(--console-primary-color);
	--toggle-negative-border-color : var(--border-color);
	> main {
		flex-grow  : 1;
		display    : flex;
		height     : 100vh;
		overflow-y : scroll;
	}
	> div[data-widget='console-favorite-container'][data-pinned=true] + main {
		margin-top : var(--console-favorite-pinned-height);
		height     : calc(100vh - var(--console-favorite-pinned-height));
	}
`;

const AdminIndex = () => {
	return <AdminContextProvider>
		<Container>
			<AdminMenu/>
			<main>
				<Switch>
					<Route path={Path.ADMIN_HOME}><Home/></Route>
					<Route path={Path.ADMIN_TOPICS}><Topics/></Route>
					<Route path={Path.ADMIN_REPORTS}><Reports/></Route>
					<Route path={Path.ADMIN_SPACES}><Spaces/></Route>
					<Route path={Path.ADMIN_PIPELINE}><Pipeline/></Route>
					<Route path={Path.ADMIN_USER_GROUPS}><UserGroups/></Route>
					<Route path={Path.ADMIN_USERS}><Users/></Route>
					<Route path={Path.ADMIN_TASKS}><Tasks/></Route>
					<Route path='*'><Redirect to={Path.ADMIN_HOME}/></Route>
				</Switch>
			</main>
		</Container>
	</AdminContextProvider>;
};

export default AdminIndex;