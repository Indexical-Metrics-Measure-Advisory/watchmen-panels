import React, { useRef } from 'react';
import styled from 'styled-components';
import Input from '../../../../component/input';

const AnInput = styled(Input)`
	height: 24px;
	line-height: 24px;
	color: var(--console-font-color);
	text-overflow: ellipsis;
`;

export const AutoSelectInput = (props: {
	value?: string;
	placeholder?: string;
	onChange: (value: string) => void;
	onFocus?: () => void;
	onBlur?: () => void;
}) => {
	const { value = '', placeholder, onChange, onFocus, onBlur } = props;

	const nameRef = useRef<HTMLInputElement>(null);
	const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => onChange(event.target.value);
	const onInputFocus = () => {
		nameRef.current!.select();
		onFocus && onFocus();
	};
	const onInputBlur = () => onBlur && onBlur();
	const onInputKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === 'Enter') {
			nameRef.current!.blur();
		}
	};

	return <AnInput value={value} placeholder={placeholder}
	                onChange={onInputChange}
	                onFocus={onInputFocus} onBlur={onInputBlur}
	                onKeyUp={onInputKeyUp}
	                ref={nameRef}/>;
};