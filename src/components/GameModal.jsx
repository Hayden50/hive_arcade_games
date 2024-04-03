import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const GameModal = ({ id, title, gameComponent }) => {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <React.Fragment>
      <Button variant="outlined" onClick={handleClickOpen} size="large">
        {title}
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="lg"
        fullWidth={true}
        TransitionComponent={Transition}
      >
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
