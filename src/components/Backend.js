import React from 'react';
import { createVendiaClient } from "@vendia/client";

const client = createVendiaClient({
    apiUrl: `https://c3zxbm61ki.execute-api.us-west-2.amazonaws.com/graphql/`,
    websocketUrl: `wss://9b6jfh1m81.execute-api.us-west-2.amazonaws.com/graphql`,
    apiKey: "3426nYaSeCpMrUdhdgLqJLPbqJFrq6Vp2ANZnTxx9zJP",
});

const toolTitleMap = {
    "hammerDrill" : "Hammer Drill",
    "angleDrill" : "Angle Drill",
    "rotaryDrill" : "Rotary Drill",
    "compactDrill" : "Compact Drill",
    "mixerDrill" : "Mixer Drill",
    "percussionDrill" : "Precussion Drill",
    "hammerDrillBulldog" : "HammerDrill Bulldog"
};

var toolTableData ={};
var motorTableData ={};
var batteryTableData={};
var seaShipmentTableData={};
var landShipmentTableData={};
var seaRouteTableData={};
var landRouteTableData={};

const loadDataFromVendia = async() => {
    const { entities } = client;

    const toolTableResp = await entities.tool.list();
    toolTableData={};
    for(let i=0; i<toolTableResp.items.length;i++)
    {
        toolTableData[toolTableResp.items[i].serialNumber] = toolTableResp.items[i];
    }

    const motorTableResp = await entities.motor.list();
    motorTableData={};
    for(let i=0; i<motorTableResp.items.length;i++)
    {
        motorTableData[motorTableResp.items[i].serialNumber] = motorTableResp.items[i];
    }

    const batteryTableResp = await entities.battery.list();
    batteryTableData={};
    for(let i=0; i<batteryTableResp.items.length;i++)
    {
        batteryTableData[batteryTableResp.items[i].serialNumber] = batteryTableResp.items[i];
    }

    const seaShipmentTableResp = await entities.seaShipment.list();
    seaShipmentTableData={};
    for(let i=0; i<seaShipmentTableResp.items.length;i++)
    {
        seaShipmentTableData[seaShipmentTableResp.items[i].trackingNumber] = seaShipmentTableResp.items[i];
    }

    const landShipmentTableResp = await entities.landShipment.list();
    landShipmentTableData={};
    for(let i=0; i<landShipmentTableResp.items.length;i++)
    {
        landShipmentTableData[landShipmentTableResp.items[i].trackingNumber] = landShipmentTableResp.items[i];
    }

    const seaRouteTableResp = await entities.seaRoute.list();
    seaRouteTableData={};
    for(let i=0; i<seaRouteTableResp.items.length;i++)
    {
        seaRouteTableData[seaRouteTableResp.items[i].routeID] = seaRouteTableResp.items[i];
    }

    const landRouteTableResp = await entities.landRoute.list();
    landRouteTableData={};
    for(let i=0; i<landRouteTableResp.items.length;i++)
    {
        landRouteTableData[landRouteTableResp.items[i].routeID] = landRouteTableResp.items[i];
    }

    tables = [
      toolTableData,
      motorTableData,
      batteryTableData,
      seaShipmentTableData,
      landShipmentTableData,
      seaRouteTableData,
      landRouteTableData
    ];
}

var tables = [
  toolTableData,
  motorTableData,
  batteryTableData,
  seaShipmentTableData,
  landShipmentTableData,
  seaRouteTableData,
  landRouteTableData
];

export const deleteTool = async (_id_of_tool_record) => {
  const { entities } = client;
  const response = await entities.tool.remove(_id_of_tool_record);
}

export const addTool = async (_toolData) =>{
  const { entities } = client;
  await loadDataFromVendia();
  var errorMsg = [];
  if(_toolData.serialNumber in toolTableData){
    errorMsg.push("Provided Tool Serial number is being used by an existing tool!");
  }
  var batteries_in_use = [];
  var motors_in_use = [];
  for(var sno in toolTableData)
  {
    batteries_in_use.push(toolTableData[sno].batterySN);
    motors_in_use.push(toolTableData[sno].motorSN);
  }
  if(batteries_in_use.includes(_toolData.batterySN)){
    errorMsg.push("Battery Serial number is being used by an existing tool!");
  }
  if(motors_in_use.includes(_toolData.motorSN)){
    errorMsg.push("Motor Serial number is being used by an existing tool!");
  }
  if(errorMsg.length == 0){
    await entities.tool.add(_toolData);
    return {sucess: true, error:["Tool Added!"]};
  }
  return {sucess:false, error:errorMsg};

}

export const getDataFromVendia = async (tableIndex) => {
  await loadDataFromVendia();
  return tables[tableIndex];
}

const getCo2DataOfShippmentByID = (_shipmentID, shipmentType) => {
    var shipmentCo2 = 0;
    const shipmentTable = shipmentType == "sea" ? seaShipmentTableData : landShipmentTableData;
    const routeTable = shipmentType == "sea" ? seaRouteTableData : landRouteTableData;
    if(_shipmentID in shipmentTable){
      var _routeId = shipmentType == "sea" ? shipmentTable[_shipmentID].seaRouteID : shipmentTable[_shipmentID].landRouteID;
      if(_routeId in routeTable){
        shipmentCo2 = routeTable[_routeId].co2;
      }
    }
    return shipmentCo2;
  }

const getCo2DataOfBatteryBySerialNo = (serialNo) => {
    var co2Return = {bateryCo2 : 0, transportationCo2 : 0};

    if(serialNo in batteryTableData){
        const shipmentType = batteryTableData[serialNo].shipmentType;
        const shipmentID = batteryTableData[serialNo].shipmentID;
        co2Return.bateryCo2 = batteryTableData[serialNo].co2;
        co2Return.transportationCo2 = getCo2DataOfShippmentByID(shipmentID, shipmentType);
    }
    return co2Return;
  }

const getCo2DataOfMotorBySerialNo = (serialNo) => {
    var co2Return = {motorCo2 : 0, transportationCo2 : 0};

    if(serialNo in motorTableData){
      const shipmentType = motorTableData[serialNo].shipmentType;
      const shipmentID = motorTableData[serialNo].shipmentID;
      co2Return.motorCo2 = motorTableData[serialNo].co2;
      co2Return.transportationCo2 = getCo2DataOfShippmentByID(shipmentID, shipmentType);
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

const getCo2DataOfTool = async (_toolEnityRecord, isImageNeeded) => {
    var _toolCo2Data = {
        sucess : false,
        imageUrl : "",
        motor: 0,
        batery: 0,
        transportation: 0,
        type: ""};
    const motorSN = _toolEnityRecord.motorSN;
    const baterySN = _toolEnityRecord.batterySN;
    const toolType = _toolEnityRecord.toolType;
    const motorCo2Return = getCo2DataOfMotorBySerialNo(motorSN);
    const batteryCo2Return = getCo2DataOfBatteryBySerialNo(baterySN);

    _toolCo2Data.sucess = true;
    if(isImageNeeded){
        _toolCo2Data.imageUrl = await getToolImageUrl(toolType);
    }
    _toolCo2Data.motor = motorCo2Return.motorCo2;
    _toolCo2Data.batery = batteryCo2Return.bateryCo2;
    _toolCo2Data.transportation = (parseFloat(motorCo2Return.transportationCo2) + parseFloat(batteryCo2Return.transportationCo2)).toFixed(3);
    _toolCo2Data.transportation = parseFloat(_toolCo2Data.transportation);
    _toolCo2Data.type = toolTitleMap[toolType];
    return _toolCo2Data;
}

export const getCo2DataOfToolBySerialNo = async (serialNo) => {
    var _toolCo2Data = {
    sucess : false,
    imageUrl : "",
    motor: 0,
    batery: 0,
    transportation: 0};
    await loadDataFromVendia();
    if(serialNo in toolTableData){
        _toolCo2Data = await getCo2DataOfTool(toolTableData[serialNo], true);
    }
    return _toolCo2Data;
};

export const getYearlyCo2EmissionOfToolType = async (_tooltype) =>{
    const { entities } = client;
    const ret = await loadDataFromVendia();
    var yearlyData = {};
    var yearlyAvg = {};
    for(const serialNo in toolTableData){
        if(toolTableData[serialNo].toolType == _tooltype){
            const manfYear = toolTableData[serialNo].releaseDate.split("-")[0];
            if(!(manfYear in yearlyData)){
                yearlyData[manfYear] = {runningTotalOfCo2:0, numberOfTools:0};
            }
            const toolCo2Values = await getCo2DataOfTool(toolTableData[serialNo], false);
            yearlyData[manfYear].runningTotalOfCo2 += parseFloat(parseFloat(toolCo2Values.batery +
                toolCo2Values.motor +
                toolCo2Values.transportation).toFixed(2));
            yearlyData[manfYear].numberOfTools += 1;
        }
    }
    for(const year in yearlyData){
        yearlyAvg[year] = yearlyData[year].runningTotalOfCo2/yearlyData[year].numberOfTools;
    }
    console.log(yearlyAvg);
    return yearlyAvg;
  }

export const getAllToolPictures = async () => {
    var _toolPictures = [];
    const { entities, storage } = client;
    const toolTypes = await entities.toolTypePic.list();
    for (let i = 0; i < toolTypes.items.length; i++) {
      console.log(toolTypes.items[i].toolType);
      var item = toolTypes.items[i];
      const fileListResp = await storage.files.list({
        filter: {
          sourceKey: {
            eq: item.toolPic,
          },
        },
      });
      //console.log(fileListResp);
      if (fileListResp.items.length > 0) {
        var _toolPicturesItem = {};
        _toolPicturesItem.img = fileListResp.items[0].temporaryUrl;
        _toolPicturesItem.title = toolTitleMap[item.toolType];
        _toolPicturesItem.type = item.toolType;
        _toolPictures.push(_toolPicturesItem);
      }
    }
    console.log(_toolPictures);
    return _toolPictures;
  };