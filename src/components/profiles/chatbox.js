
import React, { useEffect, useState } from "react";
import { connect } from 'react-redux';
import io from 'socket.io-client';

const Chatbox = (props) => {
    const { profileId } = props;

    const [message, setMessage] = useState('');
    const [socket, setSocket] = useState(null);
    const [socketUser, setSocketUser] = useState(null);
    const [isConnected, setIsConnected] = useState(null);
    const [chatUsers, setChatUsers] = useState([]);
    const [chatUser, setChatUser] = useState(null);
    // const [lastPong, setLastPong] = useState(null);

    useEffect(() => {
        const newSocket = io(process.env.REACT_APP_SOCKET_ENDPOINT, { autoConnect: false });
        setSocket(newSocket);
        return () => newSocket.close();
    }, [setSocket]);

    useEffect(() => {
        if (socket) {

            // socket.onAny((event, ...args) => {
            //     event, args);
            // });

            socket.on('connect', () => {
                setIsConnected(true);
            });

            socket.on('disconnect', () => {
                setIsConnected(false);
            });

            if (socketUser === null) {
                // const username = "USER00" + Date.now();
                setSocketUser(socket.id);
                socket.auth = { profileID: profileId };
                socket.connect();
            }

            socket.on("welcome_msg", (msg) => {
                console.log('welcome_msg::', msg);
            });

            socket.on("sendLikedProfiles", (users) => {
                setChatUsers(users);
            });

            // socket.on('message_to_user', message => {
            //     'message_to_user::', message);
            //     setMessages(messages => [...messages, message]);
            // });

            // socket.on("user_connected", (user) => {
            //     'user_connected::', user);
            // });

            // socket.on('message_to_user', () => {
            //     setLastPong(new Date().toISOString());
            // });

            // setTimeout(async () => {
            //     socket.emit("user_join", { id: 23 }, (resp) => {
            //         "resp::", resp);
            //     });

            //     socket.emit('message_from_user', {
            //         from: socketUser,
            //         // to: ele.userId,
            //         msg: 'Hi all'
            //     });
            // }, 1000);

            return () => {
                socket.off('connect');
                socket.off('disconnect');
                // socket.off('pong');
            };

        }

    }, [socket, profileId, socketUser]);

    const chatWithUser = (profileId) => {
        setChatUser(profileId);
        if (socket) {
            socket.emit("getChatMessages", { profileId }, (resp) => {
                console.log("resp::", resp);
            });
        }
    }

    const handleSend = (eve) => {
        if (isConnected) {
            socket.emit("sendMessageToUser", { chatUser, message }, (resp) => {
                console.log("sendMessageToUser::", resp);
            });
        } else {
            console.log("your not connected::");
        }
    }

    return (
        <div className="maincontainer">
            <div className="container py-5 px-4">

                <div>
                    <p>Connected: {'' + isConnected}</p>
                    {/* <p>Last pong: {lastPong || '-'}</p> */}
                    {/* <button onClick={sendPing}>Send ping</button> */}
                </div>

                <div className="row rounded-lg overflow-hidden shadow">

                    <div className="col-5 px-0">
                        <div className="bg-white">
                            <div className="bg-gray px-4 py-2 bg-light">
                                <p className="h5 mb-0 py-1">Recent</p>
                            </div>
                            <div className="messages-box">
                                <div className="list-group rounded-0">
                                    {/* <a className="list-group-item list-group-item-action active text-white rounded-0">
                                        <div className="media"><img src="https://therichpost.com/wp-content/uploads/2020/06/avatar2.png" alt="user" width="50" className="rounded-circle" />
                                            <div className="media-body ml-4">
                                                <div className="d-flex align-items-center justify-content-between mb-1">
                                                    <h6 className="mb-0">Jassa</h6><small className="small font-weight-bold">25 Dec</small>
                                                </div>
                                                <p className="font-italic mb-0 text-small">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore.</p>
                                            </div>
                                        </div>
                                    </a> */}
                                    {
                                        chatUsers.map((ele, ind) => {
                                            return (
                                                <span onClick={() => chatWithUser(ele.profileID)} key={ind} className="list-group-item list-group-item-action list-group-item-light rounded-0">
                                                    <div className="media">
                                                        <img src="https://therichpost.com/wp-content/uploads/2020/06/avatar2.png" alt="user" width="50" className="rounded-circle" />
                                                        <div className="media-body ml-4">
                                                            <div className="d-flex align-items-center justify-content-between mb-1">
                                                                <h6 className="mb-0">{ele.profileID}</h6><small className="small font-weight-bold">14 Dec</small>
                                                            </div>
                                                            <p className="font-italic text-muted mb-0 text-small">Lorem ipsum dolor sit amet, consectetur. incididunt ut labore.</p>
                                                        </div>
                                                    </div>
                                                </span>
                                            )
                                        })
                                    }
                                </div>
                            </div>
                        </div>
                    </div>

                    {
                        chatUser !== null && (

                            <div className="col-7 px-0">
                                <div className="px-4 py-5 chat-box bg-white">

                                    <div className="media w-50 mb-3">
                                        <div className="media-body ml-3">
                                            <div className="bg-light rounded py-2 px-3 mb-2">
                                                <p className="text-small mb-0 text-muted">Test which is a new approach all solutions</p>
                                            </div>
                                            <p className="small text-muted">12:00 PM | Aug 13</p>
                                        </div>
                                    </div>

                                    <div className="media w-50 ml-auto mb-3">
                                        <div className="media-body">
                                            <div className="bg-primary rounded py-2 px-3 mb-2">
                                                <p className="text-small mb-0 text-white">Test which is a new approach to have all solutions</p>
                                            </div>
                                            <p className="small text-muted">12:00 PM | Aug 13</p>
                                        </div>
                                    </div>

                                    <div className="media w-50 mb-3">
                                        <div className="media-body ml-3">
                                            <div className="bg-light rounded py-2 px-3 mb-2">
                                                <p className="text-small mb-0 text-muted">Test, which is a new approach to have</p>
                                            </div>
                                            <p className="small text-muted">12:00 PM | Aug 13</p>
                                        </div>
                                    </div>

                                    <div className="media w-50 ml-auto mb-3">
                                        <div className="media-body">
                                            <div className="bg-primary rounded py-2 px-3 mb-2">
                                                <p className="text-small mb-0 text-white">Apollo University, Delhi, India Test</p>
                                            </div>
                                            <p className="small text-muted">12:00 PM | Aug 13</p>
                                        </div>
                                    </div>

                                    <div className="media w-50 mb-3">
                                        <div className="media-body ml-3">
                                            <div className="bg-light rounded py-2 px-3 mb-2">
                                                <p className="text-small mb-0 text-muted">Test, which is a new approach</p>
                                            </div>
                                            <p className="small text-muted">12:00 PM | Aug 13</p>
                                        </div>
                                    </div>

                                    <div className="media w-50 ml-auto mb-3">
                                        <div className="media-body">
                                            <div className="bg-primary rounded py-2 px-3 mb-2">
                                                <p className="text-small mb-0 text-white">Apollo University, Delhi, India Test</p>
                                            </div>
                                            <p className="small text-muted">12:00 PM | Aug 13</p>
                                        </div>
                                    </div>
                                </div>

                                <form action="#" className="bg-light">
                                    <div className="input-group">
                                        <input type="text" placeholder="Type a message" onChange={(eve) => setMessage(eve.target.value)} aria-describedby="button-addon2" className="form-control rounded-0 border-0 py-4 bg-light" />
                                        <div className="input-group-append">
                                            <button id="button-addon2" type="button" className="btn btn-link" onClick={handleSend}> <i className="fa fa-paper-plane"></i></button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        )
                    }

                </div>
            </div>
        </div>
    )
};

const mapStateToProps = (state) => {
    return {
        commonData: state?.common?.commonData,
        user: state?.account?.authUser
    }
}

export default connect(mapStateToProps, null)(Chatbox);