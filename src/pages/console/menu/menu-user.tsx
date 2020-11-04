import React from 'react';
import styled from 'styled-components';

const UserContainer = styled.div.attrs({ 'data-widget': 'console-user-container' })`
	display: flex;
	padding: calc(var(--margin) / 2) calc((var(--console-menu-width) - var(--console-menu-item-icon-size)) / 2) \
			 calc(var(--margin) / 2) calc(var(--margin) / 4);
	align-items: center;
`;
const User = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 1.3em;
	font-family: var(--console-title-font-family);
	font-weight: var(--console-title-font-weight);
	font-variant: petite-caps;
	width: var(--console-menu-item-icon-size);
	height: var(--console-menu-item-icon-size);
	border-radius: 100%;
	background-color: var(--primary-hover-color);
	color: var(--invert-color);
	user-select: none;
	transform: scale(0.9);
	transform-origin: center;
	> span:first-child {
		transform: translate(2px, -1px);
		z-index: 1;
	}
	> span:last-child {
		z-index: 0;
		opacity: 0.7;
		transform: translate(-2px, -1px);
	}
`;
const UserName = styled.div`
	position: relative;
	flex-grow: 1;
	margin-left: calc((var(--console-menu-width) - 32px) / 2);
	white-space: nowrap;
	text-overflow: ellipsis;
	overflow: hidden;
	font-variant: petite-caps;
`;

// TODO user name BG for test
export const MenuUser = () => {
	return <UserContainer>
		<User><span>A</span><span>S</span></User>
		<UserName>Arnold Schwarzenegger</UserName>
	</UserContainer>;
};