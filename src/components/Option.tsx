import { Button, Checkbox, CircularProgress, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Api } from "../core/api";
import { CURRENCIES } from "../core/constants";
import { formatDateFromUnix, formatNum } from "../helpers/utils";
import useApi from "../hooks/useApi";
import useDeepCompareEffect from 'use-deep-compare-effect';
import { fetchOptions } from "../redux/slices/options";

const typesDictionary = {
    0: 'CALL',
    1: 'PUT'
};

export function Option({ data: {option_project_uuid: uuid, ...inputData}, sendWsMessage, wsMessage}: { data: any, sendWsMessage: any, wsMessage: any }) {
    const dispatch = useDispatch();
    const [data, setData] = useState(inputData as any);
    const { request: closeOptionRequest, isLoading: isOptionCloseLoading } = useApi(Api.closeOption);

    const onCloseOptionClick = () => {
        uuid && closeOptionRequest(uuid).then(() => dispatch(fetchOptions()));
    }

    useEffect(() => {
        uuid && !data.closed_on && sendWsMessage({ event: "subscribe", "option_uuid": uuid });

        return () => {
            uuid && !data.closed_on && sendWsMessage({ event: "unsubscribe", "option_uuid": uuid })
        }
    }, []);

    useDeepCompareEffect(() => {
        setData(inputData);
    }, [inputData])

    useEffect(() => {
        wsMessage && wsMessage.option_project_uuid === uuid && setData(d => ({ ...d, ...wsMessage, position_price: wsMessage.current_position_price }));
    }, [wsMessage, uuid]);

    return (
        <Grid container spacing={2} sx={{ pb: 6 }} alignItems="center">
            <Grid item xs={7}>
                UUID:
                <Typography variant="h6" sx={{fontSize: '1rem'}}>
                     {uuid}
                </Typography>
            </Grid>

            <Grid item xs={3}>
                Create time:
                <Typography variant="h6">
                    {formatDateFromUnix(data.created_on)}
                </Typography>
            </Grid>

            {!data.closed_on && (
                <Grid item xs={2} textAlign="right">
                    <Button disabled={isOptionCloseLoading} size="small" onClick={onCloseOptionClick} variant="contained">
                        {isOptionCloseLoading ? <CircularProgress color="warning" size={24} /> : 'Close'}
                    </Button>
                </Grid>
            )}

            <Grid item xs={12}>
                <TableContainer component={Paper}>
                    <Table>
                        <TableBody>
                            <TableRow>
                                <TableCell>
                                    Type
                                    <Typography variant="h6">
                                        {typesDictionary[data.type]}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    Deposit
                                    <Typography variant="h6">
                                        {formatNum(data.deposit)}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    Currency
                                    <Typography variant="h6">
                                        {CURRENCIES[data.currency_type]}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    Crypto Amount
                                    <Typography variant="h6">
                                        {formatNum(data.crypto_amount)}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    Position Price
                                    <Typography variant="h6">
                                        {formatNum(data.position_price)}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    Profit
                                    <Typography variant="h6">
                                        {formatNum(data.profit)}
                                    </Typography>
                                </TableCell>
                            </TableRow>

                            <TableRow>
                                <TableCell>
                                    Stop profit price
                                    <Typography variant="h6">
                                        {formatNum(data.stop_profit_price)}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    Stop loss price
                                    <Typography variant="h6">
                                        {formatNum(data.stop_loss_price)}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    Support over night <br />
                                    <Checkbox checked={data.support_over_night} />
                                </TableCell>
                                {data.system_force_closed && (
                                    <TableCell>
                                        System force closed <br />
                                        <Checkbox checked={data.system_force_closed} />
                                    </TableCell>
                                )}
                                {data.closed_on && (
                                    <TableCell>
                                        Closed on
                                        <Typography variant="h6" color="error">
                                            {formatDateFromUnix(data.closed_on)}
                                        </Typography>
                                    </TableCell>
                                )}
                                {data.close_position_price && (
                                    <TableCell>
                                        Close position price
                                        <Typography variant="h6" color="error">
                                            {formatNum(data.close_position_price)}
                                        </Typography>
                                    </TableCell>
                                )}
                                {data.close_profile && (
                                    <TableCell>
                                        Close profile
                                        <Typography variant="h6" color="error">
                                            {data.close_profile}
                                        </Typography>
                                    </TableCell>
                                )}
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </Grid>
        </Grid>
    )
}