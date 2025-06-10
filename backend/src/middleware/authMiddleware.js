const jwt = require('jsonwebtoken');
   const User = require('../models/user');

   module.exports = async (req, res, next) => {
     try {
       // 1) Haal token uit de Authorization-header
       const authHeader = req.headers.authorization;
       if (!authHeader || !authHeader.startsWith('Bearer ')) {
         return res.status(401).json({ error: 'Token ontbreekt' });
       }
       const token = authHeader.split(' ')[1];

       // 2) Verifieer token
       const decoded = jwt.verify(token, process.env.JWT_SECRET);

       // 3) Haal gebruiker op
       const user = await User.findByPk(decoded.id);
       if (!user) {
         return res.status(401).json({ error: 'Ongeldige token' });
       }

       // 4) Sla gebruiker op in req en ga door
       req.user = user;
       next();
     } catch (error) {
       console.error(error);
       return res.status(401).json({ error: 'Token niet geldig of verlopen' });
     }
   };

