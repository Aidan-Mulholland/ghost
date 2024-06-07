"use client";
import { Input, Box, Flex, FormControl, FormLabel, Text, Stack, Button, Alert } from "@chakra-ui/react";
import Image from "next/image";
import Logo from "../../images/logo.svg";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [failedLogin, setFailedLogin] = useState(false);

  async function handleSubmit() {
    try {
      setSubmitting(true);
      const res = await fetch(`${process.env.AUTH_SERVER}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });
      if (!res.ok) {
        setFailedLogin(true);
        return;
      }
      router.push("/dms");
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Flex height={"100vh"} flexDir={"column"} bgGradient={"linear(to-br, purple.800, red.600)"} padding={"1em"}>
      <Text
        fontSize={"xx-large"}
        fontWeight={"bold"}
        letterSpacing={"5px"}
        mixBlendMode={"lighten"}
        alignSelf={"flex-start"}
        marginLeft={0}
        marginRight={"auto"}
        color={"Background"}
        bgColor={"white"}
        padding={"0.4em"}
        display={"flex"}
        alignItems={"center"}
        justifyContent={"center"}
        lineHeight={"30px"}
        gap={"0.2em"}
      >
        <Image src={Logo} alt={"Ghost logo"} width={30} height={30} />
        GHOST
      </Text>
      <Flex flexGrow={1} width={"100%"} alignItems={"center"} justifyContent={"center"} flexDir={"column"}>
        <Flex borderRadius={"0.4em"} bgColor={"Background"} padding={"1em"} boxShadow={"dark-lg"} width={"500px"}>
          <FormControl>
            <Stack spacing={"0.7em"}>
              {failedLogin && <Alert status="error">Incorrect email or password</Alert>}
              <Box>
                <FormLabel>Email address</FormLabel>
                <Input type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
              </Box>
              <Box>
                <FormLabel>Password</FormLabel>
                <Input type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
              </Box>
              <Button
                type="submit"
                bgColor={"#873154"}
                color={"white"}
                _hover={{ bgColor: "#842750" }}
                transition={"0.2s all ease"}
                onClick={async () => await handleSubmit()}
                isLoading={submitting}
              >
                Login
              </Button>
            </Stack>
          </FormControl>
        </Flex>
      </Flex>
    </Flex>
  );
}
