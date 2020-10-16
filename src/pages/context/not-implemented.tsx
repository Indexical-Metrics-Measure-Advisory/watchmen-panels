import React from 'react';
import { emptySetter } from '../../common/utils';
import { useAlert } from './alert';

export interface NotImplemented {
	show: () => void;
}

const Context = React.createContext<NotImplemented>({
	show: emptySetter
});
Context.displayName = 'NotImplementedContext';

export const NotImplementedProvider = (props: { children?: ((props: any) => React.ReactNode) | React.ReactNode }) => {
	const { children } = props;

	const alert = useAlert();
	const context = { show: () => alert.show('Not implemented yet.') };

	return <Context.Provider value={context}>
		{children}
	</Context.Provider>;
};

export const useNotImplemented = () => {
	return React.useContext(Context);
};
