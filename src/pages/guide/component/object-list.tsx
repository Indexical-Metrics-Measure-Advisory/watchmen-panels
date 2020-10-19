import styled from 'styled-components';

export const ObjectsContainer = styled.div`
	display: flex;
	margin: 0 var(--margin);
	border-radius: calc(var(--border-radius) * 2);
	border: var(--border);
	min-height: 350px;
	overflow: hidden;
`;
export const ObjectsList = styled.div`
	position: relative;
	width: 30%;
	display: flex;
	flex-direction: column;
	border-right: var(--border);
	&[data-has-data=false] {
		width: 100%;
		border-right: 0;
		> div {
			display: flex;
		}
		~ div {
			display: none;
		}
	}
	> div:nth-child(n + 11):nth-last-child(2) {
		border-bottom-color: transparent;
	}
`;
export const ObjectItem = styled.div`
	display: flex;
	position: relative;
	align-items: center;
	height: 32px;
	padding: 0 calc(var(--margin) / 2);
	cursor: pointer;
	white-space: nowrap;
	text-overflow: ellipsis;
	overflow: hidden;
	border-bottom: var(--border);
	transition: all 300ms ease-in-out;
	&:hover {
		background-color: var(--hover-color);
	}
	&[data-active=true] {
		background-color: var(--active-color);
		color: var(--invert-color);
	}
`;

export const NoObjects = styled.div`
	display: none;
	height: 100%;
	align-items: center;
	justify-content: center;
	font-size: 1.2em;
	font-weight: var(--font-bold);
	cursor: pointer;
	transition: all 300ms ease-in-out;
	&:hover {
		transform: scale(1.05);
	}
	> span {
		margin: 0 var(--letter-gap);
		text-decoration: underline;
	}
`;
