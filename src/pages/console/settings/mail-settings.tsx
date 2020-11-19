import React, { Fragment } from "react";
import Dropdown, { DropdownOption } from '../../component/dropdown';
import { useConsoleContext } from '../context/console-context';
import { Frequency, FrequencyOptions } from '../context/console-settings';
import { DropdownItemBody, ItemContainer, ItemTitle } from './components';

export const MailSettings = () => {
	const { settings: { mailFrequency, mailFrequencyChanged } } = useConsoleContext();
	const onFrequencyChanged = async (option: DropdownOption) => {
		mailFrequencyChanged(option.value as Frequency);
	};

	return <Fragment>
		<ItemContainer>
			<ItemTitle>Mail Check Frequency</ItemTitle>
			<DropdownItemBody>
				<span>Every</span>
				<Dropdown options={FrequencyOptions} onChange={onFrequencyChanged} value={mailFrequency}/>
			</DropdownItemBody>
		</ItemContainer>
	</Fragment>;
};