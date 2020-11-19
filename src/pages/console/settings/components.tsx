import styled from 'styled-components';

export const SectionTitle = styled.div`
	font-family: var(--console-title-font-family);
	font-size: 1.5em;
	margin-top: var(--margin);
`;
export const ItemContainer = styled.div.attrs({
	'data-widget': 'console-settings-item'
})`
	display: flex;
	flex-direction: column;
	margin-top: calc(var(--margin) / 2);
	&:hover {
		> div[data-widget='console-settings-item-title'] {
			:before {
				opacity: 0.5;
			}
		}
	}
`;
export const ItemTitle = styled.div.attrs({
	'data-widget': 'console-settings-item-title'
})`
	display: flex;
	position: relative;
	align-items: center;
	font-family: var(--console-title-font-family);
	font-size: 1.5em;
	&:before {
		content: '';
		display: block;
		position: absolute;
		top: 50%;
		left: -16px;
		width: 8px;
		height: 10px;
		transform: translateY(-50%);
		background-color: var(--console-primary-color);
		border-top-right-radius: 50%;
		border-bottom-right-radius: 50%;
		opacity: 0;
		pointer-events: none;
		transition: all 300ms ease-in-out;
	}
`;
export const DropdownItemBody = styled.div`
	display: grid;
	grid-template-columns: auto auto 1fr;
	align-items: center;
	margin-top: calc(var(--margin) / 2);
	padding-bottom: calc(var(--margin) / 3);
	border-bottom: var(--border);
	> span:first-child {
		margin-right: calc(var(--margin) / 3);
	}
	> div[data-widget=dropdown] {
		color: var(--console-font-color);
		width: 200px;
	}
`;

