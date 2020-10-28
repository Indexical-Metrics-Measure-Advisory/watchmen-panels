import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { useChartInstanceContext } from '../../../charts/chart-instance-context';
import Button from '../../component/button';
import { useAlert } from '../../context/alert';
import { useResponsive } from '../../context/responsive';

export const DownloadButton = (props: { visible: boolean }) => {
	const { visible } = props;

	const responsive = useResponsive();
	const chartInstance = useChartInstanceContext();
	const alert = useAlert();
	const onDownloadClicked = async () => {
		if (responsive.mobile) {
			alert.show('Download doesn\'t support in mobile device.');
			return;
		}

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
	return <Button onClick={onDownloadClicked} data-visible={visible} data-widget={'chart-download-btn'}>
		<FontAwesomeIcon icon={faDownload}/>
	</Button>;
};