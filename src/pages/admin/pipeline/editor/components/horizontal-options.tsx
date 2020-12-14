import { faEdit } from '@fortawesome/free-regular-svg-icons';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import styled from 'styled-components';
import { v4 } from 'uuid';

const Options = styled.div`
	display: flex;
	position: relative;
	align-items: stretch;
	justify-self: start;
	border-color: var(--pipeline-bg-color);
	background-color: var(--pipeline-bg-color);
	height: 22px;
	border-radius: 11px;
	outline: none;
	appearance: none;
	overflow: hidden;
	cursor: pointer;
	box-shadow: 0 0 0 1px var(--border-color);
	transition: all 300ms ease-in-out;
	&:hover {
		box-shadow: var(--console-primary-hover-shadow);
	}
	&[data-expanded=true] {
		> div:first-child {
			padding-right: calc(var(--margin) / 2);
		}
		> div:not(:first-child):not(:last-child) {
			padding: 0 calc(var(--margin) / 2);
		}
		> div:not(:first-child):not(:last-child) {
			width: unset;
			background-color: var(--bg-color);
			overflow: unset;
		}
		> div:last-child,
		> div:not(:first-child):not(:last-child) {
			&:hover {
				color: var(--invert-color);
				background-color: var(--console-favorite-color);
			}
		}
		> div:not(:first-child) {
			&:before {
				content: '';
				display: block;
				position: absolute;
				top: 20%;
				left: 0;
				width: 1px;
				height: 60%;
				background-color: var(--console-primary-color);
				border-radius: 1px;
				opacity: 0.5;
				transform: translateX(-50%);
			}
		}
		> div:last-child {
			padding-right: calc(var(--margin) / 2);
			background-color: var(--bg-color);
		}
	}
	> div:first-child {
		display: flex;
		align-items: center;
		padding-left: calc(var(--margin) / 2);
		border-top-left-radius: 12px;
		border-bottom-left-radius: 12px;
		white-space: nowrap;
		overflow: hidden;
	}
	> div:not(:first-child):not(:last-child) {
		display: flex;
		align-items: center;
		position: relative;
		text-align: center;
		padding: 0;
		width: 0;
		white-space: nowrap;
		overflow: hidden;
		transition: all 300ms ease-in-out;
	}
	> div:last-child {
		display: flex;
		align-items: center;
		position: relative;
		padding: 0 calc(var(--margin) / 3);
	}
`;

export const HorizontalOptions = <Option extends any>(props: {
	label: string;
	options: Array<Option>;
	toLabel: (option: Option) => string;
	onSelect: (option: Option) => void;
}) => {
	const { label, options, toLabel, onSelect } = props;

	const [ expanded, setExpanded ] = useState(false);

	const onExpandClick = () => {
		if (!expanded) {
			setExpanded(true);
		}
	};
	const collapse = () => setExpanded(false);
	const onOptionChange = (newOption: Option) => (event: React.MouseEvent<HTMLDivElement>) => {
		event.preventDefault();
		event.stopPropagation();
		onSelect(newOption);
		setExpanded(false);
	};
	const onCaretClicked = (event: React.MouseEvent<HTMLDivElement>) => {
		event.preventDefault();
		event.stopPropagation();
		setExpanded(!expanded);
	};

	return <Options data-expanded={expanded} onClick={onExpandClick} tabIndex={0} onBlur={collapse}>
		<div>{label}</div>
		{options.map(option => {
			return <div key={v4()} onClick={onOptionChange(option)}>
				{toLabel(option)}
			</div>;
		})}
		<div onClick={onCaretClicked}><FontAwesomeIcon icon={expanded ? faTimes : faEdit}/></div>
	</Options>;
};