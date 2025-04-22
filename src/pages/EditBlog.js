import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  VStack,
  useToast,
  Heading,
  Tag,
  TagLabel,
  TagCloseButton,
  HStack,
  InputGroup,
  InputRightElement,
} from '@chakra-ui/react';
import { useNavigate, useParams } from 'react-router-dom';
import { blogsAPI } from '../services/api';

const EditBlog = () => {
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    description: '',
    category: 'article',
    tags: [],
    notes: '',
  });
  const [tagInput, setTagInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    fetchBlog();
  }, [id]);

  const fetchBlog = async () => {
    try {
      setIsLoading(true);
      const blog = await blogsAPI.getById(id);
      setFormData({
        title: blog.title || '',
        url: blog.url || '',
        description: blog.description || '',
        category: blog.category || 'article',
        tags: blog.tags || [],
        notes: blog.notes || '',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load blog',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      navigate('/blogs');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTagInput = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!formData.tags.includes(tagInput.trim())) {
        setFormData((prev) => ({
          ...prev,
          tags: [...prev.tags, tagInput.trim()],
        }));
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await blogsAPI.update(id, formData);
      toast({
        title: 'Blog updated successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      navigate('/blogs');
    } catch (error) {
      toast({
        title: 'Error updating blog',
        description: error.response?.data?.message || 'Something went wrong',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box maxW="800px" mx="auto" p={6}>
      <Heading mb={6}>Edit Blog</Heading>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <FormControl>
            <FormLabel>Title</FormLabel>
            <Input
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter blog title"
            />
          </FormControl>

          <FormControl>
            <FormLabel>URL</FormLabel>
            <Input
              name="url"
              value={formData.url}
              onChange={handleChange}
              placeholder="Enter blog URL"
              type="url"
            />
          </FormControl>

          <FormControl>
            <FormLabel>Description</FormLabel>
            <Textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter a brief description"
            />
          </FormControl>

          <FormControl>
            <FormLabel>Category</FormLabel>
            <Select
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="article">Article</option>
              <option value="tutorial">Tutorial</option>
              <option value="documentation">Documentation</option>
              <option value="other">Other</option>
            </Select>
          </FormControl>

          <FormControl>
            <FormLabel>Tags</FormLabel>
            <InputGroup>
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagInput}
                placeholder="Add tags (press Enter)"
              />
              <InputRightElement width="4.5rem">
                <Button h="1.75rem" size="sm" onClick={() => setTagInput('')}>
                  Clear
                </Button>
              </InputRightElement>
            </InputGroup>
            <HStack mt={2} flexWrap="wrap">
              {formData.tags.map((tag) => (
                <Tag
                  key={tag}
                  size="md"
                  borderRadius="full"
                  variant="solid"
                  colorScheme="blue"
                >
                  <TagLabel>{tag}</TagLabel>
                  <TagCloseButton onClick={() => removeTag(tag)} />
                </Tag>
              ))}
            </HStack>
          </FormControl>

          <FormControl>
            <FormLabel>Notes</FormLabel>
            <Textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Add any notes about this blog"
            />
          </FormControl>

          <Button
            type="submit"
            colorScheme="blue"
            isLoading={isLoading}
            loadingText="Saving..."
            width="full"
          >
            Update Blog
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default EditBlog; 