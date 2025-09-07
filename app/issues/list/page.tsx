// import Link from "next/link";
import prisma from "@/prisma/client";
// import delay from "delay";
import { Status } from "@prisma/client";
import IssueActions from "./IssueActions";

import Pagination from "@/app/components/Pagination";
import IssueTable, { columnNames, IssueQuery } from "./IssueTable";
import { Flex } from "@radix-ui/themes";
import { Metadata } from "next";

interface Props {
  searchParams: IssueQuery;
}

const issuesPage = async ({ searchParams }: Props) => {
  const statuses = Object.values(Status);
  const status = statuses.includes(searchParams.status)
    ? searchParams.status
    : undefined;
  // THESE logic makes sure even if it's a wrong property name
  // the app won't crush.
  const orderBy = columnNames.includes(searchParams.orderBy)
    ? { [searchParams.orderBy]: "asc" } // [property name] dynamically compute the name of the property
    : undefined;

  const page = parseInt(searchParams.page) || 1;
  const pageSize = 10;

  const issues = await prisma.issue.findMany({
    where: { status: status },
    orderBy: orderBy,
    skip: (page - 1) * pageSize, // number of record to skip,Page 1: (1 - 1) * 10 = 0 → Skip 0 records, return the first 10.
    take: pageSize, //number of record we wanna fetch per page
  });

  // getting count by status
  const issueCount = await prisma.issue.count({
    where: { status: status },
  });
  // await delay(2000);
  return (
    <Flex direction="column" gap="3">
      <IssueActions />
      <IssueTable searchParams={searchParams} issues={issues} />
      <Pagination
        itemCount={issueCount}
        pageSize={pageSize}
        currentPage={page}
      />
    </Flex>
  );
};

export const metadata: Metadata = {
  title: "Issue Tracker - Issue List",
  description: "View all project issues",
};

export default issuesPage;
