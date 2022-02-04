import { Button, Modal, makeStyles, Input } from '@material-ui/core';
import React, {useState, useEffect} from 'react';
import './App.css';
import Post from './Post';
import ImageUpload from './imageUpload'

const BASE_URL = 'http://localhost:8000/'

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    backgroundColor: theme.palette.background.paper,
    position: 'absolute',
    width: 400,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3)
  }
}))

function App() {

  const classes = useStyles();
  const [posts, setPosts] = useState([]);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [openSignUp, setOpenSignUp] = useState(false);
  const [modalStyle, setModalStyle] = useState(getModalStyle)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [authToken, setAuthToken] = useState(null)
  const [authTokenType, setAuthTokenType] = useState(null);
  const [userId, setUserId] = useState('');
  const [email, setEmail] = useState('')

  useEffect(() => {
    setAuthToken(window.localStorage.getItem('authToken'));
    setAuthTokenType(window.localStorage.getItem('authTokenType'))
    setUsername(window.localStorage.getItem('username'))
    setUserId(window.localStorage.getItem('userId'))
  }, [])

  useEffect(() => {
    authToken
      ? window.localStorage.setItem('authToken', authToken)
      : window.localStorage.removeItem('authToken')
    authTokenType
      ? window.localStorage.setItem('authTokenType', authTokenType)
      : window.localStorage.removeItem('authTokenType')
    username
      ? window.localStorage.setItem('username', username)
      : window.localStorage.removeItem('username')
    userId
      ? window.localStorage.setItem('userId', userId)
      : window.localStorage.removeItem('userId')

  }, [authToken, authTokenType, userId])

  useEffect(() => {
    fetch(BASE_URL + 'post')
      .then(response => {
        const json = response.json();
        console.log(json);
        
        if (response.ok) {
          return json
        }
        throw response
      })
      .then(data => {
        setPosts(data)
      })
      .catch(error => {
        console.log(error);
        alert(error);
      })
  }, [])

  const signIn = (event) => {
    event?.preventDefault();

    let formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);

    const requestOptions = {
      method: 'POST',
      body: formData
    }

    fetch(BASE_URL + 'login', requestOptions)
      .then(response => {
        if (response.ok) {
          return response.json()
        }
        throw response
      })
      .then(data => {
        console.log(data);
        setAuthToken(data.access_token)
        setAuthTokenType(data.token_type)
        setUserId(data.user_id)
        setUsername(data.username)
      })
      .catch(error => {
        console.log(error);
        alert(error);
      })

    setOpenSignIn(false);
  }

  const signOut = (event) => {
    setAuthToken(null)
    setAuthTokenType(null)
    setUserId('')
    setUsername('')
  }

  const signUp = (event) => {
    event?.preventDefault();

    const json_string = JSON.stringify({
      username: username,
      email: email,
      password: password
    })

    const requestOption = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: json_string
    }

    fetch(BASE_URL + 'user', requestOption)
      .then(response => {
        if (response.ok) {
          return response.json()
        }
        throw response
      })
      .then(data => {
        // console.log(data);
        signIn();
      })
      .catch(error => {
        console.log(error);
        alert(error);
      })


    setOpenSignUp(false)
  }

  return (
    <div className='app'>

      <Modal
        open={openSignIn}
        onClose={() => setOpenSignIn(false)}>
        
        <div style={modalStyle} className={classes.paper}>
          <form className="app_signin">
            <center>
              <img className="app_header_image"
                src="https://i2.wp.com/mrvsdaily.com/wp-content/uploads/2018/02/new-instagram-text-logo.png"
                alt=""/>
            </center>

            <Input
              placeholder="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)} />

            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)} />

            <Button
              type="submit"
              onClick={signIn}>Login</Button>
          </form>
        </div>
      </Modal>

      <Modal
        open={openSignUp}
        onClose={() => setOpenSignUp(false)}>

        <div style={modalStyle} className={classes.paper}>
          <form className="app_signin">
            <center>
              <img className="app_header_image"
                src="https://i2.wp.com/mrvsdaily.com/wp-content/uploads/2018/02/new-instagram-text-logo.png"
                alt=""/>
            </center>

            <Input
              placeholder="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)} />

            <Input
              placeholder="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)} />

            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)} />

            <Button
              type="submit"
              onClick={signUp}>Sign up</Button>
          </form>
        </div>

      </Modal>

      <div className='app_header'>
        <img className="app_header_image"
          src='https://i2.wp.com/mrvsdaily.com/wp-content/uploads/2018/02/new-instagram-text-logo.png'
          alt=''/>
        
        {authToken ? (
            <Button onClick={() => signOut()}>Logout</Button>
          ) : (
            <div>
              <Button onClick={() => setOpenSignIn(true)}>Login</Button>
              <Button onClick={() => setOpenSignUp(true)}>Sign up</Button>
            </div>
          )
        }
      </div>

      <div className='app_posts'>
        {
          posts.map(post => (
            <Post
              post = {post}
              authToken = {authToken}
              authTokenType = {authTokenType}
              username = {username}
            />
          ))
        }
      </div>
      {
        authToken ? (
          <ImageUpload
            authToken={authToken}
            authTokenType={authTokenType}
            userId={userId}
          />
        ) : (
          <h3>You need to login to upload</h3>
        )
      }
    </div>
  );
}

export default App;
