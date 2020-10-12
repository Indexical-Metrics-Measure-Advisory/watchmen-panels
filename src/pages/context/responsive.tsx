import React, { ReactNode } from 'react';

export interface Responsive {
	mobile: boolean
}

const Context = React.createContext<Responsive>({ mobile: false });

const isMobile = () => window.matchMedia('(max-width: 599px)').matches;
export const ResponsiveProvider = (props: { children?: ReactNode }) => {
	const { children } = props;

	const [ responsive, setResponsive ] = React.useState(() => ({ mobile: isMobile() }));

	const handleWindowResize = () => {
		// 宽度小于600就认为是手机
		setResponsive({ mobile: isMobile() });
	};
	React.useEffect(() => {
		window.addEventListener('resize', handleWindowResize);
		return () => {
			window.removeEventListener('resize', handleWindowResize);
		};
	});

	return <Context.Provider value={responsive}>{children}</Context.Provider>;
};

export const useResponsive = () => {
	return React.useContext(Context);
};
