// App.jsx
import './App.css'
import Body from './Components/Body'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from './Components/Login'
import SignUp from './Components/SignUp'
import Profile from './Components/Profile'
import Feed  from './Components/Feed'
import { Provider } from 'react-redux'
import appStore from './Components/utils/appStore'
import EditProfile from './Components/EditProfile'
import Connections from './Components/Connections'
import Request from './Components/Request'
import Premium from './Components/Premium'
import Chat from './Components/Chat'


function App() {
    return (
      <Provider store={appStore}>
        <BrowserRouter basename='/'>
            <Routes>
                <Route path='/' element={<Body/>}>
                    <Route path='/' element={<Feed/>} />
                    <Route path='/login' element={<Login />} />
                    <Route path='/signUp' element={<SignUp />} />
                    <Route path='/Profile' element={<Profile />} />
                    <Route path='/editProfile' element={<EditProfile />} />
                    <Route path='/connections' element={<Connections />} />
                    <Route path='/requests' element={<Request />} />
                    <Route path="/premium" element={<Premium />} />
                    <Route path="/chat/:toUserId" element={<Chat />} />

                </Route> 
            </Routes>
        </BrowserRouter>
        </Provider>
    )
}

export default App