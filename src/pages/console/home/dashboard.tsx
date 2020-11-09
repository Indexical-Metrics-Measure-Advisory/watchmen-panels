import { faSolarPanel, faStar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useRef } from 'react';
import { ConsoleDashboard } from '../../../services/console/types';
import { useTooltip } from '../context/console-tooltip';
import { SpaceContainer } from './space-container';

export const Dashboard = (props: {
	data: ConsoleDashboard
}) => {
	const { data } = props;

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
				<FontAwesomeIcon icon={faSolarPanel}/>
				<span/>
			</span>
			<span>{data.name}</span>
		</div>
		<div onMouseEnter={mouseEnter} onMouseLeave={mouseLeave} ref={buttonRef}>
			<FontAwesomeIcon icon={faStar}/>
		</div>
	</SpaceContainer>;
};