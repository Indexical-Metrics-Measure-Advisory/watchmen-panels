import styled from 'styled-components';
import Dropdown from '../../../component/dropdown';

export const DropdownInCell = styled(Dropdown)`
	transition: all 300ms ease-in-out;
	width: 100%;
	&:hover,
	&:focus {
		border-color: var(--primary-color);
		> svg {
			color: var(--primary-color);
		}
		> div:last-child {
			border-color: var(--primary-color);
		}
	}
`;
