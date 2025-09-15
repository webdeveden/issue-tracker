"use client";
import ErrorMessage from "@/app/components/ErrorMessage";
import Spinner from "@/app/components/Spinner";
import { IssueScheama } from "@/app/validationSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Issue, Status } from "@prisma/client";
import {
  Box,
  Button,
  Callout,
  Flex,
  Select,
  TextArea,
  TextField,
} from "@radix-ui/themes";
import axios from "axios";
import "easymde/dist/easymde.min.css";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import SimpleMDE from "react-simplemde-editor";
import { z } from "zod";

// defining an optional interface for  editing issue

interface Props {
  issue?: Issue;
}
// type safe from zod schema directly
type IssueFormData = z.infer<typeof IssueScheama>;

// lazy loading to disable server side rendering

const statuses: { label: string; value?: Status }[] = [
  { label: "Open", value: "OPEN" },
  { label: "In Progress", value: "IN_PROGRESS" },
  { label: "closed", value: "CLOSED" },
];
// const queryClient = useQueryClient();

const IssueForm = ({ issue }: Props) => {
  // navigating user back to the creating new issue after submit
  const router = useRouter();
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<IssueFormData>({
    resolver: zodResolver(IssueScheama),
  });

  // displaying dynamically errors to clients
  const [error, setError] = useState("");
  // when to show the spinner and submit button
  const [isSubmitting, setSubmit] = useState(false);

  const handleFormSubmit = handleSubmit(async (data) => {
    try {
      setSubmit(true);
      if (issue) await axios.patch(`/api/issues/${issue.id}`, data);
      else await axios.post("/api/issues", data);
      router.push("/issues/list");
      router.refresh(); // to avoid caching
    } catch (error) {
      setError("An unexpected error  occured");
      setSubmit(false);
    }
  });
  return (
    <div className="max-w-xl">
      {error && (
        <Callout.Root color="red" className="mb-5">
          <Callout.Text>{error}</Callout.Text>
        </Callout.Root>
      )}
      <form className="space-y-3" onSubmit={handleFormSubmit}>
        <TextField.Root>
          <TextField.Input
            defaultValue={issue?.title}
            placeholder="Title"
            {...register("title")}
          />
        </TextField.Root>

        <ErrorMessage>{errors.title?.message}</ErrorMessage>

        <Controller
          name="description"
          defaultValue={issue?.description}
          control={control}
          render={({ field }) => (
            <SimpleMDE placeholder="Description" {...field} />
          )}
        />
        <Box>
          {issue && (
            <TextArea
              size="3"
              placeholder="Comment(Optional)"
              {...register("comment")}
              defaultValue={issue?.comment ?? ""}
            />
          )}
        </Box>
        <Box>
          {issue && (
            <Select.Root
              onValueChange={async (newStatus) => {
                try {
                  await axios.patch(`/api/issues/${issue.id}`, {
                    status: newStatus,
                  });

                  toast.success(`Status updated to ${newStatus}`);
                } catch (error) {
                  toast.error("Failed to update status");
                }
              }}
            >
              <Select.Trigger placeholder="Change issue status">
                {issue.status}
              </Select.Trigger>
              <Select.Content>
                {statuses.map((status) => (
                  <Select.Item
                    key={status.value}
                    value={status.value || ""}
                    disabled={status.value === issue.status}
                  >
                    {status.label}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
          )}
        </Box>

        <ErrorMessage>{errors.description?.message}</ErrorMessage>
        <Flex justify="between">
          <Button onClick={() => router.push("/issues/list")}>Cancel</Button>
          <Button disabled={isSubmitting}>
            {issue ? "Update Issue" : "Submit New Issue "}{" "}
            {isSubmitting && <Spinner />}
          </Button>
        </Flex>
      </form>
    </div>
  );
};

export default IssueForm;
