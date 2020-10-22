import { faChartArea, faChartBar, faChartLine, faChartPie } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { Fragment } from 'react';
import styled from 'styled-components';
import { DarkenColors24 } from '../../../charts/color-theme';
import { ChartHeader, ChartOperators, ChartTitle } from '../../component/chart';
import { DownloadButton } from './download-button';
import { ResizeButtons } from './resize-buttons';
import { SettingsButton } from './settings-button';
import { SettingsContainer } from './settings-container';

export const ChartDisabledPlaceholder = styled.div.attrs({
	'data-widget': 'chart-disabled'
})`
	flex-grow: 1;
	height: 300px;
	display: grid;
	grid-template-columns: 1fr 1fr;
	grid-template-rows: 50% auto 1fr;
	> svg {
		font-size: 48px;
		opacity: 0.2;
		&:first-child {
			color: ${DarkenColors24[0]};
			align-self: end;
		    justify-self: end;
		    padding-right: 4px;
		}
		&:nth-child(2) {
			color: ${DarkenColors24[1]};
			align-self: end;
		    padding-left: 4px;
		}
		&:nth-child(3) {
			color: ${DarkenColors24[2]};
			justify-self: end;
		    padding-right: 4px;
		}
		&:nth-child(4) {
			color: ${DarkenColors24[3]};
		    padding-left: 4px;
		}
	}
	> div {
		font-size: 0.8em;
		opacity: 0.8;
		grid-column: span 2;
		text-align: center;
		align-self: start;
	}
`;

export const CustomChartPanel = (props: {}) => {
	return <Fragment>
		<ChartHeader>
			<ChartTitle>Custom Chart</ChartTitle>
			<ChartOperators>
				<DownloadButton visible={false}/>
				<SettingsButton visible={true}/>
				<ResizeButtons/>
			</ChartOperators>
		</ChartHeader>
		<SettingsContainer>
		</SettingsContainer>
		<ChartDisabledPlaceholder>
			<FontAwesomeIcon icon={faChartBar}/>
			<FontAwesomeIcon icon={faChartPie}/>
			<FontAwesomeIcon icon={faChartArea}/>
			<FontAwesomeIcon icon={faChartLine}/>
			<div>Define your own chart</div>
		</ChartDisabledPlaceholder>
	</Fragment>;
};