import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { useChartInstanceContext } from '../../../charts/chart-instance-context';
import Button from '../../component/button';
import { useAlert } from '../../context/alert';

export const DownloadButton = (props: { visible: boolean }) => {
	const { visible } = props;

	const chartInstance = useChartInstanceContext();
	const alert = useAlert();
	const onDownloadClicked = async () => {
		try {
			const dataUrl = await chartInstance.download();
			const link = document.createElement('a');
			link.href = dataUrl;
			link.download = 'chart.png';
			link.click();
		} catch (e) {
			console.error(e);
			alert.show('Failed to generate chart image.');
		}
	};
	return <Button onClick={onDownloadClicked} data-visible={visible}>
		<FontAwesomeIcon icon={faDownload}/>
	</Button>;
};