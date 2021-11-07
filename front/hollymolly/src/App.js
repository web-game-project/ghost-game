import React, { useEffect } from 'react';
import style from './styles/styles.js';
import './App.css';

import RoomList from '../src/screens/RoomList';
import RoomSearchBar from '../src/components/RoomSearchBar';
import Room from '../src/components/Room';
import Chatting from '../src/components/Chatting';
import GameStart from './screens/GameStart';
import Dialog from './screens/NickNameDialog';
import HeaderComponent from '../src/components/HeaderComponent';
import { BrowserRouter, Route, Switch } from 'react-router-dom'; //React-Router import
import WaitingRoom from './screens/WaitingRoom.js';
import UserTable from './components/UserTable.js';

// 소켓
import { io } from 'socket.io-client';
import axios from 'axios';

export default function App() {
    return (
        <div>
            {/* <UserTable /> */}
            <div>
                <BrowserRouter>
                    <Route exact path="/" component={GameStart} />
                    <Route path="/inputname" component={Dialog}>
                        <Dialog title="닉네임 입력" confirmText="접속" />
                    </Route>
                    <Route path="/roomlist" component={RoomList} />
                    <Route path="/chatting" component={Chatting} />
                    <Switch>
                        <Route path="/waitingroom/:name" component={WaitingRoom} />
                        <Route path="/waitingroom" component={WaitingRoom} />
                    </Switch>
                    <Route path="/usertable" component={UserTable} />
                </BrowserRouter>
            </div>
        </div>
    );
}