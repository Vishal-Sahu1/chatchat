import React, { useEffect } from "react";
import { Box, VStack, Heading, Button, Image } from "@chakra-ui/react";
import { useHistory } from "react-router-dom";
import { io } from "socket.io-client";
import backgroundImage from "./Authentication/background.png";  

const socket = io("http://localhost:5000"); // Connect to the Socket.IO server

const Domain = () => {
  const history = useHistory();

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to Socket.IO server");
    });
    // Avoid disconnecting socket during page navigation
  }, []);

  const handleJoinGroup = (groupName) => {
    socket.emit("joinRoom", { roomName: groupName });
    history.push(`/chat/${groupName}`);
  };

  return (
    <Box
      backgroundImage={`url(${backgroundImage})`}
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      padding={4}
      backgroundSize="cover"
      backgroundPosition="center"
    >
      <VStack spacing={8} width="80%">
        <Box 
          background="blue.100"
          padding={6}
          borderRadius="md"
          border="1px solid"
          borderColor="blue.900"
          width="100%"
          textAlign="center"
        >
          <Heading as="h2" size="2xl" color="blue.900">
            Select a Group to Join
          </Heading>
        </Box>
        <Box
          display="flex"
          justifyContent="space-between"
          width="100%"
          flexWrap="wrap"
          gap={6}
        >
          <Box
            width={{ base: "100%", md: "30%" }}
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
            boxShadow="lg"
            background="white"
            transition="transform 0.3s ease"
            _hover={{ transform: "scale(1.05)" }}  // Slight scale effect on hover
          >
            <Image
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSiEjBilP-PBEbL7NAsVh5jU2PEYPgaGhh8-g&s"
              alt="Web Development Group"
              objectFit="cover"
              width="100%"
              height="200px"
            />
            <Box p={4}>
              <Button
                colorScheme="blue"
                width="100%"
                onClick={() => handleJoinGroup("WebDevelopment")}
              >
                Join Web Development Group
              </Button>
            </Box>
          </Box>

          <Box
            width={{ base: "100%", md: "30%" }}
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
            boxShadow="lg"
            background="white"
            transition="transform 0.3s ease"
            _hover={{ transform: "scale(1.05)" }}  // Slight scale effect on hover
          >
            <Image
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ6eXWZ3rAjpb43fiGhevnJIFGoNfQoUYemQw&s"
              alt="AI/ML Group"
              objectFit="cover"
              width="100%"
              height="200px"
            />
            <Box p={4}>
              <Button
                colorScheme="teal"
                width="100%"
                onClick={() => handleJoinGroup("AI_ML")}
              >
                Join AI/ML Group
              </Button>
            </Box>
          </Box>

          <Box
            width={{ base: "100%", md: "30%" }}
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
            boxShadow="lg"
            background="white"
            transition="transform 0.3s ease"
            _hover={{ transform: "scale(1.05)" }}  // Slight scale effect on hover
          >
            <Image
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRC65H_AzkklnHH0OlQdq7kYkRsR0v1Jhvjng&s"
              alt="DSA Group"
              objectFit="cover"
              width="100%"
              height="200px"
            />
            <Box p={4}>
              <Button
                colorScheme="purple"
                width="100%"
                onClick={() => handleJoinGroup("DSA")}
              >
                Join DSA Group
              </Button>
            </Box>
          </Box>
        </Box>
      </VStack>
    </Box>
  );
};

export default Domain;
