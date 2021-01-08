import styled from 'styled-components';
import Input from '../../component/input';

export const PropInput = styled(Input)`
	font-size: 12px;
	&::placeholder {
		font-variant: petite-caps;
		opacity: 0.5;
	}
`;