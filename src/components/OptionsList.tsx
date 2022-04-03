import { Button, CircularProgress, Grid, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect } from "react";
import { Option } from "./Option";
import useWebSocket from 'react-use-websocket';
import { WS_HOST } from "../core/constants";
import { useDispatch, useSelector } from "react-redux";
import { getToken } from "../redux/slices/auth";
import { fetchOptions, getOptions, getOptionsActiveType, getOptionsStatus, setActiveType } from "../redux/slices/options";

export function OptionsList() {
    const dispatch = useDispatch();
    const token = useSelector(getToken);
    const activeType = useSelector(getOptionsActiveType);
    const optionsList = useSelector(getOptions);
    const isOptionsLoading = useSelector(getOptionsStatus) === 'loading';
    const { sendJsonMessage, lastJsonMessage } = useWebSocket(`wss://${WS_HOST}/ws/options_live`, { queryParams: { token } });

    useEffect(() => {
        dispatch(fetchOptions());
    }, [activeType]);

    return (
        <Box>
            <Typography variant="h4" textAlign="center" sx={{ mb: 4 }}>
                Order listing
            </Typography>
            <Grid container spacing={2} sx={{ pb: 5 }} alignItems="center">
                {Object.entries({
                    'all': 'All',
                    'active': 'Open',
                    'closed': 'Closed',
                    'force_closed': 'Force closed',
                }).map(([key, label], index) => (
                    <Grid key={index} item xs={6} lg={3}>
                        <Button onClick={() => dispatch(setActiveType(key))} variant={key === activeType ? 'contained' : 'outlined'} size="large" fullWidth>
                            {
                                isOptionsLoading && key === activeType ?
                                    <CircularProgress color="warning" size={24} /> :
                                    label
                            }
                        </Button>
                    </Grid>
                ))}
            </Grid>


            {(
                optionsList.map((i) => (
                    <Option key={i.option_project_uuid} data={i} sendWsMessage={sendJsonMessage} wsMessage={lastJsonMessage} />
                ))
            )}
        </Box>
    )
}