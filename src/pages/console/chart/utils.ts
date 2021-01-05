import {
	ConsoleSpace,
	ConsoleSpaceSubjectChartDimension,
	ConsoleSpaceSubjectChartIndicator
} from '../../../services/console/types';

function findFactorInSpace(topicId: string | undefined, factorId: string | undefined, space: ConsoleSpace, where: string) {
	if (!topicId || !factorId) {
		throw new Error(`Factor not defined in ${where}.`);
	}

	const topic = space.topics.find(topic => topic.topicId == topicId);
	if (!topic) {
		throw new Error(`Topic mismatched according to ${where}.`);
	}
	const factor = topic.factors.find(factor => factor.factorId == factorId);
	if (!factor) {
		throw new Error(`Factor mismatched according to ${where}.`);
	}

	return factor;
}

export const findFactorByDimension = (space: ConsoleSpace, dimension: ConsoleSpaceSubjectChartDimension) => {
	const { topicId, factorId } = dimension;
	return findFactorInSpace(topicId, factorId, space, 'dimension');
};

export const findFactorByIndicator = (space: ConsoleSpace, indicator: ConsoleSpaceSubjectChartIndicator) => {
	const { topicId, factorId } = indicator;
	return findFactorInSpace(topicId, factorId, space, 'indicator');
};