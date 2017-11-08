import React, {Component} from 'react';
import './App.css';
import socketIOClient from "socket.io-client";

class App extends Component {
    constructor() {
        super();
        this.state = {
            response: false,
            id: false,
            clients: false,
            endpoint: "http://localhost:3001"
        };
    }

    componentDidMount() {
        const {endpoint} = this.state;
        const socket = socketIOClient(endpoint);
        socket.on("message", data => this.setState({message: data}));
        socket.on("clients", data => this.setState({clients: data}));
        socket.on("id", data => this.setState({id: data}));
    }

    render() {
        const {message, id, clients} = this.state;
        return (
            <div>
                <div style={{textAlign: "center"}}>
                    {

                        id ?
                            <p> You are client: {id} </p> :
                            <p> Getting client id </p>
                    }
                </div>
                <div style={{textAlign: "center"}}>
                    {

                        clients ?
                            <p> Number of clients connected: {clients} </p> :
                            <p> Scanning clients </p>
                    }
                </div>
                <div style={{textAlign: "center"}}>
                    {
                        message ?
                            <p> Message: {message} </p> :
                            <p> No message </p>
                    }
                </div>
            </div>
        );
    }
}

export default App;