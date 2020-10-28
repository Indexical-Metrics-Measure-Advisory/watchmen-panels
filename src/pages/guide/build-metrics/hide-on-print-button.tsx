import { faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import Button from '../../component/button';
import { useChartContext } from './chart-context';

export const HideOnPrintButton = (props: { visible: boolean, title?: string }) => {
	const { visible, title } = props;

	const chartContext = useChartContext();
	const onHideClicked = () => chartContext.hideOnPrint(title || 'Untitled');
	return <Button onClick={onHideClicked} data-visible={visible} data-role='rnd'>
		<FontAwesomeIcon icon={faEyeSlash}/>
	</Button>;
};