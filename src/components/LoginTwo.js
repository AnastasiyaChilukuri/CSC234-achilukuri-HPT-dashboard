import { 
    Container, 
    Grid, 
    Paper, 
    TextField, 
    Button, 
    InputAdornment, 
    IconButton, 
    Typography, 
    Dialog, 
    Box,
    DialogTitle,
    DialogContent,
    DialogContentText,
    Backdrop, 
    CircularProgress} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import React, { useState } from 'react'
import HistData from './HistData';
import CloseIcon from "@mui/icons-material/Close";

export default function LoginTwo () {
    const [values, setValues] = useState({
        email : "",
        password : "",
        showPassword : false
    });

    const handlePassVisibility = () => {
        setValues({
            ...values,
            showPassword: !values.showPassword
        })
    }

    function handleEmailChange(event) {
        setValues({
            email: event.target.values.email});
        console.log(values.email);
    }
    
    function handlePasswordChange(event) {
        setValues({
            password: event.target.values.password});
        console.log(values.password);
    }
    
    function displayLogin() {
        return(
        <div>
            <Container maxWidth='sm'>
                <Grid 
                container spacing={2}
                direction='column'
                justifyContent='center'
                style={{minHeight: '100hv'}}>
                    <Paper
                    elevation={2}
                    sx={{padding: 5}}>
                        <Grid container direction='column' spacing={2}>
                            <Grid item>
                                <Typography component="h1" variant="h5">
                                    Please log in to get historical data
                                </Typography>
                                {/*ERROR*/}
                            </Grid>
                            <Grid item>
                                <TextField 
                                type='email' 
                                fullWidth 
                                label='Enter your e-mail' 
                                placeholder='yourname@hpt.com' 
                                variant='outlined'
                                onChange={handleEmailChange}>
                                </TextField>
                            </Grid>
                            <Grid item>
                                <TextField 
                                type={values.showPassword ? 'text' : 'password'}
                                fullWidth 
                                label='Enter your password' 
                                placeholder='Password' 
                                variant='outlined'
                                InputProps ={{
                                    endAdornment:
                                        <InputAdornment position='end'>
                                            <IconButton 
                                            onClick={handlePassVisibility} 
                                            aria-label='toggle password' 
                                            edge='end'> 
                                                {values.showPassword ? <VisibilityOffIcon/> : <VisibilityIcon/>}
                                            </IconButton>

                                        </InputAdornment>
                                        }}
                                onChange={handlePasswordChange}>
                                </TextField>
                            </Grid>
                            <Grid item>
                                <Button
                                variant="contained" 
                                fullWidth>
                                    Sign In
                                </Button>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
            </Container>
        </div>)

    };
    return (
        <div className="App">
          {displayLogin()}
        </div>
    );




}
