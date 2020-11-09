import { faPlug, faSatelliteDish } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useRef } from 'react';
import { ConsoleSpace } from '../../../services/console/types';
import { useTooltip } from '../context/console-tooltip';
import { SpaceContainer } from './space-container';

export const AvailableSpace = (props: {
	space: ConsoleSpace
}) => {
	const { space } = props;

	const buttonRef = useRef<HTMLDivElement>(null);
	const { mouseEnter, mouseLeave } = useTooltip<HTMLDivElement>({
		show: true,
		tooltip: 'Connect This Space',
		ref: buttonRef,
		rect: ({ left, top }) => ({
			x: left + 16,
			y: top - 30,
			center: true
		})
	});

	return <SpaceContainer>
		<div>
			<span>
				<FontAwesomeIcon icon={faSatelliteDish}/>
				<span>Available</span>
			</span>
			<span>{space.name}</span>
		</div>
		<div onMouseEnter={mouseEnter} onMouseLeave={mouseLeave} ref={buttonRef}>
			<FontAwesomeIcon icon={faPlug}/>
		</div>
	</SpaceContainer>;
};