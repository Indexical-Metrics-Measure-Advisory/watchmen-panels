import React, { Fragment } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import Path, { toDomain } from '../../common/path';
import { BigButton } from '../component/button';
import { useGuideContext } from '../guide/guide-context';

const Operations = styled.div`
	display: flex;
	margin-top: var(--margin);
	padding: 0 var(--margin);
	> button:not(:first-child) {
		margin-left: var(--margin);
	}
`;
const Placeholder = styled.div`
	flex-grow: 1;
`;

export default () => {
	const history = useHistory();
	const guide = useGuideContext();

	const onBuildMetricsClicked = () => {
		history.push(toDomain(Path.GUIDE_BUILD_METRICS, guide.getDomain().code));
	};

	return <Fragment>
		<Operations>
			<BigButton onClick={onBuildMetricsClicked}>Rebuild Metrics</BigButton>
			<Placeholder/>
		</Operations>
	</Fragment>;
}