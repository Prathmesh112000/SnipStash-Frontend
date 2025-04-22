import React from 'react';
import {
  Box,
  Flex,
  Button,
  Heading,
  Spacer,
  useColorModeValue,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar,
  Text,
  HStack,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { FiMenu, FiUser, FiCode } from 'react-icons/fi';
// import LanguageIcon from './LanguageIcon';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Box
      as="nav"
      position="sticky"
      top="0"
      zIndex="sticky"
      bg={bgColor}
      borderBottom="1px"
      borderColor={borderColor}
      py={4}
      px={{ base: 4, md: 8 }}
    >
      <Flex maxW="1200px" mx="auto" align="center">
        <HStack spacing={2}>
          <IconButton
            icon={<FiCode />}
            colorScheme="brand"
            variant="solid"
            size="lg"
            isRound
            aria-label="SnipStash Logo"
          />
          <Heading
            as={RouterLink}
            to="/"
            size="lg"
            color="brand.500"
            _hover={{ textDecoration: 'none' }}
          >
            SnipStash
          </Heading>
        </HStack>

        <Spacer />

        {isAuthenticated ? (
          <Flex align="center" gap={4}>
            <Button
              as={RouterLink}
              to="/snippets/new"
              colorScheme="brand"
              size="sm"
              leftIcon={<FiCode />}
            >
              New Snippet
            </Button>
            <Menu>
              <MenuButton
                as={IconButton}
                icon={<FiUser />}
                variant="ghost"
                size="sm"
                aria-label="User menu"
              />
              <MenuList>
                <MenuItem as={RouterLink} to="/profile">
                  Profile
                </MenuItem>
                <MenuItem onClick={logout}>Logout</MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        ) : (
          <Flex gap={4}>
            <Button
              as={RouterLink}
              to="/login"
              variant="ghost"
              size="sm"
            >
              Login
            </Button>
            <Button
              as={RouterLink}
              to="/register"
              colorScheme="brand"
              size="sm"
            >
              Register
            </Button>
          </Flex>
        )}
      </Flex>
    </Box>
  );
};

export default Navbar; 