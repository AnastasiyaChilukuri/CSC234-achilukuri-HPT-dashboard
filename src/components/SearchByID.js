import * as React from "react";
import { useState } from "react";
import { createTheme, ThemeProvider, styled } from "@mui/material/styles";
import ListItemText from '@mui/material/ListItemText';
import Paper from "@mui/material/Paper";
import {
  Dialog,
  Typography,
  DialogTitle,
  DialogContent,
  DialogContentText,
  IconButton,
  Container,
  Box,
  Link,
  TextField,
  CssBaseline,
  Button,
  Backdrop,
  CircularProgress
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import {getCo2DataOfToolBySerialNo} from "./Backend.js"

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.button,
  padding: theme.spacing(1),
  height: "80%",
  textAlign: "center",
  color: theme.palette.text.default,
}));

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const theme = createTheme();

export default function SearchByID() {
  const [openToolPopUp, setOpenToolPopUp] = useState(false);
  const [toolSerialFound, setToolSerialFound] = useState(false);
  const [loadingOpen, setLoadingOpen] = useState(false);
  const [toolCo2Values, setToolCo2Values] = useState({
    imageUrl : "",
    motor: 0,
    batery: 0,
    transportation: 0,
  });
  const [serialNum, setSerialNum] = useState("");
  const [toolType, setToolType] = useState("");
  const [pritnOnce, setPrintOnce] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get("id"),
    });
  };

  function handleSerialNumChange(event) {
    setSerialNum(event.target.value);
  }

  function handleClickOpen(props) {
    //here you need to determine to open wrong dialogue or the correct dialouge
    setLoadingOpen(true);
    co2DataOfToolBySerialNo(serialNum);
  }

  const handleCloseToolPopUp= () => {
    setOpenToolPopUp(false);
  };

  const co2DataOfToolBySerialNo = async (serialNo) => {
    const _toolCo2Data = await getCo2DataOfToolBySerialNo(serialNo);
    if(_toolCo2Data.sucess){
      setToolCo2Values(_toolCo2Data);
      setToolType(_toolCo2Data.type);
    }

    setOpenToolPopUp(true);
    setToolSerialFound(_toolCo2Data.sucess);
    setLoadingOpen(false);
  }

  function DialogWrongSN() {
    return (
      <div>
        <Dialog
          open={openToolPopUp && !toolSerialFound}
          onClose={handleCloseToolPopUp}
          aria-label="dialog-title"
          aria-describedby="dialog-description"
          fullWidth
          PaperProps={{
            sx: { backgroundColor: "pink", width: "60%", height: "20%" },
          }}
        >
          <DialogTitle id="dialog-title">
            <Box display="flex" alignItems="center">
              <Box flexGrow={1}>Wrong Serial Number</Box>
              <Box>
                <IconButton onClick={handleCloseToolPopUp}>
                  <CloseIcon />
                </IconButton>
              </Box>
            </Box>
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="dialog-description">
              Serial number <b>{serialNum}</b> does not exist!
            </DialogContentText>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  function DialogCorrectSN() {
    return (
      <div>
        <Dialog
          open={openToolPopUp && toolSerialFound}
          onClose={handleCloseToolPopUp}
          aria-label="dialog-title"
          aria-describedby="dialog-description"
          PaperProps={{ sx: { backgroundColor: "default" } }}
        >
          <DialogTitle id="dialog-title" align="center" sx={{ color: "white", backgroundColor: "rgba(25,118,210,1.0)", padding:1}}>
            <Box display="flex" alignItems="center">
              <Box flexGrow={1}>
              <ListItemText
                  primary="CO2 emission data"
                  primaryTypographyProps={{
                    fontSize: 30,
                    fontWeight: 'medium',
                    lineHeight: '40 px',
                    mb: '2px',
                  }}
                  secondary={`${toolType} with serial number ${serialNum}`}
                  secondaryTypographyProps={{
                    noWrap: true,
                    fontSize: 15,
                    variant: 'button',
                    lineHeight: '25px',
                    color : "white"
                  }}
                  sx={{ color: "white"}}
                />
              </Box>
              <Box>
                <IconButton onClick={handleCloseToolPopUp}>
                  <CloseIcon sx={{ color: "white"}}/>
                </IconButton>
              </Box>
            </Box>
          </DialogTitle>
          <DialogContent align="center">
            <Box sx={{ width: 1, height: 1 }} p={2} textAlign="center">
              <img src={toolCo2Values.imageUrl} width="60%" alt="bag photos" />
              <Box>
                <Box
                  display="grid"
                  gridTemplateColumns="repeat(12, 1fr)"
                  gridTemplateRows="repeat(10, 1fr)"
                  gap={1}
                >
                  <Box gridColumn="span 12" gridRow="span 4">
                    <Item>
                      <h4>TOTAL</h4>
                      <h1>
                        {(toolCo2Values.batery +
                          toolCo2Values.motor +
                          toolCo2Values.transportation).toFixed(2)}
                      </h1>
                    </Item>
                  </Box>
                  <Box gridColumn="span 4" gridRow="span 6">
                    <Item>
                      <h4>Motor</h4>
                      <h1>{toolCo2Values.motor}</h1>
                    </Item>
                  </Box>
                  <Box gridColumn="span 4" gridRow="span 6">
                    <Item>
                      <h4>Batery</h4>
                      <h1>{toolCo2Values.batery}</h1>
                    </Item>
                  </Box>
                  <Box gridColumn="span 4" gridRow="span 6">
                    <Item>
                      <h4>Transportation</h4>
                      <h1>{toolCo2Values.transportation}</h1>
                    </Item>
                  </Box>
                </Box>
              </Box>
            </Box>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography component="h1" variant="h5">
            Enter HPT Tool Serial Number
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="text"
              label="Tool Serial Number"
              name="text"
              autoFocus
              onChange={handleSerialNumChange}
            />
            <Button
              onClick={() => handleClickOpen()}
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Find Tool
            </Button>
            <Backdrop
              sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
              open={loadingOpen}
            >
              <CircularProgress color="inherit" />
            </Backdrop>
            {DialogWrongSN()}
            {DialogCorrectSN()}
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}
