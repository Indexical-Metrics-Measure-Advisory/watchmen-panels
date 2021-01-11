import styled from 'styled-components';
import Button from './button';

export const ObjectButton = styled(Button)`
	position: relative;
	height: 24px;
	font-size: 0.9em;
	font-variant: petite-caps;
	font-weight: var(--font-bold);
	border: 0;
	opacity: 1;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
	&[data-ink-type=primary] {
		background-color: var(--console-primary-color);
	}
	&[data-ink-type=danger] {
		background-color: var(--console-danger-color);
		&:hover {
			box-shadow: var(--console-danger-hover-shadow);
		}
	}
	&[data-ink-type=success] {
		background-color: var(--console-success-color);
		&:hover {
			box-shadow: var(--console-success-hover-shadow);
		}
	}
	&[data-ink-type=waive] {
		color: var(--console-font-color);
		background-color: var(--bg-color);
		border: var(--border);
		opacity: 0.8;
	}
	&:hover {
		box-shadow: var(--console-primary-hover-shadow);
		transform: none;
	}
	&[data-menu-visible=true] {
		&:before {
			content: '';
			display: block;
			position: absolute;
			left: 10%;
			width: 80%;
			height: 1px;
			background-color: var(--invert-color);
			opacity: 0.5;
		}
		&[data-menu-at-top=true] {
			border-top-left-radius: 0;
			border-top-right-radius: 0;
			&:before {
				top: 0;
			}
		}
		&[data-menu-at-top=false] {
			border-bottom-left-radius: 0;
			border-bottom-right-radius: 0;
			&:before {
				bottom: 0;
			}
		}
	}
	> svg:first-child {
		font-size: 0.8em;
		margin-right: calc(var(--margin) / 5);
	}
	> span:nth-child(2) {
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}
	> span[data-role='more-buttons'] {
		display: flex;
		position: relative;
		height: 24px;
		width: 30px;
		align-items: center;
		text-align: center;
		padding-left: 12px;
		margin: -6px -16px -6px 10px;
		&:before {
			content: '';
			display: block;
			position: absolute;
			left: 0;
			top: 30%;
			width: 1px;
			height: 40%;
			background-color: var(--invert-color);
			opacity: 0.5;
		}
	}
`;

export const PrimaryObjectButton = styled(ObjectButton).attrs({ 'data-ink-type': 'primary' })``;
export const DangerObjectButton = styled(ObjectButton).attrs({ 'data-ink-type': 'danger' })``;
export const SuccessObjectButton = styled(ObjectButton).attrs({ 'data-ink-type': 'success' })``;
export const WaiveObjectButton = styled(ObjectButton).attrs({ 'data-ink-type': 'waive' })``;
