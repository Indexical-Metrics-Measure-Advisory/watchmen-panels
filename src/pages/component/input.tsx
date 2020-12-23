import styled from 'styled-components';

export default styled.input`
	appearance: none;
	outline: none;
	padding: 6px var(--input-indent);
	border: var(--border);
	border-radius: var(--border-radius);
	font-family: var(--font-family);
	font-size: var(--font-size);
	height: var(--height);
	line-height: var(--line-height);
	color: var(--font-color);
	background-color: transparent;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
	transition: all 300ms ease-in-out;
`;