import styled from 'styled-components';

export const Container = styled.div.attrs({
	'data-widget': 'console-space-container'
})`
	display: flex;
	flex-direction: column;
	flex-grow: 1;
`;
export const Header = styled.div.attrs({
	'data-widget': 'console-space-header'
})`
	display: flex;
	position: sticky;
	top: 0;
	align-items: center;
	padding: 0 calc(var(--margin) / 2);
	height: 51px;
	background-color: var(--invert-color);
	border-bottom: var(--border);
	z-index: 2;
`;
export const Body = styled.div.attrs({
	'data-widget': 'console-space-body'
})`
	flex-grow: 1;
`;
