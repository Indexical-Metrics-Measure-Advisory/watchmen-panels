import { faEdit } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { Fragment, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import {
	DatePartArithmetic,
	NoArithmetic,
	NumericArithmetic,
	SimpleFuncArithmetic,
	SimpleFuncValue
} from '../../../../../services/admin/pipeline-types';

interface DropdownRect {
	top: number;
	left?: number;
	right?: number;
	width: number;
	atTop: boolean;
}

const DropdownHeight = 120;

const ArithmeticSelectContainer = styled.div`
	display: flex;
	position: relative;
	align-items: center;
	justify-self: flex-start;
	border-radius: var(--border-radius);
	background-color: var(--pipeline-bg-color);
	box-shadow: 0 0 0 1px var(--border-color);
	height: 22px;
	outline: none;
	appearance: none;
	white-space: nowrap;
	cursor: pointer;
	transition: all 300ms ease-in-out;
	&[data-expanded=true],
	&:hover {
		box-shadow: var(--console-primary-hover-shadow);
	}
	> div:first-child {
		position: relative;
		padding-left: calc(var(--margin) / 2);
		font-variant: petite-caps;
		font-weight: var(--font-demi-bold);
		border-top-left-radius: 12px;
		border-bottom-left-radius: 12px;
	}
	> div:last-child {
		position: relative;
		padding: 0 calc(var(--margin) / 3);
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
	display: flex;
	position: fixed;
	flex-direction: column;
	z-index: 1000;
	height: ${DropdownHeight}px;
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

const asDisplayArithmetic = (arithmetic: SimpleFuncArithmetic): string => {
	switch (arithmetic) {
		// date part
		case DatePartArithmetic.YEAR_OF:
			return 'Year';
		case DatePartArithmetic.MONTH_OF:
			return 'Month';
		case DatePartArithmetic.WEEK_OF:
			return 'Week of Year';
		case DatePartArithmetic.WEEKDAY:
			return 'Weekday';
		// numeric
		case NumericArithmetic.ABSOLUTE_VALUE:
			return 'Abs';
		case NumericArithmetic.LOGARITHM:
			return 'Log';
		case NumericArithmetic.PERCENTAGE:
			return '%';
		// no func
		case NoArithmetic.NO_FUNC:
			return 'No Func';
	}
};

const ArithmeticTypes = [
	{ label: 'Date Time', enum: DatePartArithmetic },
	{ label: 'Numeric', enum: NumericArithmetic }
];

const ArithmeticButton = (props: {
	arithmetic: SimpleFuncArithmetic;
	current: SimpleFuncArithmetic;
	onClick: (type: SimpleFuncArithmetic) => void;
}) => {
	const { arithmetic, current, onClick } = props;

	return <div data-current={current === arithmetic} onClick={() => onClick(arithmetic)}>
		{asDisplayArithmetic(arithmetic)}
	</div>;
};

export const ArithmeticSelect = (props: {
	value: SimpleFuncValue;
	right?: boolean;
	onChange: () => void;
}) => {
	const { value, right = false, onChange } = props;

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
	const onArithmeticClicked = (arithmetic: SimpleFuncArithmetic) => {
		if (arithmetic === value.arithmetic) {
			return;
		}
		value.arithmetic = arithmetic;
		onChange();
		setExpanded(false);
	};
	const onCaretClicked = (event: React.MouseEvent<HTMLDivElement>) => {
		event.preventDefault();
		event.stopPropagation();
		setExpanded(!expanded);
	};

	return <ArithmeticSelectContainer data-expanded={expanded} tabIndex={0} ref={containerRef}
	                                  onClick={onExpandClick} onBlur={collapse}>
		<div>{asDisplayArithmetic(value.arithmetic)}</div>
		<Dropdown ref={dropdownRef} data-expanded={expanded} {...dropdownRect}>
			{ArithmeticTypes.map(item => {
				return <Fragment key={item.label}>
					<div data-role='action-category'>{item.label}</div>
					<div data-role='actions'>
						{Object.values(item.enum).map(candidateType => {
							return <ArithmeticButton current={value.arithmetic} arithmetic={candidateType}
							                         key={candidateType}
							                         onClick={onArithmeticClicked}/>;
						})}
					</div>
				</Fragment>;
			})}
		</Dropdown>
		<div onClick={onCaretClicked}><FontAwesomeIcon icon={faEdit}/></div>
	</ArithmeticSelectContainer>;
};