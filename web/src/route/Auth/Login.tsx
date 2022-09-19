import React, {FormEventHandler, useState} from 'react';
import './Login.css';
import {Session} from "../../model/Session";
import {
    Alert, Avatar, Box, Button, CircularProgress, Container, CssBaseline,
    Grid, Link as LinkStyle, Paper, TextField, Typography, useMediaQuery, useTheme
} from "@mui/material";
import Copyright from "../Wrapper/Copyright";
import {useSession} from "../../provider/SessionContext";
import logo from "../../logo.svg";
import {useApi} from "../../provider/api/RestApi";

const Login = () => {
    const {setSession} = useSession();
    const theme = useTheme();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [usernameError, setUsernameError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const api = useApi();

    const isMQBelowSmall = useMediaQuery(theme.breakpoints.down('sm'));

    const maxWidth = theme.breakpoints.values.sm;

    const handleSubmit: FormEventHandler<HTMLFormElement> = async e => {
        setLoading(true);
        setError('');
        setUsernameError('');
        setPasswordError('');
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        try {
            const username = (data.get('username') as string).trim();
            const password = (data.get('password') as string).trim();

            if (!username || !password) {
                username || setUsernameError('Username cannot be empty');
                password || setPasswordError('Password cannot be empty');
                return setLoading(false);
            }

            const {payload: {user, roles}, token} = await api.post('/auth', {username, password});
            const newSession = new Session(user, roles, token);
            newSession && setSession(newSession);
        } catch (e) {
            console.log(e);
            if (e instanceof Error) {
                setError(e.message);
            } else {
                setError(`${e}`)
            }
        }
        setLoading(false);
    }

    return (
        <Box
            component="main"
            sx={{
                backgroundColor: (theme) =>
                    theme.palette.mode === 'light'
                        ? theme.palette.grey[100]
                        : theme.palette.grey[900],
                flexGrow: 1,
                height: '100vh',
                overflow: 'auto',
            }}
        >
            <Container disableGutters={isMQBelowSmall} component="main" maxWidth="sm">
                <Paper sx={{p: isMQBelowSmall ? 2 : 8, pt: 4, pb: 8, m: isMQBelowSmall ? 0 : 3, maxWidth}}>
                    <CssBaseline/>
                    <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                        <Avatar sx={{m: 1, mb: 3, width: 100, height: 100}} src={logo}/>
                        <Typography component="h1" variant="h5">Sign in</Typography>
                        <Box component="form" onSubmit={handleSubmit} noValidate sx={{mt: 1}}>
                            <TextField margin="normal" required fullWidth id="username" label="Username"
                                       name="username" autoComplete="username" autoFocus
                                       error={!!usernameError} helperText={usernameError}
                                       onFocus={() => setUsernameError('')}
                            />
                            <TextField margin="normal" required fullWidth name="password" label="Password"
                                       type="password" id="password" autoComplete="current-password"
                                       error={!!passwordError} helperText={passwordError}
                                       onFocus={() => setPasswordError('')}
                            />
                            {error && <Alert severity="error">{error}</Alert>}
                            <Box sx={{mt: 3, mb: 2, display: 'flex', justifyContent: 'center'}}>
                                {
                                    loading
                                        ? <CircularProgress/>
                                        : <Button type="submit" fullWidth variant="contained">Sign In</Button>
                                }
                            </Box>

                            <Grid container>
                                <Grid item xs>
                                    {/*<Link to="/forgot-password">*/}
                                    <LinkStyle variant="body2">Forgot password?</LinkStyle>
                                    {/*</Link>*/}
                                </Grid>
                                <Grid item>
                                    {/*<Link to="/signup">*/}
                                    <LinkStyle variant="body2">Don't have an account? Sign Up</LinkStyle>
                                    {/*</Link>*/}
                                </Grid>
                            </Grid>
                        </Box>
                    </Box>
                </Paper>
            </Container>
            <Copyright sx={{mt: 3, mb: 3}}/>
        </Box>
    )
}

export default Login;
