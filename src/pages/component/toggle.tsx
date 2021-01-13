import React, { useRef } from 'react';
import styled from 'styled-components';

const ToggleButton = styled.div.attrs({
	'data-widget': 'toggle'
})`
	display: flex;
	position: relative;
	align-items: center;
	width: 48px;
	height: 22px;
	border-width: 1px;
	border-style: solid;
	border-radius: 11px;
	cursor: pointer;
	transition: all 300ms ease-in-out;
	&[data-positive=true] {
		background-color: var(--toggle-positive-bg-color);
		border-color: var(--toggle-positive-border-color);
	}
	&[data-positive=false] {
		background-color: var(--toggle-negative-bg-color);
		border-color: var(--toggle-negative-border-color);
	}
`;
const Slider = styled.div`
	display: block;
	position: relative;
	width: 24px;
	height: 18px;
	border-radius: 9px;
	transition: all 300ms ease-in-out;
	&[data-positive=true] {
		margin-left: 21px;
		background-color: var(--toggle-positive-slider-color);
	}
	&[data-positive=false] {
		margin-left: 1px;
		background-color: var(--toggle-negative-slider-color);
	}
`;

const Toggle = (props: {
	value: boolean;
	onChange: (value: boolean) => void;
}) => {
	const { value, onChange } = props;

	const toggleRef = useRef<HTMLDivElement>(null);

	const onToggleClicked = (event: React.MouseEvent<HTMLDivElement>) => {
		const { clientX } = event;
		const { left, width } = toggleRef.current!.getBoundingClientRect();
		if (clientX - left > width / 2) {
			// toggle to true
			if (!value) {
				onChange(true);
			}
		} else if (value) {
			// toggle to false
			onChange(false);
		}
	};

	return <ToggleButton data-positive={value} onClick={onToggleClicked}
	                     ref={toggleRef}>
		<Slider data-positive={value}/>
	</ToggleButton>;
};

export default Toggle;