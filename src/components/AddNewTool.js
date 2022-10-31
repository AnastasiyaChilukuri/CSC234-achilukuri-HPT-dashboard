import React, { useContext, useState } from "react";
import Login from "./Login";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import ImageListItemBar from "@mui/material/ImageListItemBar";
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
  MenuItem,
  InputLabel,
  List,
  ListItem
} from "@mui/material";
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';

import Select, { SelectChangeEvent } from '@mui/material/Select';

import CloseIcon from "@mui/icons-material/Close";
import { UserContext } from "./UserContext";

import { createVendiaClient } from "@vendia/client";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import dayjs, { Dayjs } from "dayjs";
import {addTool} from "./Backend";

const client = createVendiaClient({
  apiUrl: `https://c3zxbm61ki.execute-api.us-west-2.amazonaws.com/graphql/`,
  websocketUrl: `wss://9b6jfh1m81.execute-api.us-west-2.amazonaws.com/graphql`,
  apiKey: "3426nYaSeCpMrUdhdgLqJLPbqJFrq6Vp2ANZnTxx9zJP",
});

const toolTypesMap = {
  "Hammer Drill": "hammerDrill",
  "Angle Drill": "angleDrill",
  "Rotary Drill": "rotaryDrill",
  "Compact Drill": "compactDrill",
  "Mixer Drill": "mixerDrill",
  "Precussion Drill": "percussionDrill",
  "HammerDrill Bulldog": "hammerDrillBulldog",
};

const AddNewTool = () => {
  const { userToken, setUserToken } = useContext(UserContext);
  const [toolSerial, setToolSerial] = useState("");
  const [toolSerialError, setToolSerialError] = useState("");
  const [toolType, setToolType] = useState("");
  const [toolTypeError, setToolTypeError] = useState("");
  const [motorSerial, setMotorSerial] = useState("");
  const [motorSerialError, setMotorSerialError] = useState("");
  const [batterySerial, setBatterySerial] = useState("");
  const [batterySerialError, setBatterySerialError] = useState("");
  const [inProcess, setInProcess] = useState(false);
  const [openAddToolResultPopUpSucess, setOpenAddToolResultPopUpSucess] = useState(false);
  const [openAddToolResultPopUpFail, setOpenAddToolResultPopUpFail] = useState(false);
  const [addToolFailedMsg, setAddToolFailedMsg] = useState([]);


  const [toolReleaseDate, setToolReleaseDate] = useState(dayjs("2014-08-18"));

  const handleReleaseDateChange = (newValue) => {
    setToolReleaseDate(newValue);
  };

  
  function showAddToolResult(){
    return (
      <div>
        <Dialog
          open={openAddToolResultPopUpSucess}
          onClose={()=>setOpenAddToolResultPopUpSucess(false)}
          aria-label="dialog-title"
          aria-describedby="dialog-description"
          fullWidth
          PaperProps={{
            sx: { backgroundColor: "default", width: "60%", height: "40%" },
          }}
        >
          <DialogTitle id="dialog-title">
            <Box display="flex" alignItems="center">
              <Box flexGrow={1}> Sucess</Box>
              <Box>
                <IconButton onClick={()=>setOpenAddToolResultPopUpSucess(false)}>
                  <CloseIcon />
                </IconButton>
              </Box>
            </Box>
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="dialog-description">
              Sucessfully added tool
            </DialogContentText>
          </DialogContent>
        </Dialog>

        <Dialog
          open={openAddToolResultPopUpFail}
          onClose={()=>setOpenAddToolResultPopUpFail(false)}
          aria-label="dialog-title"
          aria-describedby="dialog-description"
          fullWidth
          PaperProps={{
            sx: { backgroundColor:"pink", width: "60%", height: "40%" },
          }}
        >
          <DialogTitle id="dialog-title">
            <Box display="flex" alignItems="center">
              <Box flexGrow={1}> Failure </Box>
              <Box>
                <IconButton onClick={()=>setOpenAddToolResultPopUpFail(false)}>
                  <CloseIcon />
                </IconButton>
              </Box>
            </Box>
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="dialog-description">
            <List aria-labelledby="basic-list-demo">

            {addToolFailedMsg.length >0 && addToolFailedMsg.map((msg) => (
              <ListItem>{msg}</ListItem>
            ))}
            </List>
            </DialogContentText>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  const handleAddTool = async () => {
    setToolSerialError("");
    var errors = false;
    if(toolSerial===""){
      setToolSerialError("Serial number is Required");
      errors = true;
    }
    if(batterySerial===""){
      setBatterySerialError("Battery Serial number is Required");
      errors = true;
    }
    if(motorSerial===""){
      setMotorSerialError("Motor Serial number is Required");
      errors = true;
    }
    if(toolType===""){
      setToolTypeError("Tool Type is Required");
      errors = true;
    }
    if(errors) return;
    console.log(toolSerial);
    console.log(batterySerial);
    console.log(motorSerial);
    console.log(toolTypesMap[toolType]);
    console.log(toolReleaseDate.format('YYYY-MM-DD'));
    var toolData =     {
      batterySN: batterySerial,
      motorSN: motorSerial,
      releaseDate: toolReleaseDate.format('YYYY-MM-DD'),
      serialNumber: toolSerial,
      toolType: toolTypesMap[toolType]}
    setInProcess(true);
    const res= await addTool(toolData);
    console.log(res);
    setAddToolFailedMsg(res.error);
    setOpenAddToolResultPopUpSucess(res.sucess);
    setOpenAddToolResultPopUpFail(!res.sucess);
    setInProcess(false);
  };

  if (userToken.status == false) {
    return <Login textMsg={"add new tool"} />;
  } else if (userToken.role != "admin") {
    return (
      <div>
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1 }}
          align="center"
        >
          {userToken.email} user does not have enough permissions to add a new
          tool
        </Typography>
      </div>
    );
  }

  function AddNewToolForm() {
    var toolTypes = [];
    for (var type in toolTypesMap) {
      toolTypes.push(type);
    }
    return (
      <div>
        <Backdrop
              sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
              open={inProcess}
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
                    Add a new Tool
                  </Typography>
                </Grid>
                <Grid item>
                  <TextField
                    fullWidth
                    label="Tool Serial Number"
                    placeholder="Enter the tool serial number"
                    variant="outlined"
                    onChange={(e) => {
                      setToolSerialError("");
                      setToolSerial(e.target.value);}}
                    error= {(toolSerialError!=="")}
                    helperText={(toolSerialError==="")?"":toolSerialError}
                    disabled={inProcess}
                  ></TextField>
                </Grid>
                <Grid item>
                <InputLabel id="demo-simple-select-filled-label">Tool Type</InputLabel>
                <Select
                  fullWidth
                  labelId="demo-simple-select-filled-label"
                  id="demo-simple-select-filled"
                  value={toolType}
                  onChange={(e) => {
                    setToolTypeError("");
                    setToolType(e.target.value);}}
                  error = {toolTypeError!=""}
                  disabled={inProcess}
                  >
                    {toolTypes.map((type) => (
                      <MenuItem value={type}>{type}</MenuItem>
                    ))}
                  </Select>
                </Grid>
                <Grid item>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DesktopDatePicker
                      fullWidth
                      label="Tool Release date"
                      inputFormat="MM/DD/YYYY"
                      value={toolReleaseDate}
                      onChange={handleReleaseDateChange}
                      renderInput={(params) => <TextField {...params} />}
                      disabled={inProcess}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid item>
                  <TextField
                    fullWidth
                    label="Motor Serial Number"
                    placeholder="Enter the motor serial number"
                    variant="outlined"
                    onChange={(e) => {
                      setMotorSerialError("");
                      setMotorSerial(e.target.value);}}
                    error= {(motorSerialError!=="")}
                    helperText={(motorSerialError==="")?"":motorSerialError}
                    disabled={inProcess}

                  ></TextField>
                </Grid>
                <Grid item>
                  <TextField
                    fullWidth
                    label="Battery Serial Number"
                    placeholder="Enter the battery serial number"
                    variant="outlined"
                    onChange={(e) => {
                      setBatterySerialError("");
                      setBatterySerial(e.target.value);}}
                    error= {(batterySerialError!=="")}
                    helperText={(batterySerialError==="")?"":batterySerialError}
                    disabled={inProcess}

                    ></TextField>
                </Grid>
                <Grid item>
                  <Button
                    variant="contained"
                    fullWidth
                    type="submit"
                    onClick={handleAddTool}
                    disabled={inProcess}

                  >
                    Add Tool
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Container>
        {showAddToolResult()}
      </div>
      
    );
  }

  return AddNewToolForm();
};

export default AddNewTool;
