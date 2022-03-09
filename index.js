const express = require("express")
const morgan = require("morgan")
const path = require("path")
const mongoose = require('mongoose')
const cookieParser = require("cookie-parser");
if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config();
	const cors = require("cors")
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
if (process.env.NODE_ENV !== 'production') {
	var corsOptions = {
		credentials: true,
		optionsSuccessStatus: 200,
		origin: [process.env.FRONTEND_APP_URL]
	}
	app.use(cors(corsOptions)) //for handling cors origin handling
}
const app = express();
app.use(express.json()) // to handle coming json data from client without body-parser
app.use(morgan("dev")) // to show each end point request in console log
app.use(cookieParser());
// app.use((req,res,next)=>{
// 	res.setHeader('Access-Control-Allow-Origin', process.env.FRONTEND_APP_URL);
// 	res.setHeader('Access-Control-Allow-Methods','GET,POST,PUT,PATCH,DELETE');
// 	res.setHeader('Access-Control-Allow-Methods','Content-Type','Authorization');
// 	next(); 
// })





app.get("/api/", (req, res) => { res.send("chatting server is running") })
app.get("/api/refreshToken", refreshToken, newCookies)
app.post("/api/register", register)
app.post("/api/login", login)
app.get("/api/userData", verifyToken, userData)
app.post("/api/emailData", verifyToken, emailData)
app.get("/api/allEmails", verifyToken, getEmails)
app.get("/api/logout", logout)
app.get("/api/user", verifyToken, first)
app.post("/api/messagePost", verifyToken, MessagePost)
app.post("/api/messageGet", verifyToken, MessageGet)
// app.post("/api/conversation", verifyToken, ConversationPost)
app.get("/api/allConversations", verifyToken, AllConversationGet)
app.post("/api/ConversationId", verifyToken, ConversationGetFriendId)
app.get("/api/isFriend", verifyToken, IsFriend)
// app.post("/api/friendId", verifyToken, IsFriendConversation)
app.get("/api/allFriends", verifyToken, AllFriendsGet)
app.get("/api/unfriend", verifyToken, FriendDelete)
// app.post("/api/friendId", verifyToken, FriendGetById)
// app.post("/api/friendEmail", verifyToken, FriendGetByEmail)
app.post("/api/otherUsers", verifyToken, OtherUsersGet)
app.post("/api/allSeen", verifyToken, allSeen)
app.post("/api/seen", verifyToken, Seen)
app.post("/api/deliveredById", verifyToken, deliveredById)
app.post("/api/deliveredByConversationId", verifyToken, deliveredByConversationId)
app.get("/api/search/conversations", verifyToken, searchConversations)
app.get("/api/search/friends", verifyToken, SearchFriends)
app.post("/api/sendFriendRequest", verifyToken, sendFriendRequest)
app.post("/api/cancelFriendRequest", verifyToken, cancelFriendRequest)
app.post("/api/checkFriendRequest", verifyToken, checkNotification)
app.get("/api/allNotification", verifyToken, allNotifications)
app.get("/api/allRequests", verifyToken, allFriendRequests)
app.get("/api/seenNotifications", verifyToken, seenNotifications)
app.post("/api/acceptFriendRequest", verifyToken, acceptFriendRequest)
app.post("/api/removeFriendRequest", verifyToken, removeFriendRequest)
app.post("/api/removeNotification", verifyToken, removeNotification)
app.post("/api/deleteMessages", deleteMessages)


if (process.env.NODE_ENV !== 'production') {
	app.use(express.static("client/build"))
	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "client", "build", "index.html"))
	})
}


app.listen(process.env.PORT || 5000, console.log("server running on port 5000"))