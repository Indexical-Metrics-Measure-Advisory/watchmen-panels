import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { Theme } from '../../theme/types';

export interface DropdownOption {
	value: string | number | boolean;
	label: string | ((props: any) => React.ReactNode) | React.ReactNode;
}

interface State {
	active: boolean;
	top: number;
	left: number;
	width: number;
	height: number;
	minWidth: number;
}

const DropdownContainer = styled.div.attrs<State & { itemCount: number }>(() => {
	return { 'data-widget': 'dropdown' };
})<State & { itemCount: number }>(({ theme, top, height, itemCount }) => {
	const atBottom = top + height + Math.min(itemCount, 8) * (theme as Theme).height + 2 < window.innerHeight;
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
const Options = styled.div.attrs<State & { itemCount: number }>(({ theme, top, left, height, minWidth, itemCount }) => {
	const atBottom = top + height + Math.min(itemCount, 8) * (theme as Theme).height + 2 < window.innerHeight;
	return {
		style: {
			top: atBottom ? (top + height - 1) : 'unset',
			bottom: atBottom ? 'unset' : `calc(100vh - ${top + 1}px)`,
			left,
			minWidth,
			borderTopLeftRadius: atBottom ? 0 : 'var(--border-radius)',
			borderTopRightRadius: atBottom ? 0 : 'var(--border-radius)',
			borderBottomLeftRadius: atBottom ? 'var(--border-radius)' : 0,
			borderBottomRightRadius: atBottom ? 'var(--border-radius)' : 0
		}
	};
})<State & { itemCount: number }>`
	position: fixed;
	max-height: calc(var(--height) * 8 + 2px);
	pointer-events: none;
	opacity: 0;
	background-color: var(--bg-color);
	border: var(--border);
	transition: opacity 300ms ease-in-out;
	z-index: 999;
	overflow-y: auto;
	> span {
		height: var(--height);
		display: flex;
		align-items: center;
		padding: 6px var(--input-indent);
		&:hover {
			background-color: var(--hover-color);
		}
	}
`;

const getPosition = (container: HTMLDivElement) => {
	const rect = container.getBoundingClientRect();
	return {
		top: rect.top,
		left: rect.left,
		width: rect.width,
		height: rect.height
	};
};

const Dropdown = (props: {
	className?: string,
	options: Array<DropdownOption>,
	onChange: (option: DropdownOption) => Promise<void | { active: boolean }>,
	value?: string | number | boolean,
	please?: string
	select?: (value: string | number | boolean) => ((props: any) => React.ReactNode) | React.ReactNode;
}) => {
	const { className, options = [], onChange, value, please = '', select, ...rest } = props;

	const containerRef = useRef<HTMLDivElement>(null);
	const [ state, setState ] = useState<State>({ active: false, top: 0, left: 0, width: 0, height: 0, minWidth: 0 });

	useEffect(() => {
		const onScroll = () => {
			if (!state.active) {
				return;
			}
			const { top, left, width, height } = getPosition(containerRef.current!);
			setState({ ...state, top, left, width, height, minWidth: width });
		};
		window.addEventListener('scroll', onScroll, true);
		return () => {
			window.removeEventListener('scroll', onScroll, true);
		};
	});

	let selectedLabel;
	if (value == null) {
		selectedLabel = please;
	} else if (select) {
		selectedLabel = select(value) || please;
	} else {
		const selectedOption = options.find(option => option.value === value);
		selectedLabel = selectedOption ? selectedOption.label : please;
	}

	const onClicked = () => {
		const { top, left, width, height } = getPosition(containerRef.current!);
		setState({ active: true, top, left, width, height, minWidth: width });
	};
	const onBlurred = () => setState({ ...state, active: false });
	const onOptionClicked = (option: DropdownOption) => async () => {
		const ret = await onChange(option);
		if (!ret) {
			setState({ ...state, active: false });
		} else {
			setState({ ...state, active: ret.active });
		}
	};

	return <DropdownContainer className={className}
	                          data-options-visible={state.active}
	                          {...state}
	                          {...rest}
	                          itemCount={options.length}
	                          ref={containerRef}
	                          role='input' tabIndex={0}
	                          onClick={onClicked} onBlur={onBlurred}>
		<Label>{selectedLabel}</Label>
		<FontAwesomeIcon icon={faCaretDown}/>
		<Options {...state} itemCount={options.length}>
			{options.map(option => {
				return <span key={`${option.value}`} onClick={onOptionClicked(option)}>
					{option.label}
				</span>;
			})}
		</Options>
	</DropdownContainer>;
};

export default Dropdown;