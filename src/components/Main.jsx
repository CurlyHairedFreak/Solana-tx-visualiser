import React from "react";
import { clusterApiUrl, Connection, LAMPORTS_PER_SOL } from "@solana/web3.js";

const Main = () => {
  // create connection to solana/web3.js
  const connection = new Connection(clusterApiUrl("devnet", true), "confirmed");

  // Initialise states
  const [transactionId, setTransactionId] = React.useState(null);
  const [transactionSuccess, SetTransactionSuccess] = React.useState({});
  const [transactionDetails, setTransactionDetails] = React.useState(null);

  // Async function to fetch transaction
  const fetchTransaction = async () => {
    // try uses the input value(searched transaction id) to fetch transaction and set state
    try {
      const txSearchResult = await connection.getParsedTransaction(
        transactionId,
        "confirmed"
      );
      setTransactionDetails({
        signature: txSearchResult.transaction.signatures,
        fee: txSearchResult.meta.fee,
        blockTime: txSearchResult.blockTime,
        slot: txSearchResult.slot,
        previousBlockhash: txSearchResult.transaction.message.recentBlockhash,
      });
      // set state for conditional rendering
      SetTransactionSuccess(true);
    } catch (err) {
      // if input value(searched transaction id) is invalid an error will show in the console
      console.log(`Please enter a valid devnet transaction Id. Error: ${err}`);
      //  set state for conditional rendering to show and error message on page
      SetTransactionSuccess(false);
    }
  };

  // function that takes the value entered in the input field and sets state to use in fetchTransaction
  function handleInput(event) {
    const value = event.target.value;
    setTransactionId(value);
  }

  // function that is triggered when user presses the button. prevents reloading of page and resets the input field. Calls the function fetchTransaction
  function handleSubmit(event) {
    event.preventDefault();
    event.target.reset();
    fetchTransaction();
  }

  return (
    <div>
      <div className="m-auto mt-6 text-center border-4 border-purple-400 rounded-lg max-w-screen-xs max-h-80 sm:w-1/2">
        <h1 className="mt-8 text-4xl font-bold">Solana TX Visualiser</h1>
        <form onSubmit={handleSubmit} className="flex flex-col p-16 sm:p-8">
          <input
            type="text"
            placeholder="Search Transaction(devnet)"
            onChange={handleInput}
            className="placeholder:text-inherit placeholder:text-center bg-violet-400"
          />
          {/* conditional rendering to show error if transaction Id is invalid */}
          {transactionSuccess === false && (
            <p className="mt-4">Please enter a valid transaction Id</p>
          )}
          <button className="w-40 px-1 py-1 mx-auto mt-8 bg-indigo-500 rounded-full mt-110 hover:bg-indigo-400">
            Search
          </button>
        </form>
      </div>
      {/* conditional rendering if the result of fetchTransaction was successful */}
      {transactionSuccess === true && (
        <div className="flex flex-col w-1/2 mx-auto mt-12 max-w-screen-xs sm:w-3/4">
          <h2 className="mb-4 text-center">Transaction Details</h2>
          <p className="mt-2 break-words">
            <span className="font-bold">Signature: </span>{" "}
            {transactionDetails.signature}
          </p>
          <p className="mt-2">
            <span className="font-bold">Fee:</span>{" "}
            {transactionDetails.fee / LAMPORTS_PER_SOL} SOL
          </p>
          <p className="mt-2 break-words">
            <span className="font-bold">Timestamp:</span>{" "}
            {new Date(transactionDetails.blockTime * 1000).toLocaleString()}
            <span className="font-bold">{" / Blocktime: "}</span>
            {transactionDetails.blockTime}
          </p>
          <p className="mt-2">
            <span className="font-bold">Slot:</span>{" "}
            {Intl.NumberFormat()
              .format(transactionDetails.slot)
              .replaceAll(",", ", ")}
          </p>
          <p className="mt-2 break-words">
            <span className="font-bold">Previous Blockhash:</span>{" "}
            {transactionDetails.previousBlockhash}
          </p>
        </div>
      )}
    </div>
  );
};

export default Main;
