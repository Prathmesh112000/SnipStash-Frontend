import React from 'react';
import {
  Box,
  Heading,
  Text,
  Link,
  HStack,
  Tag,
  IconButton,
  useToast,
  Tooltip,
} from '@chakra-ui/react';
import { FaExternalLinkAlt, FaTrash, FaCheck, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { blogsAPI } from '../services/api';

const BlogCard = ({ blog, onDelete }) => {
  const navigate = useNavigate();
  const toast = useToast();

  const handleToggleRead = async () => {
    try {
      await blogsAPI.toggleRead(blog._id);
      toast({
        title: blog.isRead ? 'Marked as unread' : 'Marked as read',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error updating status',
        description: error.response?.data?.message || 'Something went wrong',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDelete = async () => {
    try {
      await blogsAPI.delete(blog._id);
      onDelete(blog._id);
      toast({
        title: 'Blog deleted successfully',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error deleting blog',
        description: error.response?.data?.message || 'Something went wrong',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box
      p={4}
      borderWidth="1px"
      borderRadius="lg"
      bg="white"
      _dark={{ bg: 'gray.700' }}
      boxShadow="sm"
    >
      <HStack justify="space-between" mb={2}>
        <Heading size="md">
          <Link
            href={blog.url}
            isExternal
            color="blue.500"
            _hover={{ textDecoration: 'underline' }}
          >
            {blog.title}
            <IconButton
              icon={<FaExternalLinkAlt />}
              size="xs"
              ml={2}
              variant="ghost"
              aria-label="Open blog"
            />
          </Link>
        </Heading>
        <HStack>
          <Tooltip label={blog.isRead ? 'Mark as unread' : 'Mark as read'}>
            <IconButton
              icon={blog.isRead ? <FaCheck /> : <FaTimes />}
              colorScheme={blog.isRead ? 'green' : 'gray'}
              size="sm"
              onClick={handleToggleRead}
              aria-label={blog.isRead ? 'Mark as unread' : 'Mark as read'}
            />
          </Tooltip>
          <Tooltip label="Delete blog">
            <IconButton
              icon={<FaTrash />}
              colorScheme="red"
              size="sm"
              onClick={handleDelete}
              aria-label="Delete blog"
            />
          </Tooltip>
        </HStack>
      </HStack>

      <Text color="gray.600" _dark={{ color: 'gray.300' }} mb={2}>
        {blog.description}
      </Text>

      <HStack spacing={2} mb={2}>
        <Tag size="sm" colorScheme="blue">
          {blog.category}
        </Tag>
        {blog.tags.map((tag) => (
          <Tag key={tag} size="sm" colorScheme="gray">
            {tag}
          </Tag>
        ))}
      </HStack>

      {blog.notes && (
        <Box
          mt={2}
          p={2}
          bg="gray.50"
          _dark={{ bg: 'gray.600' }}
          borderRadius="md"
        >
          <Text fontSize="sm" color="gray.600" _dark={{ color: 'gray.300' }}>
            {blog.notes}
          </Text>
        </Box>
      )}
    </Box>
  );
};

export default BlogCard; 