"use client";

import { IssuesStatusBadge } from "@/app/components";
import prisma from "@/prisma/client";
import { Issue, Status } from "@prisma/client";
import { Heading, Flex, Card, Text, Select } from "@radix-ui/themes";
import React from "react";
import ReactMarkdown from "react-markdown";

// interface Props {
//   issueTitle: string;
//   issueStatus: Status;
//   issueDescription: string;
//   issueCreatedAt: Date;
// }

interface Props {
  issue: Issue;
}

const IssueDetails = ({
  //   issueTitle,
  //   issueStatus,
  //   issueCreatedAt,
  //   issueDescription,
  issue,
}: Props) => {
  return (
    <>
      <Heading>{issue.title}</Heading>
      <Flex gap="3" my="2">
        <IssuesStatusBadge status={issue.status} />
        <Text>{issue.createdAt.toDateString()}</Text>
      </Flex>
      <Card className="prose max-w-full mt-4">
        <ReactMarkdown>{issue.description}</ReactMarkdown>
      </Card>
    </>
  );
};

export default IssueDetails;
