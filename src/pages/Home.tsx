import { Grid } from '@mui/material';
import React from 'react';
import { AddOrder } from '../components/AddOrder';
import { CurrencyInfo } from '../components/CurrencyInfo';
import { OptionsList } from '../components/OptionsList';
import { Main } from '../layouts/Main';

export function Home() {
    return (
        <Main>
            <Grid container spacing={5}>
                <Grid item xs={4}>
                    <CurrencyInfo />
                    <AddOrder />
                </Grid>
                <Grid item xs={8}>
                    <OptionsList />
                </Grid>
            </Grid>
        </Main>
    );
}