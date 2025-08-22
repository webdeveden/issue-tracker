import { IssuesStatusBadge } from "@/app/components";
import { Status } from "@prisma/client";
import { Heading, Flex, Card, Text } from "@radix-ui/themes";
import React from "react";
import ReactMarkdown from "react-markdown";

interface Props {
  issueTitle: string;
  issueStatus: Status;
  issueDescription: string;
  issueCreatedAt: Date;
}

const IssueDetails = ({
  issueTitle,
  issueStatus,
  issueCreatedAt,
  issueDescription,
}: Props) => {
  return (
    <>
      <Heading>{issueTitle}</Heading>
      <Flex gap="3" my="2">
        <IssuesStatusBadge status={issueStatus} />
        <Text>{issueCreatedAt.toDateString()}</Text>
      </Flex>
      <Card className="prose mt-4">
        <ReactMarkdown>{issueDescription}</ReactMarkdown>
      </Card>
    </>
  );
};

export default IssueDetails;
