"use client";

import Link from "next/link";
import React from "react";
// Update the import path to the correct location of Skeleton, for example:
import Skeleton from "@/app/components/Skeleton";
import { AiFillBug } from "react-icons/ai";
import classnames from "classnames";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Avatar,
  Box,
  Container,
  DropdownMenu,
  Flex,
  Text,
} from "@radix-ui/themes";

const NavBar = () => {
  return (
    <nav className=" border-b mb-5 px-5 py-3">
      <Container>
        <Flex justify="between">
          <Flex align="center" gap="3">
            <Link href="/">
              <AiFillBug />
            </Link>
            <NavLinks />
          </Flex>
          <AuthStatus />
        </Flex>
      </Container>
    </nav>
  );
};

const NavLinks = () => {
  const currentPath = usePathname();
  const links = [
    {
      href: "/",
      label: "Dashboard",
    },
    {
      href: "/issues/list",
      label: "Issues",
    },
  ];
  return (
    <ul className="flex space-x-6">
      {links.map((link) => (
        <li key={link.href}>
          <Link
            href={link.href}
            className={classnames({
              "nav-link": true,
              "!text-zinc-900": link.href === currentPath,
              // "text-zinc-500": link.href !== currentPath,
              // "hover:text-zinc-800 transition-colors": true,
            })}
          >
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  );
};

const AuthStatus = () => {
  const { status, data: session } = useSession();

  if (status === "loading") return <Skeleton width="3rem" />;
  return (
    <Box>
      {status === "authenticated" && (
        <DropdownMenu.Root>
          <DropdownMenu.Trigger>
            <Avatar
              src={session?.user!.image!}
              fallback="?"
              className="cursor-pointer"
              radius="full"
              size="2"
              referrerPolicy="no-referrer"
            />
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.Label>
              <Text size="2">{session?.user!.email}</Text>
            </DropdownMenu.Label>

            <DropdownMenu.Item>
              <Link href="/api/auth/signout">Log out</Link>
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      )}
      {status === "unauthenticated" && (
        <Link className="nav-link" href="/api/auth/signin">
          Login
        </Link>
      )}
    </Box>
  );
};
export default NavBar;
