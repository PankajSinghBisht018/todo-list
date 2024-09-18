import React, { useState } from 'react';
import { Grid, Paper, TextField, Button, Modal, FormControl, Typography } from '@mui/material';
import { toast } from 'react-toastify';
import axios from 'axios';

function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setEmail(e.target.value);
    };

    const sendLink = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:5000/user/sendpasswordlink', { email }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 200) {
                setEmail('');
                setMessage('Password reset link sent successfully');
                toast.success('Password reset link sent successfully');
            } else {
                toast.error('Invalid user');
            }
        } catch (error) {
            console.error(error);
            toast.error('An error occurred');
        }
    };

    const paperStyle = {
        padding: 20,
        width: 350,
        margin: 'auto',
        marginTop: '20vh',
        position: 'relative',
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        backdropFilter: 'blur(10px)',
        color: 'black'
    };

    return (
        <Modal open={true}>
            <Grid
                container
                justifyContent="center"
                alignItems="center"
                style={{ minHeight: '100vh' }}
                gap={10}
            >
                <Paper elevation={10} style={paperStyle}>
                    <Grid align="center">
                        <Typography variant='h5'>Forgot Password</Typography>
                    </Grid>
                   
                    <FormControl sx={{ width: 320 }}>
                        <TextField
                            label="Email"
                            name="email"
                            fullWidth
                            value={email}
                            onChange={handleChange}
                        />
                        <Button
                            type="submit"
                            color="primary"
                            variant="contained"
                            fullWidth
                            onClick={sendLink}
                        >
                            Send
                        </Button> 
                        {message ? <Typography variant='body2' sx={{color:'green'}}>{message}</Typography> : ''}
                    </FormControl>
                </Paper>
            </Grid>
        </Modal>
    );
}

export default ForgotPassword;
