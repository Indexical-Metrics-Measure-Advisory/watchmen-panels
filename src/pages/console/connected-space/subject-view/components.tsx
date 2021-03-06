import styled from 'styled-components';

export const SubjectPanelHeader = styled.div.attrs({
	'data-widget': 'console-subject-view-panel-header'
})`
	display: flex;
	align-items: center;
	height: 40px;
	padding: 0 calc(var(--margin) / 2);
	border-bottom: var(--border);
	transition: all 300ms ease-in-out;
	> div:first-child {
		flex-grow: 1;
		display: flex;
		align-items: center;
		font-family: var(--console-title-font-family);
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		> span:nth-child(2) {
			margin-left: calc(var(--margin) / 4);
			font-size: 0.8em;
			background-color: var(--console-primary-color);
			color: var(--invert-color);
			padding: 1px 10px;
			border-radius: 0.8em;
			height: 1.6em;
			transform: scale(0.7,0.7);
			opacity: 0.7;
		}
	}
	> button {
		height: 20px;
		&:hover {
			color: var(--console-primary-color);
		}
	}
`;
export const SubjectPanelBody = styled.div.attrs({
	'data-widget': 'console-subject-view-panel-body'
})`
	flex-grow: 1;
	display: flex;
	position: relative;
	flex-direction: column;
	border-bottom: var(--border);
	transition: all 300ms ease-in-out;
	&:last-child {
		border-bottom: 0;
	}
	&[data-visible=false] {
		flex-grow: 0;
		margin-top: -1px;
	}
`;
export const SubjectPanelBodyWrapper = styled.div.attrs({
	'data-widget': 'console-subject-panel-body-wrapper'
})`
	display: flex;
	flex-direction: column;
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	overflow-x: hidden;
	overflow-y: auto;
	&::-webkit-scrollbar {
		background-color: transparent;
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
