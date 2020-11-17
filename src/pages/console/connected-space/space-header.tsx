import { faBezierCurve, faServer } from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import { matchPath, useHistory, useLocation } from 'react-router-dom';
import Path, { toConnectedSpace } from '../../../common/path';
import { ConnectedConsoleSpace } from '../../../services/console/types';
import { Header } from './components';
import { GroupTab, SubjectTab } from './space-header-dropdown-tab';
import { SpaceHeaderTitle } from './space-header-title';
import { Tab, Tabs } from './tabs';

export const ConnectedSpaceHeader = (props: {
	space: ConnectedConsoleSpace
}) => {
	const { space } = props;

	const location = useLocation();
	const history = useHistory();

	const isOverallActive = !!matchPath(location.pathname, Path.CONSOLE_CONNECTED_SPACE_OVERALL);
	const isResourcesActive = !!matchPath(location.pathname, Path.CONSOLE_CONNECTED_SPACE_RESOURCES);

	const onOverallClicked = () => history.push(toConnectedSpace(Path.CONSOLE_CONNECTED_SPACE_OVERALL, space.connectId));
	const onResourcesClicked = () => history.push(toConnectedSpace(Path.CONSOLE_CONNECTED_SPACE_RESOURCES, space.connectId));

	return <Header>
		<SpaceHeaderTitle space={space}/>
		<Tabs>
			<Tab active={isOverallActive} icon={faServer} label='Overall'
			     onClick={onOverallClicked}/>
			<GroupTab space={space}/>
			<SubjectTab space={space}/>
			<Tab active={isResourcesActive} icon={faBezierCurve} label='Available Resources'
			     onClick={onResourcesClicked}/>
		</Tabs>
	</Header>;
};
