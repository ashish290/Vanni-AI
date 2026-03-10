import { signToken } from "../utils/jwtUtils.js";

export const googleCallback = (req, res) => {
  console.log("google auth callback hit");
  const token = signToken(req.user);
  res.redirect(
    `${process.env.FRONTEND_URL}/auth/callback?token=${token}&name=${encodeURIComponent(
      req.user.name,
    )}`,
  );
};

export const githubCallback = (req, res) => {
  console.log("github auth callback hit");
  const token = signToken(req.user);
  res.redirect(
    `${process.env.FRONTEND_URL}/auth/callback?token=${token}&name=${encodeURIComponent(
      req.user.name,
    )}`,
  );
};
