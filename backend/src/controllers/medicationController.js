const Medication = require('../models/medication');

exports.create = async (req, res) => {
  try {
    const { naam, dosis, frequentie, startDate, endDate, time } = req.body;

    const med = await Medication.create({
      userId: req.user.id,
      naam,
      dosis,
      frequentie,
      startDate,
      endDate,
      time,
    });

    res.status(201).json(med);
  } catch (err) {
    console.error('❌ Medicatie maken mislukt:', err);
    res.status(500).json({ error: err.message });
  }
};

    exports.getMedications = async (req, res) => {
      // example logic
      const userId = req.user.id;
      const meds = await Medication.findAll({ where: { userId } });
      res.json(meds);
    };


    exports.list = async (req, res) => {
      try {
        const meds = await Medication.findAll({ where: { userId: req.user.id } });
        res.json(meds);
      } catch (err) {
        console.error('❌ Fout bij ophalen medicijnen:', err);
        res.status(500).json({ error: 'Serverfout bij ophalen medicijnen' });
      }
    };


   exports.update = async (req, res) => {
     const { id } = req.params;
     const med = await Medication.findOne({ where: { id, userId: req.user.id } });
     if (!med) return res.status(404).json({ error: 'Niet gevonden' });
     await med.update(req.body);
     res.json(med);
   };

   exports.remove = async (req, res) => {
     const { id } = req.params;
     const deleted = await Medication.destroy({ where: { id, userId: req.user.id } });
     if (!deleted) return res.status(404).json({ error: 'Niet gevonden' });
     res.json({ message: 'Verwijderd' });
   };