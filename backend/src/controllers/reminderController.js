const ReminderLog = require('../models/reminderLog');
const Medication = require('../models/medication');

exports.logReminder = async (req, res) => {
  const { medication_id, status } = req.body;
  const log = await ReminderLog.create({
    medication_id,
    status,
    timestamp: new Date()
  });
  res.status(201).json(log);
};

exports.getLogs = async (req, res) => {
  const logs = await ReminderLog.findAll({
    include: {
      model: Medication,
      where: { userId: req.user.id }, // beveiligd per gebruiker
      attributes: ['naam'] // alleen naam als voorbeeld
    },
    order: [['timestamp', 'DESC']]
  });

  res.json(logs);
};


