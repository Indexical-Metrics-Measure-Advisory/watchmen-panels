import React, { Dispatch, RefObject, useEffect } from 'react';
import styled from 'styled-components';
import { notInMe } from '../../../common/utils';

export const Container = styled.div.attrs({
	'data-widget': 'console-space-container'
})`
	display: flex;
	flex-direction: column;
	flex-grow: 1;
`;
export const Header = styled.div.attrs({
	'data-widget': 'console-space-header'
})`
	display: flex;
	position: sticky;
	top: 0;
	align-items: center;
	padding: 0 calc(var(--margin) / 2);
	height: 51px;
	background-color: var(--invert-color);
	border-bottom: var(--border);
	z-index: 2;
`;
export const Body = styled.div.attrs({
	'data-widget': 'console-space-body'
})`
	flex-grow: 1;
`;

export interface MenuState {
	left: number;
	top: number,
	visible: boolean
}

export const Menu = styled.div.attrs<MenuState & { itemCount: number }>(({ left, top, visible, itemCount }) => {
	return {
		style: {
			left,
			top,
			height: 2 + 28 * Math.min(10, itemCount),
			transform: visible ? 'scaleY(1)' : 'scaleY(0)',
			opacity: visible ? 1 : 0,
			pointerEvents: visible ? 'auto' : 'none'
		}
	};
})<MenuState & { itemCount: number }>`
	display: flex;
	flex-direction: column;
	position: fixed;
	font-family: var(--font-family);
	width: 306px;
	background-color: var(--invert-color);
	border-radius: var(--border-radius);
	border: var(--border);
	box-shadow: var(--console-hover-shadow);
	transform-origin: top;
	transition: transform 300ms ease-in-out, opacity 300ms ease-in-out;
	overflow-x: hidden;
	overflow-y: auto;
	z-index: 1000;
	&::-webkit-scrollbar {
		background-color: transparent;
		width: 4px;
	}
	&::-webkit-scrollbar-track {
		background-color: var(--scrollbar-background-color);
		border-radius: 2px;
	}
	&::-webkit-scrollbar-thumb {
		background-color: var(--console-favorite-color);
		border-radius: 2px;
	}
`;
export const MenuItem = styled.div`
	display: flex;
	position: relative;
	align-items: center;
	padding: 0 calc(var(--margin) / 2);
	min-height: 28px;
	font-size: 0.8em;
	color: var(--console-font-color);
	cursor: pointer;
	transition: all 300ms ease-in-out;
	//&:before {
	//	content: '';
	//	display: block;
	//	position: absolute;
	//	top: 0;
	//	left: 0;
	//	width: 100%;
	//	height: 100%;
	//	background-color: var(--console-waive-color);
	//	opacity: 0;
	//	transition: opacity 300ms ease-in-out;
	//}
	&:hover {
		color: var(--console-primary-color);
		text-decoration: underline;
		//&:before {
		//	opacity: 0.05;
		//}
	}
	> svg:first-child {
		margin-right: calc(var(--margin) / 3);
	}
	> span {
		flex-grow: 1;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		margin-top: -1px;
		margin-left: 1px;
	}
`;
export const getPosition = (div: HTMLDivElement) => div.getBoundingClientRect();
export const hideMenu = (options: {
	containerRef: React.RefObject<HTMLDivElement>;
	changeState: React.Dispatch<React.SetStateAction<MenuState>>;
	offsetX?: number;
	offsetY?: number;
}) => {
	const { containerRef, changeState, offsetX = 0, offsetY = 0 } = options;

	const { top, left, height } = getPosition(containerRef.current!);
	changeState({ visible: false, left: left + offsetX, top: top + height + offsetY });
};
export const showMenu = (options: {
	containerRef: RefObject<HTMLDivElement>,
	state: MenuState,
	changeState: Dispatch<React.SetStateAction<MenuState>>,
	offsetX?: number;
	offsetY?: number;
}) => {
	const { containerRef, state, changeState, offsetX = 0, offsetY = 0 } = options;

	if (state.visible) {
		return;
	}

	const pos = getPosition(containerRef.current!);
	const tobe = !state.visible;
	changeState({
		visible: tobe,
		left: pos.left + offsetX,
		top: pos.top + pos.height + offsetY
	});
};
export const useMenu = (options: {
	containerRef: RefObject<HTMLDivElement>,
	state: MenuState,
	changeState: Dispatch<React.SetStateAction<MenuState>>,
	offsetX?: number;
	offsetY?: number;
}) => {
	const { containerRef, state, changeState, offsetX = 0, offsetY = 0 } = options;

	useEffect(() => {
		if (containerRef.current) {
			const { top, left, height } = getPosition(containerRef.current);
			changeState({ visible: false, left: left + offsetX, top: top + height + offsetY });
		}
	}, [ containerRef, offsetX, offsetY, changeState ]);
	useEffect(() => {
		if (!state.visible) {
			return;
		}
		const hide = (event: Event) => {
			if (notInMe(containerRef.current!, event.target)) {
				hideMenu({ containerRef, changeState, offsetX, offsetY });
			}
		};
		window.addEventListener('scroll', hide, true);
		window.addEventListener('click', hide, true);
		window.addEventListener('focus', hide, true);
		return () => {
			window.removeEventListener('scroll', hide, true);
			window.removeEventListener('click', hide, true);
			window.removeEventListener('focus', hide, true);
		};
	}, [ state.visible, offsetX, offsetY, containerRef, changeState ]);

};
