import React from 'react';
import { Box, Text, Link } from '@chakra-ui/react';

const Footer = () => {
  return (
    <Box
      as="footer"
      role="contentinfo"
      py={6}
      bg="gray.50"
      borderTop={1}
      borderStyle="solid"
      borderColor="gray.200"
    >
      <Box maxW="1200px" mx="auto" px={4}>
        <Text textAlign="center" fontSize="sm" color="gray.600">
          © {new Date().getFullYear()} SnipStash. All rights reserved.
        </Text>
        <Text textAlign="center" fontSize="sm" color="gray.600" mt={2}>
          Built with ❤️ for developers
        </Text>
      </Box>
    </Box>
  );
};

export default Footer; 