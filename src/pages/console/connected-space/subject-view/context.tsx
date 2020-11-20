import React, { useEffect, useState } from 'react';
import {
	ConnectedConsoleSpace,
	ConsoleSpace,
	ConsoleSpaceGroup,
	ConsoleSpaceSubject
} from '../../../../services/console/types';
import { DropdownOption } from '../../../component/dropdown';
import { useConsoleContext } from '../../context/console-context';

interface SpaceDefs {
	space: ConsoleSpace;
	topics: Array<DropdownOption>;
	factors: { [key in string]: Array<DropdownOption> }
}

export interface SubjectContext {
	defs: SpaceDefs
}

const Context = React.createContext<SubjectContext>({} as SubjectContext);
Context.displayName = 'SubjectContext';

const computeSpaceDefs = (available: Array<ConsoleSpace>, space: ConnectedConsoleSpace) => {
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
	}, {} as { [key in string]: Array<DropdownOption> });

	return {
		space: spaceDef,
		topics: topicOptions,
		factors: factorOptions
	};
};

export const SubjectContextProvider = (props: {
	space: ConnectedConsoleSpace;
	group?: ConsoleSpaceGroup;
	subject: ConsoleSpaceSubject;
	children?: ((props: any) => React.ReactNode) | React.ReactNode;
}) => {
	const { space, group, subject, children } = props;

	const { spaces: { available } } = useConsoleContext();
	const [ defs, setDefs ] = useState<SpaceDefs>(computeSpaceDefs(available, space));
	useEffect(() => {
		setDefs(computeSpaceDefs(available, space));
	}, [ space, available ]);

	return <Context.Provider value={{
		defs
	}}>{children}</Context.Provider>;
};

export const useSubjectContext = () => {
	return React.useContext(Context);
};

