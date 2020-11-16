import { EventEmitter } from 'events';
import React, { useReducer, useState } from 'react';
import { matchPath, useHistory, useLocation } from 'react-router-dom';
import Path, { toConnectedSpace, toSpaceGroup } from '../../../common/path';
import { ConnectedConsoleSpace, ConsoleSpaceGroup } from '../../../services/console/types';

export enum SpaceEvent {
}

export type ActiveGroups = Array<ConsoleSpaceGroup>;

export interface SpaceContext {
	isGroupOpened: (group: ConsoleSpaceGroup) => boolean;
	openGroupIfCan: (space: ConnectedConsoleSpace, group: ConsoleSpaceGroup) => void;
	closeGroupIfCan: (space: ConnectedConsoleSpace, group: ConsoleSpaceGroup) => void;
}

const Context = React.createContext<SpaceContext>({} as SpaceContext);
Context.displayName = 'SpaceContext';

export const SpaceContextProvider = (props: {
	children?: ((props: any) => React.ReactNode) | React.ReactNode;
}) => {
	const { children } = props;

	const location = useLocation();
	const history = useHistory();
	const [ emitter ] = useState(new EventEmitter());
	const [ , forceUpdate ] = useReducer(x => x + 1, 0);
	const [ activeGroups ] = useState<ActiveGroups>([]);
	const [ functions ] = useState({});

	// eslint-disable-next-line
	const isGroupOpened = (group: ConsoleSpaceGroup) => activeGroups.some(g => g.groupId == group.groupId);
	const openGroupIfCan = (space: ConnectedConsoleSpace, group: ConsoleSpaceGroup) => {
		// eslint-disable-next-line
		const index = activeGroups.findIndex(g => g.groupId == group.groupId);
		if (index === -1) {
			// not opened
			activeGroups.push(group);
		}
		history.push(toSpaceGroup(Path.CONSOLE_CONNECTED_SPACE_GROUP, space.connectId, group.groupId));
	};
	const closeGroupIfCan = (space: ConnectedConsoleSpace, group: ConsoleSpaceGroup) => {
		// eslint-disable-next-line
		const index = activeGroups.findIndex(g => g.groupId == group.groupId);
		if (index !== -1) {
			activeGroups.splice(index, 1);
			const match = matchPath<{ groupId: string }>(location.pathname, Path.CONSOLE_CONNECTED_SPACE_GROUP);
			// eslint-disable-next-line
			if (match && match.params.groupId == group.groupId) {
				// current opened, switch to another tab
				if (index === 0) {
					history.push(toConnectedSpace(Path.CONSOLE_CONNECTED_SPACE_OVERALL, space.connectId));
				} else {
					history.push(toSpaceGroup(Path.CONSOLE_CONNECTED_SPACE_GROUP, space.connectId, activeGroups[index - 1].groupId));
				}
			} else {
				// current not opened, force update to render tabs header
				forceUpdate();
			}
		}
	};

	return <Context.Provider value={{
		isGroupOpened, openGroupIfCan, closeGroupIfCan,

		...functions
	}}>{children}</Context.Provider>;
};

export const useSpaceContext = () => {
	return React.useContext(Context);
};
