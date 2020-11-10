import { faPlug, faPoll, faSatellite, faTachometerAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import styled from 'styled-components';
import BackgroundImage from '../../../assets/console-home-background.png';
import { ConnectedConsoleSpace } from '../../../services/console/types';
import { NarrowPageTitle } from '../component/narrow-page-title';
import { NarrowContainer } from '../component/page-container';
import { useConsoleContext } from '../context/console-context';
import { Dashboard } from './dashboard';
import { HomeSection } from './home-section';
import { Space } from './space';

const HeaderOperators = styled.div.attrs({
	'data-widget': 'console-home-section-header-operators'
})`
	display: flex;
	position: relative;
	align-items: center;
	justify-content: flex-end;
	padding: 6px calc(var(--margin) / 2);
	border-radius: var(--border-radius);
	font-size: 0.8em;
	opacity: 0.7;
	cursor: pointer;
	transition: all 300ms ease-in-out;
	&:hover {
		color: var(--console-primary-color);
		background-color: var(--invert-color);
		box-shadow: var(--console-hover-shadow);;
	}
	> svg {
		margin-right: calc(var(--margin) / 4);
	}
`;
export const Home = () => {
	const { spaces: { connected, available }, dashboards: { items: dashboards } } = useConsoleContext();

	const spaces: Array<ConnectedConsoleSpace> =
		connected.sort((s1, s2) => {
			return s1.lastVisitTime.localeCompare(s2.lastVisitTime);
		}).reverse();

	return <NarrowContainer background-image={BackgroundImage}>
		<NarrowPageTitle title='Home'/>
		<HomeSection title='Spaces' titleIcon={faSatellite}
		             titleOperators={<HeaderOperators>
			             <FontAwesomeIcon icon={faPlug}/>
			             <span>Connect New Space</span>
		             </HeaderOperators>}
		             itemCount={spaces.length}>
			{spaces.map(space => {
				return <Space key={`connected-${space.connectId}`} space={space}/>;
			})}
		</HomeSection>
		<HomeSection title='Dashboards' titleIcon={faTachometerAlt}
		             titleOperators={<HeaderOperators>
			             <FontAwesomeIcon icon={faPoll}/>
			             <span>Create New Dashboard</span>
		             </HeaderOperators>}
		             itemCount={dashboards.length}>
			{dashboards.map(dashboard => {
				return <Dashboard key={`dashboard-${dashboard.dashboardId}`} data={dashboard}/>;
			})}
		</HomeSection>
	</NarrowContainer>;
};