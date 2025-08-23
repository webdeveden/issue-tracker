import React from "react";
import dynamic from "next/dynamic";
import IssueFormLoading from "../_components/IssueFormSkeleton";

const IssueForm = dynamic(() => import("@/app/issues/_components/IssueForm"), {
  ssr: false,
  loading: () => <IssueFormLoading />,
});

const NewIssuePage = () => {
  return <IssueForm />;
};

export default NewIssuePage;
