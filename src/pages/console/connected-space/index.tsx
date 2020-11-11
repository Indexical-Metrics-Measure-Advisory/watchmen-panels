import { faBars, faBezierCurve, faCompactDisc, faGlobe, faSearch, faServer } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import styled from 'styled-components';
import Path from '../../../common/path';
import { ConsoleSpaceType } from '../../../services/console/types';
import { useConsoleContext } from '../context/console-context';
import { SpaceHeaderButtons } from './space-header-buttons';
import { SpaceTab, SpaceTabs } from './space-tabs';

enum ActiveTab {
	BOARD = 'board',
	TOPICS = 'topics'
}

const SpaceContainer = styled.div.attrs({
	'data-widget': 'console-space-container'
})`
	display: flex;
	flex-direction: column;
	flex-grow: 1;
`;
const SpaceHeader = styled.div.attrs({
	'data-widget': 'console-space-header'
})`
	display: flex;
	align-items: center;
	padding: 0 calc(var(--margin) / 2);
	height: 51px;
	background-color: var(--invert-color);
	border-bottom: var(--border);
`;
const SpaceTitle = styled.div.attrs({
	'data-widget': 'console-space-title'
})`
	display: flex;
	align-items: center;
	font-family: var(--console-title-font-family);
	padding-right: calc(var(--margin) / 2);
	margin-top: 14px;
	margin-bottom: 6px;
	height: 30px;
	> svg {
		margin-right: calc(var(--margin) / 5);
		opacity: 0.7;
	}
	> span {
		font-size: 1.2em;
	}
`;

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

	return <SpaceContainer>
		<SpaceHeader>
			<SpaceTitle>
				<FontAwesomeIcon icon={space.type === ConsoleSpaceType.PUBLIC ? faGlobe : faCompactDisc}/>
				<span>{space.name}</span>
			</SpaceTitle>
			<SpaceTabs>
				<SpaceTab active={activeTab === ActiveTab.BOARD} icon={faServer} label='Board'
				          onClick={onTabClicked(ActiveTab.BOARD)}/>
				<SpaceTab active={activeTab === ActiveTab.TOPICS} icon={faBezierCurve} label='Topics'
				          onClick={onTabClicked(ActiveTab.TOPICS)}/>
			</SpaceTabs>
			<SpaceHeaderButtons buttons={headerButtons}/>
		</SpaceHeader>
	</SpaceContainer>;
};
