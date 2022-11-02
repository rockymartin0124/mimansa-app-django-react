import React, { useState, useEffect, } from 'react'
import { Button, TextField, Typography, Grid, LinearProgress, Snackbar, } from '@material-ui/core'
import { useHistory } from 'react-router-dom';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import MainMenu from '../../components/menu';
import axios from 'axios'
import Select from 'react-select'

import { restApiSettings } from "../../services/api";
import MuiAlert from '@material-ui/lab/Alert';


function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '25ch',
    },
  },

  table: {
    maxWidth: 1000,
  },
  cell: {
      wordBreak: 'break-word',
  },
  grid_with_textfield: {
      display: 'flex',
  }
}));


const StyledTextField = withStyles((theme) => ({
    root: {
        margin: "30px 0px",
    },
}))(TextField);


const  LocnPrinterMapEdit = () => {
    const classes = useStyles();
    let history = useHistory();

    const [loading, setLoading] = useState(false);

    const [whse_code, setWhseCode] = useState("");
    const [reserve_locn, setReserveLocn] = useState("");
    const [staging_locn, setStagingLocn] = useState("");
    const [printer_name, setPrinterName] = useState("");
    const [id, setId] = useState("");

    const [warehouse_list, setWarehouseList] = useState([]);

    const [open, setOpen] = useState(false);
    const [alert_msg, setAlertMsg] = useState("");
    const [severity, setSeverity] = useState("success");

    useEffect(() => {
        getWhseList();
        const pathParts = history.location.pathname.split("/");
        if (pathParts.length > 3) {
            console.log("== query = ", pathParts[3]);
            setId(pathParts[3]);
            getData(pathParts[3]);
        }
    }, []);

    const getWhseList = ()  => {
        axios.get(`${restApiSettings.baseURL}/warehouse/`)
            .then(res => {
                console.log(res = res)

                setWarehouseList(res.data.map(d => ({
                    "value" : d.code,
                    "label" : d.code
                  })));
            })
    }

    const getData = (id)  => {
        axios.get(`${restApiSettings.baseURL}/locnprintermap/?id=${id}`)
            .then(res => {
                console.log(res = res)
                setWhseCode(res.data[0].whse_code);
                setReserveLocn(res.data[0].reserve_locn);
                setStagingLocn(res.data[0].staging_locn);
                setPrinterName(res.data[0].printer_name);
            })
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (whse_code == "" || reserve_locn == "" || staging_locn == "" || printer_name == "") {
            if (whse_code == "") {
                setAlertMsg("Please enter Warehouse Code.");
            } else if (reserve_locn == "") {
                setAlertMsg("Please enter Reserve Location.");
            } else if (staging_locn == "") {
                setAlertMsg("Please enter Staging Location.");
            } else if (printer_name == "") {
                setAlertMsg("Please enter Printer Name.");
            }

            setSeverity("warning");
            setOpen(true);
            return;
        } else {
            if (!validateReserveLocn(reserve_locn)) {
                setAlertMsg("Invalid reserve_locn.");
                setSeverity("warning");
                setOpen(true);
                return;
            } else if (!validateStagingLocn(staging_locn)) {
                setAlertMsg("Invalid staging_locn.");
                setSeverity("warning");
                setOpen(true);
                return;
            }
        }

        setLoading(true);

        let form_data = new FormData();
        form_data.append('whse_code', whse_code);
        form_data.append('reserve_locn', reserve_locn);
        form_data.append('staging_locn', staging_locn);
        form_data.append('printer_name', printer_name);

        let url = `${restApiSettings.baseURL}/locnprintermap/?id=${id}`;
        console.log("url = ", url);
        axios.put(url, form_data, {
            headers: {
                'content-type': 'multipart/form-data',
            },
        }).then(res => {
            setAlertMsg("The LocationPrinterMap has been created successfully.");
            setSeverity("success");
            setOpen(true);
            history.push("/locnprintermap/list");
            setLoading(false);
        }).catch(err => {
            if (err.response.status == 409) {
                setAlertMsg("The data is duplicated.");
            } else {
                setAlertMsg("Unknown error occurred.")
            }
            setSeverity("error");
            setOpen(true);
            setLoading(false);
        })
    };

    const handleClose = (event, reason) => {
        setOpen(false);
    };

    const validateReserveLocn = locn => {
        // validate reserve_locn
        return true;
    }

    const validateStagingLocn = locn => {
        // validate reserve_locn
        return true;
    }

    return (
        <>
            <MainMenu/>
            {loading &&
                <LinearProgress color="secondary" />
            }
            <div className="mx-auto mt-8" style={{ maxWidth: "1000px" }}>
                <div className="w-full text-center mb-12">
                    <Typography variant="h3" color="primary">
                        LocnPrinterMap
                    </Typography>
                </div>
                <form onSubmit={handleSubmit}>
                    <Grid
                        container
                        direction="row"
                        spacing={1}
                        justify="space-evenly"
                        alignItems="center"
                    >
                        <Grid
                            container
                            direction="row"
                            spacing={3}
                            justify="space-evenly"
                            xs={3}
                        >
                            <Grid item xs={12}>
                                <Select options={warehouse_list}  value={warehouse_list.filter(option => option.value === whse_code)} onChange={e => setWhseCode(e.value)}></Select>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                className="m-2 w-full"
                                variant="outlined"
                                value={reserve_locn}
                                onChange={e => setReserveLocn(e.target.value)}
                                label="Ubic. Reserva"
                                autoFocus
                                InputProps={{
                                    readOnly: Boolean(loading),
                                }}
                            />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                className="m-2 w-full"
                                variant="outlined"
                                value={staging_locn}
                                onChange={e => setStagingLocn(e.target.value)}
                                label="Ubic. Anclaje"
                                autoFocus
                                InputProps={{
                                    readOnly: Boolean(loading),
                                }}
                            />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                className="m-2 w-full"
                                variant="outlined"
                                value={printer_name}
                                onChange={e => setPrinterName(e.target.value)}
                                label="Cola"
                                autoFocus
                                InputProps={{
                                    readOnly: Boolean(loading),
                                }}
                            />
                            </Grid>
                        <Grid item xs={12}
                        style={{ display: 'flex', justifyContent: "space-around", marginTop: "20px", }}>
                            <Button variant="contained" color="primary" type="submit" className="mr-5">Update</Button>
                            <Button variant="contained" color="primary" onClick={() => history.push("/locnprintermap/list")}>Go Back</Button>
                        </Grid>
                        </Grid>
                    </Grid>
                </form>
                <Snackbar open={open} autoHideDuration={6000} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} onClose={handleClose}>
                    <Alert onClose={handleClose} severity={severity}>
                        {alert_msg}
                    </Alert>
                </Snackbar>
            </div>
        </>

    )
}

export default LocnPrinterMapEdit;