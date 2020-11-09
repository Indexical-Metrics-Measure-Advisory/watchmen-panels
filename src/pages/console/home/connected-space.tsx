import { faCompactDisc, faGlobe, faStar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useRef } from 'react';
import { ConnectedConsoleSpace, ConsoleSpaceType } from '../../../services/console/types';
import { useTooltip } from '../context/console-tooltip';
import { SpaceContainer } from './space-container';

export const ConnectedSpace = (props: {
	space: ConnectedConsoleSpace
}) => {
	const { space } = props;

	const buttonRef = useRef<HTMLDivElement>(null);
	const { mouseEnter, mouseLeave } = useTooltip<HTMLDivElement>({
		show: true,
		tooltip: 'Add into Favorite',
		ref: buttonRef,
		rect: ({ left, top }) => ({
			x: left + 16,
			y: top - 30,
			center: true
		})
	});

	return <SpaceContainer btnColor='--console-favorite-color'>
		<div>
			<span>
				<FontAwesomeIcon icon={space.type === ConsoleSpaceType.PUBLIC ? faGlobe : faCompactDisc}/>
				<span>Connected / {space.type === ConsoleSpaceType.PUBLIC ? 'Public' : 'Private'}</span>
			</span>
			<span>{space.name}</span>
		</div>
		<div onMouseEnter={mouseEnter} onMouseLeave={mouseLeave} ref={buttonRef}>
			<FontAwesomeIcon icon={faStar}/>
		</div>
	</SpaceContainer>;
};