import { Box } from "@radix-ui/themes";
import React from "react";
import Skeleton from "../../components/Skeleton";

const LoadingNewIssuePage = () => {
  return (
    <Box className="max-w-xl ">
      <Skeleton />
      <Skeleton height="20rem" />
      <Skeleton width="10rem" />
    </Box>
  );
};

export default LoadingNewIssuePage;
