> # ⚠️ INTENTIONALLY VULNERABLE APPLICATION — DO NOT DEPLOY ⚠️
>
> **This repository is a research artifact, not a usable application.**
>
> It is a modified fork of [OWASP/NodeGoat](https://github.com/OWASP/NodeGoat),
> an application that contains **deliberately planted security
> vulnerabilities** (injection, broken authentication and access control,
> insecure deserialization, XSS, ReDoS, SSRF) on top of a **dependency tree
> frozen around 2016–2019** with many known CVEs.
>
> **Do not deploy this code anywhere.** Do not run it on a shared machine, a
> hosting provider, a cloud account, or any network another person can reach.
> Running it exposes the host it runs on. The one-click deploy path that
> upstream offered has been **removed from this fork** for exactly that reason.
>
> **Why this fork exists:** it is the phase-2 target application of a private
> research project that evaluates free and low-cost **automated code-review
> tooling** (SAST, SCA, DAST, AI PR reviewers). The application is scanned; it
> is never served. Its documented vulnerabilities are used as a ground-truth
> list to measure what each tool detects.
>
> **This fork is NOT an OWASP project** and is not endorsed by, affiliated
> with, or maintained by OWASP or the NodeGoat maintainers. Upstream is the
> authoritative source of NodeGoat; report NodeGoat bugs
> [there](https://github.com/OWASP/NodeGoat/issues), not here.

---

## Modifications in this fork relative to upstream OWASP/NodeGoat

Fork point: upstream `master` at commit
[`c5cb68a7084e4ae7dcc60e6a98768720a81841e8`](https://github.com/OWASP/NodeGoat/commit/c5cb68a7084e4ae7dcc60e6a98768720a81841e8)
("Merge pull request #290 from za/add-blank-space").

Changes made here, in full:

1. **This README** — the "do not deploy" banner above, this modification list,
   and the removal described in item 2. No other README content was altered.
2. **The Heroku one-click deploy button and the whole "OPTION 3 — Deploy to
   Heroku" section were removed from this README**, together with the link to
   the publicly hosted `nodegoat.herokuapp.com` instance. The intent is that
   nothing in this repository invites a reader to stand the application up
   where others can reach it.
3. **Scanning workflows were added** under `.github/workflows/`:
   `audit-static.yml` (Semgrep, OSV-Scanner, Trivy, `npm audit`),
   `codeql.yml` (CodeQL, JavaScript), and `audit-dast.yml` (boots the app via
   `docker-compose` **inside an ephemeral GitHub Actions runner only** and
   points OWASP ZAP / Nuclei / Nikto at `127.0.0.1:4000` in that runner). They
   scan; they never publish, expose, or deploy the application.
4. **Upstream's own `e2e-test.yml` and `lint.yml` workflows were left on disk
   but disabled** through the GitHub Actions API, so they do not add failing
   runs (their Node 10/12/14 matrix no longer resolves on current runners).

**Deliberately NOT changed**, so that the code under test stays byte-identical
to upstream:

- the `LICENSE` file (Apache-2.0) and all upstream attribution;
- every line of application source, view, route, DAO and config;
- `package.json` / `package-lock.json` — the stale dependency tree *is* part of
  the measurement;
- `app.json`, `Procfile`, `Dockerfile` and `docker-compose.yml`. `app.json` and
  `Procfile` are Heroku deployment descriptors, but they are also part of the
  file tree that misconfiguration scanners are being measured against, so they
  are kept. With the deploy button and instructions gone, they are inert files;
  they are not an invitation to deploy.

The scanned commit is pinned and `master` is protected against force-pushes and
deletion so that automation (including Dependabot) cannot move the code under
test between scans. **Dependabot alerts are read as a measurement; Dependabot
update PRs are never merged here.**

---

# NodeGoat

Being lightweight, fast, and scalable, Node.js is becoming a widely adopted platform for developing web applications. This project provides an environment to learn how OWASP Top 10 security risks apply to web applications developed using Node.js and how to effectively address them.

## Getting Started

OWASP Top 10 for Node.js web applications:

### Know it!

This application bundled a tutorial page that explains the OWASP Top 10 vulnerabilities and how to fix them.

Once the application is running, you can access the tutorial page at [http://localhost:4000/tutorial](http://localhost:4000/tutorial) (or the port you have configured).

### Do it!

A vulnerable Node.js app for ninjas to exploit, toast, and fix — **on your own
isolated machine only**. Hint: Look for comments in the source code.
(Upstream links to a publicly hosted instance of this app; that link is
deliberately omitted from this fork.)

##### Default user accounts

The database comes pre-populated with these user accounts created as part of the seed data -
* Admin Account - u:`admin` p:`Admin_123`
* User Accounts (u:`user1` p:`User1_123`), (u:`user2` p:`User2_123`)
* New users can also be added using the sign-up page.

## How to Set Up Your Copy of NodeGoat

> Reminder: only on a throwaway, isolated, non-shared machine. See the banner
> at the top of this file.

### OPTION 1 - Run NodeGoat on your machine

1) Install [Node.js](http://nodejs.org/) - NodeGoat requires Node v8 or above

2) Clone the github repository:
   ```
   git clone https://github.com/OWASP/NodeGoat.git
   ```

3) Go to the directory:
   ```
   cd NodeGoat
   ```

4) Install node packages:
   ```
   npm install
   ```

5) Set up MongoDB. You can either install MongoDB locally or create a remote instance:

   * Using local MongoDB:
     1) Install [MongoDB Community Server](https://docs.mongodb.com/manual/administration/install-community/)
     2) Start [mongod](http://docs.mongodb.org/manual/reference/program/mongod/#bin.mongod)

   * Using remote MongoDB instance:
     1) [Deploy a MongoDB Atlas free tier cluster](https://docs.atlas.mongodb.com/tutorial/deploy-free-tier-cluster/) (M0 Sandbox)
     2) [Enable network access](https://docs.atlas.mongodb.com/security/add-ip-address-to-list/) to the cluster from your current IP address
     3) [Add a database user](https://docs.atlas.mongodb.com/tutorial/create-mongodb-user-for-cluster/) to the cluster
     4) Set the `MONGODB_URI` environment variable to the connection string of your cluster, which can be viewed in the cluster's
        [connect dialog](https://docs.atlas.mongodb.com/tutorial/connect-to-your-cluster/#connect-to-your-atlas-cluster). Select "Connect your application",
        set the driver to "Node.js" and the version to "2.2.12 or later". This will give a connection string in the form:
        ```
        mongodb://<username>:<password>@<cluster>/<dbname>?ssl=true&replicaSet=<rsname>&authSource=admin&retryWrites=true&w=majority
        ```
        The `<username>` and `<password>` fields need filling in with the details of the database user added earlier. The `<dbname>` field sets the name of the
        database nodegoat will use in the cluster (eg "nodegoat"). The other fields will already be filled in with the correct details for your cluster.

6) Populate MongoDB with the seed data required for the app:
   ```
   npm run db:seed
   ```
   By default this will use the "development" configuration, but the desired config can be passed as an argument if required.

7) Start the server. You can run the server using node or nodemon:
   * Start the server with node. This starts the NodeGoat application at [http://localhost:4000/](http://localhost:4000/):
     ```
     npm start
     ```
   * Start the server with nodemon, which will automatically restart the application when you make any changes. This starts the NodeGoat application at [http://localhost:5000/](http://localhost:5000/):
     ```
     npm run dev
     ```

#### Customizing the Default Application Configuration

By default the application will be hosted on port 4000 and will connect to a MongoDB instance at localhost:27017. To change this set the environment variables `PORT` and `MONGODB_URI`.

Other settings can be changed by updating the [config file](https://github.com/OWASP/NodeGoat/blob/master/config/env/all.js).

### OPTION 2 - Run NodeGoat on Docker

The repo includes the Dockerfile and docker-compose.yml necessary to set up the app and db instance, then connect them together.

1) Install [docker](https://docs.docker.com/installation/) and [docker compose](https://docs.docker.com/compose/install/) 

2) Clone the github repository:
   ```
   git clone https://github.com/OWASP/NodeGoat.git
   ```

3) Go to the directory:
   ```
   cd NodeGoat
   ```

4) Build the images:
   ```
   docker-compose build
   ```

5) Run the app, this starts the NodeGoat application at http://localhost:4000/ — bind it to localhost only, never to a routable interface:
   ```
   docker-compose up
   ```

### OPTION 3 - removed in this fork

Upstream offers a one-click "Deploy to Heroku" option. **It has been removed
here**: deploying this application makes an intentionally vulnerable host
reachable from the internet. There is no supported deployment path in this
fork.

## Report bugs, Feedback, Comments

NodeGoat itself is maintained upstream. Open a new
[issue](https://github.com/OWASP/NodeGoat/issues) against **OWASP/NodeGoat**,
or contact the team by joining the chat at
[Slack](https://owasp.slack.com/messages/project-nodegoat/) or
[Gitter](https://gitter.im/OWASP/NodeGoat). Do not report NodeGoat bugs against
this fork.

## Contributing

Please Follow [the contributing guide](CONTRIBUTING.md)

## Code Of Conduct (CoC)

This project is bound by a [Code of Conduct](CODE_OF_CONDUCT.md).

## Contributors

Here are the amazing [contributors](https://github.com/OWASP/NodeGoat/graphs/contributors) to the NodeGoat project.

## Supports

- Thanks to JetBrains for providing licenses to fantastic [WebStorm IDE](https://www.jetbrains.com/webstorm/) to build this project.

## License

Code licensed under the [Apache License v2.0.](http://www.apache.org/licenses/LICENSE-2.0)

Upstream copyright and licence notices are retained unchanged in
[`LICENSE`](LICENSE). This fork is a derivative work under Apache-2.0 §4; the
modifications it carries are listed at the top of this file.
