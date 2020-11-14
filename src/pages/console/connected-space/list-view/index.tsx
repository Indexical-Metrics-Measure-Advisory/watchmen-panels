import React from 'react';
import styled from 'styled-components';
import { ConnectedConsoleSpace } from '../../../../services/console/types';
import { ListContextProvider } from './list-context';
import { ListHeader } from './list-header';

const Container = styled.div`
	display: flex;
	flex-direction: column;
	min-height: 100%;
	padding: calc(var(--margin) / 2) var(--margin);
`;

export const ListView = (props: { visible: boolean; space: ConnectedConsoleSpace }) => {
	const { visible, space } = props;

	if (!visible) {
		return null;
	}

	return <ListContextProvider>
		<Container>
			<ListHeader space={space}/>
		</Container>
	</ListContextProvider>;
};