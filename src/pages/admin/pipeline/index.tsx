import React from "react";
import styled from 'styled-components';
import { PipelineBody } from './pipeline-body';
import { PipelineContextProvider } from './pipeline-context';
import { PipelineHeader } from './pipeline-header';
import { PipelineNavigator } from './pipeline-navigator';

const Container = styled.div.attrs({
	'data-widget': 'console-pipeline-container'
})`
	display: grid;
	grid-template-columns: 1fr auto;
	grid-template-rows: auto 1fr;
	flex-grow: 1;
	overflow: hidden;
`;

export const Pipeline = () => {
	return <PipelineContextProvider>
		<Container>
			<PipelineHeader/>
			<PipelineBody/>
			<PipelineNavigator/>
		</Container>
	</PipelineContextProvider>;
};