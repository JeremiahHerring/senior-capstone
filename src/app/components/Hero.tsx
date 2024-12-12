"use client";

import { Box, Heading, Container, Text, Button, Stack } from "@chakra-ui/react";
import { useRouter } from "next/navigation";

export default function Hero() {
  const router = useRouter();
  return (
    <>
      <Container maxW={"3xl"}>
        <Stack
          as={Box}
          textAlign={"center"}
          spacing={{ base: 8, md: 14 }}
          py={{ base: 20, md: 36 }}
        >
          <Heading
            fontWeight={600}
            fontSize={{ base: "2xl", sm: "4xl", md: "6xl" }}
            lineHeight={"110%"}
          >
            Learn Data Structures and Algorithms <br />
            <Text as={"span"} color={"green.400"}>
              Prepare for Technical Interviews
            </Text>
          </Heading>
          <Text color={"gray.500"}>
            Get your personalized roadmap to prepare for technical interviews by
            clicking the button below! Our platform offers a variety of
            interactive exercises and learning material.
          </Text>
          <Stack
            direction={"column"}
            spacing={3}
            align={"center"}
            alignSelf={"center"}
            position={"relative"}
          >
            <Button
              colorScheme={"green"}
              bg={"green.400"}
              rounded={"full"}
              px={6}
              _hover={{
                bg: "green.500",
              }}
              onClick={() => {
                router.push("/dashboard");
              }}
            >
              Get Started
            </Button>
            <Button variant={"link"} colorScheme={"blue"} size={"sm"}>
              Learn more
            </Button>
          </Stack>
        </Stack>
      </Container>
    </>
  );
}
