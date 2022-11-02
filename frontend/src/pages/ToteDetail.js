import React, { useState, useEffect, useRef } from 'react'
import { TextField, Typography, Grid, Card, CardContent, CardHeader, LinearProgress, TableHead, TableCell, TableBody, TableRow, Table, TableContainer, Paper } from '@material-ui/core'
import WithHeaderLayout from '../layouts/WithHeaderLayout';
import { useHistory } from 'react-router-dom';
import AlertDialog from '../components';
import { apiGetToteDetails } from '../services/news';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import MainMenu from '../components/menu';


const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '25ch',
    },
  },

  table: {
    maxWidth: 1200,
  },
  cell: {
      wordBreak: 'initial',
      textAlign: 'center',
  }
}));

const StyledTableCell = withStyles((theme) => ({
    head: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    body: {
        fontSize: 14,
    },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
    root: {
        '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
        },
    },
}))(TableRow);


const StyledTextField = withStyles((theme) => ({
    root: {
        margin: "30px 0px",
    },
}))(TextField);


const  ToteDetail = () => {
    const classes = useStyles();
    let history = useHistory();

    const [loading, setLoading] = useState(false);

    const [tote_id, setToteId] = useState("");
    const [res, setRes] = useState(null);

    const [alert, setAlert] = useState(false);
    const [error, setError] = useState("");

    const handleKeyUp = e => {
        if (e.keyCode === 13) {
            if (tote_id === undefined) {
                setToteId("");
            } else if (tote_id === "") {
                setError("Please insert Tote Id!");
                setAlert(true);
            } else {
                getToteDetails();
                setToteId("");
            }
        }
    }


    const getToteDetails = () => {

        setLoading(true);

        apiGetToteDetails({ tote: tote_id })
            .then(res => {
                console.log('===== res: ', res);
                setLoading(false)

                if (res) {
                    setRes(res);
                }
            })
            .catch(function (error) {
                // Handle Errors here.
                setLoading(false);
                console.log('===== error: ', error);
                setError(error.message);
                setAlert(true);
                // ...
            });

    }

    const onClose = (error) => {
        console.log("error = ", error);
        setToteId(undefined);
        setAlert(false);
    }

    return (
        <>
            <MainMenu/>
            {loading &&
                <LinearProgress color="secondary" />
            }
            <div className="mx-auto mt-8" style={{ maxWidth: "600px" }}>
                <div className="w-full text-center mb-10">
                    <Typography variant="h3" color="primary">
                        Consulta de Tote
                    </Typography>
                </div>
                <div className="w-full ">
                    <Card>
                        {/* <div className="p-4"> */}
                            <CardContent className="mt-1 mx-3">
                                <StyledTextField
                                    className="m-2 w-full"
                                    variant="outlined"
                                    value={tote_id}
                                    onChange={e => setToteId(e.target.value)}
                                    onKeyUp={handleKeyUp}
                                    label="Tote"
                                    autoFocus
                                    InputProps={{
                                        readOnly: Boolean(loading),
                                    }}
                                    // ref={refPassword}
                                />
                            </CardContent>
                        {/* </div> */}
                    </Card>
                </div>
            </div>

            {
                res && res.tote_details &&
                <Card>
                    <CardHeader
                        title="Tote"
                        titleTypographyProps={{ variant: 'h4' }}
                        style={{ textAlign: "center" }}
                    />
                    <CardContent className="mt-1 mx-3">
                        <Grid
                            container
                            direction="row"
                            justify="center"
                            alignItems="baseline"
                            spacing={6}
                            // className="pt-12"
                        >
                            <TableContainer component={Paper} className={classes.table}>
                                <Table aria-label="simple table" className={classes.table}>
                                    <TableHead>
                                        <TableRow>
                                            <StyledTableCell className={classes.cell}>Tote</StyledTableCell>
                                            <StyledTableCell className={classes.cell}>Tipo</StyledTableCell>
                                            <StyledTableCell className={classes.cell}>Estado</StyledTableCell>
                                            <StyledTableCell className={classes.cell}>Distintos SKUs</StyledTableCell>
                                            <StyledTableCell className={classes.cell}>Distintos Cartones</StyledTableCell>
                                            <StyledTableCell className={classes.cell}>VAS</StyledTableCell>
                                            <StyledTableCell className={classes.cell}>Distintos Clasificaciones</StyledTableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <TableRow>
                                            <StyledTableCell className={classes.cell}>{res.tote_details.tote}</StyledTableCell>
                                            <StyledTableCell className={classes.cell}>{res.tote_details.tote_type}</StyledTableCell>
                                            <StyledTableCell className={classes.cell}>{res.tote_details.tote_status}</StyledTableCell>
                                            <StyledTableCell className={classes.cell}>{res.tote_details.distinct_skus}</StyledTableCell>
                                            <StyledTableCell className={classes.cell}>{res.tote_details.distinct_carton}</StyledTableCell>
                                            <StyledTableCell className={classes.cell}>{res.tote_details.requiring_vas}</StyledTableCell>
                                            <StyledTableCell className={classes.cell}>{res.tote_details.distinct_classifications}</StyledTableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid>
                    </CardContent>
                </Card>
            }

            {
                res && res.carton_list &&
                <Card>
                    <CardHeader
                        title="Cartónes"
                        titleTypographyProps={{ variant: 'h4' }}
                        style={{ textAlign: "center" }}
                    />
                    <CardContent className="mt-1 mx-3">
                        <Grid
                            container
                            direction="row"
                            justify="center"
                            alignItems="baseline"
                            spacing={6}
                            // className="pt-12"
                        >
                            <TableContainer component={Paper} className={classes.table}>
                                <Table aria-label="carton table" className={classes.table}>
                                    <TableHead>
                                        <TableRow>
                                            <StyledTableCell className={classes.cell}>Carton</StyledTableCell>
                                            <StyledTableCell className={classes.cell}>Estado</StyledTableCell>
                                            <StyledTableCell className={classes.cell}>SKU_ID</StyledTableCell>
                                            <StyledTableCell className={classes.cell}>Brcd</StyledTableCell>
                                            <StyledTableCell className={classes.cell}>DSP SKU</StyledTableCell>
                                            <StyledTableCell className={classes.cell}>Desc</StyledTableCell>
                                            <StyledTableCell className={classes.cell}>Cant. a Empacar</StyledTableCell>
                                            <StyledTableCell className={classes.cell}>Cant. Empacada</StyledTableCell>
                                            <StyledTableCell className={classes.cell}>Pendiente</StyledTableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                    {   res.carton_list.map(carton =>
                                            <StyledTableRow>
                                                <StyledTableCell className={classes.cell}>{carton.carton_nbr}</StyledTableCell>
                                                <StyledTableCell className={classes.cell}>{carton.state_code}</StyledTableCell>
                                                <StyledTableCell className={classes.cell}>{carton.sku_id}</StyledTableCell>
                                                <StyledTableCell className={classes.cell}>{carton.sku_brcd}</StyledTableCell>
                                                <StyledTableCell className={classes.cell}>{carton.dsp_sku}</StyledTableCell>
                                                <StyledTableCell className={classes.cell}>{carton.sku_desc}</StyledTableCell>
                                                <StyledTableCell className={classes.cell}>{carton.to_be_pakd_units}</StyledTableCell>
                                                <StyledTableCell className={classes.cell}>{carton.units_pakd}</StyledTableCell>
                                                <StyledTableCell className={classes.cell}>{carton.remaining}</StyledTableCell>
                                            </StyledTableRow>
                                        )
                                    }
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid>
                    </CardContent>
                </Card>
            }
            <AlertDialog item="User Id" error={error} open={alert} handleClose={() => onClose(error)}/>
        </>

    )
}

export default ToteDetail;