import React, { useEffect, useState } from 'react';
import { saveSubject } from '../../../../services/console/space';
import {
	ConnectedConsoleSpace,
	ConsoleSpace,
	ConsoleSpaceGroup,
	ConsoleSpaceSubject,
	ConsoleTopic,
	ConsoleTopicFactor,
	ConsoleTopicRelationship
} from '../../../../services/console/types';
import { DropdownOption } from '../../../component/dropdown';
import { useConsoleContext } from '../../context/console-context';

interface SpaceDefs {
	space: ConsoleSpace;
	topics: Array<DropdownOption & { topic: ConsoleTopic }>;
	factors: { [key in string]: Array<DropdownOption & { topic: ConsoleTopic, factor: ConsoleTopicFactor }> };
	relations: Array<DropdownOption & {
		source: { topic: ConsoleTopic, factors: Array<ConsoleTopicFactor> },
		target: { topic: ConsoleTopic, factors: Array<ConsoleTopicFactor> },
		relation: ConsoleTopicRelationship
	}>
}

export interface SubjectContext {
	defs: SpaceDefs;
	save: (immediately?: boolean) => Promise<void>;
}

const Context = React.createContext<SubjectContext>({} as SubjectContext);
Context.displayName = 'SubjectContext';

const computeSpaceDefs = (available: Array<ConsoleSpace>, space: ConnectedConsoleSpace): SpaceDefs => {
	// eslint-disable-next-line
	const spaceDef = available.find(s => s.spaceId == space.spaceId)!;
	const topicOptions = spaceDef.topics.map(topic => ({ label: topic.name, value: topic.topicId, topic }));
	const factorOptions = spaceDef.topics.reduce((all, topic) => {
		all[topic.topicId] = topic.factors.map(factor => ({
			label: factor.label,
			value: factor.factorId,
			factor,
			topic
		}));
		return all;
	}, {} as { [key in string]: Array<DropdownOption & { topic: ConsoleTopic, factor: ConsoleTopicFactor }> });
	const relationOptions = (spaceDef.topicRelations || []).map(relation => {
		return {
			value: relation.relationId,
			label: '',
			source: {
				// eslint-disable-next-line
				topic: topicOptions.find(topic => topic.value == relation.sourceTopicId)!.topic,
				factors: relation.sourceFactorNames.map(factorName => factorOptions[relation.sourceTopicId]!.find(({ factor }) => factor.name === factorName)!.factor)
			},
			target: {
				// eslint-disable-next-line
				topic: topicOptions.find(topic => topic.value == relation.targetTopicId)!.topic,
				factors: relation.targetFactorNames.map(factorName => factorOptions[relation.targetTopicId]!.find(({ factor }) => factor.name === factorName)!.factor)
			},
			relation
		};
	});

	return {
		space: spaceDef,
		topics: topicOptions,
		factors: factorOptions,
		relations: relationOptions
	};
};

export const SubjectContextProvider = (props: {
	space: ConnectedConsoleSpace;
	group?: ConsoleSpaceGroup;
	subject: ConsoleSpaceSubject;
	doSave?: (subject: ConsoleSpaceSubject) => Promise<void>;
	children?: ((props: any) => React.ReactNode) | React.ReactNode;
}) => {
	const { space, subject, doSave, children } = props;

	const { spaces: { available } = { available: [ space ] } } = useConsoleContext() || {};
	const [ defs, setDefs ] = useState<SpaceDefs>(computeSpaceDefs(available, space));
	const [ saveTimeoutHandle, setSaveTimeoutHandle ] = useState<number | null>(null);
	useEffect(() => {
		if (available.length === 1 && available[0] === space) {
			return;
		}
		setDefs(computeSpaceDefs(available, space));
	}, [ space, available ]);

	const save = async (immediately: boolean = false) => {
		if (saveTimeoutHandle) {
			clearTimeout(saveTimeoutHandle);
		}
		if (immediately) {
			setSaveTimeoutHandle(null);
			if (doSave) {
				await doSave(subject);
			} else {
				await saveSubject(subject);
			}
		} else {
			setSaveTimeoutHandle(setTimeout(async () => {
				setSaveTimeoutHandle(null);
				if (doSave) {
					await doSave(subject);
				} else {
					await saveSubject(subject);
				}
			}, 3000));
		}
	};

	return <Context.Provider value={{ defs, save }}>{children}</Context.Provider>;
};

export const useSubjectContext = () => {
	return React.useContext(Context);
};

