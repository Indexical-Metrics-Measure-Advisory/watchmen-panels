import React from 'react';
import styled from 'styled-components';
import { UserAvatar } from '../component/user-avatar';
import { useConsoleContext } from '../context/console-context';

const UserContainer = styled.div.attrs({ 'data-widget': 'console-user-container' })`
	display: flex;
	padding: calc(var(--margin) / 2) calc((var(--console-menu-width) - var(--console-menu-item-icon-size)) / 2) \
			 calc(var(--margin) / 2) calc(var(--margin) / 4);
	align-items: center;
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

export const MenuUser = () => {
	const context = useConsoleContext();

	return <UserContainer>
		<UserAvatar name={context.user.name}/>
		<UserName>{context.user.name}</UserName>
	</UserContainer>;
};