const express = require("express")
const cors = require("cors")
const morgan = require("morgan")
const path = require("path")
const mongoose = require('mongoose')
const cookieParser = require("cookie-parser");
if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config();
}

import { first } from "./protected_functions/first"
import { register, login, logout, userData, newCookies, getEmails, emailData } from "./controllers/index.js"
import { verifyToken, refreshToken } from "./middleware/authjwt.js";
import {
	MessagePost, MessageGet, AllConversationGet, ConversationGetFriendId, Seen, sendFriendRequest,
	cancelFriendRequest, removeFriendRequest, acceptFriendRequest,
	removeNotification, allNotifications, seenNotifications, AllFriendsGet, OtherUsersGet,
	deleteMessages, allSeen, SearchFriends,
	deliveredById, deliveredByConversationId, searchConversations, IsFriend, allFriendRequests, checkNotification, FriendDelete
} from "./controllers/whatsap";

const url = process.env.MONGO_URL
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection
db.once('open', _ => {
	console.log('Database connected:')
})
db.on('error', err => {
	console.error('connection error:', err)
})

var corsOptions = {
	credentials: true,
	optionsSuccessStatus: 200,
	origin: [process.env.FRONTEND_APP_URL]
}

const app = express();
app.use(cors(corsOptions)) //for handling cors origin handling
app.use(express.json()) // to handle coming json data from client without body-parser
app.use(morgan("dev")) // to show each end point request in console log
app.use(cookieParser());
app.use((req,res,next)=>{
	res.setHeader('Access-Control-Allow-Origin', process.env.FRONTEND_APP_URL);
	res.setHeader('Access-Control-Allow-Methods','GET,POST,PUT,PATCH,DELETE');
	res.setHeader('Access-Control-Allow-Methods','Content-Type','Authorization');
	next(); 
})





app.get("/api/", (req, res) => { res.send("chatting server is running") })
app.get("/api/refreshToken", refreshToken, newCookies)
app.get("/api/register", register)
app.get("/api/login", login)
app.get("/api/userData", verifyToken, userData)
app.get("/api/emailData", verifyToken, emailData)
app.get("/api/allEmails", verifyToken, getEmails)
app.get("/api/logout", logout)
app.get("/api/user", verifyToken, first)
app.get("/api/messagePost", verifyToken, MessagePost)
app.get("/api/messageGet", verifyToken, MessageGet)
// app.get("/api/conversation", verifyToken, ConversationPost)
app.get("/api/allConversations", verifyToken, AllConversationGet)
app.get("/api/ConversationId", verifyToken, ConversationGetFriendId)
app.get("/api/isFriend", verifyToken, IsFriend)
// app.get("/api/friendId", verifyToken, IsFriendConversation)
app.get("/api/allFriends", verifyToken, AllFriendsGet)
app.get("/api/unfriend", verifyToken, FriendDelete)
// app.get("/api/friendId", verifyToken, FriendGetById)
// app.get("/api/friendEmail", verifyToken, FriendGetByEmail)
app.get("/api/otherUsers", verifyToken, OtherUsersGet)
app.get("/api/allSeen", verifyToken, allSeen)
app.get("/api/seen", verifyToken, Seen)
app.get("/api/deliveredById", verifyToken, deliveredById)
app.get("/api/deliveredByConversationId", verifyToken, deliveredByConversationId)
app.get("/api/search/conversations", verifyToken, searchConversations)
app.get("/api/search/friends", verifyToken, SearchFriends)
app.get("/api/sendFriendRequest", verifyToken, sendFriendRequest)
app.get("/api/cancelFriendRequest", verifyToken, cancelFriendRequest)
app.get("/api/checkFriendRequest", verifyToken, checkNotification)
app.get("/api/allNotification", verifyToken, allNotifications)
app.get("/api/allRequests", verifyToken, allFriendRequests)
app.get("/api/seenNotifications", verifyToken, seenNotifications)
app.get("/api/acceptFriendRequest", verifyToken, acceptFriendRequest)
app.get("/api/removeFriendRequest", verifyToken, removeFriendRequest)
app.get("/api/removeNotification", verifyToken, removeNotification)
app.get("/api/deleteMessages", deleteMessages)


if (process.env.NODE_ENV !== 'production') {
	app.use(express.static("client/build"))
	app.get("/api*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "client", "build", "index.html"))
	})
}


app.listen(process.env.PORT || 5000, console.log("server running on port 5000"))