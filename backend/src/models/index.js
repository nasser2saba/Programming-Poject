const ReminderLog = require('./reminderLog');

Medication.hasMany(ReminderLog, { foreignKey: 'medication_id' });
ReminderLog.belongsTo(Medication, { foreignKey: 'medication_id' });
