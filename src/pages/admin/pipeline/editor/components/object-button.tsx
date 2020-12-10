import styled from 'styled-components';
import Button from '../../../../component/button';

export const ObjectButton = styled(Button)`
	height: 24px;
	font-size: 0.9em;
	font-variant: petite-caps;
	font-weight: var(--font-bold);
	border: 0;
	opacity: 1;
	&[data-ink-type=primary] {
		background-color: var(--console-primary-color);
	}
	&[data-ink-type=danger] {
		background-color: var(--console-danger-color);
		&:hover {
			box-shadow: var(--console-danger-hover-shadow);
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
	> svg {
		font-size: 0.8em;
		margin-right: calc(var(--margin) / 5);
	}
`;
export const PrimaryObjectButton = styled(ObjectButton).attrs({ 'data-ink-type': 'primary' })``;
export const DangerObjectButton = styled(ObjectButton).attrs({ 'data-ink-type': 'danger' })``;
export const WaiveObjectButton = styled(ObjectButton).attrs({ 'data-ink-type': 'waive' })``;