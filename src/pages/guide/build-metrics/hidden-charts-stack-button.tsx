import { faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import styled from 'styled-components';
import Button, { ButtonType } from '../../component/button';
import { HideChart, useHideOnPrintContext } from './hide-on-print-context';

const TrashButton = styled(Button).attrs({
	'data-widget': 'chart-hide-on-print-btn'
})`
	display: block;
	position: fixed;
	font-size: 32px;
	line-height: 64px;
	width: 64px;
	right: 32px;
	top: 314px;
	z-index: 10000;
	padding: 0;
	border: 0;
	border-radius: 100%;
	> span {
		display: block;
	    position: absolute;
	    font-size: var(--font-size);
	    font-weight: var(--font-boldest);
	    top: calc(var(--font-size) - 2px);
	    right: calc(var(--font-size) - 2px);
	    line-height: 0.8em;
	}
	&:hover {
		border-top-right-radius: 0;
		border-bottom-right-radius: 0;
		right: 231px;
		> div {
			opacity: 1;
			right: -199px;
			border: var(--border);
			border-color: var(--primary-color);
			width: 200px;
		}
	}
`;
const HideCharts = styled.div`
	overflow: auto;
	display: flex;
	flex-direction: column;
	min-height: 64px;
	max-height: 282px;
	width: 0;
	position: absolute;
	opacity: 0;
	right: 0;
	top: 0;
	border-radius: var(--border-radius);
	border-top-left-radius: 0;
	border-bottom-left-radius: 0;
	background-color: var(--primary-color);
	z-index: 1;
	overflow-x: hidden;
	transition: all 300ms ease-in-out;
	> div {
		display: flex;
		align-items: center;
		height: 28px;
		line-height: initial;
		color: var(--invert-color);
		border-top: var(--border);
		border-top-color: var(--primary-color);
		padding: 0 calc(var(--margin) / 2);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		font-size: 12px;
		&:first-child {
			border-top-color: transparent;
		}
		&:hover {
			background-color: var(--primary-hover-color);
			> span {
				&:first-child {
					background-color: var(--invert-color);
					color: var(--primary-hover-color);
					margin-right: 12px;
					transform: scale(1.05);
				}
				&:last-child {
					color: var(--invert-color);
					transform: scale(1.05);
				}
			}
		}
		> span {
			transition: all 300ms ease-in-out;
			&:first-child {
				display: block;
				margin-right: 6px;
				width: 32px;
				border-radius: 9px;
				color: var(--primary-color);
				background-color: var(--invert-color);
				height: 18px;
				line-height: 18px;
			}
			&:last-child {
				width: calc(100% - 38px);
				text-align: left;
			}
		}
	}
`;

export const HiddenChartsStackButton = (props: { rnd: boolean }) => {
	const { rnd } = props;

	const hideOnPrintContext = useHideOnPrintContext();

	if (!rnd) {
		return null;
	}

	const charts = hideOnPrintContext.get();
	const has = charts.length !== 0;

	const onRecoverClicked = (chart: HideChart) => async () => await hideOnPrintContext.recover(chart);

	return <TrashButton inkType={ButtonType.PRIMARY}>
		<FontAwesomeIcon icon={faTrashAlt}/>
		<span>{charts.length}</span>
		<HideCharts>
			{
				has
					? charts.map((chart, index) => {
						return <div key={`${chart.title}-${index}`} onClick={onRecoverClicked(chart)}>
							<span>{index + 1}</span>
							<span>{chart.title}</span>
						</div>;
					})
					: <div>
						<span>0</span>
						<span>No chart is hidden.</span>
					</div>
			}
		</HideCharts>
	</TrashButton>;
};
