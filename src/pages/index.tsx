import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Path from '../common/path';
import Guide from './guide';
import Home from './home';
import Welcome from './welcome';

export default () => {
	return <BrowserRouter>
		<Switch>
			<Route path={Path.HOME}><Home/></Route>
			<Route path={Path.GUIDE}><Guide/></Route>
			<Route path="*"><Welcome/></Route>
		</Switch>
	</BrowserRouter>;
}