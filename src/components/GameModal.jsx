import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

const GameModal = ({ id, title, gameComponent, openStatus, setOpenStatus, duration }) => {
  // const [open, setOpen] = React.useState(openStatus);

  const handleClickOpen = () => setOpenStatus(true);
  const handleClose = () => setOpenStatus(false);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setOpenStatus(false)
    }, duration)

    return () => {
      console.log('OUT OF TIME')
      clearTimeout(timer)
    }
  }, [duration])

  return (
    <React.Fragment>
      <Button variant="outlined" onClick={handleClickOpen}>
        {title}
      </Button>
      <Dialog open={openStatus} onClose={handleClose} maxWidth="lg" fullWidth={true}>
        <DialogTitle id={id} justifyContent="center">
          {title}
        </DialogTitle>
        <div></div>{" "}
        {/* ^ For some reason this is needed to show top line in TTT  */}
        <DialogContent>{gameComponent}</DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

export default GameModal;
