"use client";

import { Issue, User } from "@prisma/client";
import Skeleton from "@/app/components/Skeleton";
import { Select } from "@radix-ui/themes";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

interface Props {
  issue: Issue;
  users: User[];
}

const AssigneeSelect = ({ issue }: Props) => {
  const {
    data: users,
    error,
    isLoading,
  } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: () => axios.get("/api/users").then((res) => res.data),
    staleTime: 60 * 1000, // treat our fetched data as new for 60 second
    retry: 3, // retry 3 before returnin the error
  });

  if (error) return <p>Error fetching data</p>;

  if (isLoading) return <Skeleton height="2rem" />;

  //   // using useeffect for fecthcing data from the background
  //   useEffect(() => {
  //     const fetchUser = async () => {
  //       const { data } = await axios.get<User[]>("/api/users");
  //       setUsers(data);
  //     };
  //     fetchUser();
  //   }, []);

  return (
    <>
      <Select.Root
        defaultValue={issue.assignedToUserId || ""}
        onValueChange={async (userId) => {
          try {
            await axios.patch(`/api/issues/${issue.id}`, {
              assignedToUserId: userId || null,
            });

            const selectedUser = users?.find((user) => user.id === userId);

            if (selectedUser) {
              toast.success(
                `Assignee updated successfully to ${selectedUser.name}`
              );
            }
          } catch (error) {
            toast.error("Failed to update assignee");
          }
        }}
      >
        <Select.Trigger placeholder="Assign..." />
        <Select.Content>
          <Select.Group>
            <Select.Label>Suggestions</Select.Label>
            <Select.Item value="">Unassigned</Select.Item>
            {users?.map((user) => (
              <Select.Item key={user.id} value={user.id}>
                {user.name}
              </Select.Item>
            ))}
          </Select.Group>
        </Select.Content>
      </Select.Root>
      <Toaster
        position="bottom-center"
        toastOptions={{
          // Specific for success
          success: {
            style: {
              background: "green",
              color: "white",
            },
          },
          // Specific for error
          error: {
            style: {
              background: "red",
              color: "white",
            },
          },
        }}
      />
    </>
  );
};

export default AssigneeSelect;
