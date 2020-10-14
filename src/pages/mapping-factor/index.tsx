import React, { Fragment } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import Path from '../../common/path';
import { BigButton, ButtonType } from '../component/button';

const Operations = styled.div`
	display: flex;
	margin-top: var(--margin);
	padding: 0 var(--margin);
	> button:not(:first-child) {
		margin-left: var(--margin);
	}
`;
const Placeholder = styled.div`
	flex-grow: 1;
`;

export default () => {
	const history = useHistory();

	const onImportDataClicked = () => {
		history.push(Path.GUIDE_IMPORT_DATA);
	};
	const onNextClicked = () => {
		history.push(Path.GUIDE_MEASURE_INDICATOR);
	};

	return <Fragment>
		<Operations>
			<BigButton onClick={onImportDataClicked}>Reimport Data</BigButton>
			<Placeholder/>
			<BigButton inkType={ButtonType.PRIMARY} onClick={onNextClicked}>Next</BigButton>
		</Operations>
	</Fragment>;
}