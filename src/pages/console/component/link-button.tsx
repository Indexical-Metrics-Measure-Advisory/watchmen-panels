import React, { useRef } from 'react';
import styled from 'styled-components';
import { useTooltip } from '../context/console-tooltip';

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
	background-color: transparent;
	cursor: pointer;
	transition: all 300ms ease-in-out;
	${createLinkButtonBackgroundAnimation({ opacity: 0.2 })}
`;

export const LinkButton = (props: {
	tooltip?: string;
	width?: number;
	center?: boolean;
	ignoreHorizontalPadding?: boolean;
	onClick: () => void;
	children: ((props: any) => React.ReactNode) | React.ReactNode
}) => {
	const { tooltip, width = 0, center = false, ignoreHorizontalPadding, onClick, children } = props;

	const buttonRef = useRef<HTMLButtonElement>(null);
	const { mouseEnter, mouseLeave } = useTooltip({
		show: !!tooltip,
		tooltip,
		ref: buttonRef,
		rect: ({ left, top }) => ({
			x: width ? (width / 2 + left) : left,
			y: top - 36,
			caretLeft: width ? (width / 2 - 4) : 12,
			center
		})
	});

	return <Button ignore-horizontal-padding={ignoreHorizontalPadding}
	               onMouseEnter={mouseEnter} onMouseLeave={mouseLeave}
	               onClick={onClick}
	               ref={buttonRef}>
		{children}
	</Button>;
};