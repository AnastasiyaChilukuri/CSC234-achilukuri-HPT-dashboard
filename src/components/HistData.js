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
  import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js'
  import { Chart } from 'react-chartjs-2'
  import { Line } from 'react-chartjs-2';
  import CloseIcon from "@mui/icons-material/Close";
  import {getYearlyCo2EmissionOfToolType, getAllToolPictures} from "./Backend.js"
import { UserContext } from "./UserContext";


  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  )



const HistData = () => {

  const [token, setToken] = useState();

  const [user, setUser] = useState({ name: "", email: "" });
  const [error, setError] = useState("");
  const [toolPicturesLoaded, setToolPicturesLoaded] = useState(false);
  const [toolPictures, setToolPictures] = useState([]);
  const [openToolHistPopUp, setOpenToolHistPopUp] = useState(false);
  const [toolHistPopUpTitle, setToolHistPopUpTitle] = useState("");
  const {userToken, setUserToken} = useContext(UserContext);
  const [graphOptions, setGraphOptions] = useState({});
  const [graphData, setGraphData] = useState({});

  if(userToken.status == false) {
    return ( 
    <div>
      <Login textMsg="see historical data"/>
    </div>)

  }
  


  const handleCloseToolHistPopUp = () => {
    setOpenToolHistPopUp(false);
  };

  const handleOpenToolHistPopUp = async (_toolType) => {
    const yearlyData = await getYearlyCo2EmissionOfToolType(_toolType);
    const _graphOptions = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Yearly AVG co2 emission for tool of type : ' + _toolType,
        },
      },
    };
    var year_lables = [];
    var year_avgs = [];
    for(const year in yearlyData){
      year_lables.push(year);
      year_avgs.push(yearlyData[year]);
    }
    const _graphData = {
      labels: year_lables,
      datasets: [{
        label: 'Yearly Avg',
        data: year_avgs,
        fill: false,
        borderColor: 'rgb(25,118,210)',
        tension: 0.1
      }]
    };
    setGraphOptions(_graphOptions);
    setGraphData(_graphData);
    setOpenToolHistPopUp(true);
  };

  const getAllToolPicturesFromBacked = async () => {
    const _toolPictures = await getAllToolPictures();
    setToolPictures(_toolPictures);
    setToolPicturesLoaded(true);
  }

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
                        handleOpenToolHistPopUp(tool.type);
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
          fullWidth
          maxWidth="lg"
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
                <Line options={graphOptions} data={graphData} />
              </DialogContentText>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    );
  }

  if (!toolPicturesLoaded) getAllToolPicturesFromBacked();

  return (
    <div className="App">
      {displayToolPictureGrid()}
    </div>
  );
};

export default HistData;
