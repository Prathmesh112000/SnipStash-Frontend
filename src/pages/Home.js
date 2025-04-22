import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  VStack,
  SimpleGrid,
  Icon,
  useColorModeValue,
} from '@chakra-ui/react';
import { FiCode, FiTag, FiSearch, FiCopy } from 'react-icons/fi';

const Feature = ({ icon, title, text }) => {
  return (
    <VStack
      align="start"
      p={6}
      bg={useColorModeValue('white', 'gray.700')}
      rounded="lg"
      shadow="md"
      spacing={4}
    >
      <Icon as={icon} w={8} h={8} color="brand.500" />
      <Heading size="md">{title}</Heading>
      <Text color={useColorModeValue('gray.600', 'gray.400')}>{text}</Text>
    </VStack>
  );
};

const Home = () => {
  return (
    <Box>
      {/* Hero Section */}
      <Box
        bg={useColorModeValue('gray.50', 'gray.900')}
        py={20}
        px={4}
      >
        <Container maxW="1200px">
          <VStack spacing={8} textAlign="center">
            <Heading
              as="h1"
              size="2xl"
              bgGradient="linear(to-r, brand.400, brand.600)"
              bgClip="text"
            >
              Organize Your Code Snippets
            </Heading>
            <Text fontSize="xl" color={useColorModeValue('gray.600', 'gray.400')} maxW="600px">
              Save, categorize, and find your code snippets instantly. Never lose track of your useful code snippets again.
            </Text>
            <Button
              as={RouterLink}
              to="/login"
              size="lg"
              colorScheme="brand"
              px={8}
            >
              Get Started
            </Button>
          </VStack>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxW="1200px" py={20} px={4}>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={8}>
          <Feature
            icon={FiCode}
            title="Smart Categorization"
            text="Automatically categorize your code snippets based on their content and language."
          />
          <Feature
            icon={FiTag}
            title="Easy Tagging"
            text="Add custom tags to organize and quickly find your snippets."
          />
          <Feature
            icon={FiSearch}
            title="Powerful Search"
            text="Search through your snippets by language, tags, or content."
          />
          <Feature
            icon={FiCopy}
            title="Quick Copy"
            text="One-click copy to clipboard for easy reuse of your code."
          />
        </SimpleGrid>
      </Container>
    </Box>
  );
};

export default Home; 