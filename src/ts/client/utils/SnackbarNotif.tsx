import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import Slide from '@material-ui/core/Slide';

interface IProps {
  snackbarIsOpen: any;
  name: any;
  closeSnackbar: any;
  mode: any;
}

function TransitionDown(props) {
  return <Slide {...props} direction="down" />;
}

class SnackbarNotif extends React.Component<IProps> {
  public render() {
    const { snackbarIsOpen, name, closeSnackbar, mode } = this.props;
    return (
      <Snackbar
        open={snackbarIsOpen}
        onClose={closeSnackbar}
        autoHideDuration={1000}
        TransitionComponent={TransitionDown}
        ContentProps={{
          'aria-describedby': 'message-id'
        }}
        message={
          <span id="message-id">
            {name} {mode === 'pitch' ? 'pitched in!!' : 'got one!!'}
          </span>
        }
      />
    );
  }
}

export default SnackbarNotif;
