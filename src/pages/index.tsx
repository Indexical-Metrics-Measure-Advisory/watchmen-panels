import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Path from '../common/path';
import Admin from './admin';
import { ConsoleIndex } from './console';
import Guide from './guide';
import Home from './home';
import Welcome from './welcome';

export const Pages = () => {
	return <BrowserRouter basename={process.env.REACT_APP_WEB_CONTEXT}>
		<Switch>
			<Route path={Path.HOME}><Home/></Route>
			<Route path={Path.GUIDE}><Guide/></Route>
			<Route path={Path.CONSOLE}><ConsoleIndex/></Route>
			<Route path={Path.ADMIN}><Admin/></Route>
			<Route path='*'><Welcome/></Route>
		</Switch>
	</BrowserRouter>;
};