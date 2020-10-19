import styled from 'styled-components';
import Input from '../../component/input';

export const InputInGrid = styled(Input)`
	height: 27px;
	margin-left: calc(var(--input-indent) * -1);
	border-color: transparent;
	transition: all 300ms ease-in-out;
	font-size: 0.8em;
	&:hover {
		border-color: var(--primary-color);
	}
	&:focus {
		border-color: var(--border-color);
	}
`;
