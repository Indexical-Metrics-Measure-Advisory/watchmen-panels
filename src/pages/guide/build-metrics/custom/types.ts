import { DataColumn, DataTopic } from '../../../../data/types';
import { DropdownOption } from '../../../component/dropdown';

export interface FactorOption extends DropdownOption {
	topicName: string;
	topic: DataTopic;
	column: DataColumn;
}
