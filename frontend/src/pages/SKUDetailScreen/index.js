import React, { useState, useEffect } from 'react'
import WithHeaderLayout from '../../layouts/WithHeaderLayout';
import { Typography, TextField, Card, CardHeader, CardContent, LinearProgress, Grid, Box, Snackbar, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@material-ui/core';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import logo from '../../images/logo.png';
import { useHistory } from 'react-router-dom';
import { string } from 'prop-types';
import AlertDialog from '../../components';
import { apiValidateActionCode, apiValidatePackCarton, apiValidatePrintCarton } from '../../services/news';
import MuiAlert from '@material-ui/lab/Alert';
// import qz from "../../services/qz-tray"
import qz from "qz-tray";
import MainMenu from '../../components/menu';


function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const StyledTableCell = withStyles((theme) => ({
    head: {
        backgroundColor: '#ffffff',
        color: theme.palette.common.white,
    },
    body: {
        fontSize: 14,
        backgroundColor: '#ffffff',
    },
  }))(TableCell);

const StyledTableRow = withStyles((theme) => ({
    root: {
        '&:nth-of-type(odd)': {
            backgroundColor: '#eeeeee',
        },
    },
    input: {
        backgroundColor: '#eeffff',
    },
}))(TableRow);

const useStyles = makeStyles({
    table: {
        border: '1px solid #cccccc',
    },
});


const SKUDetailScreen = () => {

    let history = useHistory();

    const [loading, setLoading] = useState(false);

    const [alert, setAlert] = useState(false);
    const [error, setError] = useState("");
    // const [skuid, setSKUId] = useState("");
    const [userid, setUserId] = useState("");
    const [lpnid, setLPNId] = useState("");
    const [tote_type, setToteType] = useState("");
    const [location, setLocation] = useState("");
    const [image, setImage] = useState("");

    const [desc, setDesc] = useState("");
    const [sku, setSKU] = useState("");
    // const [dspsku, setDspSku] = useState("");
    const [next_carton, setNextCarton] = useState("");
    const [qty, setQty] = useState(0);
    const [sku_brcd_list, setSkuBrcdList] = useState([]);
    const [scannedSKU, setScannedSKU] = useState(0);
    const [sku_brcd, setSkuBrcd] = useState("");
    const [scan_carton, setScanCarton] = useState("");
    const [scan_carton_feedback, setScanCartonFeedback] = useState("");
    const [scan_carton_feedback_error, setScanCartonFeedbackError] = useState(false);
    const [scan_carton_feedback_queue, setScanCartonFeedbackQueue] = useState([]);
    const [push_url, setPushUrl] = useState("");
    const [action_code_for_sku, setActionCodeForSku] = useState("");
    const [readonly, setReadOnly] = useState(false);
    const [printed, setPrinted] = useState(false);
    const [print_mode, setPrintMode] = useState("");

    const [open, setOpen] = useState(false);
    const [alert_msg, setAlertMsg] = useState("");
    const [severity, setSeverity] = useState("success");

    let pre_scannedSKU = 0

    useEffect(() => {
        var scanInfo = JSON.parse(sessionStorage.getItem("scanInfo"));
        if (scanInfo === null || scanInfo.skuid === undefined) {
            history.push("/iddetail");
        } else {
            // setSKUId(scanInfo.skuid);
            setLPNId(scanInfo.lpnid);
            setToteType(scanInfo.tote_type);
            setUserId(scanInfo.userid);
            setLocation(scanInfo.location);
            setImage(scanInfo.image);

            setDesc(scanInfo.desc);
            setSKU(scanInfo.dsp_sku);
            setNextCarton(scanInfo.next_carton);
            setQty(scanInfo.qty);
            setSkuBrcdList(scanInfo.sku_brcd_list);
            setPrintMode(scanInfo.print_mode);
            // pre_scannedSKU = 0
            console.log("sku_brcd_list = ", scanInfo.sku_brcd_list)
        }
        console.log("tote_type = ", scanInfo.tote_type, "  printed = ", printed);
        if (scanInfo.tote_type === "MONO") {
            if (!printed) {
                validatePrintCarton("PRINT");
                setPrinted(true);
            }
        }
    }, [history]);

    const handleClose = (event, reason) => {
        setOpen(false);
        if (push_url !== "") {
            history.push(push_url);
        }
    };

    const handleSKUKeyUp = e => {
        if (e.keyCode === 13) {

            if (sku_brcd === "" ) {
                setReadOnly(false);
            } else if ( !readonly ) {
                if (sku_brcd_list.some(item => sku_brcd === item)) {
                    if (scannedSKU < qty) {
                        if (scannedSKU == qty - 1) {
                            setAlertMsg("Por favor escanear el cartón.");
                            setSeverity("success");
                            setOpen(true);
                            validatePrintCarton("PRINT");
                        }
                        setScannedSKU(scannedSKU + 1);
                    }
                } else if (sku_brcd === "SHORT") {
                    if (scannedSKU > 0) {
                        validatePrintCarton("PRINT");
                        setActionCodeForSku("SHORT");
                        setAlertMsg("Por favor escanear el cartón.");
                    } else {
                        setAlertMsg("Debe escanearse al menos 1 Unidad.");
                    }

                    setSeverity("success");
                    setOpen(true);
                } else {
                    setError(`Incorrect Barcode : ${sku_brcd}`)
                    setAlert(true);
                }
            }
            setSkuBrcd("");
        }
    }

    const handleCartonKeyUp = e => {
        if (e.keyCode === 13) {
            validateSKUBrcd();
        }
    }

    const inputSkuBrcd = e => {
        setSkuBrcd(e.target.value.toUpperCase())
    }

    const inputScanCarton = e => {
        setScanCarton(e.target.value.toUpperCase())
    }

    const onClose = () => {
        setSkuBrcd("%*%");
        setAlert(false);
    }

    const validatePrintCarton = (action_code) => {
        console.log(" == validatePrintCarton == ", action_code);
        setLoading(true);
        setReadOnly(true);

        var scanInfo = JSON.parse(sessionStorage.getItem("scanInfo"));

        apiValidatePrintCarton({ whse: scanInfo.whse, carton_nbr: next_carton===""?scanInfo.next_carton:next_carton, printer_name: scanInfo.printer_name, action_code: action_code, login_user_id: scanInfo.userid })
            .then(res => {
                console.log('===== PRINT res: ', res);
                setLoading(false);
                setReadOnly(false);
                if (res) {
                    console.log('==== res.message: ', res.message);
                    console.log("== scanInfo.print_mode = ", scanInfo.print_mode);

                    setScanCartonFeedbackQueue(scan_carton_feedback_queue => [...scan_carton_feedback_queue, res.message]);
                    // if (res.message != "") {
                    //     setAlertMsg(res.message);
                    //     setSeverity("success");
                    //     setOpen(true);
                    // }
                    if (scanInfo.print_mode == "DIRECT" && res.print_command != "")    {
                        console.log("== print_mode = ", scanInfo.print_mode);
                        qz.websocket.connect().then(() => {
                            return qz.printers.find(scanInfo.printer_name);
                        }).then((printer) => {
                            let config = qz.configs.create(printer);
                            return qz.print(config, [res.print_command]);
                        }).then(() => {
                            return qz.websocket.disconnect();
                        }).then(() => {
                            // process.exit(0);
                            console.log("printed successfully.");
                        }).catch((err) => {
                            console.error(err);
                            // process.exit(1);
                        });
                    }
                    setPrinted(true);
                }
            })
            .catch(function (error) {
                setLoading(false);
                setReadOnly(false);
                console.log('===== error: ', error.message);

                setError(error.message);
                setAlert(true);
        });
    }

    const validateSKUBrcd = () => {
        setLoading(true);
        setReadOnly(true);

        var scanInfo = JSON.parse(sessionStorage.getItem("scanInfo"));

        if (scan_carton === "DAMAGED" || scan_carton === "DISCREPANCY" || scan_carton === "SHORT" || scan_carton === "CANCEL") {
            apiValidateActionCode({ whse: scanInfo.whse, carton_nbr: next_carton, action_code: scan_carton, staging_locn: scanInfo.staging_locn,  login_user_id: userid })
                .then(res => {
                    console.log('===== res: ', res);
                    setLoading(false);
                    setReadOnly(false);
                    if (res) {
                        console.log('==== res.message: ', res.message);
                        setScanCartonFeedbackQueue(scan_carton_feedback_queue => [...scan_carton_feedback_queue, res.message]);
                    }
                })
                .catch(function (error) {
                    setLoading(false);
                    setReadOnly(false);
                    console.log('===== error: ', error.message);

                    setError(error.message);
                    setAlert(true);
                });
        } else if (scan_carton === "REPRINT") {
            validatePrintCarton(scan_carton);
        } else if (scan_carton == next_carton) {
            if (tote_type === "MONO") { setScannedSKU(1);}
            const cur_qty = tote_type === "MONO"?1:scannedSKU;
            apiValidatePackCarton({ whse: scanInfo.whse, carton_nbr: scan_carton, tote: lpnid, tote_type: tote_type, staging_locn: scanInfo.staging_locn, login_user_id: userid, sku_id: sku, qty: cur_qty, action_code: action_code_for_sku })
                .then(res => {
                    console.log('===== res: ', res);
                    setLoading(false);
                    if (res) {
                        setScannedSKU(0);
                        console.log('==== res.message: ', res.message);
                        scanInfo.distinct_skus = res.tote_details.distinct_skus;
                        scanInfo.carton = res.tote_details.distinct_carton;
                        scanInfo.classification = res.tote_details.distinct_classifications;

                        sessionStorage.setItem("scanInfo", JSON.stringify(scanInfo));

                        setScanCartonFeedbackQueue([]);
                        // setScanCartonFeedbackQueue(scan_carton_feedback_queue => [...scan_carton_feedback_queue, ...res.additional_message]);

                        if (res.next_carton_details.next_carton_qty === 0) {
                            if (res.tote_details.tote_status === 95) {
                                setPushUrl("/id");
                            } else {
                                setPushUrl("/iddetail");
                            }
                            setAlertMsg(res.message);
                            setSeverity("success");
                            setOpen(true);
                        } else {
                            setNextCarton(res.next_carton_details.next_carton_nbr);
                            setPushUrl("");
                            setScanCarton("");
                            setActionCodeForSku("");
                            setQty(res.next_carton_details.next_carton_qty);
                            setReadOnly(false);

                            if (res.tote_details.tote_status === 95) {
                                setPushUrl("/id");
                            } else {

                            }
                        }

                    }
                })
                .catch(function (error) {
                    setLoading(false);
                    setReadOnly(false);
                    console.log('===== error: ', error.message);

                    // setScanCartonFeedbackQueue(scan_carton_feedback_queue => [...scan_carton_feedback_queue, ...error.additional_message]);

                    setError(error.message);
                    setAlert(true);

                    // setScanCartonFeedback(error.message);
                    // setScanCartonFeedbackError(true);
                });
        } else {
            setLoading(false);
            console.log(scan_carton, " : ", next_carton);
            setAlertMsg("Invalid Carton");
            setSeverity("warning");
            setOpen(true);
        }
        setScanCarton("");
    }

    const classes = useStyles();

    return (
        <MainMenu>
            <WithHeaderLayout title="SKU">
                {loading &&
                    <LinearProgress color="secondary" />
                }
                <div className="p-6">

                    <div className="w-full text-right">
                        {userid !== "" && location !== "" &&
                            <span>{userid} @ {location}</span>
                        }
                    </div>
                    <div className="mx-auto" style={{ maxWidth: "1000px" }}>
                        <div className="w-full text-center">
                            <Typography variant="h4" color="primary">
                                Empacar Desde Tote
                            </Typography>
                        </div>

                        <Card className="p-4 mt-2">
                            <CardHeader
                                title="SKU Detail Screen"
                                titleTypographyProps={{ variant: 'h5' }}
                                style={{ textAlign: "center" }}
                            />
                            <Grid container spacing={0}>
                                <Grid item lg={5}>
                                    <CardContent>
                                        <div>
                                            <div className="w-full text-center py-1">
                                                <Typography style={{ paddingRight: "20px" }}>
                                                    TOTE: {lpnid} ({tote_type})
                                                </Typography>
                                            </div>
                                            <div className="w-full text-center py-1">
                                                <Typography style={{ paddingRight: "20px" }}>
                                                    SKU: {sku}
                                                </Typography>
                                            </div>
                                            <div className="w-full text-center py-1">
                                                <Typography style={{ paddingRight: "20px" }}>
                                                    SKU DESC: {desc}
                                                </Typography>
                                            </div>
                                            <div className="flex items-center mt-10">
                                                {image !== "" &&
                                                    <img className="w-32 h-32 mx-auto" src={image} alt="demo" />
                                                }
                                            </div>
                                        </div>
                                    </CardContent>
                                </Grid>
                                <Grid item lg={1} py={12}>
                                    <CardContent style={{ height: "100%" }}>
                                        <Box display="flex" alignItems="center" justifyContent="center" py={2}  style={{ height: "100%" }}>
                                            <div style={{ width: "2px", backgroundColor: "rgba(0, 0, 0, 24%)", height: "100%"}}/>
                                        </Box>
                                    </CardContent>
                                </Grid>
                                <Grid item lg={6}>
                                    <CardContent>
                                        <div className="w-full text-center py-1">
                                            <Typography style={{ paddingRight: "20px" }}>
                                            CARTÓN: {next_carton}
                                            </Typography>
                                        </div>
                                        {tote_type === "MONO" &&
                                            <>
                                                <Box display="flex" alignItems="center" justifyContent="center" py={2}>
                                                    <TextField className={classes.textfield} style={{ width: "400px" }} id="scan_carton_id" label="Carton ID" variant="outlined" value={scan_carton} helperText={scan_carton_feedback} error={scan_carton_feedback_error} onChange={e => inputScanCarton(e)} onKeyUp={handleCartonKeyUp} autoFocus />
                                                </Box>
                                                <Box display="flex" alignItems="center" justifyContent="center" py={2}>
                                                    <TableContainer component={Paper}>
                                                        <Table className={classes.table} aria-label="error message table" style={{ backgroundColor: "#eeeeee" }}>
                                                            <TableBody>
                                                            {scan_carton_feedback_queue.map((row, i) => (
                                                                <StyledTableRow key={i}>
                                                                    <StyledTableCell scope="row" align="center">{row}</StyledTableCell>
                                                                </StyledTableRow>
                                                            ))}
                                                            </TableBody>
                                                        </Table>
                                                    </TableContainer>
                                                </Box>
                                            </>
                                        }
                                        {tote_type === "MULTI" &&
                                            <>
                                                <div className="w-full text-center py-1">
                                                    <Typography style={{ paddingRight: "20px" }}>
                                                        SKU: {sku}
                                                    </Typography>
                                                </div>
                                                <div className="w-full text-center py-1">
                                                    <Typography style={{ paddingRight: "20px" }}>
                                                        QTY: {qty} Unit{qty > 0 && "s"} {
                                                            scannedSKU > 0 && (`(Scanned : ${scannedSKU} , Pending : ${(qty - scannedSKU)})`)
                                                        }
                                                    </Typography>
                                                </div>
                                                <Box alignItems="center" justifyContent="center" py={2}>
                                                    {(action_code_for_sku === "" && scannedSKU < qty) &&
                                                        <Box display="flex" alignItems="center" justifyContent="center" py={2} className="w-full">
                                                            <TextField className={classes.textfield} style={{ width: "400px" }} autoFocus id="sku_brcd" label="SKU" variant="outlined" value={sku_brcd} onChange={e => inputSkuBrcd(e)} onKeyUp={handleSKUKeyUp} />
                                                        </Box>
                                                    }
                                                    {(action_code_for_sku === "SHORT" || scannedSKU == qty) &&
                                                        <>
                                                            <Box>
                                                                <Box display="flex" alignItems="center" justifyContent="center" py={2} className="w-full">
                                                                    <TextField className={classes.textfield} autoFocus id="scan_carton_id" label="Carton ID" variant="outlined" value={scan_carton} helperText={scan_carton_feedback} error={scan_carton_feedback_error} onChange={e => inputScanCarton(e)} onKeyUp={handleCartonKeyUp} style={{ backgroundColor: "#eeffff", width: "400px" }}  />
                                                                </Box>
                                                            </Box>

                                                            <Box display="flex" alignItems="center" justifyContent="center" py={2}>
                                                                <TableContainer component={Paper}>
                                                                    <Table className={classes.table} aria-label="error message table" style={{ backgroundColor: "#eeeeee" }}>
                                                                        <TableBody>
                                                                        {scan_carton_feedback_queue.map((row, i) => (
                                                                            <StyledTableRow key={i}>
                                                                                <StyledTableCell scope="row" align="center">{row}</StyledTableCell>
                                                                            </StyledTableRow>
                                                                        ))}
                                                                        </TableBody>
                                                                    </Table>
                                                                </TableContainer>
                                                            </Box>
                                                        </>
                                                    }
                                                </Box>
                                            </>
                                        }

                                    </CardContent>
                                </Grid>
                            </Grid>
                        </Card>
                        <AlertDialog item="SKU Detail" error={error} open={alert} handleClose={onClose} />
                        <Snackbar open={open} autoHideDuration={6000} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} onClose={handleClose}>
                            <Alert onClose={handleClose} severity={severity}>
                                {alert_msg}
                            </Alert>
                        </Snackbar>
                    </div>
                </div>
            </WithHeaderLayout>
        </MainMenu>
    )
}

export default SKUDetailScreen;