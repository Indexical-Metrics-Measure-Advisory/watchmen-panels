import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useReducer } from 'react';
import styled from 'styled-components';
import {
	ConsoleSpaceSubjectDataSetFilterExpression,
	ConsoleTopicFactor,
	ConsoleTopicFactorType
} from '../../../../../services/console/types';
import { Calendar } from '../../../../component/calendar';
import Dropdown, { DropdownOption } from '../../../../component/dropdown';
import Input from '../../../../component/input';
import { useSubjectContext } from '../context';

const PlainFactorFilterValue = (props: {
	filter: ConsoleSpaceSubjectDataSetFilterExpression;
	factorType?: ConsoleTopicFactorType;
}) => {
	const { filter, factorType } = props;
	const [ , forceUpdate ] = useReducer(x => x + 1, 0);

	if (!factorType || [ ConsoleTopicFactorType.BOOLEAN, ConsoleTopicFactorType.ENUM, ConsoleTopicFactorType.DATETIME ].includes(factorType)) {
		return null;
	}

	const onFilterValueChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
		filter.value = event.target.value;
		forceUpdate();
	};
	return <Input value={filter.value || ''} onChange={onFilterValueChanged}/>;
};

const BooleanOptions = [ { value: 'true', label: 'True' }, { value: 'false', label: 'False' } ];
const BooleanFactorFilterValue = (props: {
	filter: ConsoleSpaceSubjectDataSetFilterExpression;
	factorType?: ConsoleTopicFactorType;
}) => {
	const { filter, factorType } = props;
	const [ , forceUpdate ] = useReducer(x => x + 1, 0);

	if (factorType !== ConsoleTopicFactorType.BOOLEAN) {
		return null;
	}

	const onFilterValueOptionChanged = async ({ value }: DropdownOption) => {
		filter.value = value as string;
		forceUpdate();
	};

	return <Dropdown options={BooleanOptions} value={filter.value} onChange={onFilterValueOptionChanged}/>;
};

const EnumItem = styled.div`
	display: flex;
	align-items: center;
	&[data-checked=true] {
		> svg {
			opacity: 1;
			color: var(--console-primary-color);
		}
	}
	> svg {
		color: var(--console-waive-color);
		opacity: 0.3;
		margin-right: calc(var(--margin) / 3);
	}
	> span {
		flex-grow: 1;
	}
`;

const EnumFactorFilterValue = (props: {
	filter: ConsoleSpaceSubjectDataSetFilterExpression;
	factor?: ConsoleTopicFactor;
}) => {
	const { filter, factor } = props;
	const { value } = filter;
	const [ , forceUpdate ] = useReducer(x => x + 1, 0);

	if (!factor || factor.type !== ConsoleTopicFactorType.ENUM) {
		return null;
	}

	const values = (value || '').split(',').map(v => v.trim()).filter(v => v);
	const valueOptions = JSON.parse(factor!.enum!);
	const valueDropdownOptions = valueOptions.map(({ value, label }: { value: string, label: string }) => {
		return {
			value,
			label: <EnumItem data-checked={values.includes(value)}>
				<FontAwesomeIcon icon={faCheck}/>
				<span>{label}</span>
			</EnumItem>
		};
	});
	const onFilterValueOptionChanged = async ({ value }: DropdownOption): Promise<{ active: boolean }> => {
		const v = value as string;
		if (values.includes(v)) {
			filter.value = values.filter(value => value !== v).join(',');
			if (!filter.value) {
				delete filter.value;
			}
		} else {
			filter.value = [ ...values, v ].join(',');
		}
		forceUpdate();
		return { active: true };
	};
	const renderSelect = (value: string | number | boolean) => {
		const values = ((value as string) || '').split(',').map(v => v.trim());
		return values.map(value => {
			return valueOptions.find(({ value: v }: { value: string }) => v === value)!.label;
		}).join(', ');
	};
	return <Dropdown options={valueDropdownOptions} value={value} onChange={onFilterValueOptionChanged}
	                 select={renderSelect}/>;
};

const DateTimeFactorFilterValue = (props: {
	filter: ConsoleSpaceSubjectDataSetFilterExpression;
	factor?: ConsoleTopicFactor;
}) => {
	const { filter, factor } = props;
	const { value } = filter;

	const [ , forceUpdate ] = useReducer(x => x + 1, 0);

	if (!factor || factor.type !== ConsoleTopicFactorType.DATETIME) {
		return null;
	}

	const onFilterValueOptionChanged = async (value?: string) => {
		filter.value = value;
		forceUpdate();
	};

	return <Calendar value={value as string} onChange={onFilterValueOptionChanged}/>;
};

const ExpressionValueContainer = styled.div`
	width: 0;
	flex-grow: 0;
	overflow-x: hidden;
	margin-left: -1px;
	transition: all 300ms ease-in-out;
	&[data-visible=true] {
		flex-grow: 1;
	}
	> input,
	> div[data-widget=dropdown],
	> div[data-widget=dropdown]:focus,
	> div[data-widget=calendar],
	> div[data-widget=calendar]:focus {
		font-size: 0.8em;
		border-radius: 0;
	}
	> input {
		width: 100%;
	}
`;

export const FilterExpressionValue = (props: {
	filter: ConsoleSpaceSubjectDataSetFilterExpression;
	visible: boolean;
}) => {
	const { filter, visible } = props;
	const { topicId, factorId } = filter;

	const { defs: { factors: factorOptions } } = useSubjectContext();
	const factorDropdownOptions = factorOptions[`${topicId}`] || [];
	// eslint-disable-next-line
	const factor = (factorDropdownOptions.find(f => f.value == factorId) || {}).factor;
	const { type: factorType } = factor || {};

	return <ExpressionValueContainer data-visible={visible}>
		<PlainFactorFilterValue filter={filter} factorType={factorType}/>
		<BooleanFactorFilterValue filter={filter} factorType={factorType}/>
		<EnumFactorFilterValue filter={filter} factor={factor}/>
		<DateTimeFactorFilterValue filter={filter} factor={factor}/>
	</ExpressionValueContainer>;
};