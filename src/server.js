import express from 'express';
//import our auth routes to this server
import authRoutes from './routes/authRoutes.js'
import todoRoutes from './routes/todoRoutes.js'
import cors from 'cors';

//import variable path and dirname(from javascript module)
//to access paths and directories, simply tells our server.js to locate our html files as a response 
import path, { dirname} from 'path';
import { fileURLToPath } from 'url';
import authMiddleware from './middleware/authMiddleware.js';

const app = express()
const PORT = process.env.PORT;

app.use(cors({
    origin: "https://task-web-mngr.netlify.app",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true
}));




//configuration line that allows us to navigate the folder dir
const __filename = fileURLToPath(import.meta.url) //gives us aaccess to the filename

//get the dir name from the file path
const __dirname = dirname(__filename);

app.use(express.json())
//define auth middleware to have access to our endpoints
app.use('/auth', authRoutes);

//telling the server to pass through the middleware before accessing todo routes
app.use('/todo', authMiddleware, todoRoutes);



//A middleware to access the publiuc directory specifically
//express static tells the server to locate the folder one step up because of the 2 dots
app.use(express.static(path.join(__dirname, '../public')))

//serving up the HTML and css file from the /public dir
app.get('/', (req, res) =>{
res.sendFile(path.join(__dirname, 'public', 'index.html')) //locates our html file

})
app.listen(PORT, () =>{
    console.log(`Server running on port ${PORT}`);
})
