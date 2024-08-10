"use client";
import { Input, Box, Flex, FormControl, FormLabel, Text, Stack, Button, Alert } from "@chakra-ui/react";
import Image from "next/image";
import Logo from "../../images/logo.svg";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { SignupRequest } from "common";

export default function Signup() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [failedSignup, setFailedSignup] = useState(false);
  const [notMatching, setNotMatching] = useState(false);

  async function handleSubmit() {
    try {
      if (confirmPassword !== password) {
        setNotMatching(true);
        return;
      }
      setNotMatching(false);
      setSubmitting(true);
      const body: SignupRequest = { email, username, password };
      const res = await fetch(`${process.env.AUTH_SERVER}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
        credentials: "include",
      });
      if (!res.ok) {
        setFailedSignup(true);
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
              {failedSignup && <Alert status="error">Oops! Something went wrong. Try again.</Alert>}
              {notMatching && <Alert status="error">Passwords do not match</Alert>}
              <Box>
                <FormLabel>Email address</FormLabel>
                <Input type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
              </Box>
              <Box>
                <FormLabel>Username</FormLabel>
                <Input type="email" value={username} onChange={(event) => setUsername(event.target.value)} />
              </Box>
              <Box>
                <FormLabel>Password</FormLabel>
                <Input type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
              </Box>
              <Box>
                <FormLabel>Confirm Password</FormLabel>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                />
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
                Register
              </Button>
              <Flex justifyContent={"space-around"} alignItems={"center"} gap={"0.7em"}>
                <Box flexGrow="1" height="2px" borderLeftRadius="1px" backgroundColor="GrayText" />
                <Text lineHeight={"100%"}>OR</Text>
                <Box flexGrow="1" height="2px" borderRightRadius="1px" backgroundColor="GrayText" />
              </Flex>
              <Flex justifyContent={"center"} alignItems={"center"}>
                <Link href="/login">
                  <Text color={"#8F2F5F"} _hover={{ color: "white" }} transition={"0.2s all ease"}>
                    Already have an account?
                  </Text>
                </Link>
              </Flex>
            </Stack>
          </FormControl>
        </Flex>
      </Flex>
    </Flex>
  );
}
