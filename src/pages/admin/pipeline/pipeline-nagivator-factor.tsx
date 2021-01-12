import React from 'react';
import styled from 'styled-components';
import { QueriedFactorForPipeline, QueriedTopicForPipeline } from '../../../services/admin/types';
import { FactorIcon } from './components';
import { PipelineNavigatorNodeLabel } from './pipeline-navigator-node-label';

const FactorsContainer = styled.div.attrs<{ visible: boolean, count: number }>(({ visible, count }) => {
	return {
		style: {
			height: visible ? count * 32 : 0
		}
	};
})<{ visible: boolean, count: number }>`
	display: flex;
	flex-direction: column;
	flex-grow: 1;
	overflow: hidden;
	transition: height 300ms ease-in-out;
`;
const FactorNode = styled.div`
	display: flex;
	position: relative;
	align-items: center;
	height: 32px;
	padding: 0 calc(var(--margin) / 2) 0 calc(var(--margin) / 2 + 15px);
	cursor: pointer;
	&:hover {
		background-color: var(--hover-color);
	}
	&:before,
	&:after {
		content: '';
		display: block;
		position: absolute;
		background-color: var(--console-waive-color);
	}
	&:before {
		left: calc(var(--margin) / 2 + 3px);
		top: -16px;
		height: 32px;
		width: 1px;
	}
	&:after {
		left: calc(var(--margin) / 2 + 3px);
		top: 16px;
		width: 8px;
		height: 1px;
		transform: translateY(-50%);
	}
	> div:first-child {
		font-size: 0.8em;
		min-height: 20px;
		height: 20px;
		min-width: 20px;
		width: 20px;
		margin-right: calc(var(--margin) / 4);
	}
`;

export const NavigatorFactors = (props: {
	visible: boolean;
	topic: QueriedTopicForPipeline;
	visibleFactors: Array<QueriedFactorForPipeline>;
	filterText: string;
}) => {
	const { topic, visible, visibleFactors, filterText } = props;

	const displayFactors = visibleFactors.length === 0 ? topic.factors : visibleFactors;

	return <FactorsContainer visible={visible} count={displayFactors.length}>
		{displayFactors.map(factor => {
			return <FactorNode key={factor.factorId}>
				<FactorIcon factor={factor}/>
				<PipelineNavigatorNodeLabel name={factor.name} filter={filterText}/>
			</FactorNode>;
		})}
	</FactorsContainer>;
};