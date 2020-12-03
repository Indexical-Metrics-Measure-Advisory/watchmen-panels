import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Path from '../common/path';
import Home from './home';
import Welcome from './welcome';

const Guide = lazy(() => import(/* webpackChunkName: "guide" */ './guide'));
const Console = lazy(() => import(/* webpackChunkName: "console" */ './console'));
const Admin = lazy(() => import(/* webpackChunkName: "admin" */ './admin'));

export const Pages = () => {
	return <Suspense fallback={<div/>}>
		<BrowserRouter basename={process.env.REACT_APP_WEB_CONTEXT}>
			<Switch>
				<Route path={Path.HOME}><Home/></Route>
				<Route path={Path.GUIDE}><Guide/></Route>
				<Route path={Path.CONSOLE}><Console/></Route>
				<Route path={Path.ADMIN}><Admin/></Route>
				<Route path='*'><Welcome/></Route>
			</Switch>
		</BrowserRouter>
	</Suspense>;
};