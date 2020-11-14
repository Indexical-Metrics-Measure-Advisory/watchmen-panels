import { faBezierCurve, faCompactDisc, faGlobe, faServer } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import Path from '../../../common/path';
import { ConsoleSpaceType } from '../../../services/console/types';
import { useConsoleContext } from '../context/console-context';
import { AvailableResources } from './available-resources';
import { Body, Container, Header, Title } from './components';
import { ListView } from './list-view';
import { Tab, Tabs } from './tabs';

enum ActiveTab {
	LIST = 'list',
	RESOURCES = 'resources'
}

export const ConnectedSpace = () => {
	const history = useHistory();
	const { connectId } = useParams<{ connectId: string }>();
	const { spaces: { connected: spaces } } = useConsoleContext();
	const [ activeTab, setActiveTab ] = useState<ActiveTab>(ActiveTab.LIST);

	// eslint-disable-next-line
	const space = spaces.find(space => space.connectId == connectId)!;

	if (!space) {
		history.replace(Path.CONSOLE_HOME);
		return null;
	}

	const onTabClicked = (active: ActiveTab) => () => (activeTab !== active) && setActiveTab(active);

	return <Container>
		<Header>
			<Title>
				<FontAwesomeIcon icon={space.type === ConsoleSpaceType.PUBLIC ? faGlobe : faCompactDisc}/>
				<span>{space.name}</span>
			</Title>
			<Tabs>
				<Tab active={activeTab === ActiveTab.LIST} icon={faServer} label='List View'
				     onClick={onTabClicked(ActiveTab.LIST)}/>
				<Tab active={activeTab === ActiveTab.RESOURCES} icon={faBezierCurve} label='Available Resources'
				     onClick={onTabClicked(ActiveTab.RESOURCES)}/>
			</Tabs>
		</Header>
		<Body>
			<ListView visible={activeTab === ActiveTab.LIST} space={space}/>
			<AvailableResources visible={activeTab === ActiveTab.RESOURCES} space={space}/>
		</Body>
	</Container>;
};
