import React, { useRef } from 'react';
import styled from 'styled-components';
import { BaseColors24 } from '../../../charts/color-theme';
import { TooltipAlignment, useTooltip } from '../../component/console/context/console-tooltip';

const User = styled.div<{ color: string, 'single-character': boolean }>`
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 1.3em;
	font-family: var(--console-title-font-family);
	font-weight: var(--console-title-font-weight);
	font-variant: petite-caps;
	width: var(--console-menu-item-icon-size);
	height: var(--console-menu-item-icon-size);
	border-radius: 100%;
	background-color: ${({ color }) => color};
	color: var(--invert-color);
	user-select: none;
	transform: scale(0.9);
	transform-origin: center;
	> span:first-child {
		transform: ${({ 'single-character': singleCharacter }) => singleCharacter ? '' : 'translate(1px, -1px)'};
		z-index: 1;
	}
	> span:last-child {
		z-index: 0;
		opacity: 0.7;
		transform: translate(-1px, -1px);
	}
`;

export const UserAvatar = (props: { name: string, showTooltip?: boolean }) => {
	const { name, showTooltip = false } = props;

	const containerRef = useRef<HTMLDivElement>(null);

	const { mouseEnter, mouseLeave } = useTooltip({
		show: showTooltip,
		tooltip: name,
		ref: containerRef,
		rect: () => ({ align: TooltipAlignment.CENTER, offsetY: 10 })
	});

	let first = 'X';
	let second = '';
	const names = (name || '').split(' ');
	if (names.length !== 0) {
		first = ((names[0] || '')[0] || 'X').toUpperCase();
		if (names.length > 1) {
			second = (names[names.length - 1] || '')[0] || '';
		}
	}

	const color = BaseColors24[(first.charCodeAt(0) + (second || ' ').charCodeAt(0)) % BaseColors24.length];

	return <User color={color} single-character={!second}
	             onMouseEnter={mouseEnter} onMouseLeave={mouseLeave}
	             ref={containerRef}>
		<span>{first}</span>
		<span>{second}</span>
	</User>;
};