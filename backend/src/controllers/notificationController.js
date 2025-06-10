const { Expo } = require('expo-server-sdk');
const User = require('../models/user');
let expo = new Expo();

exports.sendTestEmail = async (req, res) => {
  try {
    const user = req.user;
    await sendReminderEmail(
      user.email,
      'Medicatie Herinnering',
      'Vergeet je medicatie niet in te nemen!'
    );
    res.json({ message: 'Email verzonden' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Email verzenden mislukt' });
  }
};

exports.sendTestPush = async (req, res) => {
  try {
    const user = req.user;

    if (!user.expo_push_token) {
      return res.status(400).json({ error: 'Geen push token aanwezig' });
    }

    if (!Expo.isExpoPushToken(user.expo_push_token)) {
      return res.status(400).json({ error: 'Push token is ongeldig' });
    }

    const messages = [{
      to: user.expo_push_token,
      sound: 'default',
      title: 'Herinnering',
      body: 'Neem je medicatie in!',
      data: { someData: '💊' },
    }];

    const chunks = expo.chunkPushNotifications(messages);
    for (let chunk of chunks) {
      await expo.sendPushNotificationsAsync(chunk);
    }

    res.json({ message: 'Push verzonden' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Push verzenden mislukt' });
  }
};
