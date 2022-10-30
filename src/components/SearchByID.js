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
import { createVendiaClient } from "@vendia/client";

const client = createVendiaClient({
  apiUrl: `https://c3zxbm61ki.execute-api.us-west-2.amazonaws.com/graphql/`,
  websocketUrl: `wss://9b6jfh1m81.execute-api.us-west-2.amazonaws.com/graphql`,
  apiKey: "3426nYaSeCpMrUdhdgLqJLPbqJFrq6Vp2ANZnTxx9zJP",
});

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
    getCo2DataOfToolBySerialNo(serialNum);
  }

  const handleCloseToolPopUp= () => {
    setOpenToolPopUp(false);
  };

  const getCo2DataOfShippmentByID = async (_shipmentID, shipmentType) => {
    var shipmentCo2 = 0;
    const { entities } = client;
    const shipmentTable = shipmentType == "sea" ? entities.seaShipment : entities.landShipment;
    const shipmentTableResp = await shipmentTable.list({
      filter: {
        trackingNumber: {
          eq: _shipmentID,
        },
      },
    });
    if(shipmentTableResp.items.length > 0){
      var _routeId = shipmentType == "sea" ? shipmentTableResp.items[0].seaRouteID : shipmentTableResp.items[0].landRouteID;
      var routeTableResp;
      if(shipmentType == "sea"){
        routeTableResp = await entities.seaRoute.list({
          filter: {
            routeID: {
              eq: _routeId,
            },
          },
        });

      }
      else{
        routeTableResp = await entities.landRoute.list({
          filter: {
            routeID: {
              eq: _routeId,
            },
          },
        });
      }
      if(routeTableResp.items.length > 0){
        shipmentCo2 = routeTableResp.items[0].co2;
      }
    }
    return shipmentCo2;
  }

  const getCo2DataOfBatteryBySerialNo = async (serialNo) => {
    var co2Return = {bateryCo2 : 0, transportationCo2 : 0};

    const { entities } = client;
    const batteryTableResp = await entities.battery.list({
      filter: {
        serialNumber: {
          eq: serialNo,
        },
      },
    });
    if(batteryTableResp.items.length > 0){
      const shipmentType = batteryTableResp.items[0].shipmentType;
      const shipmentID = batteryTableResp.items[0].shipmentID;
      co2Return.bateryCo2 = batteryTableResp.items[0].co2;
      co2Return.transportationCo2 = await getCo2DataOfShippmentByID(shipmentID, shipmentType);
    }
    return co2Return;
  }

  const getCo2DataOfMotorBySerialNo = async (serialNo) => {
    var co2Return = {motorCo2 : 0, transportationCo2 : 0};
    const { entities } = client;
    const motorTableResp = await entities.motor.list({
      filter: {
        serialNumber: {
          eq: serialNo,
        },
      },
    });
    if(motorTableResp.items.length > 0){
      const shipmentType = motorTableResp.items[0].shipmentType;
      const shipmentID = motorTableResp.items[0].shipmentID;
      co2Return.motorCo2 = motorTableResp.items[0].co2;
      co2Return.transportationCo2 = await getCo2DataOfShippmentByID(shipmentID, shipmentType);
    }
    return co2Return;
  }

  const getToolImageUrl = async (_toolType) =>{
    var imageUrl = "";
    const { entities , storage} = client;
    const toolTypeTableResp = await entities.toolTypePic.list({
      filter: {
        toolType: {
          eq: _toolType,
        },
      },
    });

    if (toolTypeTableResp.items.length > 0){
      const fileListResp = await storage.files.list({
        filter: {
          sourceKey: {
            eq: toolTypeTableResp.items[0].toolPic,
          },
        },
      });
      if(fileListResp.items.length > 0) {
        imageUrl = fileListResp.items[0].temporaryUrl;
      }
    }

    return imageUrl;
  }

  const getCo2DataOfToolBySerialNo = async (serialNo) => {
    var _toolCo2Data = {imageUrl : "",
    motor: 0,
    batery: 0,
    transportation: 0};
    const { entities } = client;
    const toolTableResp = await entities.tool.list({
      filter: {
        serialNumber: {
          eq: serialNo,
        },
      },
    });
    console.log(toolTableResp);
    if(toolTableResp.items.length > 0){
      const motorSN = toolTableResp.items[0].motorSN;
      const baterySN = toolTableResp.items[0].batterySN;
      const toolType = toolTableResp.items[0].toolType;
      const motorCo2Return = await getCo2DataOfMotorBySerialNo(motorSN);
      const batteryCo2Return = await getCo2DataOfBatteryBySerialNo(baterySN);
      const imageUrl = await getToolImageUrl(toolType);
      _toolCo2Data.imageUrl = imageUrl;
      _toolCo2Data.motor = motorCo2Return.motorCo2;
      _toolCo2Data.batery = batteryCo2Return.bateryCo2;
      _toolCo2Data.transportation = (parseFloat(motorCo2Return.transportationCo2) + parseFloat(batteryCo2Return.transportationCo2)).toFixed(3);
      _toolCo2Data.transportation = parseFloat(_toolCo2Data.transportation);
      setToolCo2Values(_toolCo2Data);
      setToolType(toolType);
    }
//    console.log(this.state.toolCo2Values);
    setOpenToolPopUp(true);
    setToolSerialFound(toolTableResp.items.length > 0);
    setLoadingOpen(false);
  };

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
          <DialogTitle id="dialog-title" align="center">
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
                  }}
                  sx={{ my: 0 }}
                />
              </Box>
              <Box>
                <IconButton onClick={handleCloseToolPopUp}>
                  <CloseIcon />
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
