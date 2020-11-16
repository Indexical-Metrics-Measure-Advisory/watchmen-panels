import { EventEmitter } from 'events';
import React, { useReducer, useState } from 'react';
import { matchPath, useHistory, useLocation } from 'react-router-dom';
import Path, { toConnectedSpace, toSpaceGroup, toSpaceSubject } from '../../../common/path';
import { ConnectedConsoleSpace, ConsoleSpaceGroup, ConsoleSpaceSubject } from '../../../services/console/types';

export enum SpaceEvent {
}

export type ActiveGroups = Array<ConsoleSpaceGroup>;
export type ActiveSubjects = Array<ConsoleSpaceSubject>;

export interface SpaceContext {
	isGroupOpened: (group: ConsoleSpaceGroup) => boolean;
	openGroupIfCan: (options: { space: ConnectedConsoleSpace, group: ConsoleSpaceGroup }) => void;
	closeGroupIfCan: (options: { space: ConnectedConsoleSpace, group: ConsoleSpaceGroup }) => void;

	isSubjectOpened: (subject: ConsoleSpaceSubject) => boolean;
	openSubjectIfCan: (options: { space: ConnectedConsoleSpace, group?: ConsoleSpaceGroup, subject: ConsoleSpaceSubject }) => void;
	closeSubjectIfCan: (options: { space: ConnectedConsoleSpace, group?: ConsoleSpaceGroup, subject: ConsoleSpaceSubject }) => void;
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
	const [ activeSubjects ] = useState<ActiveSubjects>([]);
	const [ functions ] = useState({});

	// eslint-disable-next-line
	const isGroupOpened = (group: ConsoleSpaceGroup) => activeGroups.some(g => g.groupId == group.groupId);
	const openGroupIfCan = (options: { space: ConnectedConsoleSpace, group: ConsoleSpaceGroup }) => {
		const { space, group } = options;
		// eslint-disable-next-line
		const index = activeGroups.findIndex(g => g.groupId == group.groupId);
		if (index === -1) {
			// not opened
			activeGroups.push(group);
		}
		history.push(toSpaceGroup(Path.CONSOLE_CONNECTED_SPACE_GROUP, space.connectId, group.groupId));
	};
	const closeGroupIfCan = (options: { space: ConnectedConsoleSpace, group: ConsoleSpaceGroup }) => {
		const { space, group } = options;
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

	// eslint-disable-next-line
	const isSubjectOpened = (subject: ConsoleSpaceSubject) => activeSubjects.some(s => s.subjectId == subject.subjectId);
	const openSubjectIfCan = (options: { space: ConnectedConsoleSpace, group?: ConsoleSpaceGroup, subject: ConsoleSpaceSubject }) => {
		const { space, subject } = options;
		// eslint-disable-next-line
		const index = activeSubjects.findIndex(s => s.subjectId == subject.subjectId);
		if (index === -1) {
			// not opened
			activeSubjects.push(subject);
		}
		history.push(toSpaceSubject(Path.CONSOLE_CONNECTED_SPACE_SUBJECT, space.connectId, subject.subjectId));
	};
	const closeSubjectIfCan = (options: { space: ConnectedConsoleSpace, group?: ConsoleSpaceGroup, subject: ConsoleSpaceSubject }) => {
		const { space, subject } = options;
		// eslint-disable-next-line
		const index = activeSubjects.findIndex(s => s.subjectId == subject.subjectId);
		if (index !== -1) {
			activeSubjects.splice(index, 1);
			const match = matchPath<{ subjectId: string }>(location.pathname, Path.CONSOLE_CONNECTED_SPACE_SUBJECT);
			// eslint-disable-next-line
			if (match && match.params.subjectId == subject.subjectId) {
				// current opened, switch to another tab
				if (index === 0) {
					history.push(toConnectedSpace(Path.CONSOLE_CONNECTED_SPACE_OVERALL, space.connectId));
				} else {
					history.push(toSpaceGroup(Path.CONSOLE_CONNECTED_SPACE_SUBJECT, space.connectId, activeSubjects[index - 1].subjectId));
				}
			} else {
				// current not opened, force update to render tabs header
				forceUpdate();
			}
		}
	};

	return <Context.Provider value={{
		isGroupOpened, openGroupIfCan, closeGroupIfCan,
		isSubjectOpened, openSubjectIfCan, closeSubjectIfCan,

		...functions
	}}>{children}</Context.Provider>;
};

export const useSpaceContext = () => {
	return React.useContext(Context);
};
