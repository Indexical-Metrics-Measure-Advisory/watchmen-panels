import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import { useCollapseFixedThing } from '../../../../../common/utils';
import { ButtonType } from '../../../../component/button';
import { ObjectButton } from '../../../../component/object-button';

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