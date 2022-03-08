import { Button, CircularProgress, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import { ReadyState } from 'react-use-websocket';
import { Api } from "../core/api";
import useApi from "../hooks/useApi";

export function Option({ data: inputData, sendWsMessage, wsMessage}: { data: any, sendWsMessage: any, wsMessage: any }) {
    const [data, setData] = useState(inputData as any);
    const { request: closeOptionRequest, isLoading: isOptionCloseLoading } = useApi(Api.closeOption);

    const onCloseOptionClick = () => {
        data.uuid && closeOptionRequest(data.uuid);
    }

    useEffect(() => {
        data.uuid && sendWsMessage({ event: "subscribe", "option_uuid": data.uuid });

        return () => {
            data.uuid && sendWsMessage({ event: "unsubscribe", "option_uuid": data.uuid })
        }
    }, []);

    useEffect(() => {
        console.log(wsMessage);
    }, [wsMessage]);

    return (
        <Grid container spacing={2} sx={{ pb: 3 }} alignItems="center">
            <Grid item xs={4} textAlign="center">
                <Typography variant="h5" color="inherit">
                    UUID: {data.uuid}
                </Typography>
            </Grid>

            <Grid item xs={4} textAlign="center">
                <Typography variant="h5" color="inherit">
                    Create time: {data.time}
                </Typography>
            </Grid>

            <Grid item xs={4} textAlign="right">
                <Button size="small" variant="contained">
                    {isOptionCloseLoading ? <CircularProgress color="warning" size={15} /> : 'Close'}
                </Button>
            </Grid>

            <Grid item xs={12}>
                <TableContainer component={Paper}>
                    <Table>
                        <TableBody>
                            <TableRow>
                                <TableCell>
                                    Type
                                    <Typography variant="h6" color="inherit">
                                        {data.type}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    Deposit
                                    <Typography variant="h6" color="inherit">
                                        {data.deposit}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    Currency
                                    <Typography variant="h6" color="inherit">
                                        {data.currency}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    Crypto Amount
                                    <Typography variant="h6" color="inherit">
                                        {data.crypto_amount}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    Position Price
                                    <Typography variant="h6" color="inherit">
                                        {data.position_price}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    Profit
                                    <Typography variant="h6" color="inherit">
                                        {data.profit}
                                    </Typography>
                                </TableCell>
                            </TableRow>

                            <TableRow>
                                <TableCell>
                                    Stop profit price
                                    <Typography variant="h6" color="inherit">
                                        {data.stop_profit_price}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    Stop loss price
                                    <Typography variant="h6" color="inherit">
                                        {data.stop_loss_price}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    Support over night
                                    <Typography variant="h6" color="inherit">
                                        {data.support_over_night}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    Closed on
                                    <Typography variant="h6" color="inherit">
                                        {data.closed_on}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    close position price
                                    <Typography variant="h6" color="inherit">
                                        {data.close_position_price}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    Close profile
                                    <Typography variant="h6" color="inherit">
                                        {data.close_profile}
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </Grid>
        </Grid>
    )
}