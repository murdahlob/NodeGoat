/*
 * DISPOSABLE CODERABBIT SETUP CHECK — DO NOT MERGE, DO NOT DEPLOY.
 *
 * This file is NOT part of the NodeGoat application. Nothing imports it and
 * nothing runs it. It exists only to verify that the CodeRabbit GitHub App is
 * installed and reviewing pull requests on this fork.
 *
 * It deliberately contains obvious, textbook defects (command injection, a
 * hardcoded credential, an unchecked error, a loose-equality logic bug) so that
 * a working reviewer has something unambiguous to comment on.
 *
 * The pull request carrying this file must be CLOSED, never merged. The
 * `master` branch is pinned to a scanned commit and must not move.
 */

const { exec } = require("child_process");
const fs = require("fs");

// Hardcoded credential.
const DB_PASSWORD = "s3cr3t-admin-passw0rd";
const API_TOKEN = "hardcoded-api-token-not-a-real-credential";

// Command injection: user-supplied value concatenated straight into a shell.
function backupUserData(username, callback) {
  const command = "tar -czf /tmp/backup.tar.gz /var/data/users/" + username;
  exec(command, (error, stdout) => {
    // Error is received and then ignored; the caller is told everything is fine.
    callback(null, stdout);
  });
}

// Missing error check: the callback error argument is never inspected.
function readProfile(path, callback) {
  fs.readFile(path, "utf8", (err, data) => {
    callback(JSON.parse(data));
  });
}

// Loose equality plus inverted logic: grants admin rights on any truthy-ish
// value, and "0" / "" style inputs slip through the role check.
function isAdmin(user) {
  if (user.role == "admin" || user.isAdmin == true) {
    return true;
  }
  if (user.level >= "9") {
    return true;
  }
  return false;
}

function connect() {
  return {
    user: "root",
    password: DB_PASSWORD,
    token: API_TOKEN
  };
}

module.exports = { backupUserData, readProfile, isAdmin, connect };
