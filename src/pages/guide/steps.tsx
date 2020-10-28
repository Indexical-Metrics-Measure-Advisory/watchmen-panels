import { faFlagCheckered, faTruckPickup } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Link, matchPath, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import Path from '../../common/path';
import { useGuideContext } from './guide-context';

export enum Step {
	DOMAIN_SELECT,
	IMPORT_DATA,
	MAPPING_FACTORS,
	MEASURE_INDICATORS,
	BUILD_METRICS
}

const StepLabels = [ 'Domain Select', 'Import Data', 'Mapping Factors', 'Measure Indicators', 'Build & Export Metrics' ];

const Steps = styled.div.attrs({
	'data-widget': 'guide-steps'
})`
	position: relative;
	padding: 0 var(--margin);
	display: flex;
	flex-direction: column;
	padding-bottom: 1em;
`;
const CurrentStep = styled.div`
	display: flex;
	flex-direction: column;
	> span:first-child {
		display: flex;
		position: relative;
		opacity: 0.5;
		white-space: nowrap;
		> span > a {
			text-decoration: none;
			color: var(--font-color);
			&:hover {
				text-decoration: underline;
			}
		}
		> span:not(:first-child) {
			&:before {
				content: '/';
    			padding: 0.5em;
			}
		}
		> span:last-child {
			user-select: none;
			text-overflow: ellipsis;
    		overflow: hidden;
		}
	}
	> span:last-child {
		font-size: 1.7em;
		line-height: 1.7em;
		font-weight: var(--font-boldest);
		user-select: none;
	}
`;
const StepDots = styled.ul`
	list-style-type: none;
	margin-block-start: 0;
	margin-block-end: 0;
	padding-inline-start: 0;
	position: relative;
	display: flex;
	align-items: center;
`;
const StepDot = styled.li`
	height: 8px;
	width: 8px;
	border-radius: 100%;
	background-color: var(--border-color);
	color: var(--border-color);
	border: var(--border);
	font-size: 12px;
	transition: all 300ms 100ms ease-in-out;
	&:not(:first-child) {
		position: relative;
		margin-left: calc(var(--margin) * 2);
		&:before {
			content: '';
			display: block;
			position: absolute;
			left: calc(var(--margin) * -2 - 1px);
			top: 50%;
			transform: translateY(-50%);
			width: calc(var(--margin) * 2);
			height: 1px;
			background-color: var(--border-color);
			z-index: -1;
			transition: background-color 300ms ease-in-out;
		}
	}
	&[data-performed=true] {
		background-color: var(--font-color);
		border-color: var(--font-color);
	}
	&[data-current=true],
	&[data-performed=true] {
		&:before {
			background-color: var(--font-color);
		}
	}
	&:nth-last-child(2),
	&[data-current=true] {
		border-color: transparent;
		background-color: transparent;
	}
	&[data-current=true] {
		&:nth-last-child(2) {
			> svg {
				opacity: 1;
				color: var(--font-color);
			}
		}
		> svg {
			opacity: 0;
		}
		+ div {
			display: none;
		}
	}
	> svg {
		color: var(--border-color);
		opacity: 1;
		transform: translateY(-4px);
		transition: all 300ms ease-in-out;
	}
`;
const Current = styled.div<{ step: number }>`
	position: absolute;
	left: calc((8px + var(--margin) * 2) * ${({ step }) => step} - 1px);
	transition: left 300ms ease-in-out;
`;

export default (props: { step: Step }) => {
	const { step } = props;
	const location = useLocation();
	const showDomain = !matchPath(location.pathname, Path.GUIDE_DOMAIN_SELECT);
	const guide = useGuideContext();

	const domain = guide.getDomain();

	return <Steps>
		<CurrentStep>
			<span>
				<span><Link to={Path.HOME}>Home</Link></span>
				<span>
					{showDomain ? <Link to={Path.GUIDE_DOMAIN_SELECT}>Step by Step Guide</Link> : 'Step by Step Guide'}
				</span>
				{showDomain ? <span>{domain.label}</span> : null}
			</span>
			<span>{StepLabels[step]}</span>
		</CurrentStep>
		<StepDots>
			{StepLabels.map((label, index) => {
				return <StepDot key={label} title={label} data-current={index === step} data-performed={index < step}>
					{index === Step.BUILD_METRICS ? <FontAwesomeIcon icon={faFlagCheckered}/> : null}
				</StepDot>;
			})}
			<Current step={step}><FontAwesomeIcon icon={faTruckPickup}/></Current>
		</StepDots>
	</Steps>;
}