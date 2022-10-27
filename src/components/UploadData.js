import * as React from "react";
import { useState } from "react";
import {LinearProgress} from '@mui/material';
import { createVendiaClient } from "@vendia/client";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import generatedVendiaData from "../data/export_to_vendia.json"

const client = createVendiaClient({
  apiUrl: `https://c3zxbm61ki.execute-api.us-west-2.amazonaws.com/graphql/`,
  websocketUrl: `wss://9b6jfh1m81.execute-api.us-west-2.amazonaws.com/graphql`,
  apiKey: "3426nYaSeCpMrUdhdgLqJLPbqJFrq6Vp2ANZnTxx9zJP",
});

export default function UploadedDataToVendia() {

  const [toolDataUploaded, setToolDataUploaded] = useState(0);
  const [motorDataUploaded, setMotorDataUploaded] = useState(0);
  const [batteryDataUploaded, setBatteryDataUploaded] = useState(0);
  const [seaShipmentDataUploaded, setSeaShipmentDataUploaded] = useState(0);
  const [landShipmentDataUploaded, setLandShipmentDataUploaded] = useState(0);
  const [seaRouteDataUploaded, setSeaRouteDataUploaded] = useState(0);
  const [landRouteDataUploaded, setLandRouteDataUploaded] = useState(0);
  const [loadDataComplete, setLoadDataComplete] = useState(false);
  const [loadDataInProgress, setLoadDataInProgress] = useState(false);

  const [toolDataTotal, setToolDataTotal] = useState(0);
  const [motorDataTotal, setMotorDataTotal] = useState(0);
  const [batteryDataTotal, setBatteryDataTotal] = useState(0);
  const [seaShipmentDataTotal, setSeaShipmentDataTotal] = useState(0);
  const [landShipmentDataTotal, setLandShipmentDataTotal] = useState(0);
  const [seaRouteDataTotal, setSeaRouteDataTotal] = useState(0);
  const [landRouteDataTotal, setLandRouteDataTotal] = useState(0);

  const [toolDataSkipped, setToolDataSkipped] = useState(0);
  const [motorDataSkipped, setMotorDataSkipped] = useState(0);
  const [batteryDataSkipped, setBatteryDataSkipped] = useState(0);
  const [seaShipmentDataSkipped, setSeaShipmentDataSkipped] = useState(0);
  const [landShipmentDataSkipped, setLandShipmentDataSkipped] = useState(0);
  const [seaRouteDataSkipped, setSeaRouteDataSkipped] = useState(0);
  const [landRouteDataSkipped, setLandRouteDataSkipped] = useState(0);

  const [toolDataDeleted, setToolDataDeleted] = useState(0);
  const [motorDataDeleted, setMotorDataDeleted] = useState(0);
  const [batteryDataDeleted, setBatteryDataDeleted] = useState(0);
  const [seaShipmentDataDeleted, setSeaShipmentDataDeleted] = useState(0);
  const [landShipmentDataDeleted, setLandShipmentDataDeleted] = useState(0);
  const [seaRouteDataDeleted, setSeaRouteDataDeleted] = useState(0);
  const [landRouteDataDeleted, setLandRouteDataDeleted] = useState(0);

  const addToolData = async (toolData) => {
    const { entities } = client;

    const toolTableResp = await entities.tool.list({
        filter: {
          serialNumber: {
            eq: toolData.serialNumber,
          },
        },
    });

    if(toolTableResp.items.length === 0) {
        const addResp = await entities.tool.add({
        "serialNumber": toolData.serialNumber,
        "toolType": toolData.toolType,
        "releaseDate": toolData.releaseDate,
        "motorSN": toolData.motorSN,
        "batterySN": toolData.batterySN});
        setToolDataUploaded(toolDataUploaded+1);
    }
    else{
        setToolDataSkipped(toolDataSkipped+1);
    }
  }

  const addMotorData = async (motorData) => {
    const { entities } = client;
    const resp = await entities.motor.list({
        filter: {
          serialNumber: {
            eq: motorData.serialNumber,
          },
        },
    });

    if(resp.items.length === 0) {
        const addResp = await entities.motor.add({
            "partNumber": motorData.partNumber,
            "serialNumber": motorData.serialNumber,
            "co2": parseFloat(motorData.co2),
            "dateManufactured": motorData.dateManufactured,
            "costManufactured": parseFloat(motorData.costManufactured),
            "salesPrice": parseFloat(motorData.salesPrice),
            "shipmentType": motorData.shipmentType,
            "shipmentID": motorData.shipmentID
        });
        setMotorDataUploaded(motorDataUploaded+1);
    }
    else{
        setMotorDataSkipped(motorDataSkipped+1);
    }
  }

  const addBatteryData = async (batteryData) => {
    const { entities } = client;
    const resp = await entities.battery.list({
        filter: {
          serialNumber: {
            eq: batteryData.serialNumber,
          },
        },
    });

    if(resp.items.length === 0) {
        const addResp = await entities.battery.add({
            "partNumber": batteryData.partNumber,
            "serialNumber": batteryData.serialNumber,
            "co2": parseFloat(batteryData.co2),
            "dateManufactured": batteryData.dateManufactured,
            "costManufactured": parseFloat(batteryData.costManufactured),
            "salesPrice": parseFloat(batteryData.salesPrice),
            "shipmentType": batteryData.shipmentType,
            "shipmentID": batteryData.shipmentID
        });
        setBatteryDataUploaded(batteryDataUploaded+1);
    }
    else{
        setBatteryDataSkipped(batteryDataSkipped+1);
    }
  }

  const addSeaShipmentData = async (seaShipmentData) => {
    const { entities } = client;

    const resp = await entities.seaShipment.list({
        filter: {
            trackingNumber: {
            eq: seaShipmentData.trackingNumber,
          },
        },
    });
    if(resp.items.length === 0) {
        const addResp = await entities.seaShipment.add({
            "trackingNumber": seaShipmentData.trackingNumber,
            "labourCost": parseFloat(seaShipmentData.labourCost),
            "shipID": seaShipmentData.shipID,
            "seaRouteID": seaShipmentData.seaRouteID
        });
        setSeaShipmentDataUploaded(seaShipmentDataUploaded+1);
    }
    else {
        setSeaShipmentDataSkipped(seaShipmentDataSkipped+1);
    }
  }

  const addLandShipmentData = async (landShipmentData) => {
    const { entities } = client;

    const resp = await entities.landShipment.list({
        filter: {
            trackingNumber: {
            eq: landShipmentData.trackingNumber,
          },
        },
    });
    if(resp.items.length === 0) {
        const addResp = await entities.landShipment.add({
            "trackingNumber": landShipmentData.trackingNumber,
            "labourCost": parseFloat(landShipmentData.labourCost),
            "truckID": landShipmentData.truckID,
            "landRouteID": landShipmentData.landRouteID
        });
        setLandShipmentDataUploaded(landShipmentDataUploaded+1);
    }
    else{
        setLandShipmentDataSkipped(landShipmentDataSkipped+1);
    }
  }

  const addSeaRouteData = async (seaRouteData) => {
    const { entities } = client;
    const resp = await entities.seaRoute.list({
        filter: {
            routeID: {
            eq: seaRouteData.routeID,
          },
        },
    });
    if(resp.items.length === 0) {
        const addResp = await entities.seaRoute.add({
        "routeID": seaRouteData.routeID,
        "fuelCost": parseFloat(seaRouteData.fuelCost),
        "co2": seaRouteData.co2
        });
        setSeaRouteDataUploaded(seaRouteDataUploaded+1);
    }
    else{
        setSeaRouteDataSkipped(seaRouteDataSkipped+1);
    }
  }

  const addLandRouteData = async (landRouteData) => {
    const { entities } = client;
    const resp = await entities.landRoute.list({
        filter: {
            routeID: {
            eq: landRouteData.routeID,
          },
        },
    });
    if(resp.items.length === 0) {
        const addResp = await entities.landRoute.add({
            "routeID": landRouteData.routeID,
            "fuelCost": parseFloat(landRouteData.fuelCost),
            "co2": landRouteData.co2
        });
        setLandRouteDataUploaded(landRouteDataUploaded+1);
    }
    else{
        setLandRouteDataSkipped(landRouteDataSkipped+1);
    }
  }

  async function UploadGeneratedVendiaData() {
    const toolData  = generatedVendiaData.tool;
    const motorData = generatedVendiaData.motor;
    const bateryData = generatedVendiaData.battery;
    const seaShipmentData = generatedVendiaData.seashipment;
    const landShipmentData = generatedVendiaData.landshipment;
    const seaRouteData = generatedVendiaData.searoute;
    const landRouteData = generatedVendiaData.landroute;

    setToolDataTotal(toolData.length);
    setMotorDataTotal(motorData.length);
    setBatteryDataTotal(bateryData.length);
    setSeaShipmentDataTotal(seaShipmentData.length);
    setLandShipmentDataTotal(landShipmentData.length);
    setSeaRouteDataTotal(seaRouteData.length);
    setLandRouteDataTotal(landRouteData.length);

    for(let i=0; i< toolData.length; i++){
        await addToolData(toolData[i]);
        console.log("added!");
    }
    console.log("Tool data uploaded");

    for(let i=0; i< motorData.length; i++){
        await addMotorData(motorData[i]);
        console.log("added!");
    }
    console.log("motor data uploaded");

    for(let i=0; i< bateryData.length; i++){
        await addBatteryData(bateryData[i]);
        console.log("added!");
    }
    console.log("battery data uploaded");

    for(let i=0; i< seaShipmentData.length; i++){
        await addSeaShipmentData(seaShipmentData[i]);
        console.log("added!");
    }
    console.log("seaShipmentData data uploaded");

    for(let i=0; i< landShipmentData.length; i++){
        await addLandShipmentData(landShipmentData[i]);
        console.log("added!");
    }
    console.log("landShipmentData data uploaded");

    for(let i=0; i< seaRouteData.length; i++){
        await addSeaRouteData(seaRouteData[i]);
        console.log("added!");
    }
    console.log("seaRouteData data uploaded");

    for(let i=0; i< landRouteData.length; i++){
        await addLandRouteData(landRouteData[i]);
        console.log("added!");
    }
    console.log("landRouteData data uploaded");

    setLoadDataComplete(true);
    console.log("done")

  }

  async function emptyToolTable(){
    const { entities } = client;

    while(true){
        const tableResp = await entities.tool.list();
        if(tableResp.items.length == 0) break;
        for(let i=0; i<tableResp.items.length; i++){
            await entities.tool.remove(tableResp.items[i]._id);
            console.log("Tool Deleted");
        }
    }
    while(true){
        const tableResp = await entities.motor.list();
        if(tableResp.items.length == 0) break;
        for(let i=0; i<tableResp.items.length; i++){
            await entities.motor.remove(tableResp.items[i]._id);
            console.log("Motor Deleted");
        }
    }
    while(true){
        const tableResp = await entities.battery.list();
        if(tableResp.items.length == 0) break;
        for(let i=0; i<tableResp.items.length; i++){
            await entities.battery.remove(tableResp.items[i]._id);
            console.log("Battery Deleted");
        }
    }
    while(true){
        const tableResp = await entities.landShipment.list();
        if(tableResp.items.length == 0) break;
        for(let i=0; i<tableResp.items.length; i++){
            await entities.landShipment.remove(tableResp.items[i]._id);
            console.log("LandShipment Deleted");
        }
    }
    while(true){
        const tableResp = await entities.seaShipment.list();
        if(tableResp.items.length == 0) break;
        for(let i=0; i<tableResp.items.length; i++){
            await entities.seaShipment.remove(tableResp.items[i]._id);
            console.log("SeaShipment Deleted");
        }
    }
    while(true){
        const tableResp = await entities.landRoute.list();
        if(tableResp.items.length == 0) break;
        for(let i=0; i<tableResp.items.length; i++){
            await entities.landRoute.remove(tableResp.items[i]._id);
            console.log("LandRoute Deleted");
        }
    }
    while(true){
        const tableResp = await entities.seaRoute.list();
        if(tableResp.items.length == 0) break;
        for(let i=0; i<tableResp.items.length; i++){
            await entities.seaRoute.remove(tableResp.items[i]._id);
            console.log("SeaRoute Deleted");
        }
    }
  }

  if(!loadDataInProgress){
    setLoadDataInProgress(true);
    //emptyToolTable();
    //UploadGeneratedVendiaData();
  }

  return (
    <div>
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>TableName</TableCell>
            <TableCell align="right">Upload Progress</TableCell>
            <TableCell align="right">Total</TableCell>
            <TableCell align="right">Added</TableCell>
            <TableCell align="right">Skipped</TableCell>
            <TableCell align="right">Deleted</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
            <TableRow
              key='Tool'
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">Tool Table</TableCell>
              <TableCell align="right"><LinearProgress variant="determinate" value={100*((toolDataUploaded+toolDataSkipped)/toolDataTotal)}/></TableCell>
              <TableCell align="right">{toolDataTotal}</TableCell>
              <TableCell align="right">{toolDataUploaded}</TableCell>
              <TableCell align="right">{toolDataSkipped}</TableCell>
              <TableCell align="right">{toolDataDeleted}</TableCell>
            </TableRow>

            <TableRow
              key='Motor'
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">Motor Table</TableCell>
              <TableCell align="right"><LinearProgress variant="determinate" value={100*((motorDataUploaded+motorDataSkipped)/motorDataTotal)}/></TableCell>
              <TableCell align="right">{motorDataTotal}</TableCell>
              <TableCell align="right">{motorDataUploaded}</TableCell>
              <TableCell align="right">{motorDataSkipped}</TableCell>
              <TableCell align="right">{motorDataDeleted}</TableCell>
            </TableRow>

            <TableRow
              key='Battery'
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">Battery Table</TableCell>
              <TableCell align="right"><LinearProgress variant="determinate" value={100*((batteryDataUploaded+batteryDataSkipped)/batteryDataTotal)}/></TableCell>
              <TableCell align="right">{batteryDataTotal}</TableCell>
              <TableCell align="right">{batteryDataUploaded}</TableCell>
              <TableCell align="right">{batteryDataSkipped}</TableCell>
              <TableCell align="right">{batteryDataDeleted}</TableCell>
            </TableRow>

            <TableRow
              key='SeaShipment'
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">SeaShipment Table</TableCell>
              <TableCell align="right"><LinearProgress variant="determinate" value={100*((seaShipmentDataUploaded+seaShipmentDataSkipped)/seaShipmentDataTotal)}/></TableCell>
              <TableCell align="right">{seaShipmentDataTotal}</TableCell>
              <TableCell align="right">{seaShipmentDataUploaded}</TableCell>
              <TableCell align="right">{seaShipmentDataSkipped}</TableCell>
              <TableCell align="right">{seaShipmentDataDeleted}</TableCell>
            </TableRow>

            <TableRow
              key='LandShipment'
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">LandShipment Table</TableCell>
              <TableCell align="right"><LinearProgress variant="determinate" value={100*((landShipmentDataUploaded+landShipmentDataSkipped)/landShipmentDataTotal)}/></TableCell>
              <TableCell align="right">{landShipmentDataTotal}</TableCell>
              <TableCell align="right">{landShipmentDataUploaded}</TableCell>
              <TableCell align="right">{landShipmentDataSkipped}</TableCell>
              <TableCell align="right">{landShipmentDataDeleted}</TableCell>
            </TableRow>

            <TableRow
              key='SeaRoute'
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">SeaRoute Table</TableCell>
              <TableCell align="right"><LinearProgress variant="determinate" value={100*((seaRouteDataUploaded+seaRouteDataSkipped)/seaRouteDataTotal)}/></TableCell>
              <TableCell align="right">{seaRouteDataTotal}</TableCell>
              <TableCell align="right">{seaRouteDataUploaded}</TableCell>
              <TableCell align="right">{seaRouteDataSkipped}</TableCell>
              <TableCell align="right">{seaRouteDataDeleted}</TableCell>
            </TableRow>

            <TableRow
              key='LandRoute'
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">LandRoute Table</TableCell>
              <TableCell align="right"><LinearProgress variant="determinate" value={100*((landRouteDataUploaded+landRouteDataSkipped)/landRouteDataTotal)}/></TableCell>
              <TableCell align="right">{landRouteDataTotal}</TableCell>
              <TableCell align="right">{landRouteDataUploaded}</TableCell>
              <TableCell align="right">{landRouteDataSkipped}</TableCell>
              <TableCell align="right">{landRouteDataDeleted}</TableCell>
            </TableRow>

        </TableBody>
        </Table>
    </TableContainer>
    </div>);
}
