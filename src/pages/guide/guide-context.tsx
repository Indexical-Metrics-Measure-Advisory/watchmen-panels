import React from 'react';
import { emptyGetter, emptySetter } from '../../common/utils';
import { DataColumn, DataSet } from '../../data/types';
import { NoDomain } from '../../services/domain';
import { Domain } from '../../services/types';

export interface GuideCalcDataColumn extends DataColumn {
	expressionCode: string;
	expression: string;
}

export interface GuideContext {
	domain: Domain,
	data?: DataSet;
}

export interface GuideContextOperator {
	setDomain: (domain: Domain) => void;
	getDomain: () => Domain;
	clearDomain: () => void;
	setData: (data: DataSet) => void;
	getData: () => DataSet | undefined;
	clearData: () => void;
	print: () => void;
}

const Context = React.createContext<GuideContextOperator>({
	setDomain: emptySetter,
	getDomain: () => NoDomain,
	clearDomain: emptySetter,
	setData: emptySetter,
	getData: emptyGetter,
	clearData: emptySetter,
	print: emptySetter
});
Context.displayName = 'GuideContext';

export const GuideContextProvider = (props: { children?: ((props: any) => React.ReactNode) | React.ReactNode }) => {
	const { children } = props;

	const [ context, setContext ] = React.useState<GuideContext>({ domain: NoDomain });

	const operator = {
		setDomain: (domain: Domain) => setContext({ ...context, domain }),
		getDomain: () => context.domain,
		clearDomain: () => setContext({ ...context, domain: NoDomain }),
		setData: (data: DataSet) => setContext({ ...context, data }),
		getData: () => context.data,
		clearData: () => setContext({ ...context, data: undefined }),
		print: () => {
			const onAfterPrint = () => {
				document.documentElement.removeAttribute('data-on-print');
				window.removeEventListener('afterprint', onAfterPrint);
			};
			window.addEventListener('afterprint', onAfterPrint);
			document.documentElement.setAttribute('data-on-print', 'true');
			window.print();
		}
	};

	return <Context.Provider value={operator}>{children}</Context.Provider>;
};

export const useGuideContext = () => {
	return React.useContext(Context);
};
