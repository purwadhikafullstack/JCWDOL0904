import React from "react";
import { Stack, Text } from "@chakra-ui/react";

const UserIsNotLogin = () => {
  return (
    <div>
      <Stack backgroundColor="black">
        <Text color="white" padding="10px">
          You are not login yet, please login to do transactions or to edit your profile
          !
        </Text>
      </Stack>
    </div>
  );
};

export default UserIsNotLogin;
