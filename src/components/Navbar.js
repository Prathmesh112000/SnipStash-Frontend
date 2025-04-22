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
  MenuDivider,
} from '@chakra-ui/react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { FiMenu, FiUser, FiCode, FiFileText, FiBookmark } from 'react-icons/fi';
// import LanguageIcon from './LanguageIcon';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const location = useLocation();

  const isBlogsPage = location.pathname.includes('/blogs');
  const isSnippetsPage = location.pathname.includes('/snippets');

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
            <Menu>
              <MenuButton
                as={Button}
                leftIcon={<FiBookmark />}
                colorScheme="brand"
                variant="outline"
                size="sm"
              >
                {isBlogsPage ? 'Blogs' : isSnippetsPage ? 'Snippets' : 'Content'}
              </MenuButton>
              <MenuList>
                <MenuItem
                  as={RouterLink}
                  to="/"
                  icon={<FiCode />}
                  color={!isBlogsPage && !isSnippetsPage ? 'brand.500' : undefined}
                >
                  Snippets
                </MenuItem>
                <MenuItem
                  as={RouterLink}
                  to="/blogs"
                  icon={<FiFileText />}
                  color={isBlogsPage ? 'brand.500' : undefined}
                >
                  Blogs
                </MenuItem>
              </MenuList>
            </Menu>

            <Button
              as={RouterLink}
              to={isBlogsPage ? "/blog/new" : "/snippets/new"}
              colorScheme="brand"
              size="sm"
              leftIcon={isBlogsPage ? <FiFileText /> : <FiCode />}
            >
              New {isBlogsPage ? 'Blog' : 'Snippet'}
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
                {/* Profile option removed
                <MenuItem as={RouterLink} to="/profile">
                  Profile
                </MenuItem>
                */}
                <MenuDivider />
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
            {/* Register button removed
            <Button
              as={RouterLink}
              to="/register"
              colorScheme="brand"
              size="sm"
            >
              Register
            </Button>
            */}
          </Flex>
        )}
      </Flex>
    </Box>
  );
};

export default Navbar; 