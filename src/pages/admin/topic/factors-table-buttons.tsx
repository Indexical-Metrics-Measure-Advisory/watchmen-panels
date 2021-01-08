import styled from 'styled-components';

export const FactorsTableButtons = styled.div`
	display: flex;
	align-items: center;
	justify-self: start;
	font-size: 0.8em;
	font-variant: petite-caps;
	font-weight: var(--font-bold);
	height: 24px;
	border-radius: 12px;
	color: var(--invert-color);
	background-color: var(--console-primary-color);
	padding: 0 calc(var(--margin) / 3) 0 calc(var(--margin) / 2);
	cursor: pointer;
	&:hover {
		box-shadow: var(--console-primary-hover-shadow);
	}
	&[data-expanded=true] {
		> svg {
			transform: rotateZ(360deg);
		}
	}
	> span {
		position: relative;;
		padding-right: calc(var(--margin) / 3);
		&:after {
			content: '';
			display: block;
			position: absolute;
			top: 10%;
			right: 0;
			width: 1px;
			height: 80%;
			background-color: var(--invert-color);
			opacity: 0.7;
		}
	}
	> svg {
		margin-left: calc(var(--margin) / 3);
		transition: all 300ms ease-in-out;
	}
`;
