import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { savePipeline } from '../../../../services/admin/pipeline';
import { usePipelineContext } from '../pipeline-context';
import { ArrangedPipeline } from '../types';

interface State {
	pipeline?: ArrangedPipeline;
	saved: boolean;
	throttle: number | null;
}

export interface PipelineEditContext {
	firePipelineContentChange: () => void;
}

const Context = React.createContext<PipelineEditContext>({} as PipelineEditContext);
Context.displayName = 'PipelineEditContext';

const doSave = async (pipeline: ArrangedPipeline) => {
	await savePipeline(pipeline.origin);
};

export const PipelineEditContextProvider = (props: {
	pipeline?: ArrangedPipeline;
	children?: ((props: any) => React.ReactNode) | React.ReactNode;
}) => {
	const { pipeline, children } = props;

	const { addPipelineSelectionChangedListener, removePipelineSelectionChangedListener } = usePipelineContext();
	const [ state ] = useState<State>({ pipeline, saved: true, throttle: null });
	useEffect(() => {
		const save = (pipeline?: ArrangedPipeline) => {
			if (pipeline?.origin === state.pipeline?.origin) {
				// new selection is same as me, do nothing
				return;
			}
			// pipeline changed, which means editing of previous pipeline is finished
			if (state.pipeline?.origin && !state.saved) {
				// previous pipeline existed and changed and not saved
				// don't wait, continue process
				doSave(state.pipeline);
			}
			// switch to new selection
			state.pipeline = pipeline;
			state.saved = true;
			if (state.throttle) {
				clearTimeout(state.throttle);
				state.throttle = null;
			}
		};
		addPipelineSelectionChangedListener(save);
		return () => removePipelineSelectionChangedListener(save);
	});

	// will not trigger any repaint
	const onPipelineContentChange = () => {
		if (!state.pipeline) {
			return;
		}

		state.saved = false;
		if (state.throttle) {
			clearTimeout(state.throttle);
		}

		((pipeline: ArrangedPipeline) => {
			console.log(`Receive pipeline change from editor at %c[${dayjs().format('YYYY/MM/DD HH:mm:ss.SSS')}]%c, and will save it after 30 seconds.`, 'color:rgb(251,71,71)', '');
			// save after 30 seconds
			state.throttle = setTimeout(async () => {
				state.throttle = null;
				try {
					await doSave(pipeline);
				} catch (e) {
					console.groupCollapsed(`%cError on save pipeline.`, 'color:rgb(251,71,71)');
					console.error('Pipeline: ', pipeline);
					console.error(e);
					console.groupEnd();
				}
			}, 30000);
		})(state.pipeline);
	};

	return <Context.Provider
		value={{ firePipelineContentChange: onPipelineContentChange }}>{children}</Context.Provider>;
};

export const usePipelineEditContext = () => {
	return React.useContext(Context);
};
