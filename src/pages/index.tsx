import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Path from '../common/path';
import Console from './console';
import Guide from './guide';
import Home from './home';
import Welcome from './welcome';

export default () => {
	return <BrowserRouter basename={process.env.REACT_APP_WEB_CONTEXT}>
		<Switch>
			<Route path={Path.HOME}><Home/></Route>
			<Route path={Path.GUIDE}><Guide/></Route>
			<Route path={Path.CONSOLE}><Console/></Route>
			<Route path='*'><Welcome/></Route>
		</Switch>
	</BrowserRouter>;
}