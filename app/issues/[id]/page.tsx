import prisma from "@/prisma/client";
import { Box, Grid } from "@radix-ui/themes";
import { notFound } from "next/navigation";
import EditIssueButton from "./EditIssueButton";
import IssueDetails from "./IssueDetails";
// import delay from "delay";

interface Props {
  params: { id: string };
}

const IssueDetailPage = async ({ params }: Props) => {
  const issue = await prisma.issue.findUnique({
    where: { id: parseInt(params.id) },
  });

  if (!issue) notFound();

  //   await delay(6000);

  return (
    //column size based on devices
    <Grid columns={{ initial: "1", md: "2" }} gap="5">
      <Box>
        <IssueDetails
          issueTitle={issue.title}
          issueDescription={issue.description}
          issueStatus={issue.status}
          issueCreatedAt={issue.createdAt}
        />
      </Box>
      <Box>
        <EditIssueButton issueId={issue.id} />
      </Box>
    </Grid>
  );
};

export default IssueDetailPage;
