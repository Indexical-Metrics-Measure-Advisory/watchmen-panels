import { faCalendarAlt } from '@fortawesome/free-regular-svg-icons';
import { faCaretDown, faCaretLeft, faCaretRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import dayjs from 'dayjs';
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

interface State {
	active: boolean;
	top: number;
	left: number;
	width: number;
	height: number;
}

const getPosition = (container: HTMLDivElement) => {
	const rect = container.getBoundingClientRect();
	return {
		top: rect.top,
		left: rect.left,
		width: rect.width,
		height: rect.height
	};
};

const Container = styled.div.attrs<State>(() => {
	return { 'data-widget': 'calendar' };
})<State>(({ top, height }) => {
	const atBottom = top + height + 2 < window.innerHeight;
	return `
		position: relative;
		padding: 6px var(--input-indent);
		outline: none;
		appearance: none;
		border: var(--border);
		border-radius: var(--border-radius);
		font-size: var(--font-size);
		height: var(--height);
		line-height: var(--line-height);
		color: var(--font-color);
		background-color: transparent;
		transition: all 300ms ease-in-out;
		display: flex;
		align-items: center;
		cursor: pointer;
		width: 100%;
		> svg {
			opacity: 0;
			margin-left: var(--letter-gap);
			transition: all 300ms ease-in-out;
		}
		&:hover,
		&:focus {
			> svg {
				opacity: 1;
			}
		}
		&[data-options-visible=true]:focus {
			border-bottom-left-radius: ${atBottom ? 0 : 'var(--border-radius)'};
			border-bottom-right-radius: ${atBottom ? 0 : 'var(--border-radius)'};
			border-top-left-radius: ${atBottom ? 'var(--border-radius)' : 0};
			border-top-right-radius: ${atBottom ? 'var(--border-radius)' : 0};
			> div:last-child {
				opacity: 1;
				pointer-events: auto;
			}
		}
	`;
});
const Label = styled.span`
	white-space: nowrap;
	text-overflow: ellipsis;
	overflow-x: hidden;
	flex-grow: 1;
`;
const Picker = styled.div.attrs<State>(({ theme, top, left, height }) => {
	const atBottom = top + height + 2 < window.innerHeight;
	return {
		style: {
			top: atBottom ? (top + height - 1) : 'unset',
			bottom: atBottom ? 'unset' : `calc(100vh - ${top + 1}px)`,
			left,
			borderTopLeftRadius: atBottom ? 0 : 'var(--border-radius)',
			borderTopRightRadius: atBottom ? 0 : 'var(--border-radius)',
			borderBottomLeftRadius: atBottom ? 'var(--border-radius)' : 0,
			borderBottomRightRadius: atBottom ? 'var(--border-radius)' : 0
		}
	};
})<State>`
	display: flex;
	flex-direction: column;
	position: fixed;
	pointer-events: none;
	opacity: 0;
	background-color: var(--bg-color);
	border: var(--border);
	transition: opacity 300ms ease-in-out;
	z-index: 999;
	overflow-y: auto;
	//> span {
	//	height: var(--height);
	//	display: flex;
	//	align-items: center;
	//	padding: 6px var(--input-indent);
	//	&:hover {
	//		background-color: var(--hover-color);
	//	}
	//}
`;
const PickerHeader = styled.div`
	display: flex;
	align-items: center;
	border-bottom: var(--border);
	height: 32px;
	padding: 0 calc(var(--margin) / 2);
	> svg {
		width: 32px;
		margin-right: var(--margin);
	}
	> span {
		flex-grow: 1;
	}
`;
const PickerBody = styled.div`
	display: grid;
	grid-template-columns: auto 1fr;
	> div:first-child {
		display: flex;
		flex-direction: column;
		grid-row: span 2;
		border-right: var(--border);
		> span {
			display: flex;
			align-items: center;
			height: 32px;
			padding: 0 calc(var(--margin) / 2);
			cursor: pointer;
			transition: all 300ms ease-in-out;
			&:hover {
				background-color: var(--hover-color);
			}
		}
	}
	> div:nth-last-child(2) {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 32px;
		padding: 0 calc(var(--margin) / 2);
		> span {
			font-weight: var(--font-bold);
		}
		> div {
			display: flex;
			align-items: center;
			> span {
				display: flex;
				align-items: center;
				justify-content: center;
				font-weight: var(--font-bold);
				border-radius: var(--border-radius);
				transition: all 300ms ease-in-out;
				&:hover {
					background-color: var(--hover-color);
				}
				&:first-child {
					transform: scale(0.8);
					transform-origin: right;
					padding: 2px 6px;
				}
				&:not(:first-child) {
					height: 20px;
					width: 24px;
				}
			}
		}
	}
	> div:last-child {
		display: grid;
		grid-template-columns: repeat(7, 32px);
		> span {
			text-align: center;
			&:nth-child(-n + 7) {
				color: var(--primary-color);
				font-weight: var(--font-bold);
				opacity: 0.7;
			}
			&:first-child,
			&:nth-child(7) {
				color: var(--danger-color);
			}
		}
	}
`;

export const Calendar = (props: {
	className?: string,
	onChange: (value?: string) => Promise<void | { active: boolean }>,
	value?: string,
}) => {
	const { className, onChange, value, ...rest } = props;

	const containerRef = useRef<HTMLDivElement>(null);
	const [ state, setState ] = useState<State>({ active: false, top: 0, left: 0, width: 0, height: 0 });

	useEffect(() => {
		const onScroll = () => {
			if (!state.active) {
				return;
			}
			const { top, left, width, height } = getPosition(containerRef.current!);
			setState({ ...state, top, left, width, height });
		};
		window.addEventListener('scroll', onScroll, true);
		return () => {
			window.removeEventListener('scroll', onScroll, true);
		};
	});

	const onClicked = () => {
		const { top, left, width, height } = getPosition(containerRef.current!);
		setState({ active: true, top, left, width, height });
	};
	const onBlurred = () => setState({ ...state, active: false });

	const displayValue = value ? dayjs(value) : dayjs();
	const currentMonth = displayValue.format('MMM YYYY');
	const currentDate = displayValue.format('DD/MM/YYYY');
	const currentTime = displayValue.format('HH:mm:ss');

	console.error(new Error());

	return <Container className={className}
	                  data-options-visible={state.active}
	                  {...state}
	                  {...rest}
	                  role='input' tabIndex={0} ref={containerRef}
	                  onClick={onClicked} onBlur={onBlurred}>
		<Label>{value}</Label>
		<FontAwesomeIcon icon={faCaretDown}/>
		<Picker {...state}>
			<PickerHeader>
				<FontAwesomeIcon icon={faCalendarAlt}/>
				<span>{currentDate}</span>
				<span>{currentTime}</span>
			</PickerHeader>
			<PickerBody>
				<div>
					<span>Today</span>
					<span>Tomorrow</span>
					<span>This Week</span>
					<span>Last Week</span>
					<span>This Month</span>
					<span>Last Month</span>
					<span>This Year</span>
					<span>Last Year</span>
				</div>
				<div>
					<span>{currentMonth}</span>
					<div>
						<span>TODAY</span>
						<span><FontAwesomeIcon icon={faCaretLeft}/></span>
						<span><FontAwesomeIcon icon={faCaretRight}/></span>
					</div>
				</div>
				<div>
					<span>S</span>
					<span>M</span>
					<span>T</span>
					<span>W</span>
					<span>T</span>
					<span>F</span>
					<span>S</span>
				</div>
			</PickerBody>
		</Picker>
	</Container>;
};