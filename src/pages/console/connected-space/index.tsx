import React from 'react';
import { Redirect, useParams } from 'react-router-dom';
import Path from '../../../common/path';
import { useConsoleContext } from '../context/console-context';
import { Container } from './components';
import { ConnectedSpaceBody } from './space-body';
import { SpaceContextProvider } from './space-context';
import { ConnectedSpaceHeader } from './space-header';

const ConnectedSpaceContent = () => {
	const { connectId } = useParams<{ connectId: string }>();

	const { spaces: { connected: spaces } } = useConsoleContext();

	// eslint-disable-next-line
	const space = spaces.find(space => space.connectId == connectId)!;

	if (!space) {
		return <Redirect to={Path.CONSOLE_HOME}/>;
	}

	return <Container>
		<ConnectedSpaceHeader space={space}/>
		<ConnectedSpaceBody space={space}/>
	</Container>;
};

export const ConnectedSpace = () => {
	return <SpaceContextProvider>
		<ConnectedSpaceContent/>
	</SpaceContextProvider>;
};
