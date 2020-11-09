import styled from 'styled-components';

export const Operators = styled.div.attrs({
	'data-widget': 'console-messages-item-operators'
})`
	grid-row: span 2;
	opacity: 0;
	pointer-events: none;
	transition: all 300ms ease-in-out;
`;
