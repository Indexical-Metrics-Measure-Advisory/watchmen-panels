import React from 'react';
import styled from 'styled-components';
import { ConnectedConsoleSpace } from '../../../../services/console/types';

const PaletteContainer = styled.div`
	flex-grow: 1;
	background-image: radial-gradient(var(--console-waive-color) 1px, transparent 0);
	background-size: 48px 48px;
`;

export const Palette = (props: { space: ConnectedConsoleSpace }) => {
	return <PaletteContainer/>;
};
