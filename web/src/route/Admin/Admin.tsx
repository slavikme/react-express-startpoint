import {useApi} from "../../provider/api/RestApi";
import {useEffect, useState} from "react";
import {Paper} from "@mui/material";

const Admin = () => {
    const api = useApi();
    const [data, setData] = useState({});
    useEffect(() => {
        api.get('/admin').then(setData);
    }, []);
    return <Paper sx={{p: 4, m: 2}}>
        <pre>{JSON.stringify(data)}</pre>
    </Paper>
}

export default Admin;
