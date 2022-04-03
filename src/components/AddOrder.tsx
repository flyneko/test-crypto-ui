import { Alert, Box, Button, Checkbox, CircularProgress, FormControlLabel, Grid, Paper, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { Api } from "../core/api";
import useApi from "../hooks/useApi";
import { fetchUserInfo, getCurrency } from "../redux/slices/auth";
import { batch, useDispatch, useSelector } from "react-redux";
import { Balance } from "./Balance";
import { fetchOptions } from "../redux/slices/options";
import { toastify } from "../helpers/toastify";
import { formatNum } from "../helpers/utils";

const schema = yup.object({
    deposit:           yup.number().required().transform(i => !i ? 0 : i),
    type:              yup.number(),
    multiply:          yup.number().required().transform(i => !i ? 0 : i),
    stop_profit_price: yup.number().transform(i => !i ? 0 : i),
    stop_loss_price:   yup.number().transform(i => !i ? 0 : i)
}).required();

const defaultValues = {
    type:               null,
    deposit:            '',
    multiply:           '',
    stop_profit_price:  '',
    stop_loss_price:    '',
    support_over_night: false,
};

export function AddOrder() {
    const dispatch = useDispatch();
    const selectedCurrencyType = useSelector(getCurrency);
    const { setValue, reset, handleSubmit, watch, formState: { errors }, control } = useForm({
        resolver: yupResolver(schema),
        defaultValues
    });
    const [error, setError] = useState('');
    const [totalOrderValue, setTotalOrderValue] = useState(0);
    const { request: addOptionRequest, isLoading: isAddOptionLoading } = useApi(Api.addOption);
    const formValues = {
        deposit: watch('deposit'),
        multiply: watch('multiply')
    } as any;

    useEffect(() => {
        const total = formValues.deposit * formValues.multiply;
        setTotalOrderValue(formatNum(total))
    }, [formValues.deposit, formValues.multiply]);

    const onSubmit = (data) => {
        addOptionRequest({
            currency_type: selectedCurrencyType,
            ...data
        }).then((response: any) => {
            if (typeof response === 'string' && response.includes('Error'))
                setError(response);
            else {
                batch(() => {
                    dispatch(fetchUserInfo());
                    dispatch(fetchOptions());
                });

                setError('');
                reset(defaultValues);
                toastify.success('Option added successfully');
            }
        })
    };

    const handleClickSubmitButton = (type: string) => {
        setValue('type', type);
        handleSubmit(onSubmit)();
    }

    return (
        <Box sx={{ mt: 5 }}>
            <Balance />

            <Paper elevation={3}>
                <Box width="100%" component="form" noValidate sx={{ p: 3 }}>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} md={4}>
                            <Typography variant="h6" color="inherit">
                                Deposit
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={8}>
                            <Controller
                                name="deposit"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        type="number"
                                        fullWidth
                                        error={!!errors.deposit}
                                        helperText={errors.deposit?.message}
                                    />
                                )}
                            />
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <Typography variant="h6">
                                Multiply
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={8}>
                            <Controller
                                name="multiply"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        type="number"
                                        fullWidth
                                        error={!!errors.multiply}
                                        helperText={errors.multiply?.message}
                                    />
                                )}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Typography variant="h6" color="inherit" textAlign="center">
                                Total order value: {totalOrderValue}
                            </Typography>
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <Typography variant="h6" color="inherit">
                                Profit Stop
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={8}>
                            <Controller
                                name="stop_profit_price"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        fullWidth
                                        error={!!errors.stop_profit_price}
                                        helperText={errors.stop_profit_price?.message}
                                    />
                                )}
                            />
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <Typography variant="h6" color="inherit">
                                Loss stop
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={8}>
                            <Controller
                                name="stop_loss_price"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        fullWidth
                                        error={!!errors.stop_loss_price}
                                        helperText={errors.stop_loss_price?.message}
                                    />
                                )}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Controller
                                name="support_over_night"
                                control={control}
                                render={({field}) => (
                                    <FormControlLabel control={<Checkbox {...field} />} label="Support Overnight Protection " />
                                )}
                            />
                        </Grid>

                        {error && <Alert sx={{ width: '100%' }} severity="error">{error}</Alert>}

                        {[
                            { label: 'Place call order', onClick: () => handleClickSubmitButton('0') },
                            { label: 'Place put order', onClick: () => handleClickSubmitButton('1') }
                        ].map((btn, index) => (
                            <Grid key={index} item xs={12} xl={6}>
                                <Button
                                    onClick={btn.onClick}
                                    type="button"
                                    fullWidth
                                    variant="contained"
                                    disabled={isAddOptionLoading}
                                >
                                    {
                                        isAddOptionLoading ? <CircularProgress color="warning" size={25} /> :  btn.label
                                    }
                                </Button>
                            </Grid>
                        ))}

                        <Grid item xs={12} textAlign="center">
                            <Button size="small" onClick={() => reset({
                                type: 0,
                                deposit: 0.5,
                                multiply: 3,
                                stop_profit_price: 9000.5,
                                stop_loss_price: 9.5,
                                support_over_night: true,
                            } as any)}>Fill test data</Button>
                        </Grid>
                    </Grid>
                </Box>
            </Paper>
        </Box>
    
    )
}