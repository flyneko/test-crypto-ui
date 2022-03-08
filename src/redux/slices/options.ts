import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import ky from "../../helpers/ky";

export const fetchOptions: any = createAsyncThunk('options/fetchOptions', async () => {
    return await ky.get('/games').json();
});

const baseState = {
    status: 'idle',
    data: [] as any
};


const optionsSlice = createSlice({
    name: 'options',
    initialState: baseState,
    reducers: {
        removeOption: (state, action) => {
            state.data = state.data.filter(i => i.uuid != action.payload);
        },
        addOption: (state, action) => {
            state.data.push(action.payload);
        },
    },
    extraReducers: {
        [fetchOptions.pending]: (state, action) => {
            state.status = 'loading';
        },
        [fetchOptions.fulfilled]: (state, action) => {
            state.status = 'succeeded';
            state.data = action.payload
        },
    }
})

export default optionsSlice.reducer

export const { addOption, removeOption } = optionsSlice.actions

export const getOptions = (state: any) => state.options.data;