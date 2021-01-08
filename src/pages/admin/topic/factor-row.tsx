import { faLevelDownAlt, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { Fragment } from 'react';
import styled from 'styled-components';
import { Factor, FactorType, Topic, TopicType } from '../../../services/admin/types';
import { LinkButton } from '../../component/console/link-button';
import { DropdownOption } from '../../component/dropdown';
import { PropDropdown } from '../component/prop-dropdown';
import { PropInput } from '../component/prop-input';
import { FactorButtons, FactorDescCell, FactorLabelCell, FactorNameCell, FactorTypeCell } from './factor-table-body';

const IncorrectFactorType = styled.span`
	color: var(--console-danger-color);
	text-decoration: line-through;
`;

const FactorTypeOptions = [
	{ value: FactorType.TEXT, label: 'Text' },
	{ value: FactorType.NUMBER, label: 'Number' },
	{ value: FactorType.BOOLEAN, label: 'Boolean' },
	{ value: FactorType.DATETIME, label: 'DateTime' },
	{ value: FactorType.ENUM, label: 'Enumeration' },
	{ value: FactorType.SEQUENCE, label: 'Sequence' },
	{ value: FactorType.OBJECT, label: 'Nested Object' },
	{ value: FactorType.ARRAY, label: 'Nested Array' }
];

const prepareFactorPainting = (topic: Topic, factor: Factor) => {
	const { type: topicType } = topic;
	if (topicType !== TopicType.RAW) {
		// nested factor type is not allowed
		const { type: factorType } = factor;
		if (factorType === FactorType.OBJECT) {
			return {
				pass: false,
				typeOptions: FactorTypeOptions.filter(({ value }) => value !== FactorType.ARRAY)
					.map(option => {
						return option.value !== FactorType.OBJECT ? option : {
							value: FactorType.OBJECT,
							label: <IncorrectFactorType>Nested Object</IncorrectFactorType>
						};
					})
			};
		} else if (factorType === FactorType.ARRAY) {
			return {
				pass: false,
				typeOptions: FactorTypeOptions.filter(({ value }) => value !== FactorType.OBJECT)
					.map(option => {
						return option.value !== FactorType.ARRAY ? option : {
							value: FactorType.ARRAY,
							label: <IncorrectFactorType>Nested Array</IncorrectFactorType>
						};
					})
			};
		} else {
			return {
				pass: true,
				typeOptions: FactorTypeOptions.filter(({ value }) => value !== FactorType.ARRAY && value !== FactorType.OBJECT)
			};
		}
	} else {
		return { pass: true, typeOptions: FactorTypeOptions };
	}
};

const findParentFactor = (topic: Topic, factor: Factor): Factor | undefined => {
	const factorIndex = topic.factors.indexOf(factor);
	if (factorIndex === 0) {
		return (void 0);
	}

	for (let index = factorIndex - 1; index >= 0; index--) {
		const f = topic.factors[index];
		if (f.type === FactorType.OBJECT || f.type === FactorType.ARRAY) {
			return f;
		}
	}

	return (void 0);
};

export const FactorRow = (props: {
	topic: Topic;
	factor: Factor;
	max: boolean;
	onDataChanged: () => void
}) => {
	const {
		topic, factor,
		max,
		onDataChanged
	} = props;

	const onFactorNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { value } = event.target;
		if (value === '.') {
			const parent = findParentFactor(topic, factor);
			if (parent) {
				const { name = '' } = parent;
				factor.name = name.endsWith('.') ? name : `${name}.`;
			} else {
				factor.name = event.target.value;
			}
		} else {
			factor.name = event.target.value;
		}
		onDataChanged();
	};
	const onFactorPropChange = (prop: | 'label' | 'description') => (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.value === factor[prop]) {
			return;
		}
		factor[prop] = event.target.value;
		onDataChanged();
	};
	const onFactorTypeChange = async (option: DropdownOption) => {
		factor.type = option.value as FactorType;
		onDataChanged();
	};
	const onFactorDeleteClicked = () => {
		topic.factors = topic.factors.filter(exists => exists !== factor);
		onDataChanged();
	};
	const onInsertBeforeClicked = () => {
		const index = topic.factors.indexOf(factor);
		topic.factors.splice(index, 0, { type: FactorType.TEXT });
		onDataChanged();
	};

	const { pass: passTypeCheck, typeOptions } = prepareFactorPainting(topic, factor);
	const isValid = passTypeCheck;
	const namePlaceholder = findParentFactor(topic, factor) ? 'Dot to append into nested' : (void 0);

	return <Fragment key={factor.factorId}>
		<FactorNameCell data-valid={isValid}>
			<PropInput value={factor.name || ''} onChange={onFactorNameChange}
			           placeholder={namePlaceholder}/>
		</FactorNameCell>
		<FactorLabelCell data-valid={isValid}>
			<PropInput value={factor.label || ''} onChange={onFactorPropChange('label')}/>
		</FactorLabelCell>
		<FactorTypeCell data-valid={isValid}>
			<PropDropdown value={factor.type} options={typeOptions} onChange={onFactorTypeChange}/>
		</FactorTypeCell>
		<FactorDescCell data-valid={isValid}>
			<PropInput value={factor.description || ''} onChange={onFactorPropChange('description')}/>
			<FactorButtons data-max={max}>
				<LinkButton ignoreHorizontalPadding={true} tooltip='Delete Factor' center={true}
				            onClick={onFactorDeleteClicked}>
					<FontAwesomeIcon icon={faTimes}/>
				</LinkButton>
				<LinkButton ignoreHorizontalPadding={true} tooltip='Prepend Factor' center={true}
				            onClick={onInsertBeforeClicked}>
					<FontAwesomeIcon icon={faLevelDownAlt} rotation={270}/>
				</LinkButton>
			</FactorButtons>
		</FactorDescCell>
	</Fragment>;
};