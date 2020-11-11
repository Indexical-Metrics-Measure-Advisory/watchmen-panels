import { faBars, faBezierCurve, faCompactDisc, faGlobe, faSearch, faServer } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import Path from '../../../common/path';
import { ConsoleSpaceType } from '../../../services/console/types';
import { useConsoleContext } from '../context/console-context';
import { Body, Container, Header, Title } from './components';
import { HeaderButtons } from './header-buttons';
import { Tab, Tabs } from './tabs';
import { TopicsOverview } from './topics-overview';

enum ActiveTab {
	BOARD = 'board',
	TOPICS = 'topics'
}

export const ConnectedSpace = () => {
	const history = useHistory();
	const { connectId } = useParams<{ connectId: string }>();
	const { spaces: { connected: spaces } } = useConsoleContext();
	const [ activeTab, setActiveTab ] = useState<ActiveTab>(ActiveTab.BOARD);

	// eslint-disable-next-line
	const space = spaces.find(space => space.connectId == connectId)!;

	if (!space) {
		history.replace(Path.CONSOLE_HOME);
		return null;
	}

	const onTabClicked = (active: ActiveTab) => () => (activeTab !== active) && setActiveTab(active);
	const onSearchClicked = () => {
	};
	const onMenuClicked = () => {
	};

	const headerButtons = [
		{ icon: faSearch, label: 'Search', onClick: onSearchClicked },
		{ icon: faBars, label: 'Menu', onClick: onMenuClicked }
	];

	return <Container>
		<Header>
			<Title>
				<FontAwesomeIcon icon={space.type === ConsoleSpaceType.PUBLIC ? faGlobe : faCompactDisc}/>
				<span>{space.name}</span>
			</Title>
			<Tabs>
				<Tab active={activeTab === ActiveTab.BOARD} icon={faServer} label='Board'
				     onClick={onTabClicked(ActiveTab.BOARD)}/>
				<Tab active={activeTab === ActiveTab.TOPICS} icon={faBezierCurve} label='Topics Overview'
				     onClick={onTabClicked(ActiveTab.TOPICS)}/>
			</Tabs>
			<HeaderButtons buttons={headerButtons}/>
		</Header>
		<Body>
			<TopicsOverview visible={activeTab === ActiveTab.TOPICS} space={space}/>
		</Body>
	</Container>;
};
