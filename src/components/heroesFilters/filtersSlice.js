import {
    createSlice,
    createAsyncThunk,
    createEntityAdapter,
} from '@reduxjs/toolkit';
import { useHttp } from '../../hooks/http.hook';

const filtersAdatter = createEntityAdapter();

const initialState = filtersAdatter.getInitialState({
    filtersLoadingStatus: 'idle',
    activeFilter: 'all',
});

export const fetchFilters = createAsyncThunk('filters/fetchFilters', () => {
    const { request } = useHttp();
    return request('http://localhost:3001/filters/');
});

const filterSlice = createSlice({
    name: 'filters',
    initialState,
    reducers: {
        activedFilterChanged: (state, action) => {
            state.activeFilter = action.payload;
        },
    },
    extraReducers: builder => {
        builder
            .addCase(fetchFilters.pending, state => {
                state.filtersLoadingStatus = 'loading';
            })
            .addCase(fetchFilters.fulfilled, (state, action) => {
                state.filtersLoadingStatus = 'idle';
                filtersAdatter.setAll(state, action.payload);
            })
            .addCase(fetchFilters.rejected, state => {
                state.filtersLoadingStatus = 'error';
            });
    },
});

const { actions, reducer } = filterSlice;

export default reducer;

export const { selectAll } = filtersAdatter.getSelectors(state => state.filters);

export const {
    filtersFetched,
    filtersFetching,
    filtersFetchingError,
    activedFilterChanged,
} = actions;
