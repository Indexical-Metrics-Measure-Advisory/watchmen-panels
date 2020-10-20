import React, { Fragment } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { EChart } from '../../../charts/chart';
import { useDoughnut } from '../../../charts/doughnut';
import Path, { toDomain } from '../../../common/path';
import { BigButton, ButtonType } from '../../component/button';
import { OperationBar, OperationBarPlaceholder } from '../component/operations-bar';
import { useGuideContext } from '../guide-context';

const MetricsContainer = styled.div`
	display: grid;
	grid-template-columns: 1fr;
	grid-column-gap: var(--margin);
	grid-row-gap: var(--margin);
	margin: var(--margin) var(--margin) 0;
	flex-direction: column;
	@media (min-width: 1000px) {
		grid-template-columns: repeat(3, 1fr);
	}
	@media (min-width: 1600px) {
		grid-template-columns: repeat(4, 1fr);
	}
`;
const Chart = styled(EChart)`
	height: 300px;
	border-radius: calc(var(--border-radius) * 2);
	border: var(--border);
`;

export default () => {
	const history = useHistory();
	const guide = useGuideContext();

	const onMeasureIndicatorsClicked = () => {
		history.push(toDomain(Path.GUIDE_MEASURE_INDICATOR, guide.getDomain().code));
	};
	const onNextClicked = () => {
		history.push(toDomain(Path.GUIDE_EXPORT_REPORT, guide.getDomain().code));
	};

	return <Fragment>
		<MetricsContainer>
			<Chart chartOptions={useDoughnut({
				data: guide.getData()!.tasks.data.map(item => {
					return { name: item.Category, value: 1 };
				})
			})}/>
		</MetricsContainer>
		<OperationBar>
			<BigButton onClick={onMeasureIndicatorsClicked}>Adjust Indicators</BigButton>
			<OperationBarPlaceholder/>
			<BigButton inkType={ButtonType.PRIMARY} onClick={onNextClicked}>Next</BigButton>
		</OperationBar>
	</Fragment>;
}