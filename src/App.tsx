import React from 'react';
import './App.css';

var ws = new WebSocket("ws://golang-websocket-chat.herokuapp.com/gateway")

ws.addEventListener("open", () => {
    console.log('hi')
})

type User = {
    name?: string,
    // profilepic: string // (url)
}

type Message = {
    author?: User,
    content?: string,
    time?: string // TODO: Change to `Date`
}

class MessageElement extends React.Component<Message, Message> {
    constructor(props: Message) {
        super(props)
        this.state = props
    }

    render() {
        return (
            <div className="MessageElement">
                <div>{this.state.content}</div>
                {/* <i>{this.state.author}</i>
                <i>{this.state.time}</i> */}
            </div>
        )
    }
}

class ChatArea extends React.Component<{}, { messages: Array<string> }> {

    typingMsg: string = ""

    constructor(props: any) {
        super(props)
        this.state = { messages: [] }
    }

    componentDidMount() {
        ws.addEventListener('message', (event) => {
            console.log('Message from server ', event.data)
            let newMessages = this.state.messages;
            newMessages.push(event.data)
            this.setState({ messages: newMessages })
            console.log(this.state)
        });
    }

    render() {


        return (
            <div className="MainContentWrapper">
                <div className="ChatArea">
                    {this.state.messages.map((element, index) =>
                        <MessageElement key={index} content={element} />
                    )}


                </div>
                <form className="ChatBox" onSubmit={(e) => { alert('oke') }}>
                    <input 
                    onChange={e => { this.typingMsg = e.target.value }} 
                    className="ChatEntry"
                    />
                    <input 
                    type="submit"
                    value="Send"
                    className="ChatSendButton"
                    onClick={e => {
                        e.preventDefault()
                        ws.send(this.typingMsg)
                    }}/>
                </form>
            </div>

        )
    }

}

function App() {

    return (
        <div className="App" >
            <ChatArea></ChatArea>
        </div>
    );
}

export default App;
