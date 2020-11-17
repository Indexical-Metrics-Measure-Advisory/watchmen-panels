import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { ForwardedRef, forwardRef } from 'react';
import styled from 'styled-components';

export const Tabs = styled.div`
	display: flex;
	align-items: center;
	padding: 0 calc(var(--margin) / 2) 0 0;
	padding-top: 8px;
	height: 50px;
`;
export const TabContainer = styled.div<{ active: boolean }>`
	display: flex;
	position: relative;
	align-items: center;
	border: var(--border);
	border-bottom: 0;
	border-color: ${({ active }) => active ? 'var(--border-color)' : 'transparent'};
	border-top-left-radius: calc(var(--border-radius) * 2);
	border-top-right-radius: calc(var(--border-radius) * 2);
	background-color: ${({ active }) => active ? 'var(--bg-color)' : 'transparent'};
	padding: 6px calc(var(--margin) / 1.5) 5px;
	height: 43px;
	font-size: 0.8em;
	cursor: pointer;
	color: ${({ active }) => active ? 'var(--console-primary-color)' : ''};
	transition: all 300ms ease-in-out;
	&:hover {
		> svg:first-child,
		> span:nth-child(2) {
			opacity: 1;
		}
	}
	> svg:first-child {
		margin-right: calc(var(--margin) / 4);
		opacity: ${({ active }) => active ? 1 : 0.6};
		transition: all 300ms ease-in-out;
	}
	> span:nth-child(2) {
		opacity: ${({ active }) => active ? 1 : 0.6};
		margin-top: -1px;
		transition: all 300ms ease-in-out;
	}
	> div:nth-last-child(2),
	> div:last-child {
		display: block;
		position: absolute;
		bottom: 0;
		width: 8px;
		height: 8px;
		overflow: hidden;
		background-color: var(--bg-color);
		pointer-events: none;
		opacity: ${({ active }) => active ? 1 : 0};
		transition: all 300ms ease-in-out;
		&:before {
			content: '';
			display: block;
			position: absolute;
			height: 16px;
			width: 16px;
			top: -8px;
			border-radius: 100%;
			border-width: 1px;
			border-style: solid;
			border-color: var(--border-color);
			background-color: var(--invert-color);
		}
	}
	> div:nth-last-child(2) {
		right: -8px;
		&:before {
			left: 0;
		}
	}
	> div:last-child {
		left: -8px;
		&:before {
			left: -8px;
		}
	}
`;

export const Tab = forwardRef((props: {
	active: boolean;
	icon: IconProp;
	label: string;
	moreClick?: (event: React.MouseEvent) => void;
	more?: ((props: any) => React.ReactNode) | React.ReactNode;
	onClick: () => void;
}, ref: ForwardedRef<HTMLDivElement>) => {
	const { active, icon, label, moreClick, more, onClick } = props;

	return <TabContainer active={active} onClick={onClick} ref={ref}>
		<FontAwesomeIcon icon={icon}/>
		<span>{label}</span>
		{moreClick ? <FontAwesomeIcon icon={faCaretDown} onClick={moreClick}/> : null}
		{more}
		<div/>
		<div/>
	</TabContainer>;
});