import { faBezierCurve, faCompactDisc, faCube, faGlobe, faServer } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { matchPath, Redirect, Route, Switch, useHistory, useLocation, useParams } from 'react-router-dom';
import Path, { toConnectedSpace } from '../../../common/path';
import { ConnectedConsoleSpace, ConsoleSpaceGroup, ConsoleSpaceType } from '../../../services/console/types';
import { useConsoleContext } from '../context/console-context';
import { AvailableResources } from './available-resources';
import { Body, Container, Header, Title } from './components';
import { GroupView } from './group-view';
import { ListView } from './list-view';
import { SpaceContextProvider, useSpaceContext } from './space-context';
import { Tab, Tabs } from './tabs';

const ConnectedSpaceHeader = (props: {
	space: ConnectedConsoleSpace
}) => {
	const { space } = props;
	const { groups } = space;

	const location = useLocation();
	const history = useHistory();
	const { isGroupOpened, openGroupIfCan } = useSpaceContext();

	const isOverallActive = !!matchPath(location.pathname, Path.CONSOLE_CONNECTED_SPACE_OVERALL);
	const isResourcesActive = !!matchPath(location.pathname, Path.CONSOLE_CONNECTED_SPACE_RESOURCES);
	const isGroupsActive = matchPath<{ groupId: string }>(location.pathname, Path.CONSOLE_CONNECTED_SPACE_GROUP);

	const onOverallClicked = () => history.push(toConnectedSpace(Path.CONSOLE_CONNECTED_SPACE_OVERALL, space.connectId));
	const onResourcesClicked = () => history.push(toConnectedSpace(Path.CONSOLE_CONNECTED_SPACE_RESOURCES, space.connectId));
	const onGroupTabClicked = (group: ConsoleSpaceGroup) => () => openGroupIfCan(space, group);

	return <Header>
		<Title>
			<FontAwesomeIcon icon={space.type === ConsoleSpaceType.PUBLIC ? faGlobe : faCompactDisc}/>
			<span>{space.name}</span>
		</Title>
		<Tabs>
			<Tab active={isOverallActive} icon={faServer} label='Overall'
			     onClick={onOverallClicked}/>
			{groups.filter(isGroupOpened)
				.map(group => {
					// eslint-disable-next-line
					const isCurrentGroupActive = isGroupsActive && isGroupsActive.params.groupId == group.groupId;
					return <Tab active={!!isCurrentGroupActive}
					            icon={faCube}
					            label={group.name}
					            onClick={onGroupTabClicked(group)}
					            key={group.groupId}/>;
				})}
			<Tab active={isResourcesActive} icon={faBezierCurve} label='Available Resources'
			     onClick={onResourcesClicked}/>
		</Tabs>
	</Header>;
};

const ConnectedSpaceBody = (props: {
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
			<Route path='*'>
				<Redirect to={toConnectedSpace(Path.CONSOLE_CONNECTED_SPACE_OVERALL, space.connectId)}/>
			</Route>
		</Switch>
	</Body>;
};

const ConnectedSpaceContent = () => {
	const history = useHistory();
	const { connectId } = useParams<{ connectId: string }>();

	const { spaces: { connected: spaces } } = useConsoleContext();

	// eslint-disable-next-line
	const space = spaces.find(space => space.connectId == connectId)!;

	if (!space) {
		history.replace(Path.CONSOLE_HOME);
		return null;
	}

	return <Container>
		<ConnectedSpaceHeader space={space}/>
		<ConnectedSpaceBody space={space}/>
	</Container>;
};

export const ConnectedSpace = () => {
	return <SpaceContextProvider>
		<ConnectedSpaceContent/>
	</SpaceContextProvider>;
};
