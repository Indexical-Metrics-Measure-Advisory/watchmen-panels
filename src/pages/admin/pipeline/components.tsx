import styled from 'styled-components';

export const Container = styled.div.attrs({
	'data-widget': 'console-pipeline-container'
})`
	display: flex;
	flex-direction: column;
	flex-grow: 1;
`;
export const Header = styled.div.attrs({
	'data-widget': 'console-pipeline-header'
})`
	display: flex;
	position: sticky;
	top: 0;
	align-items: center;
	padding: 0 calc(var(--margin) / 2);
	height: var(--console-space-header-height);
	background-color: var(--invert-color);
	z-index: 2;
	overflow: hidden;
	&:after {
		content: '';
		display: block;
		position: absolute;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 1px;
		background-color: var(--border-color);
		z-index: 3;
	}
`;
export const Body = styled.div.attrs({
	'data-widget': 'console-pipeline-body'
})`
	flex-grow: 1;
	display: flex;
`;
