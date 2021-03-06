import React, { useRef } from 'react';
import styled from 'styled-components';
import { TooltipAlignment, useTooltip } from './context/console-tooltip';

export const createLinkButtonBackgroundAnimation = ({ opacity = 0.2 }) => {
	return `
		&:before {
			content: '';
			display: block;
			position: absolute;
			top: 50%;
			left: 50%;
			width: 0;
			height: 0;
			border-radius: var(--border-radius);
			background-color: transparent;
			opacity: ${opacity};
			transition: all 300ms ease-in-out;
		}
		&:hover:before {
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			background-color: var(--console-waive-color);
		}
	`;
};
const Button = styled.button<{ 'ignore-horizontal-padding'?: boolean }>`
	display: flex;
	position: relative;
	align-items: center;
	justify-content: center;
	padding: 4px ${({ 'ignore-horizontal-padding': ignoreHorizontalPadding }) => ignoreHorizontalPadding ? '4px' : 'calc(var(--margin) / 2)'};
	border: 0;
	appearance: none;
	outline: none;
	color: currentColor;
	background-color: transparent;
	cursor: pointer;
	transition: all 300ms ease-in-out;
	${createLinkButtonBackgroundAnimation({ opacity: 0.2 })}
`;

export const LinkButton = (props: {
	tooltip?: string;
	center?: boolean;
	right?: boolean;
	offsetX?: number;
	offsetY?: number;
	ignoreHorizontalPadding?: boolean;
	onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
	children: ((props: any) => React.ReactNode) | React.ReactNode
}) => {
	const {
		tooltip,
		center = false,
		right = false,
		offsetX = 0,
		offsetY = 10,
		ignoreHorizontalPadding,
		onClick,
		children
	} = props;

	const buttonRef = useRef<HTMLButtonElement>(null);
	const { mouseEnter, mouseLeave, hide } = useTooltip({
		show: !!tooltip,
		tooltip,
		ref: buttonRef,
		rect: () => ({
			align: center ? TooltipAlignment.CENTER : (right ? TooltipAlignment.RIGHT : TooltipAlignment.LEFT),
			offsetY,
			offsetX
		})
	});

	const onClicked = (event: React.MouseEvent<HTMLButtonElement>) => {
		if (onClick) {
			hide && hide();
			onClick(event);
		}
	};

	return <Button ignore-horizontal-padding={ignoreHorizontalPadding}
	               onMouseEnter={mouseEnter} onMouseLeave={mouseLeave}
	               onClick={onClicked}
	               ref={buttonRef}>
		{children}
	</Button>;
};