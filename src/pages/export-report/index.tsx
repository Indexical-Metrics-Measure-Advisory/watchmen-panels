import React, { Fragment } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import Path from '../../common/path';
import { BigButton } from '../component/button';

const Operations = styled.div`
	display: flex;
	margin-top: var(--page-margin);
	padding: 0 var(--page-margin);
	> button:not(:first-child) {
		margin-left: var(--page-margin);
	}
`;
const Placeholder = styled.div`
	flex-grow: 1;
`;

export default () => {
	const history = useHistory();

	const onBuildMetricsClicked = () => {
		history.push(Path.GUIDE_BUILD_METRICS);
	};

	return <Fragment>
		<Operations>
			<BigButton onClick={onBuildMetricsClicked}>Rebuild Metrics</BigButton>
			<Placeholder/>
		</Operations>
	</Fragment>;
}