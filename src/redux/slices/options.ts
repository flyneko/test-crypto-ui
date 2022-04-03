import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Api } from '../../core/api';

export const fetchOptions: any = createAsyncThunk('options/fetchOptions', async (arg, { getState }) => {
    const state = getState() as any; 
    return await Api.getOptionsList({ type: state.options.activeType, "from-time": "2022-01-01 00:00:00", "to-time": "2022-12-31 00:00:00", "order": "desc" })();
});

const baseState = {
    status: 'idle',
    data: [] as any,
    activeType: 'all'
};


const optionsSlice = createSlice({
    name: 'options',
    initialState: baseState,
    reducers: {
        setActiveType: (state, action) => {
            state.activeType = action.payload;
        }
    },
    extraReducers: {
        [fetchOptions.pending]: (state, action) => {
            state.status = 'loading';
        },
        [fetchOptions.rejected]: (state, action) => {
            state.status = 'rejected';
        },
        [fetchOptions.fulfilled]: (state, action) => {
            state.status = 'succeeded';
            state.data = action.payload.options_array
        },
    }
})

export default optionsSlice.reducer

export const { setActiveType } = optionsSlice.actions

export const getOptions = (state: any) => state.options.data;
export const getOptionsStatus = (state: any) => state.options.status;
export const getOptionsActiveType = (state: any) => state.options.activeType;
