import { faPlug, faPoll, faSatellite, faTachometerAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import BackgroundImage from '../../../assets/console-home-background.png';
import { ConnectedConsoleSpace } from '../../../services/console/types';
import { useNotImplemented } from '../../context/not-implemented';
import { NarrowPageTitle } from '../component/narrow-page-title';
import { NarrowContainer } from '../component/page-container';
import { useConsoleContext } from '../context/console-context';
import { Dashboard } from './dashboard';
import { HomeSection } from './home-section';
import { HomeSectionHeaderButton } from './home-section-header-button';
import { Space } from './space';

export const Home = () => {
	const notImpl = useNotImplemented();
	const { spaces: { connected }, dashboards: { items: dashboards } } = useConsoleContext();

	const spaces: Array<ConnectedConsoleSpace> =
		connected.sort((s1, s2) => {
			return s1.lastVisitTime.localeCompare(s2.lastVisitTime);
		}).reverse();

	return <NarrowContainer background-image={BackgroundImage}>
		<NarrowPageTitle title='Home'/>
		<HomeSection title='Spaces' titleIcon={faSatellite}
		             titleOperators={<HomeSectionHeaderButton onClick={notImpl.show}>
			             <FontAwesomeIcon icon={faPlug}/>
			             <span>Connect New Space</span>
		             </HomeSectionHeaderButton>}
		             itemCount={spaces.length}>
			{spaces.map(space => {
				return <Space key={`connected-${space.connectId}`} space={space}/>;
			})}
		</HomeSection>
		<HomeSection title='Dashboards' titleIcon={faTachometerAlt}
		             titleOperators={<HomeSectionHeaderButton onClick={notImpl.show}>
			             <FontAwesomeIcon icon={faPoll}/>
			             <span>Create New Dashboard</span>
		             </HomeSectionHeaderButton>}
		             itemCount={dashboards.length}>
			{dashboards.map(dashboard => {
				return <Dashboard key={`dashboard-${dashboard.dashboardId}`} data={dashboard}/>;
			})}
		</HomeSection>
	</NarrowContainer>;
};