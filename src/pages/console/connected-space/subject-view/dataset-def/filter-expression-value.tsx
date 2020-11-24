import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import dayjs from 'dayjs';
import React, { useReducer } from 'react';
import styled from 'styled-components';
import {
	ConsoleSpaceSubjectDataSetFilterExpression,
	ConsoleTopicFactor,
	ConsoleTopicFactorType,
	FilterExpressionOperator as ExpressionOperator
} from '../../../../../services/console/types';
import { Calendar } from '../../../../component/calendar';
import Dropdown, { DropdownOption } from '../../../../component/dropdown';
import Input from '../../../../component/input';
import { useSubjectContext } from '../context';
import { needExactDateTime } from './utils';

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
	options?: Array<DropdownOption>;
	accept: (factor: ConsoleTopicFactor, filter: ConsoleSpaceSubjectDataSetFilterExpression) => boolean;
}) => {
	const { filter, factor, options, accept } = props;
	const { value } = filter;
	const [ , forceUpdate ] = useReducer(x => x + 1, 0);

	if (!factor || !accept(factor, filter)) {
		return null;
	}

	const values = (value || '').split(',').map(v => v.trim()).filter(v => v);
	const valueOptions = options || JSON.parse(factor!.enum!);
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
	const { operator, value } = filter;

	const [ , forceUpdate ] = useReducer(x => x + 1, 0);

	if (!factor || factor.type !== ConsoleTopicFactorType.DATETIME || !needExactDateTime(operator)) {
		return null;
	}

	const onFilterValueOptionChanged = async (value?: string) => {
		filter.value = value;
		forceUpdate();
	};

	return <Calendar value={value as string} onChange={onFilterValueOptionChanged}/>;
};

const DateTimeYearOfFactorFilterValue = (props: {
	filter: ConsoleSpaceSubjectDataSetFilterExpression;
	factorType?: ConsoleTopicFactorType;
}) => {
	const { filter, factorType } = props;
	const { operator } = filter;
	const [ , forceUpdate ] = useReducer(x => x + 1, 0);

	if (!factorType || factorType !== ConsoleTopicFactorType.DATETIME || operator !== ExpressionOperator.YEAR_OF) {
		return null;
	}

	const onFilterValueChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
		filter.value = event.target.value;
		forceUpdate();
	};
	return <Input value={filter.value || ''} onChange={onFilterValueChanged}
	              placeholder='Full year concatenated by comma'/>;
};

const TillNowOptions = [
	{ value: '1', label: 'This week' },
	{ value: '2', label: 'In 3 days' },
	{ value: '3', label: 'In 5 days' },
	{ value: '4', label: 'In 7 days' },
	{ value: '5', label: 'In 10 days' },
	{ value: '6', label: 'In 15 days' },
	{ value: '7', label: 'This month' },
	{ value: '8', label: 'This quarter' },
	{ value: '9', label: 'This half year' },
	{ value: '10', label: 'This year' }
];
const DateTimeFactorFilterTillNowValue = (props: {
	filter: ConsoleSpaceSubjectDataSetFilterExpression;
	factorType?: ConsoleTopicFactorType;
}) => {
	const { filter, factorType } = props;
	const { operator } = filter;
	const [ , forceUpdate ] = useReducer(x => x + 1, 0);

	if (factorType !== ConsoleTopicFactorType.DATETIME || operator !== ExpressionOperator.TILL_NOW) {
		return null;
	}

	const onFilterValueOptionChanged = async ({ value }: DropdownOption) => {
		filter.value = value as string;
		forceUpdate();
	};

	return <Dropdown options={TillNowOptions} value={filter.value} onChange={onFilterValueOptionChanged}/>;
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

const now = dayjs();
const DateTimeEnums = {
	HalfYear: {
		options: [ { value: '1', label: 'First half' }, { value: '2', label: 'Second half' } ],
		accept: (factor: ConsoleTopicFactor, filter: ConsoleSpaceSubjectDataSetFilterExpression) => factor.type === ConsoleTopicFactorType.DATETIME && filter.operator === ExpressionOperator.HALF_YEAR_OF
	},
	Quarter: {
		options: [
			{ value: '1', label: 'First quarter' },
			{ value: '2', label: 'Second quarter' },
			{ value: '3', label: 'Third quarter' },
			{ value: '4', label: 'Fourth quarter' }
		],
		accept: (factor: ConsoleTopicFactor, filter: ConsoleSpaceSubjectDataSetFilterExpression) => factor.type === ConsoleTopicFactorType.DATETIME && filter.operator === ExpressionOperator.QUARTER_OF
	},
	Month: {
		options: new Array(12).fill(1).map((v, index) => {
			return {
				value: `${index}`,
				label: now.month(index).format('MMMM')
			};
		}),
		accept: (factor: ConsoleTopicFactor, filter: ConsoleSpaceSubjectDataSetFilterExpression) => factor.type === ConsoleTopicFactorType.DATETIME && filter.operator === ExpressionOperator.MONTH_OF
	},
	WeekOfYear: {
		options: new Array(52).fill(1).map((v, index) => {
			const x = index + 1;
			const y = x % 10;
			return {
				value: `${x}`,
				label: y === 1 ? `${x}st` : (y === 2 ? `${x}nd` : (y === 3 ? `${x}rd` : `${x}th`))
			};
		}),
		accept: (factor: ConsoleTopicFactor, filter: ConsoleSpaceSubjectDataSetFilterExpression) => factor.type === ConsoleTopicFactorType.DATETIME && filter.operator === ExpressionOperator.WEEK_OF_YEAR
	},
	WeekOfMonth: {
		options: new Array(5).fill(1).map((v, index) => {
			const x = index + 1;
			const y = x % 10;
			return {
				value: `${x}`,
				label: y === 1 ? `${x}st` : (y === 2 ? `${x}nd` : (y === 3 ? `${x}rd` : `${x}th`))
			};
		}),
		accept: (factor: ConsoleTopicFactor, filter: ConsoleSpaceSubjectDataSetFilterExpression) => factor.type === ConsoleTopicFactorType.DATETIME && filter.operator === ExpressionOperator.WEEK_OF_MONTH
	},
	Weekdays: {
		options: [
			...new Array(7).fill(1).map((v, index) => {
				return {
					value: `${index}`,
					label: now.day(index).format('dddd')
				};
			}),
			{ value: '7', label: 'Workdays' },
			{ value: '8', label: 'Weekend' }
		],
		accept: (factor: ConsoleTopicFactor, filter: ConsoleSpaceSubjectDataSetFilterExpression) => factor.type === ConsoleTopicFactorType.DATETIME && filter.operator === ExpressionOperator.WEEKDAYS
	}
};

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
		<EnumFactorFilterValue filter={filter} factor={factor}
		                       accept={(factor) => factor.type === ConsoleTopicFactorType.ENUM}/>
		<DateTimeFactorFilterValue filter={filter} factor={factor}/>
		<DateTimeYearOfFactorFilterValue filter={filter} factorType={factorType}/>
		<EnumFactorFilterValue filter={filter} factor={factor} {...DateTimeEnums.HalfYear}/>
		<EnumFactorFilterValue filter={filter} factor={factor} {...DateTimeEnums.Quarter}/>
		<EnumFactorFilterValue filter={filter} factor={factor} {...DateTimeEnums.Month}/>
		<EnumFactorFilterValue filter={filter} factor={factor} {...DateTimeEnums.WeekOfYear}/>
		<EnumFactorFilterValue filter={filter} factor={factor} {...DateTimeEnums.WeekOfMonth}/>
		<EnumFactorFilterValue filter={filter} factor={factor} {...DateTimeEnums.Weekdays}/>
		<DateTimeFactorFilterTillNowValue filter={filter} factorType={factorType}/>
	</ExpressionValueContainer>;
};