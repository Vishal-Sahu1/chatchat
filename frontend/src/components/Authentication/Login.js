import React, { useState } from "react";
import backgroundImage from "./background.png";
import axios from "axios";
import { useToast } from "@chakra-ui/react";
import { useHistory } from "react-router-dom";
import {
  Input,
  InputGroup,
  InputRightElement,
  Button,
  FormControl,
  FormLabel,
  VStack,
  Heading,
  Box
} from "@chakra-ui/react";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const toast = useToast();
  const history = useHistory();

  const handleClick = () => setShowPassword(!showPassword);

  const submitHandler = async () => {
    setLoading(true);

    // Check if all required fields are filled
    if (!email || !password) {
      toast({
        title: "Please fill all fields",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }

    // Validate email format
    if (!/\S+@\S+\.\S+/.test(email)) {
      toast({
        title: "Invalid Email Format",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      // Make POST request to the login endpoint to check credentials in DB
      const { data } = await axios.post(
        "/api/user/login",
        { email, password },
        config
      );

      // Show success toast notification
      toast({
        title: "Login Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });

      // Store user information in localStorage
      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);

      // Redirect user to the /domain page
      history.push("/domain");
    } catch (error) {
      // Handle error cases
      toast({
        title: "Error Occurred!",
        description: error.response?.data?.message || "Invalid credentials, please try again",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };

  return (
    <Box
      // backgroundImage="url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRC65H_AzkklnHH0OlQdq7kYkRsR0v1Jhvjng&s')"
      backgroundImage={`url(${backgroundImage})`}
      backgroundSize="cover"
      minHeight="100vh" 
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <VStack spacing="5px" padding={8} boxShadow="lg" borderWidth="1px" borderRadius="md" background="white">
        <Heading as="h2" size="lg" mb={4} textAlign="center">Login</Heading>
        <FormControl id="email" isRequired>
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            placeholder="Enter Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </FormControl>

        <FormControl id="password" isRequired>
          <FormLabel>Password</FormLabel>
          <InputGroup size="md">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Enter Your Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <InputRightElement width="4.5rem">
              <Button h="1.75rem" size="sm" onClick={handleClick}>
                {showPassword ? "Hide" : "Show"}
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>

        <Button
          colorScheme="blue"
          width="100%"
          mt={4}
          onClick={submitHandler}
          isLoading={loading}
        >
          Login
        </Button>

        <Button
          variant="solid"
          colorScheme="red"
          width="100%"
          mt={4}
          onClick={() => {
            setEmail("guest@example.com");
            setPassword("123456");
          }}
        >
          Get Guest User Credentials
        </Button>

        <Button
          variant="outline"
          colorScheme="teal"
          width="100%"
          mt={2}
          onClick={() => history.push("/")}
        >
          Go to Sign Up
        </Button>
      </VStack>
    </Box>
  );
};

export default Login;