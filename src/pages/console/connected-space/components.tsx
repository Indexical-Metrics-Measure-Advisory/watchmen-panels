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
	align-items: center;
	padding: 0 calc(var(--margin) / 2);
	height: 51px;
	background-color: var(--invert-color);
	border-bottom: var(--border);
`;
export const Title = styled.div.attrs({
	'data-widget': 'console-space-title'
})`
	display: flex;
	align-items: center;
	font-family: var(--console-title-font-family);
	padding-right: calc(var(--margin) / 2);
	margin-top: 14px;
	margin-bottom: 6px;
	height: 30px;
	> svg {
		margin-right: calc(var(--margin) / 5);
		opacity: 0.7;
	}
	> span {
		font-size: 1.2em;
	}
`;
export const Body = styled.div.attrs({
	'data-widget': 'console-space-body'
})`
	flex-grow: 1;
`;
