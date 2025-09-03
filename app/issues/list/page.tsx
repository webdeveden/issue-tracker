import { Table } from "@radix-ui/themes";
import { IssuesStatusBadge, Link } from "../../components";
// import Link from "next/link";
import prisma from "@/prisma/client";
import NextLink from "next/link";
// import delay from "delay";
import IssueActions from "./IssueActions";
import { Issue, Status } from "@prisma/client";

import { ArrowUpIcon } from "@radix-ui/react-icons";
import classNames from "classnames";

interface Props {
  searchParams: { status: Status; orderBy: keyof Issue };
}

const issuesPage = async ({ searchParams }: Props) => {
  const columns: { label: string; value: keyof Issue; className?: string }[] = [
    { label: "Issue", value: "title" },
    { label: "Status", value: "status", className: "hidden md:table-cell" },
    { label: "Created", value: "createdAt", className: "hidden md:table-cell" },
  ];

  const statuses = Object.values(Status);
  const status = statuses.includes(searchParams.status)
    ? searchParams.status
    : undefined;
  // THESE logic makes sure even if it's a wrong property name
  // the app won't crush.
  const orderBy = columns
    .map((column) => column.value) // return a string array
    .includes(searchParams.orderBy)
    ? { [searchParams.orderBy]: "asc" } // [property name] dynamically compute the name of the property
    : undefined;

  const issues = await prisma.issue.findMany({
    where: { status: status },
    orderBy: orderBy,
  });
  // await delay(2000);
  return (
    <div>
      <IssueActions />
      <Table.Root variant="surface">
        <Table.Header>
          <Table.Row>
            {columns.map((column) => (
              <Table.ColumnHeaderCell
                key={column.value}
                className={column.className}
              >
                <NextLink
                  href={{
                    query: { ...searchParams, orderBy: column.value },
                  }}
                >
                  {column.label}
                </NextLink>
                {column.value === searchParams.orderBy && (
                  <ArrowUpIcon className="inline" />
                )}
              </Table.ColumnHeaderCell>
            ))}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {issues.map((issue) => (
            <Table.Row key={issue.id}>
              <Table.Cell>
                <Link href={`/issues/${issue.id}`}>{issue.title}</Link>

                <div className="block md:hidden">
                  <IssuesStatusBadge status={issue.status} />
                </div>
              </Table.Cell>
              <Table.Cell className="hidden md:table-cell">
                <IssuesStatusBadge status={issue.status} />
              </Table.Cell>
              <Table.Cell className="hidden md:table-cell">
                {issue.createdAt.toDateString()}
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </div>
  );
};

export default issuesPage;
