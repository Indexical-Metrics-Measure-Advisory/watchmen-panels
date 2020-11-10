import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useRef } from 'react';
import { useTooltip } from '../context/console-tooltip';

export const ActionButton = (props: {
	tooltip: string,
	icon: IconProp
}) => {
	const { tooltip, icon } = props;

	const buttonRef = useRef<HTMLDivElement>(null);
	const { mouseEnter, mouseLeave } = useTooltip<HTMLDivElement>({
		show: true,
		tooltip,
		ref: buttonRef,
		rect: ({ left, top }) => ({
			x: left + 16,
			y: top - 30,
			center: true
		})
	});
	return <div onMouseEnter={mouseEnter} onMouseLeave={mouseLeave} ref={buttonRef}>
		<FontAwesomeIcon icon={icon}/>
	</div>;
};