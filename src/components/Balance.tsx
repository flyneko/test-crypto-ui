import { Alert, Box, Button, CircularProgress, Grid, IconButton, Popover, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import { Api } from "../core/api";
import useApi from "../hooks/useApi";
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import RemoveOutlinedIcon from '@mui/icons-material/RemoveOutlined';
import { formatNum } from "../helpers/utils";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserInfo, getUserInfo } from "../redux/slices/auth";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import PopupState, { bindTrigger, bindPopover } from 'material-ui-popup-state';

function CreditForm({ buttonLabel, buttonColor, apiRequest, onSuccess}: any) {
    const dispatch = useDispatch();
    const { data: userInfo, requestStatus: userInfoRequestStatus } = useSelector(getUserInfo);
    const { handleSubmit, formState: { errors }, control } = useForm({
        resolver: yupResolver(yup.object({
            amount: yup.number().required(),
        }).required()),
        defaultValues: { amount: '' }
    });
    const [error, setError] = useState('');
    const { request, isLoading } = useApi(apiRequest);


    const onSubmit = ({amount}) => {
        request({ user_uuid: userInfo.user_uuid, amount }).then((response) => {
            if (response.includes('Ok')) {
                onSuccess && onSuccess();
                dispatch(fetchUserInfo());
            } else
                setError(response);
        })
    }

    return (
        <Box onSubmit={handleSubmit(onSubmit)} width="100%" component="form" sx={{ p: 3 }}>
            <Controller
                name="amount"
                control={control}
                render={({ field }) => (
                    <TextField
                        {...field}
                        margin="normal"
                        fullWidth
                        label="Amount"
                        autoComplete="off"
                        autoFocus
                        error={!!errors.amount}
                        helperText={errors.amount?.message}
                    />
                )}
            />

            {error && <Alert severity="error" sx={{ mb: 1 }}>{error}</Alert>}

            <Button
                type="submit"
                fullWidth
                variant="outlined"
                color={buttonColor}
                disabled={isLoading || userInfoRequestStatus == 'loading'}
            >
                {
                    isLoading ? <CircularProgress color="warning" size={25} /> : buttonLabel
                }
            </Button>
        </Box>
    )
}

export function Balance() {
    const { data: userInfo, requestStatus: userInfoRequestStatus } = useSelector(getUserInfo);
    const isUserInfoLoading = userInfoRequestStatus === 'loading';


    const Balance = (
        <>
            <Grid container spacing={2} sx={{ pb: 0 }} alignItems="center" flexWrap="nowrap">
                <Grid item>
                    <PopupState variant="popover" popupId="withdraw-credit-popover">
                        {(popupState) => (
                            <div>
                                <IconButton {...bindTrigger(popupState)} color="error">
                                    <RemoveOutlinedIcon />
                                </IconButton>
                                <Popover
                                    {...bindPopover(popupState)}
                                    anchorOrigin={{
                                        vertical: 'top',
                                        horizontal: 'center',
                                    }}
                                    transformOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'center',
                                    }}
                                >
                                    <CreditForm buttonLabel="Withdraw" buttonColor="error" apiRequest={Api.withdrawCredit} onSuccess={popupState.close} />
                                </Popover>
                            </div>
                        )}
                    </PopupState>
                </Grid>
                <Grid item>
                    <Typography variant="h5" textAlign="center" sx={{ mb: 0 }}>
                        {
                            isUserInfoLoading ?
                                <CircularProgress color="warning" size={15} /> :
                                formatNum(userInfo.balance || 0, 4)
                        }
                    </Typography>
                </Grid>
                <Grid item>
                    <PopupState variant="popover" popupId="add-credit-popover">
                        {(popupState) => (
                            <div>
                                <IconButton {...bindTrigger(popupState)} color="success">
                                    <AddOutlinedIcon />
                                </IconButton>
                                <Popover
                                    {...bindPopover(popupState)}
                                    anchorOrigin={{
                                        vertical: 'top',
                                        horizontal: 'center',
                                    }}
                                    transformOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'center',
                                    }}
                                >
                                    <CreditForm buttonLabel="Add" buttonColor="success" apiRequest={Api.addCredit} onSuccess={popupState.close} />
                                </Popover>
                            </div>
                        )}
                    </PopupState>
                </Grid>
            </Grid>
        </>
    )

    return (
        <Grid container spacing={2} sx={{ pb: 3 }} justifyContent="center" alignItems="center">
            <Grid item>
                <Typography variant="h6" textAlign="center">
                    Available balance:
                </Typography>
            </Grid>
            <Grid item>
                {Balance}
            </Grid>
        </Grid>
    )
}