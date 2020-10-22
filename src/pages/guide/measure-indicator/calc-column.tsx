import { faCheck, faEquals, faExclamation, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import styled from 'styled-components';
import { DomainExpression } from '../../../services/types';
import Button from '../../component/button';
import { DropdownOption } from '../../component/dropdown';
import { DropdownInGrid } from '../component/dropdown-in-grid';
import { InputInGrid } from '../component/input-in-grid';
import { ObjectDetailBodyCell, ObjectDetailBodyRow } from '../component/object-detail';
import { GuideCalcDataColumn, GuideDataColumn, GuideTopic, useGuideContext } from '../guide-context';
import { asDisplayName, generateUniqueLabel, generateUniqueName } from '../utils';

// EXPLAIN use variable to avoid webstorm inspection errors, @supports is not supported yet
const DetailBodyRow = styled(ObjectDetailBodyRow)`
	grid-template-columns: 30% calc(35% - 32px) calc(35% - 32px) 32px 32px;
	${'@supports selector(:focus-within)'} {
		&:not(:focus-within) {
			> div:last-child:not(:first-child) {
				height: 0;
				border-top: 0;
			}
		}
	}
	> div:nth-child(4) {
		> svg {
			transition: all 300ms linear;
		}
		> svg:first-child {
			color: var(--danger-color);
			width: 0;
		}
		> svg:last-child {
			color: var(--success-color);
			width: 1em;
		}
	}
	&[data-incorrect=true] {
		> div:nth-child(4) {
			> svg:first-child {
				width: 1em;
			}
			> svg:last-child {
				width: 0;
			}
		}
	}
`;
const DetailBodyOperationCell = styled(ObjectDetailBodyCell)`
	justify-content: center;
	padding: 0;
	> button {
		border: 0;
		border-radius: 100%;
		width: 27px;
		height: 27px;
		padding: 0;
		&:hover {
			background-color: var(--primary-hover-color);
			color: var(--invert-color);
		}
	}
`;
const DetailBodySettingCell = styled(ObjectDetailBodyCell)`
	height: 32px;
	border-top: var(--border);
	border-top-color: transparent;
	grid-column: span 4;
	position: relative;
	overflow: hidden;
	transition: all 300ms ease-in-out;
	> svg {
		display: block;
		position: absolute;
		top: 50%;
		left: 16px;
		transform: translateY(-50%);
		opacity: 0.5;
		font-size: 0.7em;
	}
	> input {
		margin-right: calc(var(--input-indent) * -1);
		width: calc(100% + var(--input-indent) * 2);
		padding-left: 22px;
	}
`;

export const isExpressionIncorrect = (column: GuideCalcDataColumn, allColumnNames: string[]) => {
	const expression = (column.expression || '').trim();
	if (!expression) {
		// no expression
		return true;
	}

	const variables = expression.match(/{{(((?!}}).)+)}}/g) || [];
	if (variables.length === 0) {
		// no variables
		return true;
	}

	// there is no loop refer, no incorrect refer
	return -1 !== variables.findIndex(variable => {
		const x = variable.replace('{{', '').replace('}}', '');
		if (x === column.name) {
			// use myself, loop
			return true;
		} else if (!allColumnNames.includes(x)) {
			// cannot match any column
			return true;
		}
		return false;
	});
};

export const CalcColumn = (props: { column: GuideDataColumn, topic: GuideTopic, typeOptions: Array<DropdownOption> }) => {
	const { column, topic, typeOptions } = props;

	const guide = useGuideContext();

	if (column.native) {
		return null;
	}

	const allColumnNames = topic.columns.map(column => column.name);

	const calcColumn = column as GuideCalcDataColumn;
	const name = asDisplayName(column);
	const label = column.label;
	const created = topic.columns.includes(column);
	const incorrect = isExpressionIncorrect(calcColumn, allColumnNames);

	//TODO expression result values on data should be changed:
	// 1. column name changed
	// 2. expression changed
	const onColumnNameChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
		column.name = evt.target.value;
		guide.setData(guide.getData()!);
	};
	const onColumnLabelChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
		column.label = evt.target.value;
		guide.setData(guide.getData()!);
	};
	const onCalcTypeChanged = (columns: Array<GuideDataColumn>, column: GuideCalcDataColumn) => async (option: DropdownOption) => {
		const expression = option as unknown as DomainExpression;
		column.expressionCode = option.value as string;
		column.name = generateUniqueName(columns, column, column.name || expression.name);
		column.label = generateUniqueLabel(columns, column, column.label || expression.label);
		column.expression = expression.body;
		if (!columns.includes(column)) {
			columns.push(column);
		}
		if ((expression as any).func) {
			(topic.data || []).forEach(item => {
				item[column.name] = (expression as any).func(item);
			});
		}
		guide.setData(guide.getData()!);
	};
	const onColumnExpressionChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
		calcColumn.expression = evt.target.value;
		guide.setData(guide.getData()!);
	};
	const onColumnDeleteClicked = () => {
		topic.columns = topic.columns.filter(exists => exists !== column);
		guide.setData(guide.getData()!);
	};

	return <DetailBodyRow data-incorrect={incorrect}>
		<ObjectDetailBodyCell>
			<DropdownInGrid options={typeOptions} value={calcColumn.expressionCode}
			                please={"New Indicator..."}
			                onChange={onCalcTypeChanged(topic.columns, calcColumn)}/>
		</ObjectDetailBodyCell>
		{created
			? <ObjectDetailBodyCell>
				<InputInGrid type="text" placeholder={name} value={name} onChange={onColumnNameChange}/>
			</ObjectDetailBodyCell>
			: null
		}
		{created
			? <ObjectDetailBodyCell>
				<InputInGrid type="text" placeholder={label || name} value={label} onChange={onColumnLabelChange}/>
			</ObjectDetailBodyCell>
			: null
		}
		{created
			? <ObjectDetailBodyCell>
				<FontAwesomeIcon icon={faExclamation} title={'Something incorrect.'}/>
				<FontAwesomeIcon icon={faCheck}/>
			</ObjectDetailBodyCell>
			: null
		}
		{created
			? <DetailBodyOperationCell>
				<Button title={"Delete"} onClick={onColumnDeleteClicked}>
					<FontAwesomeIcon icon={faTimes}/>
				</Button>
			</DetailBodyOperationCell>
			: null
		}
		{created
			? <DetailBodySettingCell>
				<FontAwesomeIcon icon={faEquals}/>
				<InputInGrid type="text" placeholder={"Expression..."}
				             value={calcColumn.expression}
				             onChange={onColumnExpressionChange}/>
			</DetailBodySettingCell>
			: null
		}
	</DetailBodyRow>;
};
