import { faPlug, faSatelliteDish } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { ConsoleSpace } from '../../../services/console/types';
import { ActionButton } from './action-button';
import { HomeSectionCard } from './home-section-card';

export const AvailableSpace = (props: {
	space: ConsoleSpace
}) => {
	const { space } = props;

	return <HomeSectionCard>
		<div>
			<span>
				<FontAwesomeIcon icon={faSatelliteDish}/>
				<span>Available</span>
			</span>
			<span>{space.name}</span>
		</div>
		<ActionButton tooltip='Connect This Space' icon={faPlug}/>
	</HomeSectionCard>;
};