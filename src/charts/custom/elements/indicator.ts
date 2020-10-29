import { DataColumnType, DataSet } from '../../../data/types';
import { ChartAxisType, ChartSettingsIndicator, IndicatorAggregator } from '../types';

export const detectIndicatorCategory = (indicator: ChartSettingsIndicator): ChartAxisType => {
	const { aggregator = IndicatorAggregator.NONE, column: { type } = { type: DataColumnType.UNKNOWN } } = indicator;
	switch (true) {
		case [ IndicatorAggregator.SUMMARY, IndicatorAggregator.MEDIAN, IndicatorAggregator.AVERAGE, IndicatorAggregator.COUNT ].includes(aggregator):
			return ChartAxisType.VALUE;
		default:
			// follow column type
			break;
	}
	switch (true) {
		case DataColumnType.NUMERIC === type:
			return ChartAxisType.VALUE;
		case [ DataColumnType.DATE, DataColumnType.DATETIME, DataColumnType.TIME ].includes(type):
			return ChartAxisType.TIME;
		case [ DataColumnType.BOOLEAN, DataColumnType.TEXT, DataColumnType.UNKNOWN ].includes(type):
		default:
			return ChartAxisType.CATEGORY;
	}
};
export const isIndicatorValid = (indicator: ChartSettingsIndicator): boolean => !!indicator.column;
export const asIndicatorData = (indicator: ChartSettingsIndicator, data: DataSet) => {
	const { topicName, column: { name: propName } = { name: '' } } = indicator;
	const topic = data[topicName!];
	return [ ...new Set((topic.data || []).map(item => item[propName])) ];
};
export const getIndicatorLabel = (indicator: ChartSettingsIndicator) => {
	return indicator.label || indicator.column?.label || indicator.column?.name;
};
