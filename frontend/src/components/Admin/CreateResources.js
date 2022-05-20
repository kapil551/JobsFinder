import { useContext, useEffect, useState } from "react";
import {
  Button,
  Grid,
  Typography,
  Modal,
  Paper,
  makeStyles,
  TextField,
  MenuItem,
} from "@material-ui/core";
import axios from "axios";
import ChipInput from "material-ui-chip-input";
import { useToast } from "@chakra-ui/react";
import { ChatState } from "../../Context/ChatProvider";

const useStyles = makeStyles((theme) => ({
  body: {
    height: "inherit",
  },
  popupDialog: {
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    // padding: "30px",
  },
}));

const CreateResources = (props) => {
  const classes = useStyles();
  const toast = useToast();
  const { user } = ChatState();

  const [jobDetails, setJobDetails] = useState({
    title: "",
    skillsets: [],
    type: "video",
    link:"",
    author: "",
  });

  const handleInput = (key, value) => {
    setJobDetails({
      ...jobDetails,
      [key]: value,
    });
  };

  const handleUpdate = () => {
    console.log(jobDetails);

    const config = {
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    };
    axios
      .post("/api/resources", { jobDetails, user }, config)
      .then((response) => {
        toast({
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "bottom",
          description: response.data.message,
        });
        setJobDetails({
            title: "",
            skillsets: [],
            type: "video",
            author: "",
            link:"",
        });
      })
      .catch((err) => {
        toast({
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
          description: err.response.data.message,
        });
        console.log(err.response);
      });
  };

  return (
    <>
      <Grid
        container
        item
        direction="column"
        alignItems="center"
        style={{ padding: "30px", minHeight: "93vh", width: "", marginBottom: '30px' }}
      >
        <Grid item>
          <Typography variant="h2">Add Resource</Typography>
        </Grid>
        <Grid item container xs direction="column" justify="center">
          <Grid item>
            <Paper
              style={{
                padding: "20px",
                outline: "none",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Grid
                container
                direction="column"
                alignItems="stretch"
                spacing={3}
              >
                <Grid item>
                  <TextField
                    label="Title"
                    value={jobDetails.title}
                    onChange={(event) =>
                      handleInput("title", event.target.value)
                    }
                    variant="outlined"
                    fullWidth
                  />
                </Grid>
                <Grid item>
                  <TextField
                    label="Author"
                    value={jobDetails.author}
                    onChange={(event) =>
                      handleInput("author", event.target.value)
                    }
                    variant="outlined"
                    fullWidth
                  />
                </Grid>
                <Grid item>
                  <TextField
                    label="Resource Link"
                    value={jobDetails.link}
                    onChange={(event) =>
                      handleInput("link", event.target.value)
                    }
                    variant="outlined"
                    fullWidth
                  />
                </Grid>
                <Grid item>
                  <TextField
                    select
                    label="Type"
                    variant="outlined"
                    fullWidth
                    value={jobDetails.type}
                    className={classes.inputBox}
                    onChange={(event) => {
                      handleInput("type", event.target.value);
                    }}
                  >
                    <MenuItem value="Video">Video</MenuItem>
                    <MenuItem value="Playlist">Playlist</MenuItem>
                    <MenuItem value="Article">Article</MenuItem>
                  </TextField>
                </Grid>
                <Grid item>
                  <ChipInput
                    className={classes.inputBox}
                    label="Topics"
                    variant="outlined"
                    helperText="Press enter to add topics"
                    value={jobDetails.skillsets}
                    onAdd={(chip) =>
                      setJobDetails({
                        ...jobDetails,
                        skillsets: [...jobDetails.skillsets, chip],
                      })
                    }
                    onDelete={(chip, index) => {
                      let skillsets = jobDetails.skillsets;
                      skillsets.splice(index, 1);
                      setJobDetails({
                        ...jobDetails,
                        skillsets: skillsets,
                      });
                    }}
                    fullWidth
                  />
                </Grid>
              </Grid>
              <Button
                variant="contained"
                color="primary"
                style={{ padding: "10px 50px", marginTop: "30px" }}
                onClick={() => handleUpdate()}
              >
                Create Resource
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default CreateResources;
