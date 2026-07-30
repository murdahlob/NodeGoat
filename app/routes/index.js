const SessionHandler = require("./session");
const ProfileHandler = require("./profile");
const BenefitsHandler = require("./benefits");
const ContributionsHandler = require("./contributions");
const AllocationsHandler = require("./allocations");
const MemosHandler = require("./memos");
const ResearchHandler = require("./research");
const tutorialRouter = require("./tutorial");
const ErrorHandler = require("./error").errorHandler;

const index = (app, db) => {

    "use strict";

    const sessionHandler = new SessionHandler(db);
    const profileHandler = new ProfileHandler(db);
    const benefitsHandler = new BenefitsHandler(db);
    const contributionsHandler = new ContributionsHandler(db);
    const allocationsHandler = new AllocationsHandler(db);
    const memosHandler = new MemosHandler(db);
    const researchHandler = new ResearchHandler(db);

    // Middleware to check if a user is logged in
    const isLoggedIn = sessionHandler.isLoggedInMiddleware;

    //Middleware to check if user has admin rights
    const isAdmin = sessionHandler.isAdminUserMiddleware;

    // Routes reachable without a session
    app.get("/", sessionHandler.displayWelcomePage);
    app.get("/login", sessionHandler.displayLoginPage);
    app.post("/login", sessionHandler.handleLoginRequest);
    app.get("/signup", sessionHandler.displaySignupPage);
    app.post("/signup", sessionHandler.handleSignup);
    app.get("/logout", sessionHandler.displayLogoutPage);

    // Routes that need a session, declared as [method, path, handler]
    const sessionRoutes = [
        ["get", "/dashboard", sessionHandler.displayWelcomePage],
        ["get", "/profile", profileHandler.displayProfile],
        ["post", "/profile", profileHandler.handleProfileUpdate],
        ["get", "/contributions", contributionsHandler.displayContributions],
        ["post", "/contributions", contributionsHandler.handleContributionsUpdate],
        ["get", "/benefits", benefitsHandler.displayBenefits],
        ["post", "/benefits", benefitsHandler.updateBenefits],
        ["get", "/allocations/:userId", allocationsHandler.displayAllocations],
        ["get", "/memos", memosHandler.displayMemos],
        ["post", "/memos", memosHandler.addMemos],
        ["get", "/research", researchHandler.displayResearch]
    ];

    sessionRoutes.forEach(([method, path, handler]) => app[method](path, isLoggedIn, handler));

    // Handle redirect for learning resources link
    app.get("/learn", isLoggedIn, (req, res) => {
        // Insecure way to handle redirects by taking redirect url from query string
        return res.redirect(req.query.url);
    });

    // Mount tutorial router
    app.use("/tutorial", tutorialRouter);

    // Error handling middleware
    app.use(ErrorHandler);
};

module.exports = index;
