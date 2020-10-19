import React, { Fragment } from 'react';
import { useHistory } from 'react-router-dom';
import Path, { toDomain } from '../../../common/path';
import { BigButton } from '../../component/button';
import { OperationBar, OperationBarPlaceholder } from '../component/operations-bar';
import { useGuideContext } from '../guide-context';

export default () => {
	const history = useHistory();
	const guide = useGuideContext();

	const onBuildMetricsClicked = () => {
		history.push(toDomain(Path.GUIDE_BUILD_METRICS, guide.getDomain().code));
	};

	return <Fragment>
		<OperationBar>
			<BigButton onClick={onBuildMetricsClicked}>Rebuild Metrics</BigButton>
			<OperationBarPlaceholder/>
		</OperationBar>
	</Fragment>;
}