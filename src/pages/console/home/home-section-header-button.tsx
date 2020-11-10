import styled from 'styled-components';

export const HomeSectionHeaderButton = styled.div.attrs({
	'data-widget': 'console-home-section-header-button'
})`
	display: flex;
	position: relative;
	align-items: center;
	justify-content: flex-end;
	padding: 6px calc(var(--margin) / 2);
	border-radius: var(--border-radius);
	font-size: 0.8em;
	opacity: 0.7;
	cursor: pointer;
	transition: all 300ms ease-in-out;
	&:hover {
		color: var(--console-primary-color);
		background-color: var(--invert-color);
		box-shadow: var(--console-hover-shadow);;
	}
	> svg {
		margin-right: calc(var(--margin) / 4);
	}
`;
