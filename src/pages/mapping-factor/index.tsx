import React, { Fragment, useState } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import Path from '../../common/path';
import { BigButton, ButtonType } from '../component/button';
import Dropdown, { DropdownOption } from '../component/dropdown';
import Input from '../component/input';
import { useAlert } from '../context/alert';
import {
	GuideData,
	GuideDataColumn,
	GuideDataColumnType,
	GuideDataObjectColumn,
	useGuideContext
} from '../guide/guide-context';

const ObjectsContainer = styled.div`
	display: flex;
	margin: 0 var(--margin);
	border-radius: calc(var(--border-radius) * 2);
	border: var(--border);
	min-height: 350px;
	overflow: hidden;
`;
const ObjectsList = styled.div`
	position: relative;
	width: 30%;
	display: flex;
	flex-direction: column;
	border-right: var(--border);
	&[data-has-data=false] {
		width: 100%;
		border-right: 0;
		> div {
			display: flex;
		}
		+ div {
			display: none;
		}
	}
`;
const ObjectItem = styled.div`
	display: flex;
	position: relative;
	align-items: center;
	height: 32px;
	padding: 0 calc(var(--margin) / 2);
	cursor: pointer;
	white-space: nowrap;
	text-overflow: ellipsis;
	overflow-x: hidden;
	border-bottom: var(--border);
	transition: all 300ms ease-in-out;
	&:nth-child(n + 11):last-child {
		border-bottom-color: transparent;
	}
	&:hover {
		background-color: var(--hover-color);
	}
	&[data-active=true] {
		background-color: var(--active-color);
		color: var(--invert-color);
	}
`;
const NoObjects = styled.div`
	display: none;
	height: 100%;
	align-items: center;
	justify-content: center;
	font-size: 1.2em;
	font-weight: var(--font-bold);
	cursor: pointer;
	transition: all 300ms ease-in-out;
	&:hover {
		transform: scale(1.05);
	}
	> span {
		margin: 0 var(--letter-gap);
		text-decoration: underline;
	}
`;
const ObjectDetail = styled.div`
	width: 70%;
	display: flex;
	flex-direction: column;
	opacity: 0;
	transition: all 300ms ease-in-out;
	&[data-visible=true] {
		opacity: 1;
	}
`;
const ObjectDetailHeader = styled.div`
	display: grid;
	grid-template-columns: 40% 35% 25%;
	border-bottom: var(--border);
`;
const ObjectDetailHeaderCell = styled.div`
	height: 31px;
	padding: 0 calc(var(--margin) / 2);
	display: flex;
	align-items: center;
`;
const ObjectDetailBodyRow = styled.div`
	display: grid;
	grid-template-columns: 40% 35% 25%;
	border-bottom: var(--border);
	font-size: 0.8em;
	&:nth-child(n + 10):last-child {
		border-bottom-color: transparent;
	}
	&:hover {
		background-color: var(--hover-color);
		> div {
			> input:hover:focus,
			> div[data-widget=dropdown]:hover:focus {
				border-color: var(--primary-color);
				> div:last-child {
					border-color: var(--primary-color);
				}
				> svg {
					color: var(--primary-color);
				}
			}
		}
	}
`;
const ObjectDetailBodyCell = styled.div<{ indent?: number }>`
	height: 31px;
	padding: 0 calc(var(--margin) / 2);
	display: flex;
	align-items: center;
	text-indent: calc(0.8em * ${({ indent }) => indent || 0});
	overflow-x: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
	&:last-child {
		text-transform: capitalize;
	}
`;
const LabelInput = styled(Input)`
	height: 27px;
	margin-left: calc(var(--input-indent) * -1);
	border-color: transparent;
	transition: all 300ms ease-in-out;
	font-size: 0.8em;
	&:hover {
		border-color: var(--primary-color);
	}
	&:focus {
		border-color: var(--border-color);
	}
`;
const TypeInput = styled(Dropdown)`
	height: 27px;
	margin-left: calc(var(--input-indent) * -1);
	border-color: transparent;
	transition: all 300ms ease-in-out;
	font-size: 0.8em;
	> div:last-child > span {
		height: 27px;
	}
	&:hover {
		border-color: var(--primary-color);
		> svg {
			color: var(--primary-color);
		}
	}
	&:focus {
		border-color: var(--border-color);
		> div:last-child {
			border-color: var(--border-color);
		}
		> svg {
			color: var(--border-color);
		}
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

const asDisplayName = (column: GuideDataColumn): string => {
	const name = column.name || '';
	if (name.indexOf('.') !== -1) {
		return name.split('.').reverse()[0];
	} else {
		return name || 'Nonamed';
	}
};
const asDisplayType = (column: GuideDataColumn): string => {
	return column.type;
};
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

	const onNoObjectsClicked = () => history.push(Path.GUIDE_IMPORT_DATA);
	const onImportDataClicked = () => history.push(Path.GUIDE_IMPORT_DATA);
	const onNextClicked = () => {
		if (objectKeys.length !== 0) {
			history.push(Path.GUIDE_MEASURE_INDICATOR);
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
	const renderColumns = (columns: Array<GuideDataColumn> = []) => {
		return columns.map(column => {
			const name = asDisplayName(column);
			const label = column.label;
			const indent = (column.name || '').split('').filter(ch => ch === '.').length;
			const childTypes = (column as GuideDataObjectColumn).childTypes || [];
			return <Fragment key={column.name}>
				<ObjectDetailBodyRow>
					<ObjectDetailBodyCell indent={indent}>{name}</ObjectDetailBodyCell>
					<ObjectDetailBodyCell>
						<LabelInput type='text' value={label} placeholder={name}
						            onChange={onColumnLabelChange(column)}/>
					</ObjectDetailBodyCell>
					<ObjectDetailBodyCell>
						<TypeInput options={typeOptions} onChange={onTypeChanged(column)} value={column.type}/>
					</ObjectDetailBodyCell>
				</ObjectDetailBodyRow>
				{childTypes.length !== 0 ? renderColumns(childTypes) : null}
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
				<ObjectDetailHeader>
					<ObjectDetailHeaderCell>Name</ObjectDetailHeaderCell>
					<ObjectDetailHeaderCell>Label</ObjectDetailHeaderCell>
					<ObjectDetailHeaderCell>Type</ObjectDetailHeaderCell>
				</ObjectDetailHeader>
				{renderColumns(activeObject?.columns)}
			</ObjectDetail>
		</ObjectsContainer>
		<Operations>
			<BigButton onClick={onImportDataClicked}>Reimport Data</BigButton>
			<Placeholder/>
			<BigButton inkType={ButtonType.PRIMARY} onClick={onNextClicked}>Next</BigButton>
		</Operations>
	</Fragment>;
}