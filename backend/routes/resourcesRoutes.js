const express = require("express");
const mongoose = require("mongoose");
const { protect } = require("../middleware/authMiddleware");

const Resources = require("../models/resourcesModel");

const router = express.Router();

// To add new resource
router.post("/", protect, (req, res) => {
    const user = req.body.user;
  
    if (user._id != "6282b84e22de0cdcf16c17d2") {
      res.status(401).json({
        message: "You don't have permissions to add resources",
      });
      return;
    }
  
    const data = req.body.jobDetails;
    console.log(req.body);
  
    let resource = new Resources({
      userId: user._id,
      title: data.title,
      author: data.author,
      topics: data.skillsets,
      type: data.type,
      link: data.link,
    });
  
    resource
      .save()
      .then(() => {
        res.json({ message: "Resource added successfully to the database" });
      })
      .catch((err) => {
        res.status(400).json(err);
      });
});


// to get all the resources [pagination] [for recruiter personal and for everyone]
router.get("/", protect,(req, res) => {
    const user = req.body;
    // console.log('user', user);
  
    let findParams = {};
    let sortParams = {};
  
    // const page = parseInt(req.query.page) ? parseInt(req.query.page) : 1;
    // const limit = parseInt(req.query.limit) ? parseInt(req.query.limit) : 10;
    // const skip = page - 1 >= 0 ? (page - 1) * limit : 0;
  
    // to list down jobs posted by a particular recruiter
    if (user._id === "6282b84e22de0cdcf16c17d2" && req.query.myjobs) {
      findParams = {
        ...findParams,
        userId: user._id,
      };
    }
  
    if (req.query.q) {
      findParams = {
        ...findParams,
        title: {
          $regex: new RegExp(req.query.q, "i"),
        },
      };
    }
  
    if (req.query.jobType) {
      let jobTypes = [];
      if (Array.isArray(req.query.jobType)) {
        jobTypes = req.query.jobType;
      } else {
        jobTypes = [req.query.jobType];
      }
      console.log(jobTypes);
      findParams = {
        ...findParams,
        jobType: {
          $in: jobTypes,
        },
      };
    }
  
    if (req.query.salaryMin && req.query.salaryMax) {
      findParams = {
        ...findParams,
        $and: [
          {
            salary: {
              $gte: parseInt(req.query.salaryMin),
            },
          },
          {
            salary: {
              $lte: parseInt(req.query.salaryMax),
            },
          },
        ],
      };
    } else if (req.query.salaryMin) {
      findParams = {
        ...findParams,
        salary: {
          $gte: parseInt(req.query.salaryMin),
        },
      };
    } else if (req.query.salaryMax) {
      findParams = {
        ...findParams,
        salary: {
          $lte: parseInt(req.query.salaryMax),
        },
      };
    }
  
    if (req.query.duration) {
      findParams = {
        ...findParams,
        duration: {
          $lt: parseInt(req.query.duration),
        },
      };
    }
  
    if (req.query.asc) {
      if (Array.isArray(req.query.asc)) {
        req.query.asc.map((key) => {
          sortParams = {
            ...sortParams,
            [key]: 1,
          };
        });
      } else {
        sortParams = {
          ...sortParams,
          [req.query.asc]: 1,
        };
      }
    }
  
    if (req.query.desc) {
      if (Array.isArray(req.query.desc)) {
        req.query.desc.map((key) => {
          sortParams = {
            ...sortParams,
            [key]: -1,
          };
        });
      } else {
        sortParams = {
          ...sortParams,
          [req.query.desc]: -1,
        };
      }
    }
  
    console.log(findParams);
    console.log(sortParams);
  
    let arr = [
      {
        $lookup: {
          from: "recruiterinfos",
          localField: "userId",
          foreignField: "userId",
          as: "recruiter",
        },
      },
      { $unwind: "$recruiter" },
      { $match: findParams },
    ];
  
    if (Object.keys(sortParams).length > 0) {
      arr = [
        {
          $lookup: {
            from: "recruiterinfos",
            localField: "userId",
            foreignField: "userId",
            as: "recruiter",
          },
        },
        { $unwind: "$recruiter" },
        { $match: findParams },
        {
          $sort: sortParams,
        },
      ];
    }
  
    console.log(arr);
  
    Resources.find()
      .then((posts) => {
        if (posts == null) {
          res.status(404).json({
            message: "No resources found",
          });
          return;
        }
        res.json(posts);
      })
      .catch((err) => {
        res.status(400).json(err);
      });
});

// to update info of a particular resources
router.put("/:id", protect, (req, res) => {
  const user = JSON.parse(req.query.user);
  console.log('user', user);
  if (user._id != "6282b84e22de0cdcf16c17d2") {
    res.status(401).json({
      message: "You don't have permissions to change the resource details",
    });
    return;
  }
  Resources.findOne({
    _id: req.params.id,
    userId: user._id,
  })
    .then((job) => {
      if (job == null) {
        res.status(404).json({
          message: "Resource does not exist",
        });
        return;
      }
      const data = req.body;
      console.log('data', data);
      if (data.link) {
        job.link = data.link;
      }
      job
        .save()
        .then(() => {
          res.json({
            message: "Resource details updated successfully",
          });
        })
        .catch((err) => {
          res.status(400).json(err);
        });
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

// to delete a resources
router.delete("/:id", protect, (req, res) => {
  const user = JSON.parse(req.query.user);
  console.log('user', user);
  if (user._id != "6282b84e22de0cdcf16c17d2") {
    res.status(401).json({
      message: "You don't have permissions to delete the job",
    });
    return;
  }
  Resources.findOneAndDelete({
    _id: req.params.id,
    userId: user._id,
  })
    .then((job) => {
      if (job === null) {
        res.status(401).json({
          message: "Resource Not Found",
        });
        return;
      }
      res.json({
        message: "Resource deleted successfully",
      });
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});
  

module.exports = router;