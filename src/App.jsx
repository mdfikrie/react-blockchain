import { useEffect } from "react";
import "./App.css";
import Web3 from "web3";
import { useState } from "react";
import detectEthereumProvider from "@metamask/detect-provider";
import { loadContracts } from "./utils/load-contracts";

function App() {
  const [web3Api, setWeb3Api] = useState({
    provider: null,
    web3: null,
    contract: null,
  });

  const [account, setAccount] = useState("");

  useEffect(() => {
    window.process = { ...window.process };
  }, []);

  useEffect(() => {
    const loadProvider = async () => {
      let provider = await detectEthereumProvider();
      // const contract = await loadContracts("Faucet");
      // debugger;
      if (provider) {
        setWeb3Api({
          web3: new Web3(provider),
          provider,
          // contract,
        });
      } else {
        console.error("User denied account access!");
      }
    };

    loadProvider();
  }, []);

  useEffect(() => {
    const getAccount = async () => {
      const accounts = await web3Api.web3.eth.getAccounts();
      setAccount(accounts[0]);
    };

    web3Api.web3 && getAccount();
  }, [web3Api.web3]);

  return (
    <>
      <div className="faucet-wrapper">
        <div className="faucet">
          <div className="is-flex is-flex-direction-row">
            <span>
              <strong className="mr-2">Account:</strong>
            </span>
            <span>
              <h3>
                {account ? (
                  <div>{account}</div>
                ) : (
                  <button
                    className="button  is-small"
                    onClick={() => {
                      web3Api.provider.request({
                        method: "eth_requestAccounts",
                      });
                    }}
                  >
                    Connect Wallet
                  </button>
                )}
              </h3>
            </span>
          </div>
          <div className="balance-view is-size-2 mb-2">
            Current balance: <strong>10</strong> ETH
          </div>
          <button className="button is-link mr-2 is-small">Donate</button>
          <button className="button is-primary is-small">WithDraw</button>
        </div>
      </div>
    </>
  );
}

export default App;
