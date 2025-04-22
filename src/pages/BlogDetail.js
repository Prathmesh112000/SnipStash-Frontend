import React, { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  Text,
  Button,
  useToast,
  Badge,
  HStack,
  VStack,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useColorModeValue,
  Divider,
} from '@chakra-ui/react';
import { FiMoreVertical, FiEdit2, FiTrash2, FiArrowLeft } from 'react-icons/fi';
import { useNavigate, useParams } from 'react-router-dom';
import { blogsAPI } from '../services/api';

const BlogDetail = () => {
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  useEffect(() => {
    fetchBlog();
  }, [id]);

  const fetchBlog = async () => {
    try {
      setLoading(true);
      const data = await blogsAPI.getById(id);
      setBlog(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch blog');
      toast({
        title: 'Error',
        description: 'Failed to load blog',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await blogsAPI.delete(id);
      toast({
        title: 'Success',
        description: 'Blog deleted successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      navigate('/blogs');
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to delete blog',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleToggleRead = async () => {
    try {
      const updatedBlog = await blogsAPI.toggleRead(id);
      setBlog(updatedBlog);
      toast({
        title: 'Success',
        description: `Blog marked as ${updatedBlog.isRead ? 'read' : 'unread'}`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to update blog status',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  if (loading) {
    return <Text>Loading blog...</Text>;
  }

  if (error) {
    return <Text color="red.500">{error}</Text>;
  }

  if (!blog) {
    return <Text>Blog not found</Text>;
  }

  return (
    <Box maxW="800px" mx="auto" p={6}>
      <VStack spacing={6} align="stretch">
        <HStack justify="space-between">
          <Button
            leftIcon={<FiArrowLeft />}
            variant="ghost"
            onClick={() => navigate('/blogs')}
          >
            Back to Blogs
          </Button>
          <Menu>
            <MenuButton
              as={IconButton}
              icon={<FiMoreVertical />}
              variant="ghost"
            />
            <MenuList>
              <MenuItem
                icon={<FiEdit2 />}
                onClick={() => navigate(`/blog/${id}/edit`)}
              >
                Edit
              </MenuItem>
              <MenuItem icon={<FiTrash2 />} onClick={handleDelete}>
                Delete
              </MenuItem>
              <MenuItem onClick={handleToggleRead}>
                Mark as {blog.isRead ? 'Unread' : 'Read'}
              </MenuItem>
            </MenuList>
          </Menu>
        </HStack>

        <Box
          bg={bgColor}
          p={6}
          borderRadius="lg"
          boxShadow="sm"
          border="1px"
          borderColor={borderColor}
        >
          <VStack align="stretch" spacing={4}>
            <HStack justify="space-between">
              <Badge colorScheme="blue">{blog.category}</Badge>
              <Badge colorScheme={blog.isRead ? 'green' : 'gray'}>
                {blog.isRead ? 'Read' : 'Unread'}
              </Badge>
            </HStack>

            <Heading size="lg">{blog.title || 'Untitled Blog'}</Heading>

            {blog.url && (
              <Text fontSize="md" color="blue.500">
                <a href={blog.url} target="_blank" rel="noopener noreferrer">
                  {blog.url}
                </a>
              </Text>
            )}

            {blog.description && (
              <Text fontSize="md">{blog.description}</Text>
            )}

            {blog.tags && blog.tags.length > 0 && (
              <HStack spacing={2} flexWrap="wrap">
                {blog.tags.map((tag) => (
                  <Badge key={tag} colorScheme="purple">
                    {tag}
                  </Badge>
                ))}
              </HStack>
            )}

            {blog.notes && (
              <>
                <Divider />
                <VStack align="stretch" spacing={2}>
                  <Heading size="sm">Notes</Heading>
                  <Text fontSize="md">{blog.notes}</Text>
                </VStack>
              </>
            )}

            <Text fontSize="sm" color="gray.500">
              Created: {new Date(blog.createdAt).toLocaleDateString()}
            </Text>
          </VStack>
        </Box>
      </VStack>
    </Box>
  );
};

export default BlogDetail; 