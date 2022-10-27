import React from "react";
import constants from "./constants";

export default function HomePage() {
  return (
    <div className="home-page h-[100vh] w-full bg-slate-400 flex flex-col justify-between">
      <div className="header w-full  pt-[5%] flex  justify-around items-center sm:flex-row flex-col">
        <h1 className="text-4xl behnschrift-font text-white sm:text-6xl">
          {constants.heading}
        </h1>
        {/* social media icons section */}
        <div className="flex justify-evenly pt-[30px] sm:pt-[1px] sm:w-[40%] w-[100%]">
          <img
            src="/assets/twitter.png"
            className="h-[30px] sm:h-[40px]"
            onClick={() => {}}
          />
          <img src="/assets/opensea.png" className="h-[30px] sm:h-[40px]" />
          <img src="/assets/etherscan.png" className="h-[30px] sm:h-[40px]" />
          <img
            src="/assets/meta-mask-icon.png"
            className="h-[30px] sm:h-[40px]"
          />
        </div>
      </div>
      {/* Mobile view */}
      <div className="flex flex-col sm:hidden">{mintSection()}</div>
      <div className="w-full flex flex-row hidden justify-between items-center sm:inline-flex">
        <img src="/assets/1.png" className="w-[30vw]" />
        <div className="flex flex-col items-center elmessiri-font">
          <p className="text-6xl">Mint</p>
          <p className="text-xl pt-[5px]">0.05 eth</p>

          <div className="h-[40px] drop-shadow-md w-[140px] bg-white rounded-md mt-[15px]">
            <div className="flex flex-row w-full h-full items-center justify-center">
              <p className="text-xl">0 / 2025</p>
            </div>
          </div>
        </div>
        {mintSection()}
      </div>
    </div>
  );

  function mintSection() {
    return (
      <div className="flex flex-col items-center h-[35vh]  justify-around w-[30vw] avenyt-font p-5 bg-white rounded-2xl mr-[20px] relative">
        <p className="text-4xl">Mint will start in</p>
        <div className="w-[80%] flex flex-row justify-between items-center">
          <p className="p-4 bg-blue-400 text-white rounded-md text-2xl">79</p>
          <span className="text-4xl">:</span>
          <p className="p-4 bg-blue-400 text-white rounded-md text-2xl">79</p>
          <span className="text-4xl">:</span>
          <p className="p-4 bg-blue-400 text-white rounded-md text-2xl">79</p>
        </div>
        <p className="text-2xl">You can mint upto 3</p>
        <div className="flex flex-row items-center">
          <p className="text-2xl">Enter the number</p>
          <span className="flex flex-col">
            <span className="flex flex-row">
              <p className="pl-[15px] text-2xl cursor-pointer">-</p>
              <p className="pl-[15px] text-2xl">3</p>
              <p className="pl-[15px] text-2xl cursor-pointer">+</p>
            </span>
            <hr class="ml-[15px] w-[55px] h-1 bg-gray-300 rounded border-0 " />
          </span>
        </div>
        <button
          type="button"
          className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-2xl px-5 py-2.5 mr-2 mb-2  "
        >
          MINT
        </button>
        <img
          src="/assets/512_skull.png"
          alt="s"
          className="absolute right-[-5px] bottom-0 h-[120px] rounded-br-[20px]"
        />
      </div>
    );
  }
}
