import styled from 'styled-components';
import Input from '../../../../component/input';

export const ActionInput = styled(Input)`
	height: 22px;
	padding-top: 0;
	padding-bottom: 0;
	font-size: 0.8em;
	color: var(--console-font-color);
	border: 0;
	box-shadow: 0 0 0 1px var(--border-color);
	&:hover,
	&:focus {
		box-shadow: var(--console-primary-hover-shadow);
	}
	&::placeholder {
		color: var(--console-waive-color);
	}
`;
