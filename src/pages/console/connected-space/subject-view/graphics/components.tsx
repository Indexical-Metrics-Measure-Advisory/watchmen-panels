import styled from 'styled-components';
import { PrimaryObjectButton } from '../../../../admin/pipeline/editor/components/object-button';

export const SettingsContainer = styled.div`
	display: grid;
	position: absolute;
	grid-template-columns: minmax(80px, 20%) 1fr;
	grid-auto-rows: minmax(28px, auto);
	grid-column-gap: var(--margin);
	grid-row-gap: calc(var(--margin) / 4);
	align-content: start;
	padding: calc(var(--margin) / 2);
	width: 100%;
	overflow-x: hidden;
	overflow-y: auto;
	transition: all 300ms ease-in-out;
	z-index: 1;
	&[data-visible=false] {
		padding-top: 0;
		padding-bottom: 0;
		height: 0;
	}
	&[data-visible=true] {
		height: 100%;
	}
	&::-webkit-scrollbar {
		background-color: transparent;
		width: 4px;
	}
	&::-webkit-scrollbar-track {
		background-color: transparent;
		border-radius: 2px;
	}
	&::-webkit-scrollbar-thumb {
		background-color: var(--console-favorite-color);
		border-radius: 2px;
	}
	input {
		font-size: 0.8em;
		color: var(--console-font-color);
		height: 28px;
	}
	div[data-widget=dropdown] {
		font-size: 0.8em;
		color: var(--console-font-color);
		height: 28px;
		> div:last-child {
			&::-webkit-scrollbar {
				background-color: transparent;
				width: 4px;
			}
			&::-webkit-scrollbar-track {
				background-color: transparent;
				border-radius: 2px;
			}
			&::-webkit-scrollbar-thumb {
				background-color: var(--console-favorite-color);
				border-radius: 2px;
			}
		}
	}
`;

export const SettingsRowLabel = styled.div`
	display: flex;
	align-items: center;
	font-variant: petite-caps;
	font-weight: var(--font-demi-bold);
	font-size: 0.8em;
	height: 28px;
`;
export const SettingsSegmentTitle = styled.div`
	display: flex;
	position: relative;
	align-items: center;
	grid-column: span 2;
	font-variant: petite-caps;
	font-weight: var(--font-demi-bold);
	font-size: 0.8em;
	height: 28px;
	&:after {
		content: '';
		display: block;
		position: absolute;
		top: 55%;
		right: 0;
		width: 100%;
		height: 1px;
		background-color: var(--border-color);
		opacity: 0.3;
	}
	> span {
		z-index: 1;
		background-color: var(--bg-color);
		padding-right: calc(var(--margin) / 2);
	}
`;
export const SettingsSegmentRowLabel = styled(SettingsRowLabel)`
	padding-left: calc(var(--margin) / 2);
`;
export const AppendButton = styled(PrimaryObjectButton)`
	grid-column: span 2;
	align-self: center;
	justify-self: end;
`;
export const BottomGapper = styled.div`
	grid-column: span 2;
	height: calc(var(--margin) / 2);
`;