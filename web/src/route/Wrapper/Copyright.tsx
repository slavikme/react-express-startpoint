import {Link as LinkStyle, Typography} from "@mui/material";
import React from "react";

function Copyright(props: any) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '}
            <LinkStyle color="inherit" href="https://github.com/slavikme/react-express-startpoint">Slavik Meltser</LinkStyle>
            {' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

export default Copyright;
