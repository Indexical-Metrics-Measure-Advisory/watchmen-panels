import styled from 'styled-components';
import { PrimaryObjectButton } from '../../../../component/object-button';

export const SettingsContainer = styled.div`
	display: flex;
	flex-direction: column;
	position: fixed;
	top: 10vh;
	left: 10vw;
	width: 80vw;
	height: 80vh;
	border-radius: calc(var(--border-radius) * 2);
	background-color: var(--bg-color);
	transition: all 300ms ease-in-out;
	overflow: hidden;
	z-index: 100;
	box-shadow: var(--console-hover-shadow);
	&[data-visible=false] {
		padding-top: 0;
		padding-bottom: 0;
		top: 50vh;
		height: 0;
		> div:first-child {
			display: none;
		}
	}
`;
export const SettingsBackdrop = styled.div`
	display: block;
	position: fixed;
	top: 0;
	left: 0;
	width: 100vw;
	height: 100vh;
	z-index: -1;
`;
export const SettingsHeader = styled.div`
	display: flex;
	align-items: center;
	height: 52px;
	min-height: 52px;
	font-variant: petite-caps;
	font-weight: var(--font-demi-bold);
	font-size: 1.4em;
	margin: 0 var(--margin);
	border-bottom: var(--border);
`;
export const SettingsBody = styled.div`
	width: 100%;
	flex-grow: 1;
	display: grid;
	grid-template-columns: 120px 1fr 120px 1fr;
	grid-auto-rows: minmax(28px, auto);
	grid-column-gap: var(--margin);
	grid-row-gap: calc(var(--margin) / 4);
	align-content: start;
	padding: calc(var(--margin) / 2) var(--margin);
	overflow-x: hidden;
	overflow-y: auto;
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
	grid-column: span 4;
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
	grid-column: span 4;
	align-self: center;
	justify-self: end;
`;
export const BottomGapper = styled.div`
	grid-column: span 2;
	height: calc(var(--margin) / 2);
`;
export const SettingsFooter = styled.div`
	display: flex;
	align-items: center;
	justify-content: flex-end;
	height: 52px;
	min-height: 52px;
	margin: 0 var(--margin);
	border-top: var(--border);
`;