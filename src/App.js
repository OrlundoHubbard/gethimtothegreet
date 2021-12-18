import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import './App.css';
import abi from "./utils/GreeterPortal.json";
import TwitterHeader from "./TwitterHeader.js";
import Spinner from "./components/spinner.js";



const App = () => {

    const [currentAccount, setCurrentAccount] = useState("");
    const [allGreetings, setAllGreetings] = useState([]);
    console.log(allGreetings);
    const [textarea, setTextarea] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (event) => {
        setTextarea(event.target.value)
    }

    const contractAddress = "0x031545909243C81587d492B9c7936509D8e1334a";
    const contractABI = abi.abi

    const getAllGreetings = async () => {
        try {
            const { ethereum } = window;
            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const greeterPortalContract = new ethers.Contract(contractAddress, contractABI, signer);

                const greetings = await greeterPortalContract.getAllGreetings();
                console.log(greetings)

                let greetingsCleaned = [];
                greetings.forEach(greeting => {
                    console.log(greeting)
                    greetingsCleaned.push({
                        address: greeting.greeter,
                        timestamp: new Date(greeting.timestamp * 1000),
                        message: greeting.message
                    });
                });

                setAllGreetings(greetingsCleaned);
            } else {
                console.log("Ethereum object doesn't exist!")
            }
        } catch (error) {
            console.log(error);
        }
    }

    const checkIfWalletIsConnected = async () => {
        try {
            const { ethereum } = window;

            if (!ethereum) {
                console.log("Make sure you have Metamask!");
                return;
            } else {
                console.log("We have the ethereum object", ethereum);
            }

            const accounts = await ethereum.request({ method: 'eth_accounts'});

            if (accounts.length !==0) {
                const account = accounts[0];
                console.log("Found an authorized account:", account);
                setCurrentAccount(account)
                await getAllGreetings();
            } else {
                console.log("No authorized account found")
            }

        } catch (error) {
            console.log(error);
        }

        

        

        
    };



    const connectWallet = async () => {
        try {
            const { ethereum } = window;

            if (!ethereum) {
                alert("Get Metamask!");
                return;
            }

            const accounts = await ethereum.request({method: "eth_requestAccounts"});

            console.log("Connected", accounts[0]);
            setCurrentAccount(accounts[0]);
        } catch (error) {
            console.log(error)
        }
    }

    const greet = async () => {
        try {
            const { ethereum } = window;

            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const greeterPortalContract = new ethers.Contract(contractAddress, contractABI, signer);

                let count = await greeterPortalContract.getTotalGreetings();
                console.log("Retrieved total greet count...", count.toNumber());

                const greetTxn = await greeterPortalContract.greet(textarea, { gasLimit: 3000000 });
                console.log("Mining...", greetTxn.hash);
                setTextarea("");
                setLoading(true);

                await greetTxn.wait();
                console.log("Mined --", greetTxn.hash);
                setLoading(false);

                count = await greeterPortalContract.getTotalGreetings();
                console.log("Retrieved total greet count...", count.toNumber());
                
                await getAllGreetings();
            } else {
                console.log("Ethereum object doesn't exist!");
            }
        } catch (error) {
            console.log(error)
        }

        

        
    }

    

    

    useEffect(() => {
        checkIfWalletIsConnected();
    }, [])


return (
    <div className="mainContainer">

    <div className="dataContainer">
        <div className="header">
        👋 Greetings Folks!
        </div>

        <div className="twitterContainer">
        <TwitterHeader />

        </div>
        
        {/*
        * If there is no currentAccount render this button

        */}

{!currentAccount && (
    <div className="ConnectWallet">
            <button className="greetButton2" onClick={connectWallet}>
                Connect Wallet
            </button>
    </div>
        )}

        <div className="bio">
        I'm Orlundo! I'm a Web3 enthusiast excited about the change that this new technology will bring to the world! Connect your Ethereum wallet and send me a greeting!
        </div>

    

        <div className="textWrapper">
            <label htmlFor="message">Write your greeting below:</label>
        <form>
            <textarea value={textarea} onChange={handleChange} />
        </form>
        </div>
        
    
    <div className="GreetMe">
        <button className="greetButton" onClick={greet}>
            Greet Me!
        </button>

        {
            loading && <Spinner />
        }


        

        {allGreetings.sort((greeting1, greeting2) => greeting2.timestamp - greeting1.timestamp ).map((greeting, index) => {
            return (
                <div className="wavelist" key={index}>
                    <div className="FromClass">From: </div>
                    <div>{greeting.address}</div>
                    <div className="TimeClass">Time: </div>
                    <div>{greeting.timestamp.toString()}</div>
                    <div style={{marginTop: "10px"}}> "{greeting.message}"</div>
            </div>)
        })}

        
    </div>

        
    </div>
    </div>
);
}



export default App