import styled from 'styled-components';

export const ChartContainer = styled.div.attrs({
	'data-widget': 'chart-container'
})`
	border-radius: calc(var(--border-radius) * 2);
	border: var(--border);
	overflow: hidden;
	display: flex;
	flex-direction: column;
	position: relative;
	> div[data-widget='chart'],
	> div[data-widget='chart-disabled'] {
		flex-grow: 1;
		height: 300px;
	}

	&[data-expanded=true] {
		@media (min-width: 800px) {
			grid-column: span 3;
			> div[data-widget='chart-header'] {
				height: 48px;
				padding: 0 var(--margin);
			}
			> div[data-widget='chart-settings'] {
				top: 48px;
				&[data-visible=true] {
					height: calc(100% - 48px);
				}
			}
			> div[data-widget='chart'],
			> div[data-widget='chart-disabled'] {
				height: 500px;
			}
		}
		@media (min-width: 1600px) {
			grid-column: span 4;
			> div[data-widget='chart'],
			> div[data-widget='chart-disabled'] {
				height: 650px;
			}
		}
		div[data-widget='chart-title'] {
			font-size: 1.4em;
		}
	}
`;
export const ChartHeader = styled.div.attrs({
	'data-widget': 'chart-header'
})`
	display: flex;
	padding: 0 calc(var(--margin) / 2);
	align-items: center;
	justify-content: space-between;
	height: 40px;
`;
export const ChartTitle = styled.div.attrs({
	'data-widget': 'chart-title'
})`
	font-size: 1em;
	font-weight: bold;
	white-space: nowrap;
	overflow-x: hidden;
	text-overflow: ellipsis;
	transition: all 300ms ease-in-out;
`;
export const ChartOperators = styled.div`
	display: flex;
	align-items: center;
	> button {
		display: block;
		border: 0;
		width: 28px;
		height: 28px;
		padding: 0;
		transition: all 300ms ease-in-out;
		&:not(:first-child) {
			margin-left: 2px;
		}
		&:hover {
			background-color: var(--primary-hover-color);
			color: var(--invert-color);
			opacity: 1;
		}
		&[data-visible=false] {
			display: none;
		}
		&[data-active=true] {
			background-color: var(--primary-color);
			color: var(--invert-color);
			opacity: 1;
		}
		@media (max-width: 799px) {
			&[data-size-fixed-visible=false] {
				display: none;
			}
		}
	}
`;
export const ChartSettings = styled.div.attrs({
	'data-widget': 'chart-settings'
})`
	display: grid;
	grid-template-columns: 1fr;
	grid-column-gap: calc(var(--margin) / 2);
	grid-row-gap: calc(var(--margin) / 4);
	align-items: baseline;
	align-content: start;
	position: absolute;
	top: 40px;
	left: 0;
	width: 100%;
	height: 0;
	padding: 0 var(--margin);
	transition: all 300ms ease-in-out;
	background-color: var(--bg-color-opacity);
	z-index: 1;
	overflow: hidden;
	&[data-visible=true] {
		height: calc(100% - 40px);
		border-top: var(--border);
		overflow-y: auto;
		padding-top: calc(var(--margin) / 2);
		padding-bottom: calc(var(--margin) / 2);
	}
	&[data-columns='2'] {
		grid-template-columns: 1fr 1fr;
	}
`;
export const ChartSettingsItem = styled.div.attrs({
	'data-widget': 'chart-settings-item'
})`
	display: grid;
	grid-template-columns: 35% 65%;
	align-items: center;
`;
export const ChartSettingsItemLabel = styled.div.attrs({
	'data-widget': 'chart-settings-item-label'
})`
	display: flex;
	align-items: center;
	overflow-x: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
	font-size: 0.8em;
	font-weight: var(--font-bold);
	&[data-require=true] {
		&:after {
			content: '*';
			margin-left: 4px;
			transform: scale(0.8);
			transform-origin: left bottom;
		}
	}
`;
export const ChartSettingsItemEditor = styled.div.attrs({
	'data-widget': 'chart-settings-item-editor'
})`
	display: flex;
	align-items: center;
	> input,
	> div[data-widget=dropdown] {
		flex-grow: 1;
		font-size: 0.8em;
	}
	> button:last-child {
		min-width: 27px;
		height: var(--height);
		padding: 0;
		border: 0;
		&:hover {
			color: var(--primary-color);
			transform: none;
			opacity: 1;
			> svg {
				transform: scale(1.1);
			}
		}
	}
`;
