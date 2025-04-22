import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Flex,
  Button,
  Stack,
  Link,
  useColorModeValue,
  Heading,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react';
import { FiCode, FiLogOut, FiUser } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <Box
      bg={useColorModeValue('white', 'gray.800')}
      color={useColorModeValue('gray.600', 'white')}
      px={4}
      py={4}
      borderBottom={1}
      borderStyle="solid"
      borderColor={useColorModeValue('gray.200', 'gray.900')}
    >
      <Flex
        maxW="1200px"
        mx="auto"
        alignItems="center"
        justifyContent="space-between"
      >
        <Flex alignItems="center">
          <FiCode size="24px" color="#0ea5e9" />
          <Heading
            as={RouterLink}
            to="/"
            size="md"
            ml={2}
            color="brand.500"
            _hover={{ textDecoration: 'none' }}
          >
            SnipStash
          </Heading>
        </Flex>

        <Stack
          flex={{ base: 1, md: 0 }}
          justify="flex-end"
          direction="row"
          spacing={6}
        >
          {user ? (
            <Menu>
              <MenuButton
                as={Button}
                rounded="full"
                variant="link"
                cursor="pointer"
                minW={0}
              >
                <Avatar size="sm" name={user.name} />
              </MenuButton>
              <MenuList>
                <MenuItem
                  as={RouterLink}
                  to="/dashboard"
                  icon={<FiUser />}
                >
                  Dashboard
                </MenuItem>
                <MenuItem
                  icon={<FiLogOut />}
                  onClick={logout}
                >
                  Logout
                </MenuItem>
              </MenuList>
            </Menu>
          ) : (
            <>
              <Link
                as={RouterLink}
                to="/login"
                fontSize="sm"
                fontWeight={600}
                color="brand.500"
                _hover={{
                  textDecoration: 'none',
                  color: 'brand.600',
                }}
              >
                Sign In
              </Link>
              <Button
                as={RouterLink}
                to="/register"
                display={{ base: 'none', md: 'inline-flex' }}
                fontSize="sm"
                fontWeight={600}
                color="white"
                bg="brand.500"
                _hover={{
                  bg: 'brand.600',
                }}
              >
                Sign Up
              </Button>
            </>
          )}
        </Stack>
      </Flex>
    </Box>
  );
};

export default Navbar; 