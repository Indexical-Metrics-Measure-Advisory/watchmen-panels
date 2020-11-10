import { faCompactDisc, faGlobe, faStar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { ConnectedConsoleSpace, ConsoleSpaceType } from '../../../services/console/types';
import { ActionButton } from './action-button';
import { HomeSectionCard } from './home-section-card';

export const ConnectedSpace = (props: {
	space: ConnectedConsoleSpace
}) => {
	const { space } = props;

	return <HomeSectionCard btnColor='--console-favorite-color'>
		<div>
			<span>
				<FontAwesomeIcon icon={space.type === ConsoleSpaceType.PUBLIC ? faGlobe : faCompactDisc}/>
				<span>Connected / {space.type === ConsoleSpaceType.PUBLIC ? 'Public' : 'Private'}</span>
			</span>
			<span>{space.name}</span>
		</div>
		<ActionButton tooltip='Add into Favorite' icon={faStar}/>
	</HomeSectionCard>;
};