import React, { useState, useEffect } from "react";
import constants from "./constants";

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

  return (
    <div
      className="home-page h-[100vh] w-full bg-slate-400 flex flex-col justify-between"
      style={{
        backgroundImage: `url(${constants.background_image})`,
      }}
    >
      <div className="header w-full  pt-[3%] flex  justify-around items-center sm:flex-row flex-col">
        <h1 className="text-2xl behnschrift-font text-white sm:text-6xl">
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
          <img
            src="/assets/meta-mask-icon.png"
            className="h-[30px] sm:h-[40px] cursor-pointer"
          />
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
        <p className="text-4xl sm:text-8xl text-black">{constants.mintName}</p>
        <p className="sm:text-xl sm:pt-[5px] text-black">{constants.mintPrice}</p>

        <div className=" w-[120px] h-[30px] sm:h-[40px] drop-shadow-md sm:w-[140px] bg-white rounded-md mt-[15px]">
          <div className="flex flex-row w-full h-full items-center justify-center">
            <p className="text-sm sm:text-xl text-black">0 / {constants.mintVolume}</p>
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
          disabled={!mintStarted}
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
