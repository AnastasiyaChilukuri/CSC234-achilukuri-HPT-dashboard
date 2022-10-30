import React, { useContext, useState } from "react";
import Login from "./Login";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import ImageListItemBar from "@mui/material/ImageListItemBar";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    IconButton,
    Card,
    Container,
    Backdrop,
    Box,
    CircularProgress,
    Typography
  } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { UserContext } from "./UserContext";

import { createVendiaClient } from "@vendia/client";

const client = createVendiaClient({
  apiUrl: `https://c3zxbm61ki.execute-api.us-west-2.amazonaws.com/graphql/`,
  websocketUrl: `wss://9b6jfh1m81.execute-api.us-west-2.amazonaws.com/graphql`,
  apiKey: "3426nYaSeCpMrUdhdgLqJLPbqJFrq6Vp2ANZnTxx9zJP",
});

const AddNewTool = () => {
    const {userToken, setUserToken} = useContext(UserContext);

    if(userToken.status == false) {
        return <Login textMsg={"add new tool"}/>
    }
    else if (userToken.role != "admin") {
        return (
            <div>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }} align='center'>
                    {userToken.email} user does not have enough permissions to add a new tool
                </Typography>
            </div>
        )
    }

  return (
    <div className="App">
      <h1>AddNewTool Form Here</h1>
      {console.log(userToken)}
      <div>{userToken.email}</div>
    </div>
  );
};

export default AddNewTool;
