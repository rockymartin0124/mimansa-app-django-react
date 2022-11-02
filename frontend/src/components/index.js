import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import WarningIcon from '@material-ui/icons/Warning';

const AlertDialog = (props) => {

    return (
        <div>
            <Dialog
                open={props.open}
                onClose={props.handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                fullWidth={true}
                maxWidth={'sm'}
            >
                <DialogTitle id="alert-dialog-title" className="text-center">
                    <WarningIcon style={{ fontSize: "100px", color: "#E9897E" }} />
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description" className="text-center" style={{fontSize: "36px"}}>
                        {props.error}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={props.handleClose} color="primary" autoFocus>
                        ReEnter
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default AlertDialog;