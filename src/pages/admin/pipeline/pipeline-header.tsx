import React from 'react';
import { Header, HeaderSection } from './components';
import { PipelineHeaderDirection } from './pipeline-header-direction';
import { PipelineHeaderFactor } from './pipeline-header-factor';
import { PipelineHeaderTopic } from './pipeline-header-topic';

export const PipelineHeader = () => {
	return <Header>
		<HeaderSection>Pipelines</HeaderSection>
		<PipelineHeaderTopic/>
		<PipelineHeaderFactor/>
		<PipelineHeaderDirection/>
	</Header>;
};