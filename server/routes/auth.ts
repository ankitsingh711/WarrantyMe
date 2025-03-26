import { Router, Response } from 'express';
import passport from 'passport';
import { AuthRequest } from '../middleware/auth';

const router = Router();

router.get('/google',
  passport.authenticate('google', { 
    scope: ['profile', 'email', 'https://www.googleapis.com/auth/drive.file']
  })
);

router.get('/google/callback',
  passport.authenticate('google', { 
    failureRedirect: '/login',
    session: true 
  }),
  (_req: AuthRequest, res: Response) => {
    res.redirect(process.env.CLIENT_URL!);
  }
);

router.get('/current-user', (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Not authenticated' });
  }
  return res.json(req.user);
});

router.post('/logout', (req: AuthRequest, res: Response) => {
  req.logout((err: any) => {
    if (err) {
      return res.status(500).json({ message: 'Error logging out' });
    }
    return res.json({ message: 'Logged out successfully' });
  });
});

export default router; 