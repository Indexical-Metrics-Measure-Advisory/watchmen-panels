import { faPlug, faPoll } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { ActionButton } from './action-button';
import { HomeSectionCard } from './home-section-card';

export const NewDashboard = (props: {}) => {
	return <HomeSectionCard>
		<div>
			<span>
				<FontAwesomeIcon icon={faPoll}/>
				<span/>
			</span>
			<span>Create New Dashboard</span>
		</div>
		<ActionButton tooltip='Create New Dashboard' icon={faPlug}/>
	</HomeSectionCard>;
};