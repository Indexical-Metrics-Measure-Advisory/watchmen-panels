import React from "react";
import { Container } from '../../console/connected-space/components';
import { Body } from "./components";
import { PipelineContextProvider } from './pipeline-context';
import { PipelineHeader } from './pipeline-header';

export const Pipeline = () => {
	return <PipelineContextProvider>
		<Container>
			<PipelineHeader/>
			<Body/>
		</Container>
	</PipelineContextProvider>;
};