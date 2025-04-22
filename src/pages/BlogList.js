import React, { useState, useEffect } from 'react';
import {
  Box,
  SimpleGrid,
  Heading,
  Text,
  Button,
  useToast,
  Input,
  Select,
  HStack,
  VStack,
  Badge,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useColorModeValue,
} from '@chakra-ui/react';
import { FiMoreVertical, FiEye, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { blogsAPI } from '../services/api';

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const navigate = useNavigate();
  const toast = useToast();

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  useEffect(() => {
    fetchBlogs();
  }, [searchTerm, category]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await blogsAPI.getAll({
        search: searchTerm,
        category,
      });
      setBlogs(Array.isArray(response) ? response : []);
      setError(null);
    } catch (err) {
      setError('Failed to fetch blogs');
      setBlogs([]);
      toast({
        title: 'Error',
        description: 'Failed to load blogs',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await blogsAPI.delete(id);
      toast({
        title: 'Success',
        description: 'Blog deleted successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      fetchBlogs();
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

  return (
    <Box maxW="1200px" mx="auto" p={6}>
      <VStack spacing={6} align="stretch">
        <Heading>My Blogs</Heading>

        <HStack spacing={4}>
          <Input
            placeholder="Search blogs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="All Categories"
          >
            <option value="article">Article</option>
            <option value="tutorial">Tutorial</option>
            <option value="documentation">Documentation</option>
            <option value="other">Other</option>
          </Select>
        </HStack>

        {loading ? (
          <Text>Loading blogs...</Text>
        ) : error ? (
          <Text color="red.500">{error}</Text>
        ) : blogs.length === 0 ? (
          <Text>No blogs found</Text>
        ) : (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
            {blogs.map((blog) => (
              <Box
                key={blog._id}
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
                  </HStack>

                  <VStack align="stretch" spacing={2}>
                    <Heading size="md">{blog.title || 'Untitled Blog'}</Heading>
                    {blog.url && (
                      <Text fontSize="sm" color="blue.500" isTruncated>
                        {blog.url}
                      </Text>
                    )}
                    {blog.description && (
                      <Text fontSize="sm" noOfLines={2}>
                        {blog.description}
                      </Text>
                    )}
                  </VStack>

                  {blog.tags && blog.tags.length > 0 && (
                    <HStack spacing={2} flexWrap="wrap">
                      {blog.tags.map((tag) => (
                        <Badge key={tag} colorScheme="purple">
                          {tag}
                        </Badge>
                      ))}
                    </HStack>
                  )}

                  <HStack justify="space-between">
                    <Button
                      size="sm"
                      leftIcon={<FiEye />}
                      onClick={() => navigate(`/blog/${blog._id}`)}
                    >
                      View
                    </Button>
                    <Menu>
                      <MenuButton
                        as={IconButton}
                        icon={<FiMoreVertical />}
                        variant="ghost"
                        size="sm"
                      />
                      <MenuList>
                        <MenuItem
                          icon={<FiEdit2 />}
                          onClick={() => navigate(`/blog/${blog._id}/edit`)}
                        >
                          Edit
                        </MenuItem>
                        <MenuItem
                          icon={<FiTrash2 />}
                          onClick={() => handleDelete(blog._id)}
                        >
                          Delete
                        </MenuItem>
                      </MenuList>
                    </Menu>
                  </HStack>
                </VStack>
              </Box>
            ))}
          </SimpleGrid>
        )}
      </VStack>
    </Box>
  );
};

export default BlogList; 