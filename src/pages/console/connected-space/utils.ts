import dayjs from 'dayjs';
import { ConnectedConsoleSpace, ConsoleSpaceGroup, ConsoleSpaceSubject } from '../../../services/console/types';

export const getVisitAdvice = (lastVisitTime: string) => {
	const lastVisit = dayjs(lastVisitTime);
	const days = dayjs().diff(lastVisit, 'day');
	if (days > 365) {
		return 'ancient';
	} else if (days > 30) {
		return 'year';
	} else if (days > 7) {
		return 'month';
	} else if (days > 1) {
		return 'week';
	}
	return 'recent';
};

export const findSubjectIndex = (subject: ConsoleSpaceSubject, subjects: Array<ConsoleSpaceSubject>): number => {
	// eslint-disable-next-line
	return subjects.findIndex(s => s.subjectId == subject.subjectId);
};
export const findParentGroup = (subject: ConsoleSpaceSubject, space: ConnectedConsoleSpace): ConsoleSpaceGroup | undefined => {
	if (findSubjectIndex(subject, space.subjects) !== -1) {
		return void 0;
	} else {
		return space.groups.find(group => findSubjectIndex(subject, group.subjects) !== -1);
	}
};
