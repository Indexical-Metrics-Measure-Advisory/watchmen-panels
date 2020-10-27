import { faCog } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import Button from '../../component/button';
import { useChartSettingsContext } from './settings-context';

export const SettingsButton = (props: { visible: boolean }) => {
	const { visible } = props;

	const settings = useChartSettingsContext();

	return <Button onClick={settings.toggleActive} data-visible={visible} data-active={settings.active}
	               data-widget={'chart-settings-btn'}>
		<FontAwesomeIcon icon={faCog}/>
	</Button>;
};