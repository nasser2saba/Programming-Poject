const Medication = require('../models/medication');

exports.create = async (req, res) => {
  try {
    const { naam, dosis, frequentie, startDate, endDate } = req.body;
    const med = await Medication.create({
      userId: req.user.id,
      naam, dosis, frequentie, startDate, endDate
    });
    res.status(201).json(med);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.list = async (req, res) => {
  const meds = await Medication.findAll({ where: { userId: req.user.id } });
  res.json(meds);
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