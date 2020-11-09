import styled from 'styled-components';

export const SeeAll = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	margin: 50px 0;
	opacity: 0;
	user-select: none;
	pointer-events: none;
	transition: all 300ms ease-in-out;
	&[data-visible=true] {
		opacity: 0.7;
	}
`;
