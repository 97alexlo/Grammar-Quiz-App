import React, { Component } from 'react';
import { Input, Button, Progress, Divider } from "antd";
import { level1 } from '../data';
import { Link } from 'react-router-dom';
import { AudioOutlined } from '@ant-design/icons';

class Level1 extends Component {

    state = {
        value: "",
        timeOut: false,
        round: 0,
        timer: 10,
        randomTense: "",
        wrongAnswer: "",
        wrongAnswers: []
    }

    componentDidMount() {
        this.randomTense()
        this.startTimeOut()
    }

    startTimeOut = () => {
        this.timeout = setTimeout(() => {
            this.setState({ timeOut: true })
        }, 10000)

        this.interval = setInterval(( ) => {
            this.setState({ timer: this.state.timer - 1 })
        }, 1000)
    }

    componentDidUpdate() {
        //stop countdown when it is 0 
        if(this.state.timer === 0) {
            clearInterval(this.interval)
        }
    }

    componentWillUnmount() {
        clearTimeout(this.timeout)
        clearInterval(this.interval)
    }

    // get a random tense: simple or past
    randomTense = async() => {
        let TenseArray = ['simple', 'past']

        let randomTense = await TenseArray[Math.floor(Math.random() * TenseArray.length)]
        this.setState({ randomTense: randomTense})
    }

    // restart button
    handleRestart = () => {
        //reset timer and timeout to false
        this.setState({ timer: 10, timeOut: false, wrongAnswer: "" })

        // start the timer again
        this.startTimeOut();
    }

    handleChange = (event) => {
        this.setState({ value: event.target.value })
    }

    handleSubmit = (event) => {
        event.preventDefault();

        // can not submit if the timer is 0
        if(this.state.timeOut) {
            return alert("Please click on Restart to try again")
        }

        // can not submit if there it is blank
        if(!this.state.value.trim()) {
            return alert("Please type your answer first!")
        }

        this.setState({ value: "", wrongAnswer: "" })

        //check if the answer is correct or not
        this.checkMatched()
    }

    checkMatched = () => {
        //check if the verb in simple or past matches the answer entered by user
        (this.state.randomTense === 'simple' ? level1[this.state.round].simple : level1[this.state.round].past)
            === this.state.value ? 
            //true
        this.setState({ round: this.state.round + 1, timer: 10, wrongAnswer: ""}, () => {
            this.randomTense()
            //stop the setTimeOut and start new setTimeout
            clearTimeout(this.timeout);
            this.timeout = setTimeout(() => {
                this.setState({ timeOut: true })
            }, 10000)
        })
        :
        //false
        this.setState({ 
            wrongAnswer: this.state.randomTense === 'simple' ? `${level1[this.state.round].simple}` 
            : `${level1[this.state.round].past}`}, () => {
            this.setState({ 
                round: this.state.round + 1, timer: 10, 
                wrongAnswers: this.state.wrongAnswers.concat(level1[this.state.round].vocab)
            })
            //get a random tense for the next question
            this.randomTense()
            clearTimeout(this.timeout);
            this.timeout = setTimeout(() => {
                this.setState({ timeOut: true })
            }, 10000)
        })
    }

    // try again button to restart the quiz
    handleRedirect = () => {
        setTimeout(() => {
            window.location.reload();
        }, 10);
    }

    handleAudio = (event) => {
        event.preventDefault();
        var element = event.target;
        var audio = document.getElementById('audio');
        var source = document.getElementById('audioSource');
        source.src = element.getAttribute('data-value');
        audio.load(); // preload audio without playing
        audio.play();
    }
    render() {
        return (
            <div style={{ padding: '.5rem 1rem 1rem', border: '1px solid grey', borderRadius: '6px', maxWidth: 400, margin: '5rem auto' }}>
                {this.state.round < level1.length ? 
                <>
                    <h1>Grammar Quiz</h1>

                    <Progress percent={this.state.round / level1.length * 100} status="active"/>

                    <div style={{ display:'flex', justifyContent:'space-between'}}>
                        <h2>LEVEL 1</h2>
                        <h2>{this.state.round}/{level1.length}</h2>
                    </div>

                    <span style={{ color: 'grey'}}>Infinitive</span>
                    <h2>{level1[this.state.round].vocab}</h2>

                    <div style={{ fontSize: '1rem' }}>
                        What is the <span style={{ color: 'red'}}>
                            {this.state.randomTense === 'simple' ? 'simple past ' : 'past participle '}
                            </span>
                            of {level1[this.state.round].vocab} ?
                    </div>

                    <form style={{ padding: '1rem 0'}} onSubmit={this.handleSubmit}>
                        <div style={{ display: 'flex' }}>
                            <Input
                                name="value"
                                onChange={this.handleChange}
                                value={this.state.value}
                                id="vocab"
                                type="text"
                            />
                            <Button 
                                className
                                type="submit"
                                onClick={this.handleSubmit}
                            >
                                Submit
                            </Button>
                        </div>
                    </form>

                    <span style={{ color: 'dark grey'}}>Countdown timer:</span>

                    <div style={{ display: 'flex', justifyContent: 'space-between'}}>
                        <Button className={`${this.state.timer <= 8 && 'disabled'}`}>5</Button>
                        <Button className={`${this.state.timer <= 6 && 'disabled'}`}>4</Button>
                        <Button className={`${this.state.timer <= 4 && 'disabled'}`}>3</Button>
                        <Button className={`${this.state.timer <= 2 && 'disabled'}`}>2</Button>
                        <Button className={`${this.state.timer <= 0 && 'disabled'}`}>1</Button>
                        <Button 
                            onClick={this.handleRestart}
                            // when timeout is true, display restart button
                            // otherwise, don't display the button
                            style={{display: this.state.timeOut ? 'block' : 'none'}}
                            >
                            Restart
                        </Button>
                    </div>

                    {this.state.wrongAnswer && (
                        <React.Fragment>
                        <Divider/>
                        <h3>Incorrect! Correct answer:</h3>
                        <div style={{ fontSize: '2rem', display: 'flex', justifyContent: 'flex-start' }}>
                            <li style={{ display: "block"}}>
                                <p
                                    onClick={this.handleAudio}
                                    //use previous rounds audio 
                                    data-value={level1[this.state.round - 1]? level1[this.state.round - 1 ].mp3 : level1[this.state.round].mp3}>
                                <AudioOutlined /> {this.state.wrongAnswer}
                                </p>
                            </li>
                            <audio id="audio" constrols style={{display: 'none'}}>
                                <source id="audioSource"></source>
                                Your browser does not support the audio format
                            </audio>
                        </div>
                        </React.Fragment>
                    )}
                </>
                :
                <>
                    <h2> Review your incorrect answers</h2>
                    {this.state.wrongAnswers.map((answer, index) => (
                    <div key={index}>
                        <ul>
                            <li>
                                {answer}
                            </li>
                        </ul>
                    </div>
                    ))}
                    
                    <div style={{ display: 'flex', justifyContent: 'center'}}>
                        <Button onClick={this.handleRedirect}>Try again!</Button>
                        {/* <Button><Link to="/level2">Next Level</Link></Button> */}
                    </div>
                </>
                }
                
            </div>
        )
    }
}

export default Level1;