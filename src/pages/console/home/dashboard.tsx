import { faSolarPanel, faStar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { ConsoleDashboard } from '../../../services/console/types';
import { ActionButton } from './action-button';
import { HomeSectionCard } from './home-section-card';

export const Dashboard = (props: {
	data: ConsoleDashboard
}) => {
	const { data } = props;

	return <HomeSectionCard btnColor='--console-favorite-color'>
		<div>
			<span>
				<FontAwesomeIcon icon={faSolarPanel}/>
				<span/>
			</span>
			<span>{data.name}</span>
		</div>
		<ActionButton tooltip='Add into Favorite' icon={faStar}/>
	</HomeSectionCard>;
};