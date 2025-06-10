const { Expo } = require('expo-server-sdk');
let expo = new Expo();

exports.sendPush = async (pushToken, title, body) => {
  if (!Expo.isExpoPushToken(pushToken)) {
    console.error('❌ Ongeldig token', pushToken);
    return;
  }

  const message = {
    to: pushToken,
    sound: 'default',
    title: title,
    body: body,
  };

  try {
    let ticket = await expo.sendPushNotificationsAsync([message]);
    console.log('✅ Push sent:', ticket);
  } catch (err) {
    console.error('❌ Push failed:', err);
  }
};
