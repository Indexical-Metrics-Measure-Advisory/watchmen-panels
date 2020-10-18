import React from 'react';
import { emptyGetter, emptySetter } from '../../common/utils';
import { Domain } from '../../services/domain';

export enum GuideDataColumnType {
	TEXT = 'text',
	NUMERIC = 'numeric',
	BOOLEAN = 'boolean',
	DATE = 'date',
	TIME = 'time',
	DATETIME = 'datetime',
	OBJECT = 'object',
	ARRAY = 'array',
	UNKNOWN = 'unknown'
}

export interface GuideDataColumn {
	name: string;
	label: string;
	type: GuideDataColumnType;
}

export interface GuideDataObjectColumn extends GuideDataColumn {
	childTypes: Array<GuideDataColumn>;
}

export type GuideData = {
	[key in string]: {
		columns: Array<GuideDataColumn>,
		data: Array<any>,
		hash: string;
	}
};

export interface GuideContext {
	domain?: Domain,
	data?: GuideData;
}

export interface GuideContextOperator {
	setDomain: (domain: Domain) => void;
	getDomain: () => Domain | undefined;
	clearDomain: () => void;
	setData: (data: GuideData) => void;
	getData: () => GuideData | undefined;
	clearData: () => void;
}

const Context = React.createContext<GuideContextOperator>({
	setDomain: emptySetter,
	getDomain: emptyGetter,
	clearDomain: emptySetter,
	setData: emptySetter,
	getData: emptyGetter,
	clearData: emptySetter
});
Context.displayName = 'GuideContext';

export const GuideContextProvider = (props: { children?: ((props: any) => React.ReactNode) | React.ReactNode }) => {
	const { children } = props;

	const [ context, setContext ] = React.useState<GuideContext>({});

	const operator = {
		setDomain: (domain: Domain) => setContext({ ...context, domain }),
		getDomain: () => context.domain,
		clearDomain: () => setContext({ ...context, domain: undefined }),
		setData: (data: GuideData) => setContext({ ...context, data }),
		getData: () => context.data,
		clearData: () => setContext({ ...context, data: undefined })
	};

	return <Context.Provider value={operator}>{children}</Context.Provider>;
};

export const useGuideContext = () => {
	return React.useContext(Context);
};
