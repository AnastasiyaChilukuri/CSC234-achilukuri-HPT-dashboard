import React, { useState, useContext } from "react";
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

const HistData = () => {

  const [token, setToken] = useState();

  const [user, setUser] = useState({ name: "", email: "" });
  const [error, setError] = useState("");
  const [toolPicturesLoaded, setToolPicturesLoaded] = useState(false);
  const [toolPictures, setToolPictures] = useState([]);
  const [openToolHistPopUp, setOpenToolHistPopUp] = useState(false);
  const [toolHistPopUpTitle, setToolHistPopUpTitle] = useState("");
  const {userToken, setUserToken} = useContext(UserContext);

  if(userToken.status == false) {
    return ( 
    <div>
      <Login textMsg="see historical data"/>
    </div>)

  }

  const handleCloseToolHistPopUp= () => {
    setOpenToolHistPopUp(false);
  };

  const getAllToolPictures = async () => {
    var _toolPictures = [];
    const { entities, storage } = client;
    const toolTypes = await entities.toolTypePic.list();
    for (let i = 0; i < toolTypes.items.length; i++) {
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
        _toolPicturesItem.title = item.toolType.toUpperCase();
        _toolPicturesItem.type = item.toolType;
        _toolPictures.push(_toolPicturesItem);
      }
    }
    console.log(_toolPictures);
    setToolPictures(_toolPictures);
    setToolPicturesLoaded(true);
  };

  function displayToolPictureGrid() {
    return (
      <div id="Top">
        <div id="Grid">
          <Container>
            <Backdrop
              sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
              open={!toolPicturesLoaded}
            >
              <CircularProgress color="inherit" />
            </Backdrop>
            <ImageList
              gap={12}
              sx={{
                mb: 8,
                gridTemplateColumns:
                  "repeat(auto-fill, minmax(280px, 1fr))!important",
              }}
            >
              {toolPictures.map((tool) => (
                <Card key={tool.title}>
                  <ImageListItem sx={{ height: "100% !important" }}>
                    <ImageListItemBar
                      sx={{
                        background:
                          "linear-gradient(to bottom, rgba(25,118,210,1.0)0%, rgba(25,118,210,0.3)70%, rgba(0,0,0,0)100%)",
                      }}
                      title={tool.title}
                      position="top"
                    />
                    <img
                      src={`${tool.img}&w=200&fit=crop&auto=format`}
                      srcSet={`${tool.img}&w=200&fit=crop&auto=format&dpr=2 2x`}
                      alt={tool.title}
                      loading="lazy"
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        setToolHistPopUpTitle(tool.type);
                        setOpenToolHistPopUp(true);
                      }}
                    />
                  </ImageListItem>
                </Card>
              ))}
            </ImageList>
          </Container>
        </div>
        <div id="Dialog">
          <Dialog
            open={openToolHistPopUp}
            onClose={handleCloseToolHistPopUp}
            aria-label="dialog-title"
          aria-describedby="dialog-description"
          PaperProps={{ sx: { backgroundColor: "default" } }}
        >
            <DialogTitle id="dialog-title">
              <Box display="flex" alignItems="center">
                <Box flexGrow={1}>{toolHistPopUpTitle}</Box>
                <Box>
                  <IconButton onClick={handleCloseToolHistPopUp}>
                    <CloseIcon />
                  </IconButton>
                </Box>
              </Box>
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="dialog-description">
                Historical data for tool
              </DialogContentText>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    );
  }

  /*function displayToolPictureGrid(){
        return (<div>
            <Backdrop
              sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
              open={!toolPicturesLoaded}
            >
              <CircularProgress color="inherit" />
            </Backdrop>
            <ImageList sx={{ width: 750, height: 600 }}>
                {toolPictures.map((item) => (
                    <ImageListItem key={item.img}>
                        <img
                        src={`${item.img}&w=248&fit=crop&auto=format`}
                        srcSet={`${item.img}&w=248&fit=crop&auto=format&dpr=2 2x`}
                        alt={item.title}
                        loading="lazy"
                        />
                    </ImageListItem>
                ))}
                </ImageList>

     </div>);
    }*/

  if (!toolPicturesLoaded) getAllToolPictures();

  return (
    <div className="App">
      {displayToolPictureGrid()}
    </div>
  );
};

export default HistData;
