import styled from 'styled-components';

export const MenuSeparator = styled.div<{ width?: number }>`
	margin: 0 calc(var(--margin) / 4);
	height: 1px;
	width: calc(${({ width }) => `${width}px`} - var(--margin) / 2);
	background-color: var(--console-menu-separator-color);
`;