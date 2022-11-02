import React, { useState, useEffect } from 'react'
import { Button, Snackbar, TextField, Typography, Grid, Card, CardContent, CardHeader, LinearProgress, TableHead, TableCell, TableBody, TableRow, Table, TableContainer, Paper,} from '@material-ui/core'
import { Link, useHistory } from 'react-router-dom';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import MainMenu from '../../components/menu';
import axios from 'axios'

import { restApiSettings, backendSettings } from "../../services/api";
import MuiAlert from '@material-ui/lab/Alert';
import { useConfirm } from 'material-ui-confirm';


function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
    table: {
        maxWidth: 1150,
        marginBottom: 20,
        marginTop: 20,
    },
    cell: {
        wordBreak: 'break-word',
    }
}));

const StyledTableCell = withStyles((theme) => ({
    head: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
        textAlign: 'center',
    },
    body: {
        fontSize: 14,
        textAlign: 'center',
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

const LocnPrinterMapList = () => {
    const classes = useStyles();
    let history = useHistory();
    const confirm = useConfirm();

    const [locnprintermap_list, setLocnPrinterMapList] = useState([]);
    const [loading, setLoading] = useState(false);

    const [open, setOpen] = useState(false);
    const [alert_msg, setAlertMsg] = useState("");
    const [severity, setSeverity] = useState("success");

    useEffect(() => {
        getList();
    }, []);

    const getList = ()  => {
        setLoading(true);
        axios.get(`${restApiSettings.baseURL}/locnprintermap/`)
            .then(res => {
                console.log(res = res)
                setLocnPrinterMapList(res.data);
                setLoading(false);
            }).catch(err => {
                setLoading(false);
            });
    }

    const deleteRow = (id) => {
        confirm({ description: 'Are you sure to delete the locnprintermap?' })
            .then(() => {
                setLoading(true);
                axios.delete(`${restApiSettings.baseURL}/locnprintermap/?id=${id}`)
                    .then(res => {
                        setAlertMsg("The locnprintermap has been deleted successfully.");
                        setSeverity("success");
                        setOpen(true);
                        getList();
                        setLoading(false);
                    }).catch(err => {
                        setLoading(false);
                    });
            }).catch(() => {});
    }

    const handleClose = (event, reason) => {
        setOpen(false);
    };

    return (
        <>
            <MainMenu/>
            {loading &&
                <LinearProgress color="secondary" />
            }
            <div className="mx-auto mt-8" style={{ maxWidth: "1150px" }}>
                <div className="w-full text-center mb-6">
                    <Typography variant="h3" color="primary">
                        LocnPrinterMap
                    </Typography>
                </div>
                <Button variant="contained" color="primary" onClick={() => history.push("/locnprintermap/create")}>Add LocnPrinterMap</Button>
                {/* <Link to="/locnprintermap/create">Add LocnPrinterMap</Link> */}
                <TableContainer component={Paper} className={classes.table}>
                    <Table aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <StyledTableCell >N.</StyledTableCell>
                                <StyledTableCell >Warehouse</StyledTableCell>
                                <StyledTableCell >Ubic. Reserva</StyledTableCell>
                                <StyledTableCell >Ubic. Anclaje</StyledTableCell>
                                <StyledTableCell >Cola</StyledTableCell>
                                <StyledTableCell >Fecha Creación</StyledTableCell>
                                <StyledTableCell >Fecha Modificación</StyledTableCell>
                                <StyledTableCell >Acción</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                        {
                            locnprintermap_list.map((locnprintermap, i) =>
                                <StyledTableRow key={i}>
                                    <StyledTableCell key={"no_" + i} >{ i + 1 }</StyledTableCell>
                                    <StyledTableCell key={"whse_code_" + i} >{locnprintermap.whse_code}</StyledTableCell>
                                    <StyledTableCell key={"reserve_locn_" + i} >{locnprintermap.reserve_locn}</StyledTableCell>
                                    <StyledTableCell key={"staging_locn_" + i} >{locnprintermap.staging_locn}</StyledTableCell>
                                    <StyledTableCell key={"printer_name_" + i} >{locnprintermap.printer_name}</StyledTableCell>
                                    <StyledTableCell key={"creation_date_" + i} >{locnprintermap.creation_date}</StyledTableCell>
                                    <StyledTableCell key={"modification_date_" + i} >{locnprintermap.modification_date}</StyledTableCell>
                                    <StyledTableCell key={"action_" + i} style={{ wordWrap: 'no-wrap'}}>
                                        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"/>
                                        <Button variant="outlined" id="printPageButton" onClick={ e => history.push(`/locnprintermap/edit/${locnprintermap.id}`)}><i className="fa fa-pencil"></i></Button>
                                        <Button variant="outlined" id="printPageButton" onClick={ e => deleteRow(locnprintermap.id)}><i className="fa fa-trash"></i></Button>
                                    </StyledTableCell>
                                </StyledTableRow>
                            )
                        }

                        </TableBody>
                    </Table>
                </TableContainer>
                <Snackbar open={open} autoHideDuration={6000} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} onClose={handleClose}>
                    <Alert onClose={handleClose} severity={severity}>
                        {alert_msg}
                    </Alert>
                </Snackbar>
            </div>
        </>

    )
}

export default LocnPrinterMapList;
