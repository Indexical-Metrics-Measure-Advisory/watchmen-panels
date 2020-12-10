import { faCompressAlt, faExpandAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { Fragment, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import {
	ReadTopicActionType,
	SomeValueType,
	SystemActionType,
	UnitAction,
	UnitActionAlarmSeverity,
	UnitActionType,
	WriteTopicActionType
} from '../../../../../services/admin/pipeline-types';

interface DropdownRect {
	top: number;
	left: number;
	width: number;
	atTop: boolean;
}

const ActionSelectContainer = styled.div`
	display: flex;
	position: relative;
	align-self: flex-start;
	justify-self: flex-start;
	border: var(--border);
	border-color: transparent;
	border-radius: 12px;
	background-color: transparent;
	height: 24px;
	line-height: 22px;
	outline: none;
	appearance: none;
	white-space: nowrap;
	cursor: pointer;
	transition: all 300ms ease-in-out;
	&[data-expanded=true],
	&:hover {
		border-color: transparent;
		background-color: var(--pipeline-bg-color);
		box-shadow: var(--console-primary-hover-shadow);
		> div:first-child {
			padding-left: calc(var(--margin) / 2);
		}
		> div:last-child {
			opacity: 1;
			pointer-events: auto;
		}
	}
	&[data-expanded=true] > div:last-child > svg {
		transform: rotateZ(180deg);
	}
	> div:first-child {
		position: relative;
		font-weight: var(--font-bold);
		font-variant: petite-caps;
		border-top-left-radius: 12px;
		border-bottom-left-radius: 12px;
		transition: all 300ms ease-in-out;
	}
	> div:last-child {
		position: relative;
		padding: 0 calc(var(--margin) / 3);
		opacity: 0;
		pointer-events: none;
		transition: all 300ms ease-in-out;
		> svg {
			transition: all 300ms ease-in-out;
		}
	}
`;
const Dropdown = styled.div.attrs<DropdownRect>(({ top, left, width, atTop }) => {
	return {
		style: {
			top, left, minWidth: Math.max(width, 200),
			transformOrigin: atTop ? 'bottom' : 'top'
		}
	};
})<DropdownRect>`
	display: flex;
	position: fixed;
	flex-direction: column;
	z-index: 1000;
	height: 180px;
	transform: scaleY(0);
	transition: transform 300ms ease-in-out;
	pointer-events: none;
	background-color: var(--bg-color);
	border-radius: 12px;
	box-shadow: var(--console-primary-hover-shadow);
	&[data-expanded=true] {
		transform: scaleY(1);
		pointer-events: auto;
		&:before {
			content: '';
			display: block;
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			border-radius: 12px;
			background-color: var(--pipeline-bg-color);
			z-index: -1;
		}
	}
	> div {
		min-height: 28px;
		padding: 0 calc(var(--margin) / 2);
	}
	> div[data-role='action-category'] {
		display: flex;
		align-items: center;
		font-weight: var(--font-bold);
		cursor: default;
	}
	> div[data-role='actions'] {
		display: flex;
		flex-wrap: wrap;
		grid-column-gap: calc(var(--margin) / 4);
		grid-row-gap: calc(var(--margin) / 8);
		background-color: var(--bg-color);
		padding: calc(var(--margin) / 8) calc(var(--margin) / 2);
		cursor: default;
		&:last-child {
			border-bottom-left-radius: 12px;
			border-bottom-right-radius: 12px;
		}
		> div {
			display: flex;
			align-items: center;
			height: 24px;
			line-height: 22px;
			border-radius: 12px;
			border: var(--border);
			padding: 0 calc(var(--margin) / 4);
			transition: all 300ms ease-in-out;
			cursor: pointer;
			&:hover,
			&[data-current=true] {
				border-color: var(--console-favorite-color);
				color: var(--invert-color);
				background-color: var(--console-favorite-color);
			}
			&[data-current=true] {
				cursor: default;
			}
		}
	}
`;

const asDisplayType = (type: UnitActionType): string => {
	return type.split('-').map(word => {
		if ([ 'or', 'and', 'to', 'from' ].includes(word)) {
			return word;
		} else {
			return word.substr(0, 1).toUpperCase() + word.substr(1);
		}
	}).join(' ');
};

const ActionTypes = [
	{ label: 'Write to Topic', enum: WriteTopicActionType },
	{ label: 'Read from Topic', enum: ReadTopicActionType },
	{ label: 'System', enum: SystemActionType }
];

interface ActionDefault {
	keep: Array<string>,
	default: { [key in string]: number | string | boolean | object }
}

const OnActionTypeChanged: { [key in WriteTopicActionType | ReadTopicActionType | SystemActionType]: ActionDefault } = {
	[WriteTopicActionType.INSERT_ROW]: { keep: [ 'topicId' ], default: {} },
	[WriteTopicActionType.MERGE_ROW]: { keep: [ 'topicId' ], default: {} },
	[WriteTopicActionType.INSERT_OR_MERGE_ROW]: { keep: [ 'topicId' ], default: {} },
	[WriteTopicActionType.WRITE_FACTOR]: {
		keep: [ 'topicId', 'factorId' ],
		default: { value: { type: SomeValueType.FACTOR } }
	},
	[ReadTopicActionType.EXISTS]: { keep: [ 'topicId' ], default: {} },
	[ReadTopicActionType.FIND_ROW]: { keep: [ 'topicId' ], default: {} },
	[SystemActionType.COPY_TO_MEMORY]: { keep: [], default: {} },
	[SystemActionType.ALARM]: { keep: [ 'severity' ], default: { severity: UnitActionAlarmSeverity.MEDIUM } }
};

const ActionTypeButton = (props: {
	type: UnitActionType;
	current: UnitActionType;
	onClick: (type: UnitActionType) => void;
}) => {
	const { type, current, onClick } = props;

	return <div data-current={current === type} onClick={() => onClick(type)}>{asDisplayType(type)}</div>;
};

export const ActionSelect = (props: {
	action: UnitAction;
	onTypeChanged: () => void;
}) => {
	const { action, onTypeChanged } = props;
	const { type } = action;

	const containerRef = useRef<HTMLDivElement>(null);
	const dropdownRef = useRef<HTMLDivElement>(null);
	const [ expanded, setExpanded ] = useState(false);
	const [ dropdownRect, setDropdownRect ] = useState<DropdownRect>({ top: 0, left: 0, width: 0, atTop: false });
	useEffect(() => {
		const onScroll = () => setExpanded(false);
		window.addEventListener('scroll', onScroll, true);
		return () => window.removeEventListener('scroll', onScroll, true);
	});

	const collapse = () => setExpanded(false);
	const onExpandClick = () => {
		if (!expanded) {
			const rect = containerRef.current!.getBoundingClientRect();
			const top = rect.top + rect.height + 2;
			const bottom = top + 180;
			if (bottom > window.innerHeight) {
				setDropdownRect({ top: rect.top - 180 - 2, left: rect.left, width: rect.width, atTop: true });
			} else {
				setDropdownRect({ top, left: rect.left, width: rect.width, atTop: false });
			}
			setExpanded(true);
		}
	};
	const onActionTypeClicked = (type: UnitActionType) => {
		if (type === action.type) {
			return;
		}
		action.type = type;
		const actionDefault = OnActionTypeChanged[type];
		// remove irrelevant properties
		Object.keys(action)
			.filter(key => key !== 'type' && !actionDefault.keep.includes(key))
			.forEach(key => delete (action as any)[key]);
		// set default values
		Object.keys(actionDefault.default).forEach(key => (action as any)[key] = actionDefault.default[key]);
		setExpanded(false);
		onTypeChanged();
	};
	const onCaretClicked = (event: React.MouseEvent<HTMLDivElement>) => {
		event.preventDefault();
		event.stopPropagation();
		setExpanded(!expanded);
	};

	return <ActionSelectContainer data-expanded={expanded} tabIndex={0} ref={containerRef}
	                              onClick={onExpandClick} onBlur={collapse}>
		<div>{asDisplayType(type)}</div>
		<Dropdown ref={dropdownRef} data-expanded={expanded} {...dropdownRect}>
			{ActionTypes.map(item => {
				return <Fragment key={item.label}>
					<div data-role='action-category'>{item.label}</div>
					<div data-role='actions'>
						{Object.values(item.enum).map(candidateType => {
							return <ActionTypeButton current={type} type={candidateType} key={candidateType}
							                         onClick={onActionTypeClicked}/>;
						})}
					</div>
				</Fragment>;
			})}
		</Dropdown>
		<div onClick={onCaretClicked}><FontAwesomeIcon icon={expanded ? faCompressAlt : faExpandAlt}/></div>
	</ActionSelectContainer>;
};