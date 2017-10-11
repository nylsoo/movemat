import express from 'express';
import passport from 'passport';

const router = express.Router();

// User login
router.post('/login', (req, res, next) => {
  // TODO: Add check for bots.
  passport.authenticate('local-login', (err, user, info) => {
    if(err) { return next(err); }
    if(!user) {
      return res.json({ success: false,
        messages: {
          password: 'Wachtwoord komt niet overeen met gebruikersnaam',
          name: 'Gebruikersnaam komt niet overeen met wachtwoord',
        },
      });
    }
    req.login(user, (loginErr) => {
      if(loginErr) { console.log(loginErr); return next(loginErr); }
      return res.json({
        success: true,
      });
    });
  })(req, res, next);
});

// Check if user is still logged in.
router.get('/isLoggedIn', (req, res) => {
  if(!req.user) return res.json({ loggedIn: false });
  return res.json({ loggedIn: true });
});

// Log out user.
router.get('/logout', (req, res) => {
  if(!req.user) return res.json({ loggedIn: false });
  req.session.destroy(() => res.json({ loggedIn: false }));
});

export default router;
