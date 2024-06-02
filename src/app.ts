import express from "express"

import serverConfig from "./framework/webserver/server"
import expressConfig from "./framework/webserver/express"

import http from "http"
import colors from 'colors.ts'
import connectDB from "./framework/database/mongodb/connection"
import routes from "./framework/webserver/routes"
import errorHandlingMidlleware from "./framework/webserver/middleware/errorHandlingMidlleware"


colors?.enable()

const app = express()
const server = http.createServer(app)
connectDB()


expressConfig(app)
routes(app);
app.use(errorHandlingMidlleware);

serverConfig(server).startServer();