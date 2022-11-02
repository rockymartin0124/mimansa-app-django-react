import React, { useState, useEffect } from 'react'
import WithHeaderLayout from '../../layouts/WithHeaderLayout';
import { Typography, TextField, Card, CardHeader, CardContent, LinearProgress } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import AlertDialog from '../../components';
import { apiValidateLPNId } from '../../services/news';
import MainMenu from '../../components/menu';

const IDScreen = () => {

    let history = useHistory();

    const [loading, setLoading] = useState(false);

    const [userid, setUserId] = useState("");
    const [location, setLocation] = useState("");
    // const [reserve_locn, setReserveLocn] = useState("");

    const [lpnid, setLPNId] = useState("");
    const [alert, setAlert] = useState(false);
    const [error, setError] = useState("");


    const handleKeyUp = e => {
        if (e.keyCode === 13) {
            if (lpnid === "%*%") {
                setLPNId("");
            } else if (lpnid === "") {
                setError("Please insert LPN Id!")
                setAlert(true);
            } else {
                validateLPNId();
                setLPNId("");
            }
        }
    }

    useEffect(() => {
        var scanInfo = JSON.parse(sessionStorage.getItem("scanInfo"));

        if (scanInfo === null || scanInfo.location === undefined) {
            history.push("/location");
        } else {
            if (scanInfo !== null && scanInfo.lpnid !== undefined) {
                var newInfo = { 
                    userid: scanInfo.userid,
                    whse: scanInfo.whse,
                    whse_name: scanInfo.whse_name,
                    location: scanInfo.location,
                    dsp_locn: scanInfo.dsp_locn,
                    reserve_locn: scanInfo.reserve_locn,
                    staging_locn: scanInfo.staging_locn,
                    printer_name: scanInfo.printer_name,
                    print_mode: scanInfo.print_mode, 
                };
                sessionStorage.setItem("scanInfo", JSON.stringify(newInfo));
            }
            if (scanInfo !== null) {
                setUserId(scanInfo.userid);
                setLocation(scanInfo.location);
                // setReserveLocn(scanInfo.reserve_locn);
            }
        }

    }, [history]);

    const validateLPNId = () => {

        setLoading(true);

        var scanInfo = JSON.parse(sessionStorage.getItem("scanInfo"));

        apiValidateLPNId({ whse: scanInfo.whse, tote: lpnid, login_user_id: scanInfo.userid, reserve_locn: scanInfo.reserve_locn})
            .then(res => {
                console.log('===== res: ', res);
                setLoading(false);
                if (res) {
                    var scanInfo = JSON.parse(sessionStorage.getItem("scanInfo"));
                    console.log(" == whse = ", scanInfo.whse)
                    var newObj = Object.assign({}, scanInfo, { lpnid: lpnid, tote_type: res.tote_details.tote_type, tote_status: res.tote_details.tote_status, distinct_skus: res.tote_details.distinct_skus, carton: res.tote_details.distinct_carton, requiring_vas: res.tote_details.requiring_vas,  classification: res.tote_details.distinct_classifications,  });
                    sessionStorage.setItem("scanInfo", JSON.stringify(newObj));
                    history.push('/iddetail');
                }
            })
            .catch(function (error) {
                // Handle Errors here.
                setLoading(false);
                console.log('===== error: ', error.message);
                setError(error.message);
                setAlert(true);
                // ...
            });

    }

    const onClose = () => {
        setLPNId("");
        setAlert(false);
    }

    return (
        <MainMenu>
            <WithHeaderLayout title="TOTE">
                {loading &&
                    <LinearProgress color="secondary" />
                }
                <div className="p-6">
                    <div className="w-full text-right">
                        {userid !== "" && location !== "" &&
                            <span>{userid} @ {location}</span>}
                    </div>
                    <div className="mx-auto" style={{ maxWidth: "600px" }}>
                        <div className="w-full ">
                            <div className="w-full text-center">
                                <Typography variant="h4" color="primary">
                                    Empacar Desde Tote
                            </Typography>
                            </div>
                            <Card className="mt-2">
                                <div className="p-4">
                                    <CardHeader
                                        title="TOTE"
                                        titleTypographyProps={{ variant: 'h5' }}
                                        style={{ textAlign: "center" }}
                                    />
                                    <CardContent className="mt-8 mx-3">
                                        <TextField
                                            className="m-2 w-full"
                                            variant="outlined"
                                            value={lpnid}
                                            onChange={e => setLPNId(e.target.value.toUpperCase())}
                                            onKeyUp={handleKeyUp}
                                            label="TOTE"
                                            autoFocus
                                            InputProps={{ readOnly: Boolean(loading), }}
                                        />
                                    </CardContent>
                                </div>
                            </Card>
                            <AlertDialog item="LPN id" error={error} open={alert} handleClose={onClose} />
                        </div>
                    </div>
                </div>
            </WithHeaderLayout>
        </MainMenu>
    )
}

export default IDScreen;