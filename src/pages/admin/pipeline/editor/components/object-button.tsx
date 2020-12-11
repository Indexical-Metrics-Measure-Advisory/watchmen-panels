import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import { useCollapseFixedThing } from '../../../../../common/utils';
import Button, { ButtonType } from '../../../../component/button';

export const ObjectButton = styled(Button)`
	position: relative;
	height: 24px;
	font-size: 0.9em;
	font-variant: petite-caps;
	font-weight: var(--font-bold);
	border: 0;
	opacity: 1;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
	&[data-ink-type=primary] {
		background-color: var(--console-primary-color);
	}
	&[data-ink-type=danger] {
		background-color: var(--console-danger-color);
		&:hover {
			box-shadow: var(--console-danger-hover-shadow);
		}
	}
	&[data-ink-type=waive] {
		color: var(--console-font-color);
		background-color: var(--bg-color);
		border: var(--border);
		opacity: 0.8;
	}
	&:hover {
		box-shadow: var(--console-primary-hover-shadow);
		transform: none;
	}
	&[data-menu-visible=true] {
		&:before {
			content: '';
			display: block;
			position: absolute;
			left: 10%;
			width: 80%;
			height: 1px;
			background-color: var(--invert-color);
			opacity: 0.5;
		}
		&[data-menu-at-top=true] {
			border-top-left-radius: 0;
			border-top-right-radius: 0;
			&:before {
				top: 0;
			}
		}
		&[data-menu-at-top=false] {
			border-bottom-left-radius: 0;
			border-bottom-right-radius: 0;
			&:before {
				bottom: 0;
			}
		}
	}
	> svg:first-child {
		font-size: 0.8em;
		margin-right: calc(var(--margin) / 5);
	}
	> span:nth-child(2) {
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}
	> span[data-role='more-buttons'] {
		display: flex;
		position: relative;
		height: 24px;
		width: 30px;
		align-items: center;
		text-align: center;
		padding-left: 12px;
		margin: -6px -16px -6px 10px;
		&:before {
			content: '';
			display: block;
			position: absolute;
			left: 0;
			top: 30%;
			width: 1px;
			height: 40%;
			background-color: var(--invert-color);
			opacity: 0.5;
		}
	}
`;

export const PrimaryObjectButton = styled(ObjectButton).attrs({ 'data-ink-type': 'primary' })``;
export const DangerObjectButton = styled(ObjectButton).attrs({ 'data-ink-type': 'danger' })``;
export const WaiveObjectButton = styled(ObjectButton).attrs({ 'data-ink-type': 'waive' })``;

interface DropdownState {
	visible: boolean;
	top: number;
	left: number;
	minWidth: number;
	atTop: boolean
}

const Dropdown = styled.div.attrs<DropdownState>(({ visible, top, left, minWidth, atTop }) => {
	return {
		'data-at-top': atTop,
		style: {
			opacity: visible ? 1 : 0,
			pointerEvents: visible ? 'auto' : 'none',
			minWidth,
			top,
			left,
			borderTopLeftRadius: atTop ? 'var(--border-radius)' : 0,
			borderTopRightRadius: atTop ? 'var(--border-radius)' : 0,
			borderBottomLeftRadius: atTop ? 0 : 'var(--border-radius)',
			borderBottomRightRadius: atTop ? 0 : 'var(--border-radius)'
		}
	};
})<DropdownState>`
	display: flex;
	flex-direction: column;
	position: fixed;
	overflow-x: hidden;
	border-radius: 0;
	transition: opacity 300ms ease-in-out;
	> button {
		border-radius: 0;
	}
	&[data-ink-type=primary] {
		box-shadow: var(--console-primary-hover-shadow);
	}
	&[data-ink-type=danger] {
		box-shadow: var(--console-danger-hover-shadow);
	}
`;
const DropdownMenu = styled.div`
	display: flex;
	align-items: center;
	padding: 6px calc(var(--margin) / 2);
	height: 24px;
	font-size: 0.9em;
	font-variant: petite-caps;
	font-weight: var(--font-bold);
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	&:hover {
		filter: brightness(140%);
	}
	&[data-ink-type=primary] {
		background-color: var(--console-primary-color);
		box-shadow: var(--console-primary-hover-shadow);
	}
	&[data-ink-type=danger] {
		background-color: var(--console-danger-color);
		box-shadow: var(--console-danger-hover-shadow);
	}
	&[data-ink-type=waive] {
		color: var(--console-font-color);
		background-color: var(--bg-color);
		border: var(--border);
		opacity: 0.8;
	}
	> svg:first-child {
		font-size: 0.8em;
		margin-right: calc(var(--margin) / 5);
	}
`;

export const DropdownButton = (props: {
	icon: IconProp;
	label: string;
	type: ButtonType;
	onClick: () => void;
	menus: Array<{ icon: IconProp, label: string, onClick: () => void }>;
}) => {
	const { icon, label, type, onClick, menus } = props;

	const containerRef = useRef<HTMLButtonElement>(null);
	const [ expanded, setExpanded ] = useState({ visible: false, left: 0, top: 0, minWidth: 0, atTop: false });
	useCollapseFixedThing(containerRef, () => setExpanded({ ...expanded, visible: false }));

	const onExpandClicked = (event: React.MouseEvent<HTMLSpanElement>) => {
		event.preventDefault();
		event.stopPropagation();
		const rect = containerRef.current!.getBoundingClientRect();
		if (rect.top + rect.height + menus.length * 24 > window.innerHeight) {
			setExpanded({
				visible: true,
				top: rect.top - menus.length * 24,
				left: rect.left,
				minWidth: rect.width,
				atTop: true
			});
		} else {
			setExpanded({
				visible: true,
				top: rect.top + rect.height,
				left: rect.left,
				minWidth: rect.width,
				atTop: false
			});
		}
	};
	const onMenuClicked = (doOnClick: () => void) => (event: React.MouseEvent<HTMLDivElement>) => {
		event.preventDefault();
		event.stopPropagation();
		setExpanded({ ...expanded, visible: false });
		doOnClick();
	};

	return <ObjectButton inkType={type} onClick={onClick} ref={containerRef}
	                     data-menu-at-top={expanded.atTop}
	                     data-menu-visible={expanded.visible}>
		<FontAwesomeIcon icon={icon}/>
		<span>{label}</span>
		<span data-role='more-buttons' onClick={onExpandClicked}>
			<FontAwesomeIcon icon={faCaretDown}/>
		</span>
		<Dropdown {...expanded} data-ink-type={type}>
			{menus.map(({ icon, label, onClick }) => {
				return <DropdownMenu data-ink-type={type} key={label} onClick={onMenuClicked(onClick)}>
					<FontAwesomeIcon icon={icon}/>
					<span>{label}</span>
				</DropdownMenu>;
			})}
		</Dropdown>
	</ObjectButton>;
};