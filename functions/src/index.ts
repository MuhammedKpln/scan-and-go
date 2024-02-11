import * as admin from "firebase-admin";
import createUserProfile from "./createUserProfile";
import onNewMessageObjectWritten from "./onNewMessageObjectWritten";

admin.initializeApp();

exports.onNewMessageObjectWritten = onNewMessageObjectWritten;
exports.createUserProfile = createUserProfile;
