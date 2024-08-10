"use client";
import { Avatar, Box, Flex, Heading, Text, VStack, HStack, Button, Input } from "@chakra-ui/react";
import ProtectedRoute from "components/ProtectedRoute";
import { useEffect, useState } from "react";
import { useAccount } from "store/account";

export default function Account() {
  const account = useAccount();
  const [edit, setEdit] = useState(false);
  const [username, setUsername] = useState(account.username);
  const [email, setEmail] = useState(account.email);

  useEffect(() => {
    setUsername(account.username);
    setEmail(account.email);
  }, [account]);

  const handleButton = async () => {
    if (edit) {
      try {
        const res = await fetch(`${process.env.AUTH_SERVER}/update-account`, {
          method: "POST",
          body: JSON.stringify({ email, username }),
          credentials: "include",
        });
      } catch (error) {
        console.error(error);
      } finally {
        setEdit(false);
      }
    } else {
      setEdit(true);
    }
  };

  return (
    <ProtectedRoute>
      <Flex
        alignItems={"center"}
        margin={"2em"}
        justifyContent={"flex-start"}
        gap={"1em"}
        flexDir={"column"}
        minHeight={"100vh"}
      >
        <Box width={"50%"}>
          <Heading size={"md"} marginBottom={"0.5em"} marginLeft={"0.5em"}>
            Account
          </Heading>
          <Flex
            flexDir={"column"}
            alignItems={"flex-start"}
            gap={"1em"}
            borderRadius={"0.4em"}
            bgColor={"background.900"}
            padding={"1em"}
          >
            <Flex alignItems={"center"} justifyContent={"space-between"} width={"100%"}>
              <HStack spacing={"1em"}>
                <Avatar src={account.picture} name={account.username} />
                <Text onClick={() => navigator.clipboard.writeText(account.username!)}>{account.username}</Text>
              </HStack>
              <Button variant={"primary"} onClick={() => handleButton()}>
                {edit ? "Save" : "Edit"}
              </Button>
            </Flex>
            <Flex
              flexDir={"column"}
              width={"100%"}
              borderRadius={"0.4em"}
              bgColor={"background.100"}
              padding={"1em"}
              gap={"1em"}
              alignItems={"start"}
            >
              <VStack spacing={"0.4em"} alignItems={"start"}>
                <Text fontWeight={"bold"}>Name</Text>
                {edit ? (
                  <Input type="text" value={username} onChange={(event) => setUsername(event.target.value)} />
                ) : (
                  <Text>{username}</Text>
                )}
              </VStack>
              <VStack spacing={"0.4em"} alignItems={"start"}>
                <Text fontWeight={"bold"}>Email</Text>
                {edit ? (
                  <Input type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
                ) : (
                  <Text>{email}</Text>
                )}
              </VStack>
            </Flex>
          </Flex>
        </Box>
      </Flex>
    </ProtectedRoute>
  );
}
