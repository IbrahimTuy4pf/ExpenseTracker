// ============================================
// BACKEND SERVER - MAIN ENTRY POINT
// ============================================
// This file is the HEART of your backend server.
// It starts the server and sets up all the tools needed
// to handle requests from the frontend.

// IMPORT STATEMENTS - Bringing in code from other files/packages
// Think of this like gathering all the tools you need before starting work

// CORS = Cross-Origin Resource Sharing
// WHY: Your frontend runs on http://localhost:3000 and backend on http://localhost:8000
//      They are different "origins", so browsers block requests between them by default
//      CORS tells the browser "it's OK, allow these requests"
import cors from "cors";

// EXPRESS = A web framework for Node.js
// WHY: Makes it easy to create a server and handle HTTP requests/responses
//      Without Express, you'd need to write a lot more code to handle requests
import express from "express";

// DOTENV = Loads environment variables from .env file
// WHY: Keeps sensitive info (like passwords, API keys) out of your code
//      The .env file is NOT committed to git (it's in .gitignore for security)
import dotenv from "dotenv";

// EXPRESS-SESSION = Manages user sessions (like "keeping you logged in")
// WHY: When you log in, we store your session info so you don't have to log in again
//      It's like a wristband at a theme park - shows you're already "checked in"
import session from "express-session";

// COOKIE-PARSER = Parses cookies from incoming requests
// WHY: Cookies are small pieces of data stored in the browser
//      We use them to store your authentication token securely
import cookieParser from "cookie-parser";

// PASSPORT = Authentication middleware (handles login strategies like Google OAuth)
// WHY: Makes it easy to add different ways to log in (email/password, Google, etc.)
//      Without this, you'd need to write authentication code from scratch
import passport from "./libs/passport.js";

// ROUTES = Our custom file that defines all API endpoints
// WHY: Instead of putting all route handlers here, we organize them in separate files
//      This makes the code cleaner and easier to maintain
import routes from "./routes/index.js";

// DOTENV.CONFIG() - Load environment variables from .env file
// WHY: This must be called BEFORE using process.env variables
//      It reads the .env file and makes variables available via process.env.VARIABLE_NAME
dotenv.config();

// CREATE EXPRESS APPLICATION
// This creates our web server application
// Think of it like turning on a computer - it's ready to work but not doing anything yet
const app = express();

// SET THE PORT NUMBER
// PORT = The "door number" where our server will listen for requests
// process.env.PORT = Check if PORT is defined in .env file
// || 8000 = If not found, use port 8000 as default
// WHY: Allows flexibility - you can change the port in .env without changing code
const PORT = process.env.PORT || 8000;

// CORS CONFIGURATION - Allow frontend to communicate with backend
// app.use() = Add middleware (code that runs on EVERY request)
// WHY: This MUST be before other middleware so it handles requests first

app.use(cors({
  // origin: true = Allow ALL origins (websites) to access this API
  // WHY: In development, this makes testing easier
  //      In production, you'd set this to specific domains like "https://yourdomain.com"
  origin: true,
  
  // credentials: true = Allow cookies and authentication headers
  // WHY: Our authentication uses cookies, so we need this enabled
  credentials: true,
  
  // methods = Which HTTP methods are allowed (GET, POST, PUT, DELETE, etc.)
  // WHY: Some browsers check what methods are allowed before making requests
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  
  // allowedHeaders = Which HTTP headers the browser can send
  // WHY: "Authorization" header is used for JWT tokens, "Content-Type" for JSON data
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// JSON PARSER MIDDLEWARE
// express.json() = Parses JSON data from request bodies
// limit: "10mb" = Maximum size of JSON data we'll accept (10 megabytes)
// WHY: When frontend sends data like { email: "user@example.com" }, this converts it to a JavaScript object
app.use(express.json({ limit: "10mb" }));

// URL-ENCODED PARSER MIDDLEWARE
// express.urlencoded() = Parses form data (like from HTML forms)
// extended: true = Allows rich objects and arrays in form data
// WHY: Handles data sent from HTML forms (though we mostly use JSON)
app.use(express.urlencoded({ extended: true }));

// COOKIE PARSER MIDDLEWARE
// cookieParser() = Parses cookies from incoming requests
// WHY: Makes cookies available via req.cookies (we use this for authentication tokens)
app.use(cookieParser());

// SESSION CONFIGURATION - How to manage user sessions
// Sessions = A way to keep users logged in without asking for password every time
// Think of it like a coat check ticket - you get a ticket, and later use it to get your coat back

app.use(session({
  // secret = Secret key used to sign (encrypt) session cookies
  // WHY: This prevents people from tampering with session data
  //      We check multiple places: SESSION_SECRET, then JWT_SECRET, then a default (change this!)
  secret: process.env.SESSION_SECRET || process.env.JWT_SECRET || "your-secret-key-change-this",
  
  // resave: false = Don't save session if nothing changed
  // WHY: Saves unnecessary database/Redis writes (better performance)
  resave: false,
  
  // saveUninitialized: false = Don't create session until user logs in
  // WHY: Saves storage space - only logged-in users get sessions
  saveUninitialized: false,
  
  // cookie = Configuration for the session cookie itself
  cookie: {
    // secure = Only send cookie over HTTPS (in production)
    // WHY: HTTPS encrypts data, so cookies are safer from hackers
    //      In development (localhost), we use false because localhost isn't HTTPS
    secure: process.env.NODE_ENV === "production",
    
    // httpOnly = JavaScript can't access this cookie (prevents XSS attacks)
    // WHY: If a hacker injects malicious JavaScript, they can't steal your session cookie
    httpOnly: true,
    
    // maxAge = How long the cookie lasts (24 hours in milliseconds)
    // WHY: 24 * 60 * 60 * 1000 = 24 hours * 60 minutes * 60 seconds * 1000 milliseconds
    //      After this time, user must log in again
    maxAge: 24 * 60 * 60 * 1000,
    
    // sameSite = Controls when browser sends the cookie
    // "lax" (dev) = Send cookie for same-site requests (safer)
    // "none" (prod) = Send cookie for cross-site requests (needed for OAuth redirects)
    // WHY: Prevents CSRF attacks (where another site tries to use your session)
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
  }
}));

// PASSPORT INITIALIZATION - Set up authentication strategies
// Passport = Middleware for handling different login methods (email/password, Google, etc.)

// passport.initialize() = Start up Passport middleware
// WHY: Makes Passport available to handle authentication requests
app.use(passport.initialize());

// passport.session() = Connect Passport to session management
// WHY: Allows Passport to store/retrieve user info from sessions
//      This is what keeps you logged in after Google OAuth
app.use(passport.session());

// REGISTER ROUTES - Connect all API endpoints
// "/api-v1" = All routes will start with this prefix
//             Example: /api-v1/auth/sign-in, /api-v1/account/create
// WHY: The prefix helps organize routes and makes it clear these are API endpoints
//      routes = Our custom file that defines all endpoints (see routes/index.js)
app.use("/api-v1", routes);

// 404 HANDLER - Catch any routes that don't exist
// "*" = Matches any URL that hasn't been handled by routes above
// WHY: This must be LAST (after all other routes) to catch unmatched requests
//      Returns a helpful JSON error instead of HTML error page
app.use("*", (req, res) => {
  res.status(404).json({
    status: "404 Not found",
    message: "Route not found",
  });
});

// START THE SERVER - Make it listen for requests
// app.listen() = Starts the server and makes it listen on the specified port
// PORT = The port number (from above, either from .env or default 8000)
// () => { ... } = Callback function that runs when server starts
// WHY: The server must be started explicitly - it doesn't start automatically
//      The console.log confirms the server is running and on which port
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});


