import React, { useState, useContext } from "react";
import Login from "./Login";
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import ImageListItemBar from "@mui/material/ImageListItemBar";
import ListItemText from '@mui/material/ListItemText';

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
} from "chart.js";
import { Chart } from "react-chartjs-2";
import { Line } from "react-chartjs-2";
import CloseIcon from "@mui/icons-material/Close";
import {
  getYearlyCo2EmissionOfToolType,
  getAllToolPictures,
} from "./Backend.js";
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { padding } from "@mui/system";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const HistData = () => {

  const [token, setToken] = useState();

  const [user, setUser] = useState({ name: "", email: "" });
  const [error, setError] = useState("");
  const [toolPicturesLoaded, setToolPicturesLoaded] = useState(false);
  const [toolPictures, setToolPictures] = useState([]);
  const [openToolHistPopUp, setOpenToolHistPopUp] = useState(false);
  const [toolHistPopUpTitle, setToolHistPopUpTitle] = useState("");
  const [toolHistPopUpImgUrl, setToolHistPopUpImgUrl] = useState("");
  const {userToken, setUserToken} = useContext(UserContext);
  const [graphOptions, setGraphOptions] = useState({});
  const [graphData, setGraphData] = useState({});
  const [graphLoaded, setGraphLoaded] = useState(false);
  const [yearlyDataFromVendia, setYearlyDataFromVendia] = useState({});  if(userToken.status == false) {
    return ( 
    <div>
      <Login textMsg="see historical data"/>
    </div>)

  }
  


  const handleCloseToolHistPopUp = () => {
    setOpenToolHistPopUp(false);
    setGraphLoaded(false);
  };

  const handleOpenToolHistPopUp = async (_toolType, toolTitle) => {
    setOpenToolHistPopUp(true);

    const yearlyData = await getYearlyCo2EmissionOfToolType(_toolType);
    const _graphOptions = {
      scales: {
        x: {
          display: true,
          title: {
            display: true,
            text: 'Release year'
          }
        },
        y: {
          display: true,
          title: {
            display: true,
            text: 'Co2 Emmission'
          },
          ticks: {
                // Include a dollar sign in the ticks
                callback: function(value, index, ticks) {
                    return value + ' ppm';
                }
            }
        }
      },
      responsive: true,
      plugins: {
        legend: {
          position: "top",
        },
        title: {
          display: true,
          text: "Yearly AVG co2 emission for " + toolTitle,
        },
      }
    };
    var _yearlyDataFromVendia = [];
    var year_lables = [];
    var year_avgs = [];
    for (const year in yearlyData) {
      year_lables.push(year);
      year_avgs.push(yearlyData[year]);
      _yearlyDataFromVendia.push({"year":year, "avg":parseFloat(yearlyData[year]).toFixed(2)});
    }
    const _graphData = {
      labels: year_lables,
      datasets: [
        {
          label: "Yearly Avg",
          data: year_avgs,
          fill: false,
          borderColor: "rgb(25,118,210)",
          tension: 0.1,
        },
      ],
    };
    setGraphOptions(_graphOptions);
    setGraphData(_graphData);
    setYearlyDataFromVendia(_yearlyDataFromVendia);
    setGraphLoaded(true);
  };

  const getAllToolPicturesFromBacked = async () => {
    const _toolPictures = await getAllToolPictures();
    setToolPictures(_toolPictures);
    setToolPicturesLoaded(true);
  };

  function tableWithYearlyAvg(){
    return(
      <TableContainer component={Paper}>
      <Table aria-label="simple table">
    <TableHead>
      <TableRow>
        <TableCell sx={{ color: "white", backgroundColor: "rgba(25,118,210,1.0)", padding:1}} >Release Year</TableCell>
        <TableCell sx={{ color: "white", backgroundColor: "rgba(25,118,210,1.0)", padding:1}} align="right">Avg. Co2 Emitted</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {yearlyDataFromVendia.map((row) => (
        <TableRow
          key={row.year}
          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
        >
          <TableCell component="th" scope="row" sx={{ padding: 1 }}>
            {row.year}
          </TableCell>
          <TableCell align="right" sx={{ padding: 1 }}>{row.avg}</TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table></TableContainer>)
  }

  function dialogPopupWithGraphAndTable() {
    return(
      <Dialog
            open={openToolHistPopUp}
            onClose={handleCloseToolHistPopUp}
            aria-label="dialog-title"
            aria-describedby="dialog-description"
            PaperProps={{ sx: { backgroundColor: "default" } }}
            fullWidth
            maxWidth="lg"
          >
            <DialogTitle id="dialog-title" align="center" sx={{ color: "white", backgroundColor: "rgba(25,118,210,1.0)", padding:1}}>
              <Box display="flex" alignItems="center">
                <Box flexGrow={1}>
                <ListItemText
                  primary={`Historical data for ${toolHistPopUpTitle}`}
                  primaryTypographyProps={{
                    fontSize: 30,
                    fontWeight: 'medium',
                    lineHeight: '40 px',
                    mb: '2px',
                  }}/>

                </Box>
                <Box>
                  <IconButton onClick={handleCloseToolHistPopUp}>
                    <CloseIcon sx={{ color: "white"}}/>
                  </IconButton>
                </Box>
              </Box>
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="dialog-description">
              <Grid container spacing={2} padding={2}>
                <Grid item xs={12} align="center" justifyContent="center" >
                <img
                      src={`${toolHistPopUpImgUrl}&w=25&fit=crop&auto=format`}
                      srcSet={`${toolHistPopUpImgUrl}&w=25&fit=crop&auto=format&dpr=2 3x`}
                      alt={toolHistPopUpTitle}
                      loading="lazy"
                    />
                </Grid>
                <Grid item xs={8}>
                  {graphLoaded && (
                  <Line options={graphOptions} data={graphData} />
                )}
                </Grid>
                <Grid item xs={4}>
                  {graphLoaded && tableWithYearlyAvg()}
                </Grid>
                <Grid item xs={12} align="center" justifyContent="center" >
                {!graphLoaded && <CircularProgress />}
                </Grid>
                </Grid>

              </DialogContentText>
            </DialogContent>
          </Dialog>
    );
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
                      src={`${tool.img}&w=100&fit=crop&auto=format`}
                      srcSet={`${tool.img}&w=100&fit=crop&auto=format&dpr=2 4x`}
                      alt={tool.title}
                      loading="lazy"
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        setToolHistPopUpTitle(tool.title);
                        setToolHistPopUpImgUrl(tool.img);
                        handleOpenToolHistPopUp(tool.type, tool.title);
                      }}
                    />
                  </ImageListItem>
                </Card>
              ))}
            </ImageList>
          </Container>
        </div>
        <div id="Dialog">
        {dialogPopupWithGraphAndTable()}
        </div>
      </div>
    );
  }

  if (!toolPicturesLoaded) getAllToolPicturesFromBacked();

  return <div className="App">{displayToolPictureGrid()}</div>;
};

export default HistData;
