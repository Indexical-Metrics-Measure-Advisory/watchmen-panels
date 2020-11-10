import styled from 'styled-components';

export const HomeSectionCard = styled.div.attrs({
	'data-widget': 'console-home-section-card'
})<{ btnColor?: string }>`
	display: grid;
	position: relative;
	grid-template-columns: 1fr auto;
	grid-column-gap: calc(var(--margin) / 5);
	align-items: stretch;
	padding: calc(var(--margin) / 3) calc(var(--margin) / 5) calc(var(--margin) / 3) calc(var(--margin) / 2);
	border-radius: calc(var(--margin) / 3);
	background-color: var(--invert-color);
	cursor: pointer;
	transition: all 300ms ease-in-out;
	&:hover {
		box-shadow: var(--console-hover-shadow);
		> div:first-child > span:first-child {
			color: var(--console-primary-color);
		}
		> div:nth-child(2) > svg {
			opacity: 1;
			width: 100%;
			margin-left: 0;
		}
	}
	> div:first-child {
		display: grid;
		grid-template-columns: auto 1fr;
		align-items: center;
		> span {
			overflow: hidden;
			white-space: nowrap;
			text-overflow: ellipsis;
		}
		> span:first-child {
			font-size: 0.8em;
			font-weight: var(--font-demi-bold);
			opacity: 0.7;
			grid-column: span 2;
			transform: scale(0.9);
			transform-origin: left;
			transition: all 300ms ease-in-out;
			> svg {
				margin-right: calc(var(--margin) / 3);
			}
		}
	}
	> div:nth-child(2) {
		display: flex;
		width: 32px;
		align-items: center;
		color: var(--console-waive-color);
		&:hover {
			color: var(${({ btnColor }) => btnColor || '--console-primary-color'});
		}
		> svg {
			opacity: 0;
			width: 0;
			margin-left: 32px;
			transition: all 300ms ease-in-out;
		}
	}
`;
