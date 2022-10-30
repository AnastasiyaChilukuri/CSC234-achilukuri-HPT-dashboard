import * as React from "react";
import { useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import { getDataFromVendia } from "./Backend.js";

export default function ViewAndEditData() {
  const [value, setValue] = useState(0);
  const [tableLoaded, setTableLoaded] = useState(false);
  const [tableHeaders, setTableHeaders] = useState([]);
  const [tableData, setTableData] = useState([]);


  const listOfTableHeaders = [
    ["Serial Number", "Type", "Release Date", "Motor SNo.", "Battery SNo."],
    [
      "Part Number",
      "Serial Number",
      "Co2 for Production",
      "Sales Price",
      "Shipment Type",
      "ShipmentID",
    ],
    [
      "Part Number",
      "Serial Number",
      "Co2 for Production",
      "Sales Price",
      "Shipment Type",
      "ShipmentID",
    ],
    ["Tracking Number", "Labour Cost", "Ship  ID", "Sea Route ID"],
    ["Tracking Number", "Labour Cost", "truck ID", "Land Route ID"],
    ["Route ID", "Fuel Cost", "Co2 for transport"],
    ["Route ID", "Fuel Cost", "Co2 for transport"],
  ];


  const loadTable = async(tableIndex) => {
    setTableLoaded(false);
    const table = await getDataFromVendia(tableIndex);
    var data = [];
    for(var serial in table)
    {
        var row = [];
        for(var x in table[serial]){
            row.push(table[serial][x]);
        }
        data.push(row.slice(2, row.length));
    }
    //console.log(table);
    //const data = Array.from(table.keys());
    console.log(data);
    const headers = listOfTableHeaders[tableIndex];
    setTableHeaders(headers);
    setTableData(data);
    setTableLoaded(true);
  }

  const handleChange = (event, newValue) => {
    setValue(newValue);
    loadTable(newValue);
  };

  function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`vertical-tabpanel-${index}`}
        aria-labelledby={`vertical-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }

  function a11yProps(index) {
    return {
      id: `vertical-tab-${index}`,
      "aria-controls": `vertical-tabpanel-${index}`,
    };
  }

  function getTable() {
    return (<div>
      <TableContainer component={Paper}>
        <Table size="small" aria-label="simple table">
          <TableHead>
            <TableRow>
              {tableHeaders.map((header) => (
                <TableCell
                  sx={{
                    color: "white",
                    backgroundColor: "rgba(25,118,210,1.0)",
                    padding: 1,
                  }}
                >
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
          {tableData.map((row) => (
            <TableRow>
                {row.map((val)=>(
                    <TableCell>
                        {val}
                    </TableCell>
                ))}
            </TableRow>
          ))}
          </TableBody>

        </Table>
      </TableContainer></div>
    );
  };

  return (
    <div>
      <Tabs
        variant="scrollable"
        value={value}
        onChange={handleChange}
        aria-label="Vertical tabs example"
        sx={{ borderRight: 1, borderColor: "divider" }}
      >
        <Tab label="Tool" {...a11yProps(0)} />
        <Tab label="Motor" {...a11yProps(1)} />
        <Tab label="Battery" {...a11yProps(2)} />
        <Tab label="SeaShipment" {...a11yProps(3)} />
        <Tab label="LandShipment" {...a11yProps(4)} />
        <Tab label="SeaRoute" {...a11yProps(5)} />
        <Tab label="LandRoute" {...a11yProps(6)} />
      </Tabs>
      <TabPanel value={value} index={0}>
        {tableLoaded && getTable()}
      </TabPanel>
      <TabPanel value={value} index={1}>
        {tableLoaded && getTable()}
      </TabPanel>
      <TabPanel value={value} index={2}>
         {tableLoaded && getTable()}
      </TabPanel>
      <TabPanel value={value} index={3}>
        {tableLoaded && getTable()}
      </TabPanel>
      <TabPanel value={value} index={4}>
        {tableLoaded && getTable()}
      </TabPanel>
      <TabPanel value={value} index={5}>
        {tableLoaded && getTable()}
      </TabPanel>
      <TabPanel value={value} index={6}>
        {tableLoaded && getTable()}
      </TabPanel>
      </div>
  );
}
