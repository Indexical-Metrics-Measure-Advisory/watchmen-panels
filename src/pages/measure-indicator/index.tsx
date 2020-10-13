import React, { Fragment } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import Path from '../../common/path';
import { BigButton, ButtonType } from '../component/button';

const Operations = styled.div`
	display: flex;
	margin-top: var(--page-margin);
	padding: 0 var(--page-margin);
	> button:not(:first-child) {
		margin-left: var(--page-margin);
	}
`;
const Placeholder = styled.div`
	flex-grow: 1;
`;

export default () => {
	const history = useHistory();

	const onMappingFactorsClicked = () => {
		history.push(Path.GUIDE_MAPPING_FACTOR);
	};
	const onNextClicked = () => {
		history.push(Path.GUIDE_BUILD_METRICS);
	};

	return <Fragment>
		<Operations>
			<BigButton onClick={onMappingFactorsClicked}>Check Factors</BigButton>
			<Placeholder/>
			<BigButton inkType={ButtonType.PRIMARY} onClick={onNextClicked}>Next</BigButton>
		</Operations>
	</Fragment>;
}