import styled from 'styled-components';

export const MetricsContainer = styled.div.attrs({
	'data-widget': 'metrics-container'
})`
	display: grid;
	position: relative;;
	grid-template-columns: 1fr;
	grid-column-gap: var(--margin);
	grid-row-gap: var(--margin);
	margin: var(--margin) var(--margin) 0;
	&[data-rnd=true] {
		height: calc(42.0cm - 3.3cm);
		width: calc(29.7cm - 3cm);
		margin-right: auto;
		&:before,
		&:after {
			display: flex;
			align-items: center;
			justify-content: center;
			position: absolute;
			top: 0;
			left: 0;
			font-size: 1.5em;
			font-weight: var(--font-bold);
			opacity: 0.15;
			border-radius: 2px;
		}
		&:before {
			content: 'A4';
			height: calc(29.7cm - 3.3cm);
			width: calc(21cm - 3cm);
			color: var(--success-color);
			border: 2px dashed var(--success-color);
			z-index: -1;
		}
		&:after {
			content: 'A3';
			height: calc(42.0cm - 6cm);
			width: calc(29.7cm - 4.6cm);
			color: var(--danger-color);
			z-index: -2;
			border: 2px dashed var(--danger-color);
		}
	}
	@media (min-width: 800px) {
		grid-template-columns: repeat(3, 1fr);
	}
	@media (min-width: 1600px) {
		grid-template-columns: repeat(4, 1fr);
	}
`;
