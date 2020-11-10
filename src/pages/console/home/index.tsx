import { faCaretDown, faSatellite, faTachometerAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import styled from 'styled-components';
import BackgroundImage from '../../../assets/console-home-background.png';
import { ConnectedConsoleSpace, ConsoleSpace } from '../../../services/console/types';
import { NarrowPageTitle } from '../component/narrow-page-title';
import { NarrowContainer } from '../component/page-container';
import { useConsoleContext } from '../context/console-context';
import { AvailableSpace } from './available-space';
import { ConnectedSpace } from './connected-space';
import { Dashboard } from './dashboard';
import { NewDashboard } from './new-dashboard';

const HomeSection = styled.div.attrs({
	'data-widget': 'console-home-section'
})<{ itemCount: number }>`
	display: flex;
	flex-direction: column;
	margin-top: var(--margin);
	transition: all 300ms ease-in-out;
	&:not(:nth-child(2)) {
		margin-top: calc(var(--margin) / 2);
	}
	&:last-child {
		margin-bottom: var(--margin);
	}
	&[data-visible=false] {
		> div[data-widget='console-home-section-header'] {
			> div[data-widget='console-home-section-title'] {
				> svg:first-child {
					opacity: 1;
					transform: translateY(-50%) rotateZ(-90deg);
				}
			}
		}
		> div[data-widget='console-home-section-body'] {
			padding-top: 0;
			padding-bottom: 0;
			height: 0;
		}
	}
	> div[data-widget='console-home-section-body'] {
		height: calc(var(--margin) / 3 * (2 + ${({ itemCount }) => Math.ceil(itemCount / 3) - 1}) + ${({ itemCount }) => Math.ceil(itemCount / 3) * 64}px);
		> div {
			height: 64px;
		}
	}
`;
const HomeSectionHeader = styled.div.attrs({
	'data-widget': 'console-home-section-header'
})`
	display: flex;
`;
const HomeSectionTitle = styled.div.attrs({
	'data-widget': 'console-home-section-title'
})`
	display: flex;
	position: relative;
	align-items: center;
	height: 3em;
	margin-left: calc(var(--margin) / 3 * -1);
	padding-left: calc(var(--margin) / 3);
	padding-right: var(--margin);
	font-family: var(--console-title-font-family);
	font-size: 1.2em;
	font-weight: var(--font-demi-bold);
	cursor: pointer;
	&:hover {
		> svg, > div:last-child {
			color: var(--console-primary-color);
		}
		> svg:first-child {
			pointer-events: auto;
			opacity: 1;
		}
	}
	> svg:nth-child(2) {
		margin-right: calc(var(--margin) / 3);
	}
	> svg:first-child {
		display: block;
		position: absolute;
		right: 100%;
		top: 50%;
		transform: translateY(-50%);
		opacity: 0;
		user-select: none;
		transition: all 300ms ease-in-out;
	}
`;
const HomeSectionBody = styled.div.attrs({
	'data-widget': 'console-home-section-body'
})`
	display: grid;
	position: relative;
	grid-template-columns: repeat(3, minmax(0, 1fr));
	grid-gap: calc(var(--margin) / 3);
	background-color: var(--console-home-section-body-bg-color);
	overflow: hidden;
	padding: calc(var(--margin) / 3);
	border-radius: calc(var(--margin) / 2);
	transition: all 300ms ease-in-out;
`;

const isConnectedSpace = (space: ConsoleSpace): space is ConnectedConsoleSpace => {
	const s = space as any;
	return !!s.connectId;
};

export const Home = () => {
	const { spaces: { connected, available }, dashboards: { items: dashboards } } = useConsoleContext();

	const [ spaceCollapsed, setSpaceCollapsed ] = useState(false);
	const [ dashboardCollapsed, setDashboardCollapsed ] = useState(false);

	const connectedSpaceMap = connected.reduce((map, space) => {
		map.set(space.spaceId, space);
		return map;
	}, new Map<string, ConsoleSpace>());
	const spaces: Array<ConsoleSpace> = [
		...connected.sort((s1, s2) => s1.name.localeCompare(s2.name)),
		...available.filter(space => !connectedSpaceMap.has(space.spaceId))
	];

	return <NarrowContainer background-image={BackgroundImage}>
		<NarrowPageTitle title='Home'/>
		<HomeSection data-visible={!spaceCollapsed} itemCount={spaces.length}>
			<HomeSectionHeader>
				<HomeSectionTitle onClick={() => setSpaceCollapsed(!spaceCollapsed)}>
					<FontAwesomeIcon icon={faCaretDown}/>
					<FontAwesomeIcon icon={faSatellite}/>
					<div>Spaces</div>
				</HomeSectionTitle>
			</HomeSectionHeader>
			<HomeSectionBody>
				{spaces.map(space => {
					if (isConnectedSpace(space)) {
						return <ConnectedSpace key={`connected-${space.connectId}`} space={space}/>;
					} else {
						return <AvailableSpace key={`available-${space.spaceId}`} space={space}/>;
					}
				})}
			</HomeSectionBody>
		</HomeSection>
		<HomeSection data-visible={!dashboardCollapsed} itemCount={dashboards.length + 1}>
			<HomeSectionHeader>
				<HomeSectionTitle onClick={() => setDashboardCollapsed(!dashboardCollapsed)}>
					<FontAwesomeIcon icon={faCaretDown}/>
					<FontAwesomeIcon icon={faTachometerAlt}/>
					<div>Dashboards</div>
				</HomeSectionTitle>
			</HomeSectionHeader>
			<HomeSectionBody>
				{dashboards.map(dashboard => {
					return <Dashboard key={`dashboard-${dashboard.dashboardId}`} data={dashboard}/>;
				})}
				<NewDashboard/>
			</HomeSectionBody>
		</HomeSection>
	</NarrowContainer>;
};