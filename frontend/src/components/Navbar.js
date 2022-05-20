import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  makeStyles,
} from "@material-ui/core";
import { useNavigate } from "react-router-dom";
import { ChatState } from "../Context/ChatProvider";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  header: {
    top: 'auto',
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  }
}));

const Navbar = (props) => {
  const classes = useStyles();
  const navigate = useNavigate();
  const handleClick = (route) => {
    console.log(route);
    window.location = `${route}`;
  };
  const { user } = ChatState();
  console.log('user', user);

  return (
    <AppBar position="fixed" className={classes.header}>
      <Toolbar>
        {
          user._id === "6282b84e22de0cdcf16c17d2" 
          ? <>
          <Button color="inherit" onClick={() => handleClick("/addjob")}>
            Add Jobs
          </Button>
          <Button color="inherit" onClick={() => handleClick("/addresources")}>
            Add Resources
          </Button>
          <Button color="inherit" onClick={() => handleClick("/myjobs")}>
            Added Jobs
          </Button>
          <Button color="inherit" onClick={() => handleClick("/myresources")}>
            Added Resources
          </Button>
        </> 
          : <>
          <Button color="inherit" onClick={() => handleClick("/chats")}>
            Collaborate
          </Button>
          <Button color="inherit" onClick={() => handleClick("/jobs")}>
            Jobs
          </Button>
          <Button color="inherit" onClick={() => handleClick("/resources")}>
            Interview Prep
          </Button>
          <Button color="inherit" onClick={() => handleClick("/code")}>
            Live Coding
          </Button>
        </>
        }
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
