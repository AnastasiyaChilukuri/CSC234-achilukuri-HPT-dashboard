import React from "react";
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
  CircularProgress,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useState, useContext } from "react";
import CloseIcon from "@mui/icons-material/Close";
import PropTypes from "prop-types";
import { createVendiaClient } from "@vendia/client";
import { UserContext } from "./UserContext";

async function loginUser(credentials) {
  return true;
}

const client = createVendiaClient({
  apiUrl: `https://c3zxbm61ki.execute-api.us-west-2.amazonaws.com/graphql/`,
  websocketUrl: `wss://9b6jfh1m81.execute-api.us-west-2.amazonaws.com/graphql`,
  apiKey: "3426nYaSeCpMrUdhdgLqJLPbqJFrq6Vp2ANZnTxx9zJP",
});

export default function Login(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [openToolPopUp, setOpenToolPopUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [inLoginProcess, setInLoginProcess] = useState(false);
  const [userNameError, setUserNameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [userNameHelperText, setUserNameHelperText] = useState("Username/email cannot be empty");
  const [passwordNameHelperText, setPasswordHelperText] = useState("Password cannot be empty");



  const handleCloseToolPopUp = () => {
    setOpenToolPopUp(false);
  };

  const getUserInfo = async (credentials) => {
    console.log(credentials.email);
    console.log("Inside getUserInfo");
    var _token = {
      status: false,
      email: "",
      role: "",
      apiKey: "",
    };
    const { entities } = client;
    console.log(entities);
    const userTableResp = await entities.user.list({
      filter: {
        email: {
          eq: credentials.email,
        },
        _and: {
          encryptPswd: {
            eq: credentials.password,
          },
        },
      },
    });
    if (userTableResp.items.length > 0) {
      _token.status = true;
      _token.role = userTableResp.items[0].role;
      _token.email = userTableResp.items[0].email;
      _token.apiKey = userTableResp.items[0].apiKey;
    }
    setOpenToolPopUp(true);
    setInLoginProcess(false);
    console.log(_token);
    return _token;
  };

  const handlePassVisibility = () => {
    setShowPassword(!showPassword);
  };

  const { userToken, setUserToken } = useContext(UserContext);

  const handleOnClickLogin = async (e) => {
    setInLoginProcess(true);
    var errors = false;
    if(email==""){
      setUserNameError(true);
      errors = true;
    }
    if(password==""){
      setPasswordError(true);
      errors = true;
    }
    if(errors){
      setInLoginProcess(false);
      return;
    }
    e.preventDefault();
    const token = await getUserInfo({
      email,
      password,
    });
    console.log("Inside HandleOnclickLogin");
    console.log(token);
    setUserToken({
      ...userToken,
      status: token.status,
      email: token.email,
      role: token.role,
      apiKey: token.apiKey,
    });
  };

  function DialogWrongCredentials() {
    return (
      <div>
        <Dialog
          open={openToolPopUp && userToken.status == false}
          onClose={handleCloseToolPopUp}
          aria-label="dialog-title"
          aria-describedby="dialog-description"
          fullWidth
          id='wrongCredDialog'
          PaperProps={{
            sx: { backgroundColor: "pink", width: "60%", height: "20%" },
          }}
        >
          <DialogTitle id="dialog-title">
            <Box display="flex" alignItems="center">
              <Box flexGrow={1}>Wrong Credentials</Box>
              <Box>
                <IconButton onClick={handleCloseToolPopUp}>
                  <CloseIcon />
                </IconButton>
              </Box>
            </Box>
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="dialog-description">
              Cannot find email or password. Please try again
            </DialogContentText>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <div id='loginPage'>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={inLoginProcess}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Container maxWidth="sm">
        <Grid
          container
          spacing={2}
          direction="column"
          justifyContent="center"
          style={{ minHeight: "100hv" }}
        >
          <Paper elevation={2} sx={{ padding: 5 }}>
            <Grid container direction="column" spacing={2}>
              <Grid item>
                <Typography component="h1" variant="h5">
                  {`Please log in to ${props.textMsg}`}
                </Typography>
                {/*ERROR*/}
              </Grid>
              <Grid item>
                <TextField
                  type="email"
                  fullWidth
                  id='loginPageUserNameField'
                  label="Enter your e-mail"
                  placeholder="yourname@hpt.com"
                  variant="outlined"
                  onChange={(e) => setEmail(e.target.value)}
                  disabled = {inLoginProcess}
                  error = {userNameError}
                  helperText = {userNameError && userNameHelperText}
                ></TextField>
              </Grid>
              <Grid item>
                <TextField
                  type={showPassword ? "text" : "password"}
                  fullWidth
                  id='loginPagePasswordField'
                  label="Enter your password"
                  placeholder="Password"
                  variant="outlined"
                  disabled = {inLoginProcess}
                  error = {passwordError}
                  helperText = {passwordError && passwordNameHelperText}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          id='hideShowPassword'
                          onClick={handlePassVisibility}
                          aria-label="toggle password"
                          edge="end"
                        >
                          {showPassword ? (
                            <VisibilityOffIcon />
                          ) : (
                            <VisibilityIcon />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  onChange={(e) => setPassword(e.target.value)}
                ></TextField>
              </Grid>
              <Grid item>
                <Button
                  variant="contained"
                  fullWidth
                  id='loginPageSignInButton'
                  type="submit"
                  onClick={handleOnClickLogin}
                  disabled = {inLoginProcess}
                >
                  Sign In
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        {DialogWrongCredentials()}
      </Container>
    </div>
  );
}

// Login.propTypes = {
//     setToken: PropTypes.func.isRequired
//   }
