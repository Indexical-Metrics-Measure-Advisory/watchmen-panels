import React, { useState } from 'react';
import styled from 'styled-components';
import { AutoSelectInput } from './auto-select-input';

export interface AutoSwitchInputStyles {
	height?: number | string;
	paddingHorizontal?: number | string;
	backgroundColor?: string;
	inputFontSize?: number | string;
}

const InputContainer = styled.div<AutoSwitchInputStyles>`
	display: grid;
	grid-template-columns: auto 1fr;
	align-items: center;
	height: ${({ height }) => typeof (height || 24) ? `${height || 24}px` : height};
	line-height: ${({ height }) => typeof (height || 24) ? `${height || 24}px` : height};
	font-family: var(--console-title-font-family);
	border-radius: var(--border-radius);
	background-color: ${({ backgroundColor }) => backgroundColor || 'var(--bg-color)'};
	padding: 0 ${({ paddingHorizontal }) => paddingHorizontal || 'calc(var(--margin) / 4)'};
	overflow: hidden;
	&:hover,
	&[data-editing=true] {
		flex-grow: 1;
		box-shadow: var(--console-primary-hover-shadow);
		background-color: var(--console-primary-color);
		padding-right: 0;
		> span[data-role='prefix-label'] {
			color: var(--invert-color);
		}
		> span[data-role='display-label'] {
			display: none;
		}
		> input {
			display: block;
		}
	}
	> input {
		display: none;
		width: 100%;
		font-family: var(--console-title-font-family);
		font-size: ${({ inputFontSize }) => typeof inputFontSize === 'number' ? `${inputFontSize}px` : inputFontSize};
		background-color: var(--bg-color);
		border: 0;
		border-radius: 0;
		transition: none;
	}
`;
const PrefixLabel = styled.span`
	padding-right: calc(var(--margin) / 4);
`;
// a label on display
const DisplayLabel = styled.span`
	padding-left: var(--input-indent);
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
`;

export const AutoSwitchInput = (props: {
	prefixLabel: string;
	value?: string;
	placeholder?: string;
	onChange: (value: string) => void;
	styles?: AutoSwitchInputStyles;
}) => {
	const { prefixLabel, value, placeholder, onChange, styles } = props;

	const [ editing, setEditing ] = useState<boolean>(false);

	const onInputFocus = () => setEditing(true);
	const onInputBlur = () => setEditing(false);

	return <InputContainer data-editing={editing} {...styles}>
		<PrefixLabel data-role='prefix-label'>{prefixLabel}</PrefixLabel>
		<DisplayLabel data-role='display-label'>{value || placeholder}</DisplayLabel>
		<AutoSelectInput value={value} placeholder={placeholder}
		                 onChange={onChange}
		                 onFocus={onInputFocus} onBlur={onInputBlur}/>
	</InputContainer>;
};