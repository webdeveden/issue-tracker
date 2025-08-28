"use client";

import { User } from "@prisma/client";
import Skeleton from "@/app/components/Skeleton";
import { Select } from "@radix-ui/themes";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React, { useEffect, useState } from "react";

const AssigneeSelect = () => {
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
    <Select.Root>
      <Select.Trigger placeholder="Assign..." />
      <Select.Content>
        <Select.Group>
          <Select.Label>Suggestions</Select.Label>
          {users?.map((user) => (
            <Select.Item key={user.id} value={user.id}>
              {user.name}
            </Select.Item>
          ))}
        </Select.Group>
      </Select.Content>
    </Select.Root>
  );
};

export default AssigneeSelect;
