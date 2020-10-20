import React, { Fragment, useState } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import Path, { toDomain } from '../../../common/path';
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
	GuideData,
	GuideDataColumn,
	GuideDataColumnType,
	GuideDataObjectColumn,
	useGuideContext
} from '../guide-context';
import { asDisplayName } from '../utils';

const DetailHeader = styled(ObjectDetailHeader)`
	grid-template-columns: 40% 35% 25%;
`;
const DetailBodyRow = styled(ObjectDetailBodyRow)`
	grid-template-columns: 40% 35% 25%;
`;
const DetailBodyCell = styled(ObjectDetailBodyCell)<{ indent?: number }>`
	text-indent: calc(0.8em * ${({ indent }) => indent || 0});
	&:last-child {
		text-transform: capitalize;
	}
`;

const typeOptions = Object.keys(GuideDataColumnType).filter(k =>
	// @ts-ignore
	typeof GuideDataColumnType[k] === "number" || GuideDataColumnType[k] === k || GuideDataColumnType[GuideDataColumnType[k]]?.toString() !== k
).map(key => {
	return {
		// @ts-ignore
		value: GuideDataColumnType[key],
		// @ts-ignore
		label: GuideDataColumnType[key] as string
	};
});

export default () => {
	const history = useHistory();
	const alert = useAlert();
	const guide = useGuideContext();

	const data = (guide.getData() || {}) as GuideData;
	const objectKeys = Object.keys(data).sort((k1, k2) => k1.localeCompare(k2));

	const [ activeKey, setActiveKey ] = useState<string | null>(objectKeys.length !== 0 ? objectKeys[0] : null);

	const onNoObjectsClicked = () => history.push(toDomain(Path.GUIDE_IMPORT_DATA, guide.getDomain().code));
	const onImportDataClicked = () => history.push(toDomain(Path.GUIDE_IMPORT_DATA, guide.getDomain().code));
	const onNextClicked = () => {
		if (objectKeys.length !== 0) {
			history.push(toDomain(Path.GUIDE_MEASURE_INDICATOR, guide.getDomain().code));
		} else {
			alert.show('No factor described.');
		}
	};

	const onObjectSelected = (key: string) => () => setActiveKey(key);
	const activeObject = activeKey ? data[activeKey!] : null;
	const onColumnLabelChange = (column: GuideDataColumn) => (evt: React.ChangeEvent<HTMLInputElement>) => {
		column.label = evt.target.value;
		guide.setData(guide.getData()!);
	};
	const onTypeChanged = (column: GuideDataColumn) => async (option: DropdownOption) => {
		column.type = option.value as GuideDataColumnType;
		guide.setData(guide.getData()!);
	};
	const renderColumns = (columns: Array<GuideDataColumn> = [], indent: number = 0) => {
		return columns.map(column => {
			const name = asDisplayName(column);
			const label = column.label;
			const childTypes = (column as GuideDataObjectColumn).childTypes || [];
			return <Fragment key={column.name}>
				<DetailBodyRow>
					<DetailBodyCell indent={indent}>{name}</DetailBodyCell>
					<DetailBodyCell>
						<InputInGrid type='text' value={label} placeholder={name}
						             onChange={onColumnLabelChange(column)}/>
					</DetailBodyCell>
					<DetailBodyCell>
						<DropdownInGrid options={typeOptions} onChange={onTypeChanged(column)} value={column.type}/>
					</DetailBodyCell>
				</DetailBodyRow>
				{childTypes.length !== 0 ? renderColumns(childTypes, indent + 1) : null}
			</Fragment>;
		});
	};

	return <Fragment>
		<ObjectsContainer>
			<ObjectsList data-has-data={objectKeys.length !== 0} data-has-active={activeKey != null}>
				{objectKeys.map(key => {
					return <ObjectItem key={key} onClick={onObjectSelected(key)} data-active={key === activeKey}>
						{key}
					</ObjectItem>;
				})}
				<NoObjects onClick={onNoObjectsClicked}>
					No valid data imported, back and <span>Import Data</span> again.
				</NoObjects>
			</ObjectsList>
			<ObjectDetail data-visible={activeKey != null}>
				<DetailHeader>
					<ObjectDetailHeaderCell>Name</ObjectDetailHeaderCell>
					<ObjectDetailHeaderCell>Label</ObjectDetailHeaderCell>
					<ObjectDetailHeaderCell>Type</ObjectDetailHeaderCell>
				</DetailHeader>
				{renderColumns(activeObject?.columns.filter(column => column.native))}
			</ObjectDetail>
		</ObjectsContainer>
		<OperationBar>
			<BigButton onClick={onImportDataClicked}>Reimport Data</BigButton>
			<OperationBarPlaceholder/>
			<BigButton inkType={ButtonType.PRIMARY} onClick={onNextClicked}>Next</BigButton>
		</OperationBar>
	</Fragment>;
}