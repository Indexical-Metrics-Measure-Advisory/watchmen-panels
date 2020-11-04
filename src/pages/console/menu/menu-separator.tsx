import styled from 'styled-components';

export const MenuSeparator = styled.div`
	margin: calc(var(--margin) / 4);
	height: 1px;
	width: calc(var(--console-menu-width) - var(--margin) / 2);
	background-color: var(--console-menu-separator-color);
`;