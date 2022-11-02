import React, { useState, useEffect, useRef } from 'react'
import { TextField, Typography, Card, CardContent, CardHeader, LinearProgress } from '@material-ui/core'
import WithHeaderLayout from '../layouts/WithHeaderLayout';
import { useHistory } from 'react-router-dom';
import AlertDialog from '../components';
import { apiValidateUserId } from '../services/news';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import logo from '../images/logo.png';


const StyledTextField = withStyles((theme) => ({
    root: {
        margin: "30px 0px",
    },
  }))(TextField);

const Login = () => {

    let history = useHistory();

    const [loading, setLoading] = useState(false);

    const [userid, setUserId] = useState("");
    const [password, setPassword] = useState("");
    const [alert, setAlert] = useState(false);
    const [error, setError] = useState("");

    const refUserId = useRef(null);
    const refPassword = useRef(null);


    const handleKeyUpUserId = e => {
        if (e.keyCode === 13) {
            if (userid === undefined) {
                setUserId("");
            } else if (userid === "") {
                setError("Please insert User Id!");
                setAlert(true);
            } else {
                console.log('focus');
                refPassword.current.querySelector('input').focus();
            }
        }
    }

    const handleKeyUpPassword = e => {
        if (e.keyCode === 13) {
            if (userid === undefined) {
                setUserId("");
                refUserId.current.querySelector('input').focus();
            } else if (userid === "") {
                setError("Please insert User Id!");
                setAlert(true);
            } else if (password === undefined) {
                setPassword("");
            } else if (password === "") {
                setError("Please insert Password!");
                setAlert(true);
            } else {
                validateUserId();
            }
        }
    }


    useEffect(() => {
        sessionStorage.removeItem("scanInfo");
    }, []);

    const validateUserId = () => {

        setLoading(true);

        apiValidateUserId({ login_user_id: userid, password: password })
            .then(res => {
                console.log('===== res: ', res);
                setLoading(false)

                if (res) {
                    sessionStorage.setItem("scanInfo", JSON.stringify({ userid: userid, whse: res.whse, whse_name: res.whse_name }));
                    history.push('/main');
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
        if (error == "Please insert User Id!") {
            setUserId(undefined);
        } else {
            setPassword(undefined);
        }
        setAlert(false);
    }

    return (

        <div className="p-6">
            <div className="w-full text-right">
                &nbsp;
            </div>
            <div className="mx-auto" style={{ maxWidth: "600px" }}>
                <div className="w-full ">
                    <img src={logo} className="mx-auto mb-10" alt="logo" />
                    <div className="w-full text-center">
                        <Typography variant="h4" color="primary">
                            Mimansa - Empacar Desde Tote
                        </Typography>
                    </div>
                    <Card className="mt-2">
                        <div className="p-4">
                            <CardContent className="mt-8 mx-3">
                                <TextField
                                    className="m-2 w-full"
                                    variant="outlined"
                                    value={userid}
                                    onChange={e => setUserId(e.target.value.toUpperCase())}
                                    onKeyUp={handleKeyUpUserId}
                                    label="Usuario"
                                    // autoFocus
                                    InputProps={{
                                        readOnly: Boolean(loading),
                                    }}
                                    ref={refUserId}
                                />
                                <StyledTextField
                                    className="m-2 w-full"
                                    variant="outlined"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    onKeyUp={handleKeyUpPassword}
                                    label="Contraseña"
                                    // autoFocus
                                    type="password"
                                    InputProps={{
                                        readOnly: Boolean(loading),
                                    }}
                                    ref={refPassword}
                                />
                            </CardContent>
                        </div>
                    </Card>
                    <AlertDialog item="User Id" error={error} open={alert} handleClose={() => onClose(error)}/>
                </div>
            </div>
        </div>
    )
}

export default Login;