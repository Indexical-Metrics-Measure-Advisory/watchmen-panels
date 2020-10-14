import styled from 'styled-components';

export enum ButtonType {
	DEFAULT = 'default',
	PRIMARY = 'primary',
	DANGER = 'danger'
}

interface ButtonProps {
	inkType?: ButtonType
}

const Button = styled.button.attrs<ButtonProps>(({ inkType = ButtonType.DEFAULT }) => ({
	'data-ink-type': inkType
}))<ButtonProps>`
	border: 0;
	appearance: none;
	outline: none;
	cursor: pointer;
	padding: 6px calc(var(--margin) / 2);
	border-radius: var(--border-radius);
	transition: all 300ms ease-in-out;
	font-size: var(--font-size);
	line-height: var(--line-height);
	border: var(--border);
	display: flex;
	align-items: center;
	justify-content: space-around;
	&[data-ink-type=default] {
		color: var(--font-color);
		background-color: transparent;
		border-color: var(--border-color);
		opacity: 0.5;
	}
	&[data-ink-type=primary] {
		background-color: var(--primary-color);
		color: var(--invert-color);
	}
	&[data-ink-type=danger] {
		background-color: var(--danger-color);
		color: var(--invert-color);
	}
	@media (min-width: ${({ theme }) => theme.minDeskWidth}px) {
		&:hover {
			transform: scale(1.05);
		}
	}
`;


export default Button;

export const BigButton = styled(Button)`
	align-self: center;
	min-width: 230px;
	font-weight: var(--font-boldest);
	font-size: 1.15em;
	line-height: 2.2em;
	@media (max-width: ${({ theme }) => theme.maxMobileWidth}px) {
		min-width: unset;
	}
`;

