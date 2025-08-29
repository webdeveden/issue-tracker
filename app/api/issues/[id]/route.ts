import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { patchIssueScheama } from "@/app/validationSchemas";
import authOptions from "@/app/auth/authOptions";
import { getServerSession } from "next-auth";
import { error } from "console";

interface Prop {
  params: { id: string };
}

export async function PATCH(request: NextRequest, { params }: Prop) {
  // protecting our api by making sure only authenticated user can access our data
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({}, { status: 401 }); // unauthorized

  const body = await request.json();
  const validation = patchIssueScheama.safeParse(body);
  if (!validation.success) {
    return NextResponse.json(validation.error.format(), { status: 400 });
  }

  if (body.assignedToUserId) {
    const user = await prisma.user.findUnique({
      where: { id: body.assignedToUserId },
    });
    if (!user) {
      return NextResponse.json({ error: "Invalid user" }, { status: 400 });
    }
  }

  const issue = await prisma.issue.findUnique({
    where: { id: parseInt(params.id) },
  });
  if (!issue)
    return NextResponse.json({ error: "Invalid issue" }, { status: 404 });

  const updatedIssue = await prisma.issue.update({
    where: { id: parseInt(params.id) },
    data: {
      title: body.title,
      description: body.description,
      assignedToUserId: body.assignedToUserId,
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
