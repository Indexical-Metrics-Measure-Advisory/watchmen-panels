import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

export interface DropdownOption {
	value: string | number | boolean;
	label: string;
}

const DropdownContainer = styled.div.attrs({
	'data-widget': 'dropdown'
})`
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
		border-bottom-left-radius: 0;
		border-bottom-right-radius: 0;
		> div:last-child {
			opacity: 1;
			pointer-events: auto;
		}
	}
`;
const Label = styled.span`
	white-space: nowrap;
	text-overflow: ellipsis;
	overflow-x: hidden;
	flex-grow: 1;
`;
const Options = styled.div`
	position: fixed;
	max-height: calc(var(--height) * 8 + 2px);
	pointer-events: none;
	opacity: 0;
	background-color: var(--bg-color);
	border-bottom-left-radius: var(--border-radius);
	border-bottom-right-radius: var(--border-radius);
	border: var(--border);
	transition: opacity 300ms ease-in-out;
	z-index: 1;
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
		top: `${rect.top + rect.height - 1}px`,
		left: `${rect.left}px`,
		width: `${rect.width}px`,
		height: `${rect.height}px`
	};
};

const Dropdown = (props: {
	className?: string,
	options: Array<DropdownOption>,
	onChange: (option: DropdownOption) => Promise<void>,
	value?: string | number | boolean,
	please?: string
}) => {
	const { className, options = [], onChange, value, please = '' } = props;

	const containerRef = useRef<HTMLDivElement>(null);
	const [ state, setState ] = useState({ active: false, top: '', left: '', minWidth: '' });

	useEffect(() => {
		const onScroll = () => {
			if (!state.active) {
				return;
			}
			const { top, left, width } = getPosition(containerRef.current!);
			setState({ ...state, top, left, minWidth: width });
		};
		window.addEventListener('scroll', onScroll, true);
		return () => {
			window.removeEventListener('scroll', onScroll, true);
		};
	});

	const selectedOption = options.find(option => option.value === value);
	const selectedLabel = selectedOption ? selectedOption.label : please;

	const onClicked = () => {
		const { top, left, width } = getPosition(containerRef.current!);
		setState({
			active: true,
			top,
			left,
			minWidth: width
		});
	};
	const onOptionClicked = (option: DropdownOption) => async () => {
		await onChange(option);
		setState({ ...state, active: false });
	};

	return <DropdownContainer className={className}
	                          data-options-visible={state.active}
	                          ref={containerRef}
	                          role='input' tabIndex={0} onClick={onClicked}>
		<Label>{selectedLabel}</Label>
		<FontAwesomeIcon icon={faCaretDown}/>
		<Options style={{
			top: state.top,
			left: state.left,
			minWidth: state.minWidth
		}}>
			{options.map(option => {
				return <span key={`${option.value}`} onClick={onOptionClicked(option)}>
					{option.label}
				</span>;
			})}
		</Options>
	</DropdownContainer>;
};

export default Dropdown;