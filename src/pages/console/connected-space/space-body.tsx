import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import Path, { toConnectedSpace } from '../../../common/path';
import { ConnectedConsoleSpace } from '../../../services/console/types';
import { AvailableResources } from './available-resources';
import { Body } from './components';
import { GroupView } from './group-view';
import { ListView } from './list-view';
import { SubjectView } from './subject-view';

export const ConnectedSpaceBody = (props: {
	space: ConnectedConsoleSpace
}) => {
	const { space } = props;

	return <Body>
		<Switch>
			<Route path={Path.CONSOLE_CONNECTED_SPACE_OVERALL}>
				<ListView visible={true} space={space}/>
			</Route>
			<Route path={Path.CONSOLE_CONNECTED_SPACE_RESOURCES}>
				<AvailableResources visible={true} space={space}/>
			</Route>
			<Route path={Path.CONSOLE_CONNECTED_SPACE_GROUP}>
				<GroupView visible={true} space={space}/>
			</Route>
			<Route path={Path.CONSOLE_CONNECTED_SPACE_SUBJECT}>
				<SubjectView visible={true} space={space}/>
			</Route>
			<Route path='*'>
				<Redirect to={toConnectedSpace(Path.CONSOLE_CONNECTED_SPACE_OVERALL, space.connectId)}/>
			</Route>
		</Switch>
	</Body>;
};
