import { faEdit } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { ConditionOperator, PlainCondition } from '../../../../../services/admin/pipeline-types';

interface DropdownRect {
	top: number;
	left?: number;
	right?: number;
	width: number;
	atTop: boolean;
}

const DropdownHeight = 28 * 5 + 4;

const ConditionOperatorSelectContainer = styled.div`
	display          : flex;
	position         : relative;
	align-items      : center;
	justify-self     : flex-start;
	border-radius    : var(--border-radius);
	background-color : var(--pipeline-bg-color);
	box-shadow       : 0 0 0 1px var(--border-color);
	height           : 22px;
	outline          : none;
	appearance       : none;
	white-space      : nowrap;
	cursor           : pointer;
	transition       : all 300ms ease-in-out;
	&[data-expanded=true],
	&:hover {
		box-shadow : var(--console-primary-hover-shadow);
	}
	> div:first-child {
		position                  : relative;
		padding-left              : calc(var(--margin) / 2);
		font-variant              : petite-caps;
		font-weight               : var(--font-demi-bold);
		border-top-left-radius    : 12px;
		border-bottom-left-radius : 12px;
	}
	> div:last-child {
		position : relative;
		padding  : 0 calc(var(--margin) / 3);
	}
`;
const Dropdown = styled.div.attrs<DropdownRect>(({ top, left, right, width, atTop }) => {
	return {
		style: {
			top,
			left,
			right: typeof right === 'number' ? `calc(100vw - ${right}px)` : 'unset',
			minWidth: Math.max(width, 200),
			transformOrigin: atTop ? 'bottom' : 'top'
		}
	};
})<DropdownRect>`
	display          : flex;
	position         : fixed;
	flex-direction   : column;
	z-index          : 1000;
	height           : ${DropdownHeight}px;
	transform        : scaleY(0);
	transition       : transform 300ms ease-in-out;
	pointer-events   : none;
	background-color : var(--bg-color);
	border-radius    : 12px;
	box-shadow       : var(--console-primary-hover-shadow);
	&[data-expanded=true] {
		transform      : scaleY(1);
		pointer-events : auto;
		&:before {
			content          : '';
			display          : block;
			position         : absolute;
			top              : 0;
			left             : 0;
			width            : 100%;
			height           : 100%;
			border-radius    : 12px;
			background-color : var(--pipeline-bg-color);
			z-index          : -1;
		}
	}
	> div {
		min-height : 28px;
		padding    : 0 calc(var(--margin) / 2);
	}
	> div[data-role='operators'] {
		display          : flex;
		flex-wrap        : wrap;
		grid-column-gap  : calc(var(--margin) / 4);
		grid-row-gap     : calc(var(--margin) / 8);
		background-color : var(--bg-color);
		padding          : 0 calc(var(--margin) / 2);
		cursor           : default;
		&:first-child {
			border-top-left-radius  : 12px;
			border-top-right-radius : 12px;
			padding-top             : calc(var(--margin) / 8);
			padding-bottom          : calc(var(--margin) / 8);
		}
		&:last-child {
			border-bottom-left-radius  : 12px;
			border-bottom-right-radius : 12px;
			padding-bottom             : calc(var(--margin) / 8);
		}
		> div {
			display       : flex;
			align-items   : center;
			height        : 24px;
			line-height   : 22px;
			border-radius : 12px;
			border        : var(--border);
			padding       : 0 calc(var(--margin) / 2);
			transition    : all 300ms ease-in-out;
			cursor        : pointer;
			&:hover,
			&[data-current=true] {
				border-color     : var(--console-favorite-color);
				color            : var(--invert-color);
				background-color : var(--console-favorite-color);
			}
			&[data-current=true] {
				cursor : default;
			}
		}
	}
`;

const asDisplayOperator = (operator: ConditionOperator): string => {
	switch (operator) {
		case ConditionOperator.EMPTY:
			return 'Is Empty';
		case ConditionOperator.NOT_EMPTY:
			return 'Is Not Empty';
		// date part
		case ConditionOperator.EQUALS:
			return 'Equals';
		case ConditionOperator.NOT_EQUALS:
			return 'Not Equals';
		case ConditionOperator.LESS:
			return 'Less Than';
		case ConditionOperator.LESS_EQUALS:
			return 'Less Than or Equals';
		case ConditionOperator.MORE:
			return 'Greater Than';
		case ConditionOperator.MORE_EQUALS:
			return 'Greater Than or Equals';
		case ConditionOperator.IN:
			return 'In';
		case ConditionOperator.NOT_IN:
			return 'Not In';
	}
};

const OperatorButton = (props: {
	operator: ConditionOperator;
	current: ConditionOperator;
	onClick: (type: ConditionOperator) => void;
}) => {
	const { operator, current, onClick } = props;

	return <div data-current={current === operator} onClick={() => onClick(operator)}>
		{asDisplayOperator(operator)}
	</div>;
};

export const ConditionOperatorSelect = (props: {
	condition: PlainCondition;
	right?: boolean;
	onChange: () => void;
}) => {
	const { condition, right = false, onChange } = props;

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
			const bottom = top + DropdownHeight;
			if (bottom > window.innerHeight) {
				setDropdownRect({
					top: rect.top - DropdownHeight - 2,
					left: right ? (void 0) : rect.left,
					right: right ? rect.right : (void 0),
					width: rect.width,
					atTop: true
				});
			} else {
				setDropdownRect({
					top,
					left: right ? (void 0) : rect.left,
					right: right ? rect.right : (void 0),
					width: rect.width,
					atTop: false
				});
			}
			setExpanded(true);
		}
	};
	const onOperatorClicked = (operator: ConditionOperator) => {
		if (operator === condition.operator) {
			return;
		}
		condition.operator = operator;
		onChange();
		setExpanded(false);
	};
	const onCaretClicked = (event: React.MouseEvent<HTMLDivElement>) => {
		event.preventDefault();
		event.stopPropagation();
		setExpanded(!expanded);
	};

	return <ConditionOperatorSelectContainer data-expanded={expanded} tabIndex={0} ref={containerRef}
	                                         onClick={onExpandClick} onBlur={collapse}>
		<div>{asDisplayOperator(condition.operator)}</div>
		<Dropdown ref={dropdownRef} data-expanded={expanded} {...dropdownRect}>
			<div data-role='operators'>
				<OperatorButton current={condition.operator} operator={ConditionOperator.EMPTY}
				                onClick={onOperatorClicked}/>
				<OperatorButton current={condition.operator} operator={ConditionOperator.NOT_EMPTY}
				                onClick={onOperatorClicked}/>
			</div>
			<div data-role='operators'>
				<OperatorButton current={condition.operator} operator={ConditionOperator.EQUALS}
				                onClick={onOperatorClicked}/>
				<OperatorButton current={condition.operator} operator={ConditionOperator.NOT_EQUALS}
				                onClick={onOperatorClicked}/>
			</div>
			<div data-role='operators'>
				<OperatorButton current={condition.operator} operator={ConditionOperator.LESS}
				                onClick={onOperatorClicked}/>
				<OperatorButton current={condition.operator} operator={ConditionOperator.LESS_EQUALS}
				                onClick={onOperatorClicked}/>
			</div>
			<div data-role='operators'>
				<OperatorButton current={condition.operator} operator={ConditionOperator.MORE}
				                onClick={onOperatorClicked}/>
				<OperatorButton current={condition.operator} operator={ConditionOperator.MORE_EQUALS}
				                onClick={onOperatorClicked}/>
			</div>
			<div data-role='operators'>
				<OperatorButton current={condition.operator} operator={ConditionOperator.IN}
				                onClick={onOperatorClicked}/>
				<OperatorButton current={condition.operator} operator={ConditionOperator.NOT_IN}
				                onClick={onOperatorClicked}/>
			</div>
		</Dropdown>
		<div onClick={onCaretClicked}><FontAwesomeIcon icon={faEdit}/></div>
	</ConditionOperatorSelectContainer>;
};