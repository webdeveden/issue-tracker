import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { IssueScheama } from "@/app/validationSchemas";

interface Prop {
  params: { id: string };
}

export async function PATCH(request: NextRequest, { params }: Prop) {
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
