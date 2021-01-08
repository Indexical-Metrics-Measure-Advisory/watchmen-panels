import { faCompressAlt, faExpandAlt, faLevelDownAlt, faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { Fragment, useState } from 'react';
import { v4 } from 'uuid';
import { Factor, FactorType, Topic } from '../../../services/admin/types';
import { LinkButton } from '../../component/console/link-button';
import { DropdownOption } from '../../component/dropdown';
import { PrimaryObjectButton } from '../../component/object-button';
import { useEditPanelContext } from '../component/edit-panel';
import { PropDropdown } from '../component/prop-dropdown';
import { PropInput } from '../component/prop-input';
import { FactorTable } from './factor-table';
import {
	FactorButtons,
	FactorDescCell,
	FactorLabelCell,
	FactorNameCell,
	FactorTableBody,
	FactorTypeCell
} from './factor-table-body';
import { FactorTableFooter } from './factor-table-footer';
import { FactorTableHeader } from './factor-table-header';
import { FactorsTableButtons } from './factors-table-buttons';

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

export const Factors = (props: { topic: Topic, onDataChanged: () => void }) => {
	const { topic, onDataChanged } = props;

	const { changeBackgroundPosition } = useEditPanelContext();
	const [ expanded, setExpanded ] = useState(false);
	const [ max, setMax ] = useState(false);

	const onExpandToggleClicked = () => setExpanded(!expanded);
	const onFactorPropChange = (factor: Factor, prop: 'name' | 'label' | 'description') => (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.value === factor[prop]) {
			return;
		}
		factor[prop] = event.target.value;
		onDataChanged();
	};
	const onFactorTypeChange = (factor: Factor) => async (option: DropdownOption) => {
		factor.type = option.value as FactorType;
		onDataChanged();
	};
	const onFactorDeleteClicked = (factor: Factor) => () => {
		topic.factors = topic.factors.filter(exists => exists !== factor);
		onDataChanged();
	};
	const onInsertBeforeClicked = (factor: Factor) => () => {
		const index = topic.factors.indexOf(factor);
		topic.factors.splice(index, 0, { type: FactorType.TEXT });
		onDataChanged();
	};
	const onFactorAddClicked = () => {
		topic.factors.push({ type: FactorType.TEXT });
		onDataChanged();
	};
	const onFactorExpandToggleClicked = () => {
		setMax(!max);
		if (max) {
			changeBackgroundPosition('left');
		} else {
			changeBackgroundPosition('top 50px left');
		}
	};

	const factorCount = topic.factors.length;
	const buttonLabel = factorCount === 0 ? 'No Factor Defined' : (factorCount === 1 ? '1 Factor' : `${factorCount} Factors`);

	return <Fragment>
		<FactorsTableButtons onClick={onExpandToggleClicked} data-expanded={expanded}>
			<span>{buttonLabel}</span>
			<FontAwesomeIcon icon={expanded ? faCompressAlt : faExpandAlt}/>
		</FactorsTableButtons>
		<FactorTable expanded={expanded} factorCount={factorCount} data-max={max}>
			<FactorTableHeader data-max={max}>
				<div>Name</div>
				<div>Label</div>
				<div>Type</div>
				<div>Description</div>
			</FactorTableHeader>
			<FactorTableBody data-max={max}>
				{topic.factors.map(factor => {
					if (!factor.factorId) {
						factor.factorId = v4();
					}
					return <Fragment key={factor.factorId}>
						<FactorNameCell>
							<PropInput value={factor.name} onChange={onFactorPropChange(factor, 'name')}/>
						</FactorNameCell>
						<FactorLabelCell>
							<PropInput value={factor.label} onChange={onFactorPropChange(factor, 'label')}/>
						</FactorLabelCell>
						<FactorTypeCell>
							<PropDropdown value={factor.type} options={FactorTypeOptions}
							              onChange={onFactorTypeChange(factor)}/>
						</FactorTypeCell>
						<FactorDescCell>
							<PropInput value={factor.description} onChange={onFactorPropChange(factor, 'description')}/>
							<FactorButtons data-max={max}>
								<LinkButton ignoreHorizontalPadding={true} tooltip='Delete Factor' center={true}
								            onClick={onFactorDeleteClicked(factor)}>
									<FontAwesomeIcon icon={faTimes}/>
								</LinkButton>
								<LinkButton ignoreHorizontalPadding={true} tooltip='Prepend Factor' center={true}
								            onClick={onInsertBeforeClicked(factor)}>
									<FontAwesomeIcon icon={faLevelDownAlt} rotation={270}/>
								</LinkButton>
							</FactorButtons>
						</FactorDescCell>
					</Fragment>;
				})}
			</FactorTableBody>
			<FactorTableFooter>
				<PrimaryObjectButton onClick={onFactorAddClicked}>
					<FontAwesomeIcon icon={faPlus}/>
					<span>Append Factor</span>
				</PrimaryObjectButton>
				<PrimaryObjectButton onClick={onFactorExpandToggleClicked} data-max={max}>
					<FontAwesomeIcon icon={max ? faCompressAlt : faExpandAlt}/>
					<span>{max ? 'Shrink Table' : 'Expand Table'}</span>
				</PrimaryObjectButton>
			</FactorTableFooter>
		</FactorTable>
	</Fragment>;
};
