import { faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { Fragment, useState } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import Path, { toDomain } from '../../../common/path';
import { CustomDomainExpression } from '../../../services/domain';
import { BigButton, ButtonType } from '../../component/button';
import { useAlert } from '../../context/alert';
import { ObjectDetail, ObjectDetailHeader, ObjectDetailHeaderCell } from '../component/object-detail';
import { NoObjects, ObjectItem, ObjectsContainer, ObjectsList } from '../component/object-list';
import { OperationBar, OperationBarPlaceholder } from '../component/operations-bar';
import { GuideData, GuideDataColumn, GuideTopic, useGuideContext } from '../guide-context';
import { CalcColumn } from './calc-column';
import { NativeColumn } from './native-column';

const MeasureObjectItem = styled(ObjectItem)`
	&[data-active=false] + div {
		height: 0;
	}
	&[data-active=true] {
		> svg {
			transform: rotateX(180deg);
		}
	}
	> span {
		flex-grow: 1;
	}
	> svg {
		transition: all 300ms ease-in-out;
	}
`;
const DetailHeader = styled(ObjectDetailHeader)`
	grid-template-columns: 30% calc(35% - 32px) calc(35% - 32px) 32px 32px;
`;

export default () => {
	const history = useHistory();
	const alert = useAlert();
	const guide = useGuideContext();

	const data = (guide.getData() || {}) as GuideData;
	const objectKeys = Object.keys(data).sort((k1, k2) => k1.localeCompare(k2));

	const [ activeKey, setActiveKey ] = useState<string | null>(objectKeys.length !== 0 ? objectKeys[0] : null);

	const onNoObjectsClicked = () => history.push(toDomain(Path.GUIDE_IMPORT_DATA, guide.getDomain().code));
	const onMappingFactorsClicked = () => history.push(toDomain(Path.GUIDE_MAPPING_FACTOR, guide.getDomain().code));
	const onNextClicked = () => {
		if (objectKeys.length !== 0) {
			history.push(toDomain(Path.GUIDE_BUILD_METRICS, guide.getDomain().code));
		} else {
			alert.show('No factor described.');
		}
	};

	const onObjectClicked = (key: string) => () => {
		if (key === activeKey) {
			setActiveKey(null);
		} else {
			setActiveKey(key);
		}
	};

	const renderCalcColumns = (topic: GuideTopic) => {
		const calcColumnTypeOptions = [ ...(guide.getDomain().expressions || []), CustomDomainExpression ].map(option => {
			return {
				...option,
				value: option.code
			};
		});
		const existsColumns = (topic.columns || [])
			.map((column, index) => {
				return <CalcColumn column={column} topic={topic}
				                   typeOptions={calcColumnTypeOptions}
				                   key={`${column.name}-${index}`}/>;
			});

		const newColumn = { native: false } as GuideDataColumn;
		return <Fragment>
			{existsColumns}
			<CalcColumn column={newColumn} topic={topic} typeOptions={calcColumnTypeOptions}/>
		</Fragment>;
	};

	return <Fragment>
		<ObjectsContainer>
			<ObjectsList data-has-data={objectKeys.length !== 0} data-has-active={activeKey != null}>
				{objectKeys.map(key => {
					const columnsVisible = key === activeKey;
					return <Fragment key={key}>
						<MeasureObjectItem onClick={onObjectClicked(key)} data-active={key === activeKey}>
							<span>{key}</span>
							<FontAwesomeIcon icon={faAngleUp}/>
						</MeasureObjectItem>
						{(data[key].columns || []).map(column => {
							return <NativeColumn column={column} visible={columnsVisible} key={column.name}/>;
						})}
					</Fragment>;
				})}
				<NoObjects onClick={onNoObjectsClicked}>
					No valid data imported, back and <span>Import Data</span> again.
				</NoObjects>
			</ObjectsList>
			<ObjectDetail data-visible={activeKey != null}>
				<DetailHeader>
					<ObjectDetailHeaderCell>Calc.</ObjectDetailHeaderCell>
					<ObjectDetailHeaderCell>Name</ObjectDetailHeaderCell>
					<ObjectDetailHeaderCell>Label</ObjectDetailHeaderCell>
				</DetailHeader>
				{activeKey ? renderCalcColumns(data[activeKey]) : null}
			</ObjectDetail>
		</ObjectsContainer>
		<OperationBar>
			<BigButton onClick={onMappingFactorsClicked}>Check Factors</BigButton>
			<OperationBarPlaceholder/>
			<BigButton inkType={ButtonType.PRIMARY} onClick={onNextClicked}>Next</BigButton>
		</OperationBar>
	</Fragment>;
}