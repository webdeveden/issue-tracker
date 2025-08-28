import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { IssueScheama } from "@/app/validationSchemas";
import authOptions from "@/app/auth/authOptions";
import { getServerSession } from "next-auth";

interface Prop {
  params: { id: string };
}

export async function PATCH(request: NextRequest, { params }: Prop) {
  // protecting our api
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({}, { status: 401 }); // unauthorized

  const body = await request.json();
  const validation = IssueScheama.safeParse(body);
  if (!validation.success) {
    return NextResponse.json(validation.error.format(), { status: 400 });
  }

  const updatedIssue = await prisma.issue.update({
    where: { id: parseInt(params.id) },
    data: {
      title: body.title,
      description: body.description,
    },
  });

  return NextResponse.json(updatedIssue, { status: 201 });
}

export async function DELETE(request: NextRequest, { params }: Prop) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({}, { status: 401 }); // unauthorized

  const issue = await prisma.issue.findUnique({
    where: { id: parseInt(params.id) },
  });

  if (!issue)
    return NextResponse.json({ error: "Invalid Issue" }, { status: 404 });
  await prisma.issue.delete({
    where: { id: issue.id },
  });
  return NextResponse.json({});
}
