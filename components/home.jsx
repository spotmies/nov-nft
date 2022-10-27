import React from "react";
import constants from "./constants";

export default function HomePage() {
  return (
    <div className="home-page h-[100vh] w-full bg-slate-400 flex flex-col justify-between">
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
      <div className="w-full flex flex-row hidden justify-between items-center sm:inline-flex">
        <img src="/assets/1.png" className="w-[30vw]" />
        {totalMintCount()}
        {mintSection()}
      </div>
    </div>
  );

  function totalMintCount() {
    return (
      <div className="flex flex-col items-center elmessiri-font">
        <p className="text-4xl sm:text-8xl">{constants.mintName}</p>
        <p className="sm:text-xl sm:pt-[5px]">{constants.mintPrice}</p>

        <div className=" w-[120px] h-[30px] sm:h-[40px] drop-shadow-md sm:w-[140px] bg-white rounded-md mt-[15px]">
          <div className="flex flex-row w-full h-full items-center justify-center">
            <p className="text-sm sm:text-xl">0 / {constants.mintVolume}</p>
          </div>
        </div>
      </div>
    );
  }

  function mintSection() {
    return (
      <div className="flex flex-col items-center h-[40vh] sm:h-[60vh] m-auto justify-around w-[80vw] sm:m-1 sm:w-[30vw] avenyt-font p-5 bg-white rounded-2xl md:mr-[50px] relative">
        <p className="text-2xl sm:text-4xl">{constants.mint_will_start}</p>
        <div className="w-[80%] flex flex-row justify-between items-center">
          <p className="p-2 sm:p-4 bg-blue-400 text-white rounded-md sm:text-2xl">
            79
          </p>
          <span className="text-xl sm:text-4xl">:</span>
          <p className="p-2 sm:p-4 bg-blue-400 text-white rounded-md sm:text-2xl">
            79
          </p>
          <span className="text-xl sm:text-4xl">:</span>
          <p className="p-2 sm:p-4 bg-blue-400 text-white rounded-md sm:text-2xl">
            79
          </p>
        </div>
        <p className="sm:text-2xl">{constants.mint_upto}</p>
        <div className="flex flex-row items-center">
          <p className="sm:text-2xl">{constants.mint_lable}</p>
          <span className="flex flex-col">
            <span className="flex flex-row">
              <p className="pl-[15px] sm:text-2xl cursor-pointer">-</p>
              <p className="pl-[15px] sm:text-2xl">3</p>
              <p className="pl-[15px] sm:text-2xl cursor-pointer">+</p>
            </span>
            <hr class="ml-[15px] w-[55px] h-1 bg-gray-300 rounded border-0 " />
          </span>
        </div>
        <button
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
