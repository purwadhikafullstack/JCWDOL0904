import React from "react";
import { Stack, Text } from "@chakra-ui/react";

const UserIsNotLogin = () => {
  return (
    <div className="flex w-full items-center justify-center">
      <div className="w-full bg-black">
        <p className="text-white p-4 text-center">
          You are not login yet, please login to do transactions or to edit your
          profile !
        </p>
      </div>
    </div>
  );
};

export default UserIsNotLogin;
