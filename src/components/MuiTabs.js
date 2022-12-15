import React from 'react';

import { Box, Tab } from '@mui/material'
import {TabContext, TabList, TabPanel} from '@mui/lab'
import {useState} from 'react'
import Appbar from './Appbar';
import SearchByID from './SearchByID';
import HistData from './HistData';
import Login from './Login';
import AddNewTool from "./AddNewTool";
import ViewAndEditData from "./ViewAndEditData"
import {UserContext} from './UserContext';

export const MuiTabs = () => {
    const [value, setValue] = useState('1')

    const handleChange = (event, newValue) => {
        setValue(newValue)
    }
  return (
    <div>
        <Box>
        <TabContext value={value}>
            <Box sx={{borderBottom: 1, borderColor:'divider'}}>
                <TabList id='mainMenu' aria-label='Tabs example' 
                onChange={handleChange} 
                textColor='primary' 
                indicatorColor='primary'
                centered>
                    <Tab label='Search by Serial Number' value='1'></Tab>
                    <Tab label='Historical Data' value='2'></Tab>
                    <Tab label='Add New Tool' value='3' ></Tab>
                    <Tab label='View/Edit Data' value='4' ></Tab>

                </TabList>

            </Box>
            <TabPanel value='1' ><SearchByID/></TabPanel>
            <TabPanel value='2' ><HistData/></TabPanel>
            <TabPanel value='3' ><AddNewTool/></TabPanel>
            <TabPanel value='4' ><ViewAndEditData/></TabPanel>

        </TabContext>
        </Box>
    </div>
    
  )
}

export default MuiTabs
