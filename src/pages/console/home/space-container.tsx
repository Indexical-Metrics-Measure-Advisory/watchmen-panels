import styled from 'styled-components';
import { HomeSectionCard } from './home-section-card';

export const SpaceContainer = styled(HomeSectionCard)<{ btnColor?: string }>`
	display: grid;
	grid-template-columns: 1fr auto;
	grid-column-gap: calc(var(--margin) / 5);
	align-items: stretch;
	padding-right: calc(var(--margin) / 5);
	transition: all 300ms ease-in-out;
	&:hover {
		> div:first-child > span:first-child {
			color: var(--console-primary-color);
		}
		> div:nth-child(2) > svg {
			opacity: 1;
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
		align-items: center;
		color: var(--console-waive-color);
		&:hover {
			color: var(${({ btnColor }) => btnColor || '--console-primary-color'});
		}
		> svg {
			opacity: 0;
			width: 32px;
			transition: all 300ms ease-in-out;
		}
	}
`;
