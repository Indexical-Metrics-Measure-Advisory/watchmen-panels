import { faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { Fragment, useState } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import Path, { toDomain } from '../../../common/path';
import { CustomDomainExpression, DomainExpression } from '../../../services/domain';
import { BigButton, ButtonType } from '../../component/button';
import { DropdownOption } from '../../component/dropdown';
import { useAlert } from '../../context/alert';
import { DropdownInGrid } from '../component/dropdown-in-grid';
import { InputInGrid } from '../component/input-in-grid';
import {
	ObjectDetail,
	ObjectDetailBodyCell,
	ObjectDetailBodyRow,
	ObjectDetailHeader,
	ObjectDetailHeaderCell
} from '../component/object-detail';
import { NoObjects, ObjectItem, ObjectsContainer, ObjectsList } from '../component/object-list';
import { OperationBar, OperationBarPlaceholder } from '../component/operations-bar';
import {
	GuideCalcDataColumn,
	GuideData,
	GuideDataColumn,
	GuideDataObjectColumn,
	useGuideContext
} from '../guide-context';
import { asDisplayName, asDisplayType, generateUniqueLabel, generateUniqueName } from '../utils';

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
const ObjectColumn = styled(ObjectItem)<{ indent?: number }>`
	cursor: default;
	text-indent: calc(0.8em * ${({ indent }) => (indent || 0) + 1});
	font-size: 0.8em;
	&:hover {
		background-color: var(--hover-color);
	}
	&[data-visible=false] {
		height: 0;
		border-bottom: 0;
	}
	> span:last-child {
		transform: scale(0.8);
		transform-origin: bottom;
		text-transform: capitalize;
	}
`;
const DetailHeader = styled(ObjectDetailHeader)`
	grid-template-columns: 30% 35% 35%;
`;
const DetailBodyRow = styled(ObjectDetailBodyRow)`
	grid-template-columns: 30% 35% 35%;
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

	const renderNativeColumns = (columns: Array<GuideDataColumn> = [], visible: boolean) => {
		return columns.filter(column => column.native)
			.map(column => {
				const name = asDisplayName(column);
				const label = column.label;
				const type = asDisplayType(column);
				const indent = (column.name || '').split('').filter(ch => ch === '.').length;
				const childTypes = (column as GuideDataObjectColumn).childTypes || [];
				return <Fragment key={column.name}>
					<ObjectColumn indent={indent} data-visible={visible}>
						<span>{label || name}</span>
						<span>{type ? `(${type})` : null}</span>
					</ObjectColumn>
					{childTypes.length !== 0 ? renderNativeColumns(childTypes, visible) : null}
				</Fragment>;
			});
	};
	const onColumnNameChange = (column: GuideDataColumn) => (evt: React.ChangeEvent<HTMLInputElement>) => {
		column.name = evt.target.value;
		guide.setData(guide.getData()!);
	};
	const onColumnLabelChange = (column: GuideDataColumn) => (evt: React.ChangeEvent<HTMLInputElement>) => {
		column.label = evt.target.value;
		guide.setData(guide.getData()!);
	};
	const calcColumnTypeOptions = [ ...(guide.getDomain().expressions || []), CustomDomainExpression ].map(option => {
		return {
			...option,
			value: option.code
		};
	});
	const onCalcTypeChanged = (columns: Array<GuideDataColumn>, column: GuideCalcDataColumn) => async (option: DropdownOption) => {
		const expression = option as unknown as DomainExpression;
		column.expressionCode = option.value as string;
		column.name = generateUniqueName(columns, column, column.name || expression.name);
		column.label = generateUniqueLabel(columns, column, column.label || expression.label);
		if (!columns.includes(column)) {
			columns.push(column);
		}
		guide.setData(guide.getData()!);
	};
	const renderCalcColumns = (columns: Array<GuideDataColumn> = []) => {
		return columns.filter(column => !column.native)
			.map((column, index) => {
				const calcColumn = column as GuideCalcDataColumn;
				const name = asDisplayName(column);
				const label = column.label;
				const created = data[activeKey!].columns.includes(column);
				return <DetailBodyRow key={index}>
					<ObjectDetailBodyCell>
						<DropdownInGrid options={calcColumnTypeOptions} value={calcColumn.expressionCode}
						                please={"New Indicator..."}
						                onChange={onCalcTypeChanged(data[activeKey!].columns, calcColumn)}/>
					</ObjectDetailBodyCell>
					{created
						? <ObjectDetailBodyCell>
							<InputInGrid type="text" placeholder={name} value={name}
							             onChange={onColumnNameChange(column)}/>
						</ObjectDetailBodyCell>
						: null
					}
					{created
						? <ObjectDetailBodyCell>
							<InputInGrid type="text" placeholder={label || name} value={label}
							             onChange={onColumnLabelChange(column)}/>
						</ObjectDetailBodyCell>
						: null
					}
				</DetailBodyRow>;
			});
	};

	return <Fragment>
		<ObjectsContainer>
			<ObjectsList data-has-data={objectKeys.length !== 0} data-has-active={activeKey != null}>
				{objectKeys.map(key => {
					return <Fragment key={key}>
						<MeasureObjectItem onClick={onObjectClicked(key)} data-active={key === activeKey}>
							<span>{key}</span>
							<FontAwesomeIcon icon={faAngleUp}/>
						</MeasureObjectItem>
						{renderNativeColumns(data[key].columns, key === activeKey)}
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
				{activeKey ? renderCalcColumns([ ...data[activeKey].columns, { native: false } as GuideCalcDataColumn ]) : null}
			</ObjectDetail>
		</ObjectsContainer>
		<OperationBar>
			<BigButton onClick={onMappingFactorsClicked}>Check Factors</BigButton>
			<OperationBarPlaceholder/>
			<BigButton inkType={ButtonType.PRIMARY} onClick={onNextClicked}>Next</BigButton>
		</OperationBar>
	</Fragment>;
}