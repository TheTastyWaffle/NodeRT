import React, {Component} from 'react';
import './App.css';
import socketIOClient from "socket.io-client";

class App extends Component {
    constructor() {
        super();
        this.state = {
            response: false,
            clients: false,
            endpoint: "http://localhost:3001"
        };
    }

    componentDidMount() {
        const {endpoint} = this.state;
        const socket = socketIOClient(endpoint);
        socket.on("message", data => this.setState({message: data}));
        socket.on("clients", data => this.setState({clients: data}))
    }

    render() {
        const {message} = this.state;
        const {clients} = this.state;
        return (
            <div>
                <div style={{textAlign: "center"}}>
                    {
                        clients ?
                        <p> Number of clients connected: {clients}</p> :
                        <p> Scanning clients *bleep* *bloop*</p>
                    }
                </div>
                <div style={{textAlign: "center"}}>
                    {
                        message ?
                            <p> Message: {message}</p> :
                            <p> No message </p>
                    }
                </div>
            </div>
        );
    }
}

export default App;
