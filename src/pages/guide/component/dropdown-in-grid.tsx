import styled from 'styled-components';
import Dropdown from '../../component/dropdown';

export const DropdownInGrid = styled(Dropdown)`
	height: 27px;
	margin-left: calc(var(--input-indent) * -1);
	border-color: transparent;
	transition: all 300ms ease-in-out;
	font-size: 0.8em;
	width: calc(100% + var(--input-indent));
	> div:last-child > span {
		height: 27px;
	}
	&:hover {
		border-color: var(--primary-color);
		> svg {
			color: var(--primary-color);
		}
	}
	&:focus {
		border-color: var(--border-color);
		> div:last-child {
			border-color: var(--border-color);
		}
		> svg {
			color: var(--border-color);
		}
	}
`;
