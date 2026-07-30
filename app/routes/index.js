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

    const registerAccountRoutes = () => {
        app.get("/", sessionHandler.displayWelcomePage);
        app.get("/login", sessionHandler.displayLoginPage);
        app.post("/login", sessionHandler.handleLoginRequest);
        app.get("/signup", sessionHandler.displaySignupPage);
        app.post("/signup", sessionHandler.handleSignup);
        app.get("/logout", sessionHandler.displayLogoutPage);
        app.get("/dashboard", isLoggedIn, sessionHandler.displayWelcomePage);
    };

    const registerEmployeeRoutes = () => {
        app.get("/profile", isLoggedIn, profileHandler.displayProfile);
        app.post("/profile", isLoggedIn, profileHandler.handleProfileUpdate);
        app.get("/benefits", isLoggedIn, benefitsHandler.displayBenefits);
        app.post("/benefits", isLoggedIn, benefitsHandler.updateBenefits);
    };

    const registerInvestmentRoutes = () => {
        app.get("/contributions", isLoggedIn, contributionsHandler.displayContributions);
        app.post("/contributions", isLoggedIn, contributionsHandler.handleContributionsUpdate);
        app.get("/allocations/:userId", isLoggedIn, allocationsHandler.displayAllocations);
        app.get("/research", isLoggedIn, researchHandler.displayResearch);
    };

    const registerContentRoutes = () => {
        app.get("/memos", isLoggedIn, memosHandler.displayMemos);
        app.post("/memos", isLoggedIn, memosHandler.addMemos);

        // Handle redirect for learning resources link
        app.get("/learn", isLoggedIn, (req, res) => {
            // Insecure way to handle redirects by taking redirect url from query string
            return res.redirect(req.query.url);
        });

        app.use("/tutorial", tutorialRouter);
    };

    registerAccountRoutes();
    registerEmployeeRoutes();
    registerInvestmentRoutes();
    registerContentRoutes();

    // Error handling middleware
    app.use(ErrorHandler);
};

module.exports = index;
