import React, { useRef } from 'react';
import styled from 'styled-components';
import { TooltipAlignment, useTooltip } from './context/console-tooltip';

export const CarvedButton = styled.button`
	display: flex;
	position: relative;
	align-items: center;
	justify-content: center;
	padding: 4px calc(var(--margin) / 2);
	border: 0;
	border-radius: var(--border-radius);
	appearance: none;
	outline: none;
	background-color: transparent;
	color: var(--console-primary-color);
	font-weight: var(--font-bold);
	cursor: pointer;
	transition: all 300ms ease-in-out;
	&[data-visible=false] {
		opacity: 0;
		pointer-events: none;
	}
	&:hover {
		color: var(--console-primary-color);
		background-color: var(--invert-color);
		box-shadow: var(--console-hover-shadow);
	}
	> svg {
		margin-right: calc(var(--margin) / 4);
	}
`;

export const TooltipCarvedButton = (props: {
	tooltip?: string;
	center?: boolean;
	onClick?: (event: React.MouseEvent) => void;
	children: ((props: any) => React.ReactNode) | React.ReactNode
}) => {
	const { tooltip, center = false, onClick, children } = props;

	const buttonRef = useRef<HTMLButtonElement>(null);
	const { mouseEnter, mouseLeave, hide } = useTooltip({
		show: !!tooltip,
		tooltip,
		ref: buttonRef,
		rect: () => ({ align: center ? TooltipAlignment.CENTER : TooltipAlignment.LEFT, offsetY: 10 })
	});

	const onClicked = (event: React.MouseEvent) => {
		if (onClick) {
			hide && hide();
			onClick(event);
		}
	};

	return <CarvedButton onMouseEnter={mouseEnter} onMouseLeave={mouseLeave}
	                     onClick={onClicked}
	                     ref={buttonRef}>
		{children}
	</CarvedButton>;
};