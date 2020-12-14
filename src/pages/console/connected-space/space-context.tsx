import { EventEmitter } from 'events';
import React, { useState } from 'react';
import { matchPath, useHistory, useLocation } from 'react-router-dom';
import Path, { toConnectedSpace, toSpaceGroup, toSpaceSubject } from '../../../common/path';
import { ConnectedConsoleSpace, ConsoleSpaceGroup, ConsoleSpaceSubject } from '../../../services/console/types';

export enum SpaceEvent {
	GROUP_CLOSED = 'group-closed',
	GROUP_RENAMED = 'group-renamed',
	SUBJECT_CLOSED = 'subject-closed',
	SUBJECT_RENAMED = 'subject-renamed'
}

export type ActiveGroups = Array<ConsoleSpaceGroup>;
export type ActiveSubjects = Array<ConsoleSpaceSubject>;

export type GroupClosedListener = (options: { space: ConnectedConsoleSpace, group: ConsoleSpaceGroup }) => void;
export type GroupRenamedListener = (options: { space: ConnectedConsoleSpace, group: ConsoleSpaceGroup }) => void;
export type SubjectClosedListener = (options: { space: ConnectedConsoleSpace, group?: ConsoleSpaceGroup, subject: ConsoleSpaceSubject }) => void;
export type SubjectRenamedListener = (options: { space: ConnectedConsoleSpace, group?: ConsoleSpaceGroup, subject: ConsoleSpaceSubject }) => void;

export interface SpaceContextStore {
	activeGroupId?: string;
	activeSubjectId?: string;
}

export interface SpaceContext {
	store: SpaceContextStore;

	isGroupOpened: (group: ConsoleSpaceGroup) => boolean;
	openGroupIfCan: (options: { space: ConnectedConsoleSpace, group: ConsoleSpaceGroup }) => void;
	closeGroupIfCan: (options: { space: ConnectedConsoleSpace, group: ConsoleSpaceGroup }) => void;
	addGroupClosedListener: (listener: GroupClosedListener) => void;
	removeGroupClosedListener: (listener: GroupClosedListener) => void;
	groupRenamed: (options: { space: ConnectedConsoleSpace, group: ConsoleSpaceGroup }) => void;
	addGroupRenamedListener: (listener: GroupRenamedListener) => void;
	removeGroupRenamedListener: (listener: GroupRenamedListener) => void;

	isSubjectOpened: (subject: ConsoleSpaceSubject) => boolean;
	openSubjectIfCan: (options: { space: ConnectedConsoleSpace, group?: ConsoleSpaceGroup, subject: ConsoleSpaceSubject }) => void;
	closeSubjectIfCan: (options: { space: ConnectedConsoleSpace, group?: ConsoleSpaceGroup, subject: ConsoleSpaceSubject }) => void;
	addSubjectClosedListener: (listener: SubjectClosedListener) => void;
	removeSubjectClosedListener: (listener: SubjectClosedListener) => void;
	subjectRenamed: (options: { space: ConnectedConsoleSpace, group?: ConsoleSpaceGroup, subject: ConsoleSpaceSubject }) => void;
	addSubjectRenamedListener: (listener: SubjectRenamedListener) => void;
	removeSubjectRenamedListener: (listener: SubjectRenamedListener) => void;
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
	const [ activeGroups ] = useState<ActiveGroups>([]);
	const [ activeSubjects ] = useState<ActiveSubjects>([]);
	const [ store ] = useState<SpaceContextStore>({} as SpaceContextStore);

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
		store.activeGroupId = group.groupId;
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
				// current is active tab, and active group
				if (activeGroups.length === 0) {
					// no more group opened
					delete store.activeGroupId;
					history.push(toConnectedSpace(Path.CONSOLE_CONNECTED_SPACE_OVERALL, space.connectId));
				} else if (index !== 0) {
					// not first one, use previous one
					store.activeGroupId = activeGroups[index - 1].groupId;
					history.push(toSpaceGroup(Path.CONSOLE_CONNECTED_SPACE_GROUP, space.connectId, activeGroups[index - 1].groupId));
				} else {
					store.activeGroupId = activeGroups[0].groupId;
					history.push(toSpaceGroup(Path.CONSOLE_CONNECTED_SPACE_GROUP, space.connectId, activeGroups[0].groupId));
				}
			} else {
				// whether current is active tab or not
				// eslint-disable-next-line
				if (store.activeGroupId == group.groupId) {
					// current is active group
					if (activeGroups.length === 0) {
						// no more group opened
						delete store.activeGroupId;
					} else if (index !== 0) {
						// not first one, use previous one
						store.activeGroupId = activeGroups[index - 1].groupId;
					} else {
						store.activeGroupId = activeGroups[0].groupId;
					}
				}
				emitter.emit(SpaceEvent.GROUP_CLOSED, { space, group });
			}
		}
	};
	const addGroupClosedListener = (listener: GroupClosedListener) => emitter.on(SpaceEvent.GROUP_CLOSED, listener);
	const removeGroupClosedListener = (listener: GroupClosedListener) => emitter.off(SpaceEvent.GROUP_CLOSED, listener);
	const groupRenamed = (options: { space: ConnectedConsoleSpace, group: ConsoleSpaceGroup }) => {
		const { space, group } = options;
		emitter.emit(SpaceEvent.GROUP_RENAMED, { space, group });
	};
	const addGroupRenamedListener = (listener: GroupRenamedListener) => emitter.on(SpaceEvent.GROUP_RENAMED, listener);
	const removeGroupRenamedListener = (listener: GroupRenamedListener) => emitter.off(SpaceEvent.GROUP_RENAMED, listener);

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
		store.activeSubjectId = subject.subjectId;
		history.push(toSpaceSubject(Path.CONSOLE_CONNECTED_SPACE_SUBJECT, space.connectId, subject.subjectId));
	};
	const closeSubjectIfCan = (options: { space: ConnectedConsoleSpace, group?: ConsoleSpaceGroup, subject: ConsoleSpaceSubject }) => {
		const { space, group, subject } = options;
		// eslint-disable-next-line
		const index = activeSubjects.findIndex(s => s.subjectId == subject.subjectId);
		if (index !== -1) {
			activeSubjects.splice(index, 1);
			const match = matchPath<{ subjectId: string }>(location.pathname, Path.CONSOLE_CONNECTED_SPACE_SUBJECT);
			// eslint-disable-next-line
			if (match && match.params.subjectId == subject.subjectId) {
				// current is active tab, and active subject
				if (activeSubjects.length === 0) {
					// no more subject opened
					delete store.activeSubjectId;
					history.push(toConnectedSpace(Path.CONSOLE_CONNECTED_SPACE_OVERALL, space.connectId));
				} else if (index !== 0) {
					// not first one, use previous one
					store.activeSubjectId = activeSubjects[index - 1].subjectId;
					history.push(toSpaceSubject(Path.CONSOLE_CONNECTED_SPACE_SUBJECT, space.connectId, activeSubjects[index - 1].subjectId));
				} else {
					store.activeSubjectId = activeSubjects[0].subjectId;
					history.push(toSpaceSubject(Path.CONSOLE_CONNECTED_SPACE_SUBJECT, space.connectId, activeSubjects[0].subjectId));
				}
			} else {
				// whether current is active tab or not
				// eslint-disable-next-line
				if (store.activeSubjectId == subject.subjectId) {
					// current is active subject
					if (activeSubjects.length === 0) {
						// no more subject opened
						delete store.activeSubjectId;
					} else if (index !== 0) {
						// not first one, use previous one
						store.activeSubjectId = activeSubjects[index - 1].subjectId;
					} else {
						store.activeSubjectId = activeSubjects[0].subjectId;
					}
				}
				emitter.emit(SpaceEvent.SUBJECT_CLOSED, { space, group, subject });
			}
		}
	};
	const addSubjectClosedListener = (listener: SubjectClosedListener) => emitter.on(SpaceEvent.SUBJECT_CLOSED, listener);
	const removeSubjectClosedListener = (listener: SubjectClosedListener) => emitter.off(SpaceEvent.SUBJECT_CLOSED, listener);
	const subjectRenamed = (options: { space: ConnectedConsoleSpace, group?: ConsoleSpaceGroup, subject: ConsoleSpaceSubject }) => {
		const { space, group, subject } = options;
		emitter.emit(SpaceEvent.SUBJECT_RENAMED, { space, group, subject });
	};
	const addSubjectRenamedListener = (listener: SubjectRenamedListener) => emitter.on(SpaceEvent.SUBJECT_RENAMED, listener);
	const removeSubjectRenamedListener = (listener: SubjectRenamedListener) => emitter.off(SpaceEvent.SUBJECT_RENAMED, listener);

	return <Context.Provider value={{
		store,

		isGroupOpened,
		openGroupIfCan,
		closeGroupIfCan,
		addGroupClosedListener,
		removeGroupClosedListener,
		groupRenamed,
		addGroupRenamedListener,
		removeGroupRenamedListener,

		isSubjectOpened,
		openSubjectIfCan,
		closeSubjectIfCan,
		addSubjectClosedListener,
		removeSubjectClosedListener,
		subjectRenamed,
		addSubjectRenamedListener,
		removeSubjectRenamedListener
	}}>{children}</Context.Provider>;
};

export const useSpaceContext = () => {
	return React.useContext(Context);
};
