import React from "react";
import { useMediaQuery } from "@chakra-ui/react";
import SRMPcScreen from "./SendRequestMutationresponsif/SRMPcScreen";
import SRMPMobileSreen from "./SendRequestMutationresponsif/SRMPMobileScreen";

const SendRequestMutation = () => {
  const [isSmallerThan401] = useMediaQuery("(max-width: 767px)");
  return <div>{isSmallerThan401 ? <SRMPMobileSreen /> : <SRMPcScreen />}</div>;
};

export default SendRequestMutation;
