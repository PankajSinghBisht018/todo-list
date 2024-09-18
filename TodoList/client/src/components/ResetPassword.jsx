import React, { useState } from 'react';
import { Grid, Paper, TextField, Button, Modal, FormControl, Typography } from '@mui/material';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

function ResetPassword() {
    const { token } = useParams();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();

    const handleChangePassword = (e) => {
        setPassword(e.target.value);
    };

    const handleConfirmPassword = (e) => {
        setConfirmPassword(e.target.value);
    };

    const resetPassword = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        try {
            const response = await axios.post(`http://localhost:5000/user/resetpassword/${token}`, { password }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 200) {
                toast.success('Password reset successfully');
                navigate('/login')
            } else {
                toast.error('Unable to reset your password');
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
                        <Typography variant='h5'>Reset Password</Typography>
                    </Grid>
                    <FormControl sx={{ width: 320 }}>
                        <TextField
                            label="New Password"
                            name="password"
                            fullWidth
                            type="password"
                            value={password}
                            onChange={handleChangePassword}
                        />
                        <TextField
                            label="Confirm Password"
                            name="confirmPassword"
                            fullWidth
                            type="password"
                            value={confirmPassword}
                            onChange={handleConfirmPassword}
                        />
                        <Button
                            type="submit"
                            color="primary"
                            variant="contained"
                            fullWidth
                            onClick={resetPassword}
                        >
                            Reset
                        </Button>
                    </FormControl>
                </Paper>
            </Grid>
        </Modal>
    );
}

export default ResetPassword;
