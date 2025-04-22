import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Text,
  Link,
  useToast,
  Container,
  HStack,
  PinInput,
  PinInputField,
} from '@chakra-ui/react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const toast = useToast();
  const { login } = useAuth();

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await authAPI.sendOTP(email);
      setOtpSent(true);
      toast({
        title: 'OTP Sent',
        description: 'Please check your email for the OTP',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to send OTP',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await authAPI.verifyOTP(email, otp);
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      login({ ...user, token });
      toast({
        title: 'Login successful',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Invalid OTP',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxW="md" py={10}>
      <VStack spacing={8} align="stretch">
        <Box textAlign="center">
          <Heading>Welcome Back</Heading>
          <Text color="gray.600">Sign in to access your snippets</Text>
        </Box>

        <Box as="form" onSubmit={otpSent ? handleVerifyOTP : handleSendOTP}>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Email address</FormLabel>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                isDisabled={otpSent}
              />
            </FormControl>

            {otpSent && (
              <FormControl isRequired>
                <FormLabel>Enter OTP</FormLabel>
                <HStack justify="center">
                  <PinInput
                    value={otp}
                    onChange={setOtp}
                    type="number"
                    size="lg"
                  >
                    <PinInputField />
                    <PinInputField />
                    <PinInputField />
                    <PinInputField />
                    <PinInputField />
                    <PinInputField />
                  </PinInput>
                </HStack>
              </FormControl>
            )}

            <Button
              type="submit"
              colorScheme="brand"
              width="full"
              size="lg"
              isLoading={isLoading}
            >
              {otpSent ? 'Verify OTP' : 'Send OTP'}
            </Button>
          </VStack>
        </Box>

        <Box textAlign="center">
          <Text>
            Don't have an account?{' '}
            <Link as={RouterLink} to="/register" color="brand.500">
              Sign up
            </Link>
          </Text>
        </Box>
      </VStack>
    </Container>
  );
};

export default Login; 