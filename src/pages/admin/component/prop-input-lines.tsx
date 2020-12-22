import styled from 'styled-components';

export const PropInputLines = styled.textarea`
	appearance: none;
	outline: none;
	padding: 6px var(--input-indent);
	border: var(--border);
	border-radius: var(--border-radius);
	font-family: var(--font-family);
	font-size: 12px;
	height: calc(var(--height) * 3);
	line-height: var(--line-height);
	color: var(--font-color);
	background-color: transparent;
	resize: none;
	margin: 4px 0;
	transition: all 300ms ease-in-out;
	&::-webkit-scrollbar {
		background-color: transparent;
		height: 4px;
		width: 4px;
	}
	&::-webkit-scrollbar-track {
		background-color: var(--scrollbar-background-color);
		border-radius: 2px;
	}
	&::-webkit-scrollbar-thumb {
		background-color: var(--console-favorite-color);
		border-radius: 2px;
	}
`;