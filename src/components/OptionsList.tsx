import { Button, Grid, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import { Api } from "../core/api";
import useApi from "../hooks/useApi";
import { Option } from "./Option";
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { API_URL } from "../core/constants";
import { useSelector } from "react-redux";
import { getToken } from "../redux/slices/auth";

export function OptionsList() {
    const token = useSelector(getToken);
    const [isListOpen, setIsListOpen] = useState(false);
    const { data: optionsList, request: optionsListRequest, isLoading } = useApi(Api.optionsList);
    const {
        sendJsonMessage,
        lastMessage,
        lastJsonMessage,
        readyState,
    } = useWebSocket(`wss://${API_URL}/ws/options_live`, { queryParams: { token } });

    useEffect(() => {
        isListOpen && optionsListRequest();
    }, [isListOpen]);

    return (
        <Box>
            <Typography variant="h4" color="inherit" textAlign="center" sx={{ mb: 4 }}>
                Order listing
            </Typography>
            <Grid container spacing={2} sx={{ pb: 5 }} alignItems="center">
                <Grid item xs={4}>
                    <Button onClick={() => setIsListOpen(true)} variant={isListOpen ? 'contained' : 'outlined'} size="large" fullWidth>
                        Open
                    </Button>
                </Grid>
                <Grid item xs={4}>
                    <Button onClick={() => setIsListOpen(false)} variant="outlined" size="large" fullWidth>
                        Close
                    </Button>
                </Grid>
                <Grid item xs={4}>
                    <Button onClick={() => setIsListOpen(false)} variant="outlined" size="large" fullWidth>
                        Force close
                    </Button>
                </Grid>
            </Grid>


            {isListOpen && (
                [{}, {}, {}].map((i, index) => (
                    <Option key={index} data={i} sendWsMessage={sendJsonMessage} wsMessage={lastJsonMessage} />
                ))
            )}
        </Box>
    )
}