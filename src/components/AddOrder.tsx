import { Alert, Box, Button, Checkbox, CircularProgress, FormControlLabel, Grid, Paper, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { Api } from "../core/api";
import useApi from "../hooks/useApi";
import { getCurrency } from "../redux/slices/auth";
import { useSelector } from "react-redux";

const schema = yup.object({
    crypto_amount: yup.string().required(),
}).required();

export function AddOrder() {
    const selectedCurrencyType = useSelector(getCurrency);
    const { register, setValue, handleSubmit, watch, formState: { errors }, control } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            type: '',
            crypto_amount: '',
            multiply: '',
            stop_profit_price: '',
            stop_loss_price: '',
            support_over_night: false,

        }
    });
    const [error, setError] = useState('');
    const [totalOrderValue, setTotalOrderValue] = useState(0);
    const { data, request, isLoading } = useApi(Api.addOption);
    const { request: balanceRequest, data: balanceData, isLoading: isBalanceLoading } = useApi(Api.getUserInfo);

    const formValues = {
        crypto_amount: watch('crypto_amount'),
        multiply: watch('multiply')
    } as any;

    useEffect(() => {
        balanceRequest();
    }, []);

    useEffect(() => {
        const total = formValues.crypto_amount * formValues.multiply;
        setTotalOrderValue(Math.round(total * 1000) / 1000)
    }, [formValues.crypto_amount, formValues.multiply])

    const onSubmit = (data) => {
        request({
            currency_type: selectedCurrencyType,
            ...data
        }).then(response => {
            console.log(response);
        })
    };

    const handleClickSubmitButton = (type: string) => {
        setValue('type', type);
        handleSubmit(onSubmit)();
    }

    return (
        <Box sx={{ mt: 5 }}>
            <Typography variant="h6" textAlign="center" sx={{ mb: 3 }}>
                Available balance: {isBalanceLoading ? <CircularProgress color="warning" size={15} /> : balanceData}
            </Typography>

            <Paper elevation={3}>
                <Box width="100%" component="form" noValidate sx={{ p: 3 }}>
                    <Grid container spacing={2} sx={{ pb: 3 }} alignItems="center">
                        <Grid item xs={4}>
                            <Typography variant="h6" color="inherit">
                                Deposit
                            </Typography>
                        </Grid>
                        <Grid item xs={8}>
                            <Controller
                                name="crypto_amount"
                                control={control}
                                render={({ field }) => {
                                    return (<TextField
                                        {...field}
                                        type="number"
                                        margin="normal"
                                        fullWidth
                                        error={!!errors.crypto_amount}
                                        helperText={errors.crypto_amount?.message}
                                    />)
                                }}
                            />
                        </Grid>

                        <Grid item xs={4}>
                            <Typography variant="h6" color="inherit">
                                Multiply
                            </Typography>
                        </Grid>
                        <Grid item xs={8}>
                            <Controller
                                name="multiply"
                                control={control}
                                render={({ field }) => {
                                    return (<TextField
                                        {...field}
                                        type="number"
                                        fullWidth
                                        error={!!errors.multiply}
                                        helperText={errors.multiply?.message}
                                    />)
                                }}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Typography variant="h6" color="inherit" textAlign="center">
                                Total order value: {totalOrderValue}
                            </Typography>
                        </Grid>

                        <Grid item xs={4}>
                            <Typography variant="h6" color="inherit">
                                Profit Stop
                            </Typography>
                        </Grid>
                        <Grid item xs={8}>
                            <Controller
                                name="stop_profit_price"
                                control={control}
                                render={({ field }) => {
                                    return (<TextField
                                        {...field}
                                        fullWidth
                                        error={!!errors.stop_profit_price}
                                        helperText={errors.stop_profit_price?.message}
                                    />)
                                }}
                            />
                        </Grid>

                        <Grid item xs={4}>
                            <Typography variant="h6" color="inherit">
                                Loss stop
                            </Typography>
                        </Grid>
                        <Grid item xs={8}>
                            <Controller
                                name="stop_loss_price"
                                control={control}
                                render={({ field }) => {
                                    return (<TextField
                                        {...field}
                                        fullWidth
                                        error={!!errors.stop_loss_price}
                                        helperText={errors.stop_loss_price?.message}
                                    />)
                                }}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Controller
                                name="support_over_night"
                                control={control}
                                render={({ field }) => {
                                    return (
                                        <FormControlLabel {...field} control={<Checkbox />} label="Support Overnight Protection " />
                                    )
                                }}
                            />
                        </Grid>

                        {error && <Alert severity="error">{error}</Alert>}


                        <Grid item xs={6}>
                            <Button
                                onClick={() => handleClickSubmitButton('call')}
                                type="button"
                                fullWidth
                                variant="contained"
                            >
                                {
                                    0 ? <CircularProgress color="warning" size={25} /> : 'Place call order'
                                }
                            </Button>
                        </Grid>
                        <Grid item xs={6}>
                            <Button
                                onClick={() => handleClickSubmitButton('put')}
                                type="button"
                                fullWidth
                                variant="contained"
                            >
                                {
                                    0 ? <CircularProgress color="warning" size={25} /> : 'Place put order'
                                }
                            </Button>
                        </Grid>
                    </Grid>


                </Box>
            </Paper>
        </Box>
    
    )
}