import { useState, useEffect } from "react";
import {
  Button,
  Chip,
  Grid,
  IconButton,
  InputAdornment,
  makeStyles,
  Paper,
  TextField,
  Typography,
  Modal,
  Slider,
  FormControlLabel,
  FormGroup,
  MenuItem,
  Checkbox,
} from "@material-ui/core";
import { useNavigate } from "react-router-dom";
import Rating from "@material-ui/lab/Rating";
import Pagination from "@material-ui/lab/Pagination";
import axios from "axios";
import SearchIcon from "@material-ui/icons/Search";
import FilterListIcon from "@material-ui/icons/FilterList";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import { useToast } from "@chakra-ui/react";
import { ChatState } from "../../Context/ChatProvider";

const useStyles = makeStyles((theme) => ({
  body: {
    height: "inherit",
  },
  button: {
    width: "100%",
    height: "100%",
  },
  jobTileOuter: {
    padding: "30px",
    margin: "20px 0",
    boxSizing: "border-box",
    width: "100%",
  },
  popupDialog: {
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  statusBlock: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textTransform: "uppercase",
  },
}));

const JobTile = ({user, ...props}) => {
  const classes = useStyles();
  const reactNavigator = useNavigate();
  const { job, getData } = props;
  const toast = useToast();

  const [open, setOpen] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [jobDetails, setJobDetails] = useState(job);

  console.log(jobDetails);

  const handleInput = (key, value) => {
    setJobDetails({
      ...jobDetails,
      [key]: value,
    });
  };

  const handleClick = (location) => {
    reactNavigator(location);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCloseUpdate = () => {
    setOpenUpdate(false);
  };

  const handleDelete = () => {
    console.log(job._id);
    const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        params: {
          user
        }
      };
    axios
      .delete(`/api/jobs/${job._id}`, config)
      .then((response) => {
        toast({
            status: "success",
            duration: 5000,
            isClosable: true,
            position: "bottom",
            description: response.data.message,
        });
        getData();
        handleClose();
      })
      .catch((err) => {
        console.log(err.response);
        toast({
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom",
            description: err.response.data.message,
        });
        handleClose();
      });
  };

  const handleJobUpdate = () => {
    const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        params: {
          user
        }
      };
    axios
      .put(`/api/jobs/${job._id}`, jobDetails, config)
      .then((response) => {
        toast({
            status: "success",
            duration: 5000,
            isClosable: true,
            position: "bottom",
            description: response.data.message,
        });
        getData();
        handleCloseUpdate();
      })
      .catch((err) => {
        console.log(err.response);
        toast({
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom",
            description: err.response.data.message,
        });
        handleCloseUpdate();
      });
  };

  const postedOn = new Date(job.dateOfPosting);

  return (
    <Paper className={classes.jobTileOuter} elevation={3}>
      <Grid container>
        <Grid container item xs={9} spacing={1} direction="column">
          <Grid item>
            <Typography variant="h5">{job.title}</Typography>
          </Grid>
          {/* <Grid item>
            <Rating value={job.rating !== -1 ? job.rating : null} readOnly />
          </Grid> */}
          <Grid item>Role : {job.jobType}</Grid>
          {job.salary > 0 
            ?(<Grid item>Salary : &#8377; {job.salary} per month</Grid>)
            :(<Grid item>Salary : See Job Details</Grid>)
          }
          <Grid item>Experience required : {job.experience} </Grid>
          <Grid item>
            Duration :{" "}
            {job.duration !== 0 ? `${job.duration} month` : `Flexible`}
          </Grid>
          <Grid item>Date Of Posting: {postedOn.toLocaleDateString()}</Grid>
          <Grid item>Number of Applicants: {job.maxApplicants}</Grid>
          <Grid item>
            Remaining Number of Positions:{" "}
            {job.maxPositions - job.acceptedCandidates}
          </Grid>
          <Grid item>
            {job.skillsets.map((skill) => (
              <Chip label={skill} style={{ marginRight: "2px" }} />
            ))}
          </Grid>
          <Grid item>
            {job.locations.map((location) => (
              <Chip label={location} style={{ marginRight: "2px" }} />
            ))}
          </Grid>
        </Grid>
        <Grid item container direction="column" xs={3}>
          {/* <Grid item xs>
            {
              <Button
              variant="contained"
              color="primary"
              className={classes.statusBlock}
              onClick={() => handleClick(`/job/applications/${job._id}`)}
            >
              View Applications
            </Button>
            }
          </Grid> */}
          <Grid item style={{marginBottom: '10px'}}>
            { user._id === "6282b84e22de0cdcf16c17d2" && <Button
              variant="contained"
              className={classes.statusBlock}
              onClick={() => {
                setOpenUpdate(true);
              }}
              style={{
                background: "#FC7A1E",
                color: "#fff",
              }}
            >
              Update Details
            </Button>
            }
          </Grid>
          <Grid item>
            { user._id === "6282b84e22de0cdcf16c17d2" && <Button
              variant="contained"
              color="secondary"
              className={classes.statusBlock}
              onClick={() => {
                setOpen(true);
              }}
            >
              Delete Job
            </Button>
            }
          </Grid>
        </Grid>
      </Grid>
      <Modal open={open} onClose={handleClose} className={classes.popupDialog}>
        <Paper
          style={{
            padding: "20px",
            outline: "none",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            minWidth: "30%",
            alignItems: "center",
          }}
        >
          <Typography variant="h4" style={{ marginBottom: "10px" }}>
            Are you sure?
          </Typography>
          <Grid container justify="center" spacing={5}>
            <Grid item>
              <Button
                variant="contained"
                color="secondary"
                style={{ padding: "10px 50px" }}
                onClick={() => handleDelete()}
              >
                Delete
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                style={{ padding: "10px 50px" }}
                onClick={() => handleClose()}
              >
                Cancel
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Modal>
      <Modal
        open={openUpdate}
        onClose={handleCloseUpdate}
        className={classes.popupDialog}
      >
        <Paper
          style={{
            padding: "20px",
            outline: "none",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            minWidth: "30%",
            alignItems: "center",
          }}
        >
          <Typography variant="h4" style={{ marginBottom: "10px" }}>
            Update Details
          </Typography>
          <Grid
            container
            direction="column"
            spacing={3}
            style={{ margin: "10px" }}
          >
            <Grid item>
              <TextField
                label="Update Application Deadline"
                type="datetime-local"
                value={jobDetails.deadline.substr(0, 16)}
                onChange={(event) => {
                  handleInput("deadline", event.target.value);
                }}
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
                fullWidth
              />
            </Grid>
            <Grid item>
              <TextField
                label="Update Job Link"
                type="link"
                value={jobDetails.link}
                onChange={(event) => {
                  handleInput("link", event.target.value);
                }}
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
                fullWidth
              />
            </Grid>
            {/* <Grid item>
              <TextField
                label="Update Maximum Number Of Applicants"
                type="number"
                variant="outlined"
                value={jobDetails.maxApplicants}
                onChange={(event) => {
                  handleInput("maxApplicants", event.target.value);
                }}
                InputProps={{ inputProps: { min: 1 } }}
                fullWidth
              />
            </Grid> */}
            {/* <Grid item>
              <TextField
                label="Update Positions Available"
                type="number"
                variant="outlined"
                value={jobDetails.maxPositions}
                onChange={(event) => {
                  handleInput("maxPositions", event.target.value);
                }}
                InputProps={{ inputProps: { min: 1 } }}
                fullWidth
              />
            </Grid> */}
          </Grid>
          <Grid container justify="center" spacing={5}>
            <Grid item>
              <Button
                variant="contained"
                color="secondary"
                style={{ padding: "10px 50px" }}
                onClick={() => handleJobUpdate()}
              >
                Update
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                style={{ padding: "10px 50px" }}
                onClick={() => handleCloseUpdate()}
              >
                Cancel
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Modal>
    </Paper>
  );
};

const FilterPopup = (props) => {
  const classes = useStyles();
  const { open, handleClose, searchOptions, setSearchOptions, getData } = props;
  return (
    <Modal open={open} onClose={handleClose} className={classes.popupDialog}>
      <Paper
        style={{
          padding: "50px",
          outline: "none",
          minWidth: "50%",
        }}
      >
        <Grid container direction="column" alignItems="center" spacing={3}>
          <Grid container item alignItems="center">
            <Grid item xs={3}>
              Job Type
            </Grid>
            <Grid
              container
              item
              xs={9}
              justify="space-around"
              // alignItems="center"
            >
              <Grid item>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="fullTime"
                      checked={searchOptions.jobType.fullTime}
                      onChange={(event) => {
                        setSearchOptions({
                          ...searchOptions,
                          jobType: {
                            ...searchOptions.jobType,
                            [event.target.name]: event.target.checked,
                          },
                        });
                      }}
                    />
                  }
                  label="Full Time"
                />
              </Grid>
              <Grid item>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="partTime"
                      checked={searchOptions.jobType.partTime}
                      onChange={(event) => {
                        setSearchOptions({
                          ...searchOptions,
                          jobType: {
                            ...searchOptions.jobType,
                            [event.target.name]: event.target.checked,
                          },
                        });
                      }}
                    />
                  }
                  label="Part Time"
                />
              </Grid>
              <Grid item>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="wfh"
                      checked={searchOptions.jobType.wfh}
                      onChange={(event) => {
                        setSearchOptions({
                          ...searchOptions,
                          jobType: {
                            ...searchOptions.jobType,
                            [event.target.name]: event.target.checked,
                          },
                        });
                      }}
                    />
                  }
                  label="Work From Home"
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid container item alignItems="center">
            <Grid item xs={3}>
              Salary
            </Grid>
            <Grid item xs={9}>
              <Slider
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => {
                  return value * (100000 / 100);
                }}
                marks={[
                  { value: 0, label: "0" },
                  { value: 100, label: "100000" },
                ]}
                value={searchOptions.salary}
                onChange={(event, value) =>
                  setSearchOptions({
                    ...searchOptions,
                    salary: value,
                  })
                }
              />
            </Grid>
          </Grid>
          <Grid container item alignItems="center">
            <Grid item xs={3}>
              Duration
            </Grid>
            <Grid item xs={9}>
              <TextField
                select
                label="Duration"
                variant="outlined"
                fullWidth
                value={searchOptions.duration}
                onChange={(event) =>
                  setSearchOptions({
                    ...searchOptions,
                    duration: event.target.value,
                  })
                }
              >
                <MenuItem value="0">All</MenuItem>
                <MenuItem value="1">1</MenuItem>
                <MenuItem value="2">2</MenuItem>
                <MenuItem value="3">3</MenuItem>
                <MenuItem value="4">4</MenuItem>
                <MenuItem value="5">5</MenuItem>
                <MenuItem value="6">6</MenuItem>
                <MenuItem value="7">7</MenuItem>
              </TextField>
            </Grid>
          </Grid>
          <Grid container item alignItems="center">
            <Grid item xs={3}>
              Sort
            </Grid>
            <Grid item container direction="row" xs={9}>
              <Grid
                item
                container
                xs={4}
                justify="space-around"
                alignItems="center"
                style={{ border: "1px solid #D1D1D1", borderRadius: "5px" }}
              >
                <Grid item>
                  <Checkbox
                    name="salary"
                    checked={searchOptions.sort.salary.status}
                    onChange={(event) =>
                      setSearchOptions({
                        ...searchOptions,
                        sort: {
                          ...searchOptions.sort,
                          salary: {
                            ...searchOptions.sort.salary,
                            status: event.target.checked,
                          },
                        },
                      })
                    }
                    id="salary"
                  />
                </Grid>
                <Grid item>
                  <label for="salary">
                    <Typography>Salary</Typography>
                  </label>
                </Grid>
                <Grid item>
                  <IconButton
                    disabled={!searchOptions.sort.salary.status}
                    onClick={() => {
                      setSearchOptions({
                        ...searchOptions,
                        sort: {
                          ...searchOptions.sort,
                          salary: {
                            ...searchOptions.sort.salary,
                            desc: !searchOptions.sort.salary.desc,
                          },
                        },
                      });
                    }}
                  >
                    {searchOptions.sort.salary.desc ? (
                      <ArrowDownwardIcon />
                    ) : (
                      <ArrowUpwardIcon />
                    )}
                  </IconButton>
                </Grid>
              </Grid>
              <Grid
                item
                container
                xs={4}
                justify="space-around"
                alignItems="center"
                style={{ border: "1px solid #D1D1D1", borderRadius: "5px" }}
              >
                <Grid item>
                  <Checkbox
                    name="duration"
                    checked={searchOptions.sort.duration.status}
                    onChange={(event) =>
                      setSearchOptions({
                        ...searchOptions,
                        sort: {
                          ...searchOptions.sort,
                          duration: {
                            ...searchOptions.sort.duration,
                            status: event.target.checked,
                          },
                        },
                      })
                    }
                    id="duration"
                  />
                </Grid>
                <Grid item>
                  <label for="duration">
                    <Typography>Duration</Typography>
                  </label>
                </Grid>
                <Grid item>
                  <IconButton
                    disabled={!searchOptions.sort.duration.status}
                    onClick={() => {
                      setSearchOptions({
                        ...searchOptions,
                        sort: {
                          ...searchOptions.sort,
                          duration: {
                            ...searchOptions.sort.duration,
                            desc: !searchOptions.sort.duration.desc,
                          },
                        },
                      });
                    }}
                  >
                    {searchOptions.sort.duration.desc ? (
                      <ArrowDownwardIcon />
                    ) : (
                      <ArrowUpwardIcon />
                    )}
                  </IconButton>
                </Grid>
              </Grid>
              <Grid
                item
                container
                xs={4}
                justify="space-around"
                alignItems="center"
                style={{ border: "1px solid #D1D1D1", borderRadius: "5px" }}
              >
                <Grid item>
                  <Checkbox
                    name="rating"
                    checked={searchOptions.sort.rating.status}
                    onChange={(event) =>
                      setSearchOptions({
                        ...searchOptions,
                        sort: {
                          ...searchOptions.sort,
                          rating: {
                            ...searchOptions.sort.rating,
                            status: event.target.checked,
                          },
                        },
                      })
                    }
                    id="rating"
                  />
                </Grid>
                <Grid item>
                  <label for="rating">
                    <Typography>Rating</Typography>
                  </label>
                </Grid>
                <Grid item>
                  <IconButton
                    disabled={!searchOptions.sort.rating.status}
                    onClick={() => {
                      setSearchOptions({
                        ...searchOptions,
                        sort: {
                          ...searchOptions.sort,
                          rating: {
                            ...searchOptions.sort.rating,
                            desc: !searchOptions.sort.rating.desc,
                          },
                        },
                      });
                    }}
                  >
                    {searchOptions.sort.rating.desc ? (
                      <ArrowDownwardIcon />
                    ) : (
                      <ArrowUpwardIcon />
                    )}
                  </IconButton>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid item>
            <Button
              variant="contained"
              color="primary"
              style={{ padding: "10px 50px" }}
              onClick={() => getData()}
            >
              Apply
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Modal>
  );
};

const MyJobs = (props) => {
  const { user } = ChatState();
  console.log('user', user);
  const toast = useToast();
  const [jobs, setJobs] = useState([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [searchOptions, setSearchOptions] = useState({
    query: "",
    jobType: {
      fullTime: false,
      partTime: false,
      wfh: false,
    },
    salary: [0, 100],
    duration: "0",
    sort: {
      salary: {
        status: false,
        desc: false,
      },
      duration: {
        status: false,
        desc: false,
      },
      rating: {
        status: false,
        desc: false,
      },
    },
  });

  const navigate = useNavigate();
  useEffect(() => {

    if(user !== undefined) {
      getData();
    }
    if(user !== undefined && user._id !== "6282b84e22de0cdcf16c17d2") {
      window.location = `/chats`;
    }
  }, [user]);

  const getData = () => {
    let searchParams = [`myjobs=1`];

    if (searchOptions.query !== "") {
      searchParams = [...searchParams, `q=${searchOptions.query}`];
    }
    if (searchOptions.jobType.fullTime) {
      searchParams = [...searchParams, `jobType=Full%20Time`];
    }
    if (searchOptions.jobType.partTime) {
      searchParams = [...searchParams, `jobType=Part%20Time`];
    }
    if (searchOptions.jobType.wfh) {
      searchParams = [...searchParams, `jobType=Work%20From%20Home`];
    }
    if (searchOptions.salary[0] != 0) {
      searchParams = [
        ...searchParams,
        `salaryMin=${searchOptions.salary[0] * 1000}`,
      ];
    }
    if (searchOptions.salary[1] != 100) {
      searchParams = [
        ...searchParams,
        `salaryMax=${searchOptions.salary[1] * 1000}`,
      ];
    }
    if (searchOptions.duration != "0") {
      searchParams = [...searchParams, `duration=${searchOptions.duration}`];
    }

    let asc = [],
      desc = [];

    Object.keys(searchOptions.sort).forEach((obj) => {
      const item = searchOptions.sort[obj];
      if (item.status) {
        if (item.desc) {
          desc = [...desc, `desc=${obj}`];
        } else {
          asc = [...asc, `asc=${obj}`];
        }
      }
    });
    searchParams = [...searchParams, ...asc, ...desc];
    const queryString = searchParams.join("&");
    console.log(queryString);
    let address = "/api/jobs";
    if (queryString !== "") {
      address = `${address}?${queryString}`;
    }

    console.log(address, user);
    const config = {
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    };
    axios
      .get(address, config)
      .then((response) => {
        console.log(response.data);
        setJobs(response.data);
      })
      .catch((err) => {
        console.log(err.response.data);
        toast({
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom",
            description: err.response.data.message,
        });
      });
  };

  return (
    <>
      <Grid
        container
        item
        direction="column"
        alignItems="center"
        style={{ padding: "30px", minHeight: "93vh", marginBottom: "30px"}}
      >
        <Grid
          item
          container
          direction="column"
          justify="center"
          alignItems="center"
        >
          <Grid item xs>
            <Typography variant="h2">All Added Jobs</Typography>
          </Grid>
          {/* <Grid item xs>
            <TextField
              label="Search Jobs"
              value={searchOptions.query}
              onChange={(event) =>
                setSearchOptions({
                  ...searchOptions,
                  query: event.target.value,
                })
              }
              onKeyPress={(ev) => {
                if (ev.key === "Enter") {
                  getData();
                }
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment>
                    <IconButton onClick={() => getData()}>
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              style={{ width: "500px" }}
              variant="outlined"
            />
          </Grid> */}
          {/* <Grid item>
            <IconButton onClick={() => setFilterOpen(true)}>
              <FilterListIcon />
            </IconButton>
          </Grid> */}
        </Grid>

        <Grid
          container
          item
          xs
          direction="column"
          alignItems="stretch"
          justify="center"
        >
          {jobs.length > 0 ? (
            jobs.map((job) => {
              return <JobTile job={job} getData={getData} user={user} />;
            })
          ) : (
            <Typography variant="h5" style={{ textAlign: "center" }}>
              No jobs found
            </Typography>
          )}
        </Grid>
      </Grid>
      <FilterPopup
        open={filterOpen}
        searchOptions={searchOptions}
        setSearchOptions={setSearchOptions}
        handleClose={() => setFilterOpen(false)}
        getData={() => {
          getData();
          setFilterOpen(false);
        }}
        user={user}
      />
    </>
  );
};

export default MyJobs;
