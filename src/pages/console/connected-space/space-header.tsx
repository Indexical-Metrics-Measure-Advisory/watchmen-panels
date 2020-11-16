import { faBezierCurve, faCube, faServer } from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import { matchPath, useHistory, useLocation } from 'react-router-dom';
import Path, { toConnectedSpace } from '../../../common/path';
import { ConnectedConsoleSpace, ConsoleSpaceGroup } from '../../../services/console/types';
import { Header } from './components';
import { useSpaceContext } from './space-context';
import { SpaceHeaderTitle } from './space-header-title';
import { Tab, Tabs } from './tabs';

export const ConnectedSpaceHeader = (props: {
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
		<SpaceHeaderTitle space={space}/>
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
