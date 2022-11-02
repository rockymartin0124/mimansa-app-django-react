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

const WarehouseList = () => {
    const classes = useStyles();
    let history = useHistory();
    const confirm = useConfirm();

    const [warehouse_list, setWarehouseList] = useState([]);
    const [loading, setLoading] = useState(false);

    const [open, setOpen] = useState(false);
    const [alert_msg, setAlertMsg] = useState("");
    const [severity, setSeverity] = useState("success");

    useEffect(() => {
        getList();
    }, []);

    const getList = ()  => {
        setLoading(true);
        axios.get(`${restApiSettings.baseURL}/warehouse/`)
            .then(res => {
                console.log(res = res)
                setWarehouseList(res.data);
                setLoading(false);
            }).catch(err => {
                setLoading(false);
            });
    }

    const deleteRow = (code) => {
        confirm({ description: 'Are you sure to delete the warehouse?' })
            .then(() => {
                setLoading(true);
                axios.delete(`${restApiSettings.baseURL}/warehouse/?code=${code}`)
                    .then(res => {
                        setAlertMsg("The warehouse has been deleted successfully.");
                        setSeverity("success");
                        setOpen(true);
                        getList();
                    }).catch(err => {
                        console.log(" error = ", err.response.data);
                        let errMsg = err.response.data;
                        errMsg = err.response.data.substr(1, errMsg.length - 2);
                        setAlertMsg(errMsg);
                        setSeverity("error");
                        setOpen(true);
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
                        Warehouse
                    </Typography>
                </div>
                <Button variant="contained" color="primary" onClick={() => history.push("/warehouse/create")}>Add Warehouse</Button>
                {/* <Link to="/warehouse/create">Add Warehouse</Link> */}
                <TableContainer component={Paper} className={classes.table}>
                    <Table aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <StyledTableCell >N.</StyledTableCell>
                                <StyledTableCell >Código</StyledTableCell>
                                <StyledTableCell >Nombre</StyledTableCell>
                                <StyledTableCell >RUT</StyledTableCell>
                                <StyledTableCell >Dirección Linea 1</StyledTableCell>
                                <StyledTableCell >Dirección Linea 2</StyledTableCell>
                                <StyledTableCell >Comuna</StyledTableCell>
                                <StyledTableCell >Ciudad</StyledTableCell>
                                <StyledTableCell >Region</StyledTableCell>
                                <StyledTableCell >Código Postal</StyledTableCell>
                                <StyledTableCell >Fono</StyledTableCell>
                                <StyledTableCell >Logo</StyledTableCell>
                                <StyledTableCell >Fecha Creación</StyledTableCell>
                                <StyledTableCell >Fecha Modificación</StyledTableCell>
                                <StyledTableCell >Acción</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                        {
                            warehouse_list.map((warehouse, i) =>
                                <StyledTableRow key={i}>
                                    <StyledTableCell key={"no_" + i} >{ i + 1 }</StyledTableCell>
                                    <StyledTableCell key={"code_" + i} >{warehouse.code}</StyledTableCell>
                                    <StyledTableCell key={"name_" + i} >{warehouse.name}</StyledTableCell>
                                    <StyledTableCell key={"rut_" + i} >{warehouse.rut}</StyledTableCell>
                                    <StyledTableCell key={"addr_line_1_" + i} >{warehouse.addr_line_1}</StyledTableCell>
                                    <StyledTableCell key={"addr_line_2_" + i} >{warehouse.addr_line_2}</StyledTableCell>
                                    <StyledTableCell key={"locality_" + i} >{warehouse.locality}</StyledTableCell>
                                    <StyledTableCell key={"city_" + i} >{warehouse.city}</StyledTableCell>
                                    <StyledTableCell key={"state_" + i} >{warehouse.state}</StyledTableCell>
                                    <StyledTableCell key={"zipcode_" + i} >{warehouse.zipcode}</StyledTableCell>
                                    <StyledTableCell key={"phone_" + i} >{warehouse.phone}</StyledTableCell>
                                    <StyledTableCell key={"logo_" + i} >
                                        {warehouse.logo !== null && <img src={`${backendSettings.logoBaseURL}/${warehouse.logo.split("/")[2]}`}/>}
                                    </StyledTableCell>
                                        {/* {warehouse.logo}</StyledTableCell> */}
                                    {/* <StyledTableCell key={"logo_" + i} >{warehouse.logo}</StyledTableCell> */}
                                    <StyledTableCell key={"creation_date_" + i} >{warehouse.creation_date}</StyledTableCell>
                                    <StyledTableCell key={"modification_date_" + i} >{warehouse.modification_date}</StyledTableCell>
                                    <StyledTableCell key={"action_" + i} style={{ wordWrap: 'no-wrap'}}>
                                        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"/>
                                        <Button variant="outlined" id="printPageButton" onClick={ e => history.push(`/warehouse/edit/${warehouse.code}`)} style={{ marginBottom: '10px', }}><i className="fa fa-pencil"></i></Button>
                                        <Button variant="outlined" id="printPageButton" onClick={ e => deleteRow(warehouse.code)}><i className="fa fa-trash"></i></Button>
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

export default WarehouseList;
