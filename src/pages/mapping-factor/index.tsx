import React, { Fragment, useState } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import Path from '../../common/path';
import { BigButton, ButtonType } from '../component/button';
import { useGuideContext } from '../guide/guide-context';

const ObjectsContainer = styled.div`
	display: flex;
	margin: 0 var(--margin);
	border-radius: calc(var(--border-radius) * 2);
	border: var(--border);
	min-height: 300px;
	overflow: hidden;
`;
const ObjectsList = styled.div`
	width: 30%;
	display: flex;
	flex-direction: column;
	border-right: var(--border);
`;
const ObjectDetail = styled.div`
	
`;
const ObjectItem = styled.div`
	display: flex;
	align-items: center;
	height: 32px;
	padding: 0 calc(var(--margin) / 2);
	cursor: pointer;
	white-space: nowrap;
	text-overflow: ellipsis;
	overflow-x: hidden;
	border-bottom: var(--border);
	&:nth-child(n + 10):last-child {
		border-bottom: transparent;
	}
	&:hover {
		background-color: var(--hover-color);
	}
	&[data-active=true] {
		background-color: var(--active-color);
		color: var(--invert-color);
	}
`;
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
	const guide = useGuideContext();

	const [ activeKey, setActiveKey ] = useState<string | null>(null);

	const onImportDataClicked = () => {
		history.push(Path.GUIDE_IMPORT_DATA);
	};
	const onNextClicked = () => {
		history.push(Path.GUIDE_MEASURE_INDICATOR);
	};

	const data = guide.getData() || { "No Data": [] };
	const onObjectSelected = (key: string) => () => setActiveKey(key);

	return <Fragment>
		<ObjectsContainer>
			<ObjectsList>
				{Object.keys(data).sort((k1, k2) => k1.localeCompare(k2)).map((key, index) => {
					return <ObjectItem key={key} onClick={onObjectSelected(key)} data-active={key === activeKey}>
						{key}
					</ObjectItem>;
				})}
			</ObjectsList>
			<ObjectDetail>

			</ObjectDetail>
		</ObjectsContainer>
		<Operations>
			<BigButton onClick={onImportDataClicked}>Reimport Data</BigButton>
			<Placeholder/>
			<BigButton inkType={ButtonType.PRIMARY} onClick={onNextClicked}>Next</BigButton>
		</Operations>
	</Fragment>;
}