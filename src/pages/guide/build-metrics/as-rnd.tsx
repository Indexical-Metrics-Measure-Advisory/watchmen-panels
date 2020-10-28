import React, { Fragment } from 'react';
import { Rnd } from 'react-rnd';
import styled from 'styled-components';

const HideDiv = styled.div`
	display: none;
	overflow: hidden;
`;

export const AsRnd = (props: {
	rnd: boolean,
	lock?: boolean,
	hidden?: boolean,
	children: ((props: any) => React.ReactNode) | React.ReactNode
}) => {
	const { rnd, lock = false, hidden = false, children } = props;
	if (rnd) {
		if (hidden) {
			return <HideDiv>{children}</HideDiv>;
		} else {
			return <Rnd enableResizing={!lock} disableDragging={lock}>{children}</Rnd>;
		}
	} else {
		return <Fragment>{children}</Fragment>;
	}
};
