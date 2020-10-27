import { faThumbtack } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { ChartSettings } from '../../../charts/custom/types';
import Button from '../../component/button';
import { useSavedCustomChartContext } from './saved-custom-chart-context';

export const SaveButton = (props: { visible: boolean, settings: ChartSettings }) => {
	const { visible, settings } = props;

	const customCharts = useSavedCustomChartContext();
	const onSaveClicked = () => customCharts.add(settings);

	return <Button onClick={onSaveClicked} data-visible={visible}>
		<FontAwesomeIcon icon={faThumbtack}/>
	</Button>;
};