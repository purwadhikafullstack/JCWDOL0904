import { Button } from "@chakra-ui/react";
import React from "react";

const SideBarPc = (props) => {
  return (
    <>
      <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
        <div className="flex min-h-0 flex-1 flex-col bg-black">
          <div className="flex h-16 flex-shrink-0 justify-center items-center px-4">
            <img
              className="h-8 w-auto"
              src={`${process.env.REACT_APP_API_BASE}logo_galaxy_white.png`}
              alt="Your Company"
            />
          </div>
          <div className="flex flex-1 flex-col overflow-y-auto">
            <nav className="flex-1 space-y-1 px-2 py-4">
              {props.navigation.map((item) => (
                <Button
                  key={item.name}
                  backgroundColor={
                    props.buttonActive === item.name ? "#4A5568" : "black"
                  }
                  _hover={{ backgroundColor: "#4A5568" }}
                  color="white"
                  width="230px"
                  justifyContent="left"
                  onClick={() => {
                    props.navigator(item.href);
                    props.setButtonActive(item.name);
                  }}
                >
                  <item.icon
                    className={props.classNames(
                      item.current
                        ? "text-gray-300"
                        : "text-gray-400 group-hover:text-gray-300",
                      "mr-3 flex-shrink-0 h-6 w-6"
                    )}
                    aria-hidden="true"
                  />
                  {item.name}
                </Button>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </>
  );
};

export default SideBarPc;
