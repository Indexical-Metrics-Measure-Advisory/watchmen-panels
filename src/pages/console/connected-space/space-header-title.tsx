import { faCaretDown, faCompactDisc, faCube, faGlobe, faPoll } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { notInMe } from '../../../common/utils';
import { ConnectedConsoleSpace, ConsoleSpaceType } from '../../../services/console/types';

const Title = styled.div.attrs({
	'data-widget': 'console-space-title'
})`
	display: flex;
	position: relative;
	align-items: center;
	font-family: var(--console-title-font-family);
	padding-right: calc(var(--margin) / 2);
	margin-top: 14px;
	margin-bottom: 6px;
	height: 30px;
	cursor: pointer;
	> svg:first-child {
		margin-right: calc(var(--margin) / 5);
		opacity: 0.7;
	}
	> span {
		font-size: 1.2em;
	}
	> svg:nth-child(3) {
		margin-left: calc(var(--margin) / 5);
		width: 24px;
		opacity: 0.7;
		transition: all 300ms ease-in-out;
		&[data-menu-shown=true] {
			transform: rotateX(180deg);
		}
	}
`;
const Menu = styled.div.attrs<{ left: number, top: number, visible: boolean }>(({ left, top, visible }) => {
	return {
		style: {
			left,
			top,
			opacity: visible ? 1 : 0,
			pointerEvents: visible ? 'auto' : 'none'
		}
	};
})<{ left: number, top: number, visible: boolean }>`
	display: flex;
	flex-direction: column;
	position: fixed;
	font-family: var(--font-family);
	width: 306px;
	background-color: var(--invert-color);
	border-radius: var(--border-radius);
	border: var(--border);
	box-shadow: var(--console-hover-shadow);
	transition: all 300ms ease-in-out;
	overflow: hidden;
	z-index: 1000;
`;
const MenuItem = styled.div`
	display: flex;
	align-items: center;
	padding: 0 calc(var(--margin) / 2);
	height: 32px;
	transition: all 300ms ease-in-out;
	&:hover {
		z-index: 1;
		color: var(--console-primary-color);
	}
	> svg {
		margin-right: calc(var(--margin) / 2);
	}
`;

const getPosition = (div: HTMLDivElement) => div.getBoundingClientRect();

export const SpaceHeaderTitle = (props: { space: ConnectedConsoleSpace }) => {
	const { space } = props;

	const containerRef = useRef<HTMLDivElement>(null);
	const [ menuShown, setMenuShown ] = useState<{ left: number; top: number, visible: boolean }>({
		left: 0,
		top: 0,
		visible: false
	});
	useEffect(() => {
		const { top, left, height } = getPosition(containerRef.current!);
		setMenuShown({ visible: false, top: top + height + 30, left });
	}, []);
	useEffect(() => {
		if (!menuShown.visible) {
			return;
		}
		const hide = (event: Event) => {
			if (notInMe(containerRef.current!, event.target)) {
				const { top, left, height } = getPosition(containerRef.current!);
				setMenuShown({ visible: false, top: top + height + 30, left });
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
	}, [ menuShown.visible ]);

	const onTitleClicked = () => {
		if (menuShown.visible) {
			return;
		}
		const pos = getPosition(containerRef.current!);
		const tobe = !menuShown.visible;
		setMenuShown({
			visible: tobe,
			left: pos.left,
			top: pos.top + pos.height + (tobe ? 0 : 30)
		});
	};

	return <Title onClick={onTitleClicked} ref={containerRef}>
		<FontAwesomeIcon icon={space.type === ConsoleSpaceType.PUBLIC ? faGlobe : faCompactDisc}/>
		<span>{space.name}</span>
		<FontAwesomeIcon icon={faCaretDown} data-menu-shown={menuShown.visible}/>
		<Menu {...menuShown}>
			<MenuItem>
				<FontAwesomeIcon icon={faCube}/>
				<span>Add Group</span>
			</MenuItem>
			<MenuItem>
				<FontAwesomeIcon icon={faPoll}/>
				<span>Add Subject</span>
			</MenuItem>
		</Menu>
	</Title>;
};
