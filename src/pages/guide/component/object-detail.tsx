import styled from 'styled-components';

export const ObjectDetail = styled.div`
	width: 70%;
	display: flex;
	flex-direction: column;
	opacity: 0;
	transition: all 300ms ease-in-out;
	&[data-visible=true] {
		opacity: 1;
	}
`;
export const ObjectDetailHeader = styled.div`
	display: grid;
	border-bottom: var(--border);
	align-items: center;
`;

export const ObjectDetailHeaderCell = styled.div`
	height: 31px;
	padding: 0 calc(var(--margin) / 2);
	display: flex;
	align-items: center;
`;

export const ObjectDetailBodyRow = styled.div`
	display: grid;
	border-bottom: var(--border);
	font-size: 0.8em;
	&:nth-child(n + 10):last-child {
		border-bottom-color: transparent;
	}
	&:hover {
		background-color: var(--hover-color);
		> div {
			> input:hover:focus,
			> div[data-widget=dropdown]:hover:focus {
				border-color: var(--primary-color);
				> div:last-child {
					border-color: var(--primary-color);
				}
				> svg {
					color: var(--primary-color);
				}
			}
		}
	}
`;

export const ObjectDetailBodyCell = styled.div`
	height: 31px;
	padding: 0 calc(var(--margin) / 2);
	display: flex;
	align-items: center;
	overflow-x: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
`;



