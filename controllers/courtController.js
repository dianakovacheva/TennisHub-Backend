const { Club, Court } = require("../models");

// Create court
function createCourt(req, res) {
  const { clubId, courtName, surface, indoor, lighting } = req.body;

  Court.create({
    clubId,
    courtName,
    surface,
    indoor,
    lighting,
  })
    .then((createdCourt) => {
      if (createdCourt) {
        Club.updateOne(
          {
            _id: clubId,
          },
          { $addToSet: { courts: createdCourt._id } },
          { new: true }
        )
          .then(res.status(200).json(createdCourt))
          .catch((error) => {
            res.status(500).json(error);
          });
      } else {
        res.status(401).json({ message: `Not allowed!` });
      }
    })
    .catch((error) => {
      res.status(500).json(error);
    });
}

// Edit court
function editCourt(req, res) {
  const { courtId } = req.params;
  const { clubId, courtName, surface, indoor, lighting } = req.body;

  Court.findOneAndUpdate(
    {
      _id: courtId,
    },
    {
      clubId: { _id: clubId },
      courtName: courtName,
      surface: surface,
      indoor: indoor,
      lighting: lighting,
    },
    { new: true }
  )
    .then((updatedCourt) => {
      if (updatedCourt) {
        res.status(200).json(updatedCourt);
      } else {
        res.status(401).json({ message: `Not allowed!` });
      }
    })
    .catch((error) => {
      res.status(500).json(error);
    });
}

// Delete court
function deleteCourt(req, res) {
  const { courtId, clubId } = req.params;
  // const { clubId } = req.body;

  Promise.all([
    Court.findOneAndDelete({ _id: courtId }),
    Club.findOneAndUpdate(
      { _id: clubId },
      {
        $pull: {
          courts: courtId,
        },
      },
      { new: true }
    ),
  ])
    .then(([deletedOne, _]) => {
      if (deletedOne) {
        res.status(200).json(deletedOne);
      } else {
        res.status(401).json({ message: `Not allowed!` });
      }
    })
    .catch((error) => {
      res.status(500).json(error);
    });
}

module.exports = {
  createCourt,
  editCourt,
  deleteCourt,
};
