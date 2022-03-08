import { FormControl, Grid, InputLabel, MenuItem, Select, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { API_URL, CURRENCIES } from "../core/constants";
import { clearToken, getCurrency, getToken, setCurrency } from "../redux/slices/auth";
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { toastify } from "../helpers/toastify";

export function CurrencyInfo() {
    const dispatch = useDispatch();
    const selectedCurrency = useSelector(getCurrency);
    const token = useSelector(getToken);
    const [currencyInfo, setCurrencyInfo] = useState({} as any);
    const [trendVectors, setTrendVectors] = useState({ buy: 0, sell: 0 });
    const onChangeCurrency = (e: any) => {
        dispatch(setCurrency(e.target.value));
    }
    const {
        sendJsonMessage,
        lastMessage,
        lastJsonMessage,
        readyState,
    } = useWebSocket(`wss://${API_URL}/ws/currency_live`, { queryParams: { token } });

    useEffect(() => {
        if (lastMessage?.data.includes('Error')){
            toastify.error(lastMessage.data);
            dispatch(clearToken());
        }

        if (lastJsonMessage) {
            currencyInfo && setTrendVectors({
                buy: lastJsonMessage.average_buy_price == currencyInfo.average_buy_price ? 0 : lastJsonMessage.average_buy_price > currencyInfo.average_buy_price ? 1 : -1,
                sell: lastJsonMessage.average_sell_price == currencyInfo.average_sell_price ? 0 : lastJsonMessage.average_sell_price > currencyInfo.average_sell_price ? 1 : -1
            })
            setCurrencyInfo(lastJsonMessage);
        }

    }, [lastMessage]);

    useEffect(() => {
        ReadyState.OPEN == readyState && sendJsonMessage({ event: "subscribe", "currency_type": selectedCurrency });

        return () => {
            ReadyState.OPEN == readyState && sendJsonMessage({ event: "unsubscribe", "currency_type": selectedCurrency })
        }
    }, [readyState, selectedCurrency])

    return (
        <Box>
            <Grid container spacing={2} sx={{ pb: 3 }} alignItems="center">
                <Grid item xs={4}>
                    <Typography variant="h6" color="inherit">
                        Currency
                    </Typography>
                </Grid>
                <Grid item xs={8}>
                    <FormControl fullWidth>
                        <Select value={selectedCurrency} onChange={onChangeCurrency}>
                            {Object.entries(CURRENCIES).map(([currencyValue, currencyLabel]: any, index: any) => (
                                <MenuItem key={index} value={currencyValue}>{currencyLabel}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>
            <Grid container spacing={2}>
                <Grid item xs={4}>
                    <Typography variant="h6">
                        {CURRENCIES[selectedCurrency]}
                    </Typography>
                </Grid>
                <Grid item xs={8}>
                    <Grid container spacing={2} justifyContent="space-between" alignItems="center">
                        <Grid item xs={6}>
                            <Typography variant="h6" color="inherit">
                                Buy price: 
                            </Typography>
                        </Grid>
                        <Grid item xs={6} textAlign="right">
                            <Typography variant="h6" color={trendVectors.buy === 1 ? 'success.main' : trendVectors.buy === -1 ? 'error.main' : ''}>
                                {currencyInfo.average_buy_price || 0}
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="h6" color="inherit">
                                Sell price:
                            </Typography>
                        </Grid>
                        <Grid item xs={6} textAlign="right">
                            <Typography variant="h6" color={trendVectors.sell === 1 ? 'success.main' : trendVectors.sell === -1 ? 'error.main' : ''}>
                                {currencyInfo.average_sell_price || 0}
                            </Typography>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Box>

    )
}