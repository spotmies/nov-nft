import React, { useState, useEffect } from "react";
import constants from "./constants";
import contractabi from "./abi.json";
const { MerkleTree } = require("merkletreejs");
const keccak256 = require("keccak256");
import { ethers } from "ethers";

export default function HomePage() {
  const [mintCount, setMintCount] = useState(constants.minimum_mints);
  const futureDate = new Date(constants.mint_schedule);
  const [mintStarted, setMintStarted] = useState(false);

  const [diff, setDiff] = useState({
    day: 0,
    hour: 0,
    minute: 0.0,
    month: 0,
    second: 0.0,
    year: 0,
  });
  const [timeStamp, setTimeStamp] = useState(futureDate);
  const getDateDiff = (date1, date2) => {
    const diff = new Date(date2.getTime() - date1.getTime());
    return {
      year: diff.getUTCFullYear() - 1970,
      month: diff.getUTCMonth(),
      day: diff.getUTCDate() - 1,
      hour: diff.getUTCHours(),
      minute: diff.getUTCMinutes(),
      second: diff.getUTCSeconds(),
    };
  };
  useEffect(() => {
    const timer = setInterval(() => {
      setDiff(getDateDiff(new Date(), timeStamp));
      if (new Date() > timeStamp) {
        console.log("time is up");
        setMintStarted(true);
        clearInterval(timer);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [timeStamp]);

  // contract constants
  const [walletAddress, setWalletAddress] = useState("");
  const [userMints, setUserMints] = useState(null);
  const [totalMinted, settotalMinted] = useState("0");

  //////////////////////////////////////////////////////////////////////
  ////////MEKRLE TREE /////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////

  const whiteList_leaves = constants.whiteList.map((x) => keccak256(x));
  const whiteList_tree = new MerkleTree(whiteList_leaves, keccak256, {
    sortPairs: true,
  });
  const buf2hex = (x) => "0x" + x.toString("hex");

  const proof = whiteList_tree
    .getProof(buf2hex(keccak256(walletAddress)))
    .map((x) => buf2hex(x.data));

  const leaf = buf2hex(keccak256(walletAddress));

  console.log("My leaf:", buf2hex(keccak256(walletAddress)));
  console.log(
    "Proof:",
    whiteList_tree
      .getProof(buf2hex(keccak256(walletAddress)))
      .map((x) => buf2hex(x.data))
  );
  console.log("Root Hash:", buf2hex(whiteList_tree.getRoot()));

  const is_whiteList_Valid = async () => {
    const isValid = await getContract().whiteList_MerkleVerify(proof, leaf);
    console.log("isValid?", isValid);
    return isValid;
  };

  ///////////////////////////////////////////////////////////////////
  ///////////END OF MERKLE TREE /////////////////////////////////////
  ///////////////////////////////////////////////////////////////////

  //
  //
  //
  // Contract Integration
  //
  //
  //

  useEffect(() => {
    setTimeout(() => {
      if (
        window?.ethereum &&
        window?.ethereum?.selectedAddress &&
        walletAddress === ""
      ) {
        setWalletAddress(window?.ethereum?.selectedAddress);

        checkWl(window?.ethereum?.selectedAddress.toLocaleLowerCase());
      }
    }, 1000);
    setTimeout(() => {
      mintCountFromContract();
    }, 2000);
  }, []);

  async function requestAccount(showError) {
    const alertMessage = showError ?? true;
    if (window.ethereum) {
      if (walletAddress !== "") {
        checkWl(walletAddress.toLowerCase());
        if (alertMessage) alert("Wallet already connected");
        return;
      }
      // gaWalletTracker("new-wallet");
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        mintCountFromContract();
        getChainId();
        // setWalletText(true);
        // gaWalletTracker("wallet-connected");

        console.log(accounts[0]);
        setWalletAddress(accounts[0]);

        checkWl(accounts[0].toLocaleLowerCase());
        console.log("account", accounts[0].toLocaleLowerCase());
        // createPost(accounts[0]);
      } catch (error) {
        // console.log("Error connecting....");
        alert(error);
      }
    } else {
      //console.log("Metamask not detected");
      // gaWalletTracker("no-metamask");
      alert("Metamask not detected");
    }
  }

  async function checkWl(walleteAddress) {
    let isWhiteList = false;

    constants.whiteList.forEach((item) => {
      if (item.toLowerCase() === walleteAddress) {
        isWhiteList = true;
      }
    });

    console.log("is whitelist", isWhiteList);
  }

  const getChainId = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window?.ethereum);
      const { chainId } = await provider.getNetwork();
      console.log("chainId", chainId);
      // setChainId(chainId);

      if (chainId !== 1) {
        alert("Please connect to Ethereum Mainnet");
      }
    } catch (error) {
      console.log("Error connecting....");
    }
  };

  const getContract = () => {
    try {
      const contractAddress = "0x4E2143BE5eca4E4b9942EA9a9aEf762251784425";
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        contractAddress,
        contractabi,
        signer
      );
      // console.log("contract", contract);
      return contract;
    } catch (error) {
      console.log("error, getcontract", error);
    }
  };

  const mintCountFromContract = async () => {
    // const TotalMinted = await getContract().suppliedNFTs();

    if (!window.ethereum) {
      //alert("Metamask not detected");
      console.log("Metamask not detected");
      return null;
    }

    try {
      const TotalMinted = await getContract().totalSupply();
      const userMinted = await getContract().userMint();

      console.log("myMints", userMinted.toString());
      setUserMints(parseInt(userMinted._hex, 16));
      console.log("totalMinted", TotalMinted.toString());
      settotalMinted(TotalMinted.toString());

      return userMinted.toString();

      // setCurrentMintCount(3769);
    } catch (err) {
      console.log("mintcount error", err);
      return null;
    }
  };

  const mintToken = async (userMintArg, NFTCount) => {
    // console.log("nft count ", NFTCount);
    try {
      if (NFTCount < 1) {
        alert("Please enter valid quantity");
        return;
      }

      let ethValue = NFTCount * constants.mint_price;
      let isWhiteList = await is_whiteList_Valid();
      // let isSkullList = await is_skullList_Valid();

      console.log("is whitelist", isWhiteList);
      if (isWhiteList) {
        console.log("whitelisted", walletAddress.toLowerCase());
        if (userMintArg === null) {
          alert("Please connect to wallet");
          return;
        } else {
          ethValue = 0;
        }
      }

      console.log("final", NFTCount, ethValue);
      if (isWhiteList) {
        getContract()
          .mint(NFTCount, proof, leaf, {
            value: ethers.utils.parseEther(ethValue.toString()),
          })
          .then((val) => {
            alert("Token minted successfully");
            mintCountFromContract();
          })
          .catch((error) => {
            console.log(error.reason);
            alert(error.reason);
          });
      }
    } catch (error) {
      console.log("error91, mint button", error);
    }

    //console.log(result);
  };

  const clickedMint = async (mints) => {
    setMintCount(mints);
    console.log("clickedMint", mints);
    requestAccount(false);
    getChainId();
    let userMints = await mintCountFromContract();
    console.log("userMints", userMints);
    if (userMints != null) {
      mintToken(userMints, mints);
    }
  };

  //
  //
  //
  // End Of Contract Integration
  //
  //
  //
  //

  return (
    <div
      className="home-page h-[100vh] w-full bg-slate-400 flex flex-col justify-between"
      style={{
        backgroundImage: `url(${constants.background_image})`,
      }}
    >
      <div className="header w-full  pt-[3%] flex  justify-around items-center sm:flex-row flex-col">
        <h1 className="text-2xl behnschrift-font text-white sm:text-5xl">
          {constants.heading}
        </h1>
        {/* social media icons section */}
        <div className="flex justify-evenly pt-[30px] sm:pt-[1px] sm:w-[40%] w-[100%]">
          <img
            src="/assets/twitter.png"
            className="h-[30px] sm:h-[40px] cursor-pointer"
            onClick={() => {
              window.open(constants.twitterLink, "_blank");
            }}
          />
          <img
            src="/assets/opensea.png"
            className="h-[30px] sm:h-[40px] cursor-pointer"
            onClick={() => {
              window.open(constants.openSeaLink, "_blank");
            }}
          />
          <img
            src="/assets/etherscan.png"
            className="h-[30px] sm:h-[40px] cursor-pointer"
            onClick={() => {
              window.open(constants.etherScanLink, "_blank");
            }}
          />
         {walletAddress === "" ? <img
            src="/assets/meta-mask-icon.png"
            className="h-[30px] sm:h-[40px] cursor-pointer"
            onClick={() => {
              requestAccount(true);
            }}
          /> : <p className="text-black bg-white p-[10px] rounded-3xl font-bold cursor-pointer"
          onClick={() =>{
            alert(`Wallet Connected , ${walletAddress}`)
          }}
          >0x...{walletAddress.slice(-4)}</p> }
        </div>
      </div>
      {/* Mobile view */}
      <div className="flex flex-col sm:hidden">
        <div className="pb-[20px]"> {mintSection()}</div>
        <div className="flex flex-row">
          <img src="/assets/1.png" className="h-[30vh]" />
          <div className="pt-[20px]">{totalMintCount()}</div>
        </div>
      </div>
      {/* end of mobile view */}
      <div className="w-full flex flex-row hidden justify-between items-end sm:inline-flex">
        <img src="/assets/1.png" className="w-[30vw]" />
        <div className="flex flex-col h-full items-center justify-center">
          {totalMintCount()}
        </div>
        {mintSection()}
      </div>
    </div>
  );

  function totalMintCount() {
    return (
      <div className="flex flex-col items-center elmessiri-font">
        <p className="text-4xl sm:text-8xl text-white">{constants.mintName}</p>
        <p className="sm:text-xl sm:pt-[5px] text-white">
          {constants.mintPrice}
        </p>

        <div className=" w-[120px] h-[30px] sm:h-[40px] drop-shadow-md sm:w-[140px] bg-white rounded-md mt-[15px]">
          <div className="flex flex-row w-full h-full items-center justify-center">
            <p className="text-sm sm:text-xl text-black">
              0 / {constants.mintVolume}
            </p>
          </div>
        </div>
      </div>
    );
  }

  function mintSection() {
    return (
      <div className="flex flex-col items-center h-[40vh] sm:mb-[60px] sm:h-[60vh] m-auto justify-around w-[80vw] sm:m-1 sm:w-[30vw] avenyt-font p-5 bg-white rounded-2xl md:mr-[50px] relative">
        <p className="text-2xl sm:text-4xl text-black">
          {mintStarted ? constants.mint_has_started : constants.mint_will_start}
        </p>
        {!mintStarted && (
          <div className="w-[80%] flex flex-row justify-between items-center">
            <p className="p-2 sm:p-4 bg-blue-400 text-white rounded-md sm:text-2xl">
              {diff.hour}
            </p>
            <span className="text-xl sm:text-4xl text-black">:</span>
            <p className="p-2 sm:p-4 bg-blue-400 text-white rounded-md sm:text-2xl">
              {diff.minute}
            </p>
            <span className="text-xl sm:text-4xl text-black">:</span>
            <p className="p-2 sm:p-4 bg-blue-400 text-white rounded-md sm:text-2xl">
              {diff.second}
            </p>
          </div>
        )}
        <p className="sm:text-2xl text-black">{constants.mint_upto}</p>
        <div className="flex flex-row items-center">
          <p className="sm:text-2xl text-black">{constants.mint_lable}</p>
          <span className="flex flex-col">
            <span className="flex flex-row">
              <p
                className="pl-[15px] text-black sm:text-2xl cursor-pointer"
                onClick={() => {
                  if (mintCount > constants.minimum_mints)
                    setMintCount(mintCount - 1);
                }}
              >
                -
              </p>
              <p className="pl-[15px] text-black sm:text-2xl">{mintCount}</p>
              <p
                className="pl-[15px] sm:text-2xl text-black cursor-pointer"
                onClick={() => {
                  if (mintCount < constants.maximum_mints) {
                    setMintCount(mintCount + 1);
                  }
                }}
              >
                +
              </p>
            </span>
            <hr class="ml-[15px] w-[55px] h-1 bg-gray-300 rounded border-0 " />
          </span>
        </div>
        <button
          //disabled={!mintStarted}
          onClick={clickedMint}
          type="button"
          className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg sm:text-2xl sm:px-5 sm:py-2.5 px-5 py-1.5 mr-2 mb-2  "
        >
          {constants.mint_button}
        </button>
        <img
          src="/assets/512_skull.png"
          alt="s"
          className="absolute right-[-5px] bottom-0 h-[90px] sm:h-[120px] rounded-br-[20px]"
        />
      </div>
    );
  }
}
