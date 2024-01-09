import { useEffect, useCallback } from "react";
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

  const [balance, setBallance] = useState(null);

  const [shouldReload, setReload] = useState(false);

  const reloadEffect = () => setReload((prev) => !prev);

  const canConnectToContract = account && web3Api.contract;

  useEffect(() => {
    const loadBalance = async () => {
      const { contract, web3 } = web3Api;
      const newBalance = await web3.eth.getBalance(contract.address);
      setBallance(web3.utils.fromWei(newBalance, "ether"));
    };

    web3Api.contract && loadBalance();
  }, [web3Api, shouldReload]);

  const setAccountListener = (provider) => {
    provider.on("accountsChanged", (_) => window.location.reload());
    provider.on("chainChanged", (_) => window.location.reload());
    // provider._jsonRpcConnection.events.on("notification", (payload) => {
    //   const { method } = payload;
    //   if (method === "metamask_unlockStateChanged") {
    //     setAccount(null);
    //   }
    // });
  };

  useEffect(() => {
    const loadProvider = async () => {
      let provider = await detectEthereumProvider();
      const contract = await loadContracts("Faucet", provider);
      // debugger;
      if (provider) {
        setAccountListener(provider);
        setWeb3Api({
          web3: new Web3(provider),
          provider,
          contract,
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

  const addFunds = useCallback(async () => {
    const { contract, web3 } = web3Api;
    await contract.addFunds({
      from: account,
      value: web3.utils.toWei("1", "ether"),
    });
    reloadEffect();
  }, [web3Api, account]);

  const withDrawFunds = async () => {
    const { contract, web3 } = web3Api;
    const withdrawAmount = web3.utils.toWei("0.1", "ether");
    await contract.withdraw(withdrawAmount, {
      from: account,
    });
    reloadEffect();
  };

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
                ) : !web3Api.provider ? (
                  <>
                    <div className="">Wallet is not detected!</div>
                    <a href="https://docs.metamask.io">Metamask</a>
                  </>
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
            Current balance: <strong>{balance}</strong> ETH
          </div>
          {!canConnectToContract && (
            <div className="is-block mb-2">Connect to Ganache</div>
          )}
          <button
            disabled={!canConnectToContract}
            onClick={addFunds}
            className="button is-link mr-2 is-small"
          >
            Donate 1eth
          </button>
          <button
            disabled={!canConnectToContract}
            onClick={withDrawFunds}
            className="button is-primary is-small"
          >
            Withdraw 0.1eth
          </button>
        </div>
      </div>
    </>
  );
}

export default App;
