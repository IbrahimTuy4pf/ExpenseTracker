import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { pool } from "./database.js";
import { createJWT } from "./index.js";

// Only initialize Google OAuth if credentials are provided
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL || `${process.env.BACKEND_URL || "http://localhost:8000"}/api-v1/auth/google/callback`,
      },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const { id, displayName, emails, photos } = profile;
        const email = emails[0].value;
        const firstName = displayName.split(" ")[0];
        const photo = photos[0]?.value;

        // Check if user exists
        const userExist = await pool.query({
          text: "SELECT * FROM tbluser WHERE email = $1",
          values: [email],
        });

        let user = userExist.rows[0];

        if (user) {
          // Update provider if not set
          if (!user.provider) {
            await pool.query({
              text: "UPDATE tbluser SET provider = $1 WHERE id = $2",
              values: ["google", user.id],
            });
            user.provider = "google";
          }
        } else {
          // Create new user
          const newUser = await pool.query({
            text: `INSERT INTO tbluser (firstname, email, provider) VALUES ($1, $2, $3) RETURNING *`,
            values: [firstName, email, "google"],
          });
          user = newUser.rows[0];
        }

        user.password = undefined;
        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
    )
  );
} else {
  console.log("Google OAuth not configured - GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET required");
}

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const result = await pool.query({
      text: "SELECT * FROM tbluser WHERE id = $1",
      values: [id],
    });
    const user = result.rows[0];
    if (user) {
      user.password = undefined;
    }
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;

