const app = require('express')();
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const exjwt = require('express-jwt');

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Headers', 'Content-type, Authorization');
    next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

const jwtMW = exjwt({
  secret: 'keyboard cat 4 ever'
});

const user = {
    username: 'admin',
    password: 'admin'
};

app.post('/login', (req, res) => {
   const {username, password} = req.body;
   if(username === user.username && password === user.password){
       const token = jwt.sign({username, password}, 'keyboard cat 4 ever', {expiresIn: 129600});
       console.log(token);
       res.json({
           success: true,
           err: null,
           token
       });
   }else {
       res.status(401).json({
           success: false,
           err: 'Username or password is incorrect',
           token: null
       })
   }
});

app.get('/', jwtMW, (req, res) => {
   res.send('You are authenticated');
});

app.use((err, req, res, next) => {
   if(err.name === 'UnauthorizedError'){
       res.status(401).send(err);
   }else{
       next(err);
   }
});

const PORT = 8000;
app.listen(PORT, () =>{
    console.log('Server running!');
});