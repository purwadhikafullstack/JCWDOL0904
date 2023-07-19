import { AtSignIcon, StarIcon } from "@chakra-ui/icons";
import {
  Box,
  Card,
  CardBody,
  Image,
  List,
  ListIcon,
  ListItem,
  Stack,
} from "@chakra-ui/react";
import { HomeIcon } from "@heroicons/react/24/outline";
import React from "react";

const DataAdminDashboard = (props) => {
  return (
    <>
      <Card shadow="lg" background="blackAlpha.100">
        <CardBody>
          <Stack direction="row" justifyContent="left" alignItems="center">
            <Box backgroundColor="white" padding="5px" borderRadius="50px">
              <Image
                width="70px"
                src={`${process.env.REACT_APP_API_BASE}/${props.props.adminData.user_image}`}
                borderRadius="50px"
              />
            </Box>
            <List alignItems="center" spacing={1}>
              <ListItem fontSize="13px">
                <ListIcon as={AtSignIcon} boxSize="13px" />
                {props.props.adminData.username}
              </ListItem>
              <ListItem fontSize="13px">
                <ListIcon as={StarIcon} boxSize="13px" />
                {props.props.adminData.role}
              </ListItem>
              <ListItem fontSize="13px">
                <ListIcon as={HomeIcon} boxSize="15px" />
                {props.props.warehousePlace}
              </ListItem>
            </List>
          </Stack>
          <h1 className="text-xl font-semibold text-gray-900 py-2">
            Hi, {props.props.adminData.username}. Welcome to the admin dashboard
          </h1>
        </CardBody>
      </Card>
    </>
  );
};

export default DataAdminDashboard;
