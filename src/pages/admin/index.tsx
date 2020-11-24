import React from 'react';
import styled from 'styled-components';
import { AdminContextProvider } from './context/admin-context';
import { AdminMenu } from './menu';

const Container = styled.div.attrs({
	'data-widget': 'console-container'
})`
	display: flex;
	color: var(--console-font-color);
	> main {
		flex-grow: 1;
		display: flex;
		height: 100vh;
		overflow-y: scroll;
	}
	> div[data-widget='console-favorite-container'][data-pinned=true] + main {
		margin-top: var(--console-favorite-pinned-height);
		height: calc(100vh - var(--console-favorite-pinned-height));
	}
`;

const AdminIndex = () => {
	return <AdminContextProvider>
		<Container>
			<AdminMenu/>
		</Container>
	</AdminContextProvider>;
};

export default AdminIndex;