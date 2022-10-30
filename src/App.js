import React from 'react';

import { Box, Tab } from '@mui/material'
import {TabContext, TabList, TabPanel} from '@mui/lab'
import {useState} from 'react'

import './components/MuiTabs'
import Appbar from './components/Appbar';

const App = () => {

  return (
    <div>
        <Appbar/>
    </div>
  )
}

export default App
