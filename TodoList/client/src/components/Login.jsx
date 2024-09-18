import React, { useState } from 'react';
import { Avatar, Grid, Paper, TextField, Button, Tabs, Tab, Box, Typography, IconButton, Modal,Link } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import CloseIcon from '@mui/icons-material/Close';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';


function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div style={{ display: value !== index ? 'none' : 'block' }}>
      <Box p={3}>{children}</Box>
    </div>
  );
}

function Login({ onLogin }) {
  const [tabValue, setTabValue] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');


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
    
  const avatarStyle = { backgroundColor: 'black' };

  const loginSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email format').required('Email is required'),
    password: Yup.string().required('Password is required'),
  });

  const signUpSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email format').required('Email is required'),
    password: Yup.string().required('Password is required'),
    confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match').required('Confirm Password is required'),
  });

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setErrorMessage('');
  };

  const handleLoginSubmit = (values, { setSubmitting }) => {
    axios.post('http://localhost:5000/user/signin', values)
        .then(response => {
            const { token } = response.data;
            localStorage.setItem('token', token);
            onLogin();
        })
        .catch(error => {
            console.error('Login error:', error.response || error.message);
            setErrorMessage('Invalid email or password');
            setSubmitting(false);
        });
};

const handleSignUpSubmit = (values, { setSubmitting }) => {
    axios.post('http://localhost:5000/user/signup', values)
        .then(response => {
            setSubmitting(false);
            setErrorMessage('');
            setTabValue(0);
        })
        .catch(error => {
            console.error('Signup error:', error.response || error.message);
            setErrorMessage('User already exists');
            setSubmitting(false);
        });
};

  return (
    <Modal open={true}>
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        style={{ minHeight: '100vh' }}
      >
        <Paper elevation={10} style={paperStyle}>
          <Grid align="center">
            <Avatar style={avatarStyle}><LockIcon /></Avatar>
            <h2>Sign In / Sign Up</h2>
          </Grid>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="login signup tabs" variant="fullWidth">
            <Tab label="Login" />
            <Tab label="Sign Up" />
          </Tabs>
          <TabPanel value={tabValue} index={0}>
            <Formik
              initialValues={{ email: '', password: '' }}
              validationSchema={loginSchema}
              onSubmit={handleLoginSubmit}
            >
              {({ isSubmitting }) => (
                <Form>
                  <Field as={TextField} label="Email" name="email" fullWidth required helperText={<ErrorMessage name="email" />} />
                  <Field as={TextField} label="Password" name="password" type="password" fullWidth required helperText={<ErrorMessage name="password" />} />
                  <Button type="submit" color="primary" variant="contained" fullWidth disabled={isSubmitting}>Login</Button> 
                  <Typography sx={{lineHeight:3}}>Forgot your password? <Link href="/password-reset" variant="body2">Click here</Link></Typography>
                </Form>
               
              )}
            </Formik>
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            <Formik
              initialValues={{ email: '', password: '', confirmPassword: '' }}
              validationSchema={signUpSchema}
              onSubmit={handleSignUpSubmit}
            >
              {({ isSubmitting }) => (
                <Form>
                  <Field as={TextField} label="Email" name="email" fullWidth required helperText={<ErrorMessage name="email" />} />
                  <Field as={TextField} label="Password" name="password" type="password" fullWidth required helperText={<ErrorMessage name="password" />} />
                  <Field as={TextField} label="Confirm Password" name="confirmPassword" type="password" fullWidth required helperText={<ErrorMessage name="confirmPassword" />} />
                  <Button type="submit" color="primary" variant="contained" fullWidth disabled={isSubmitting}>Sign Up</Button>
                </Form>
              )}
            </Formik>
          </TabPanel>
          {errorMessage && <Typography color="error">{errorMessage}</Typography>}
          <IconButton style={{ position: 'absolute', top: 0, right: 0 }} onClick={() => { }}><CloseIcon /></IconButton>
        </Paper>
      </Grid>
    </Modal>
  );
}

export default Login;
