import React from 'react';
import styled from 'styled-components';

const Body = styled.div.attrs({
	'data-widget': 'console-pipeline-body'
})`
	display: flex;
`;

export const PipelineBody = () => {
	return <Body/>;
};