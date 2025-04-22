import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Heading,
  SimpleGrid,
  Input,
  Select,
  HStack,
  Tag,
  TagLabel,
  TagCloseButton,
  useColorModeValue,
  VStack,
  Text,
  Icon,
  Spinner,
  Center,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Wrap,
  WrapItem,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useToast,
} from '@chakra-ui/react';
import { FiPlus, FiSearch, FiFilter, FiChevronDown, FiTrash2 } from 'react-icons/fi';
import { snippetsAPI } from '../services/api';
import { getLanguageIcon, getLanguageColor } from '../utils/languageIcons';

const SnippetCard = ({ snippet, onDelete }) => {
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const cancelRef = React.useRef();
  const LanguageIcon = getLanguageIcon(snippet.language);
  const languageColor = getLanguageColor(snippet.language);

  return (
    <Box
      p={6}
      bg={useColorModeValue('white', 'gray.700')}
      rounded="lg"
      shadow="md"
      _hover={{ shadow: 'lg' }}
      transition="all 0.2s"
    >
      <VStack align="start" spacing={4}>
        <Heading size="md">{snippet.title}</Heading>
        <HStack spacing={2}>
          {LanguageIcon && (
            <Icon as={LanguageIcon} color={languageColor} boxSize={5} />
          )}
          <Text fontSize="sm" color={languageColor} fontWeight="medium">
            {snippet.language}
          </Text>
        </HStack>
        <HStack spacing={2}>
          {snippet.tags.map((tag) => (
            <Tag key={tag} size="sm" variant="subtle" colorScheme="gray">
              <TagLabel>{tag}</TagLabel>
            </Tag>
          ))}
        </HStack>
        <Text
          fontFamily="mono"
          fontSize="sm"
          color={useColorModeValue('gray.600', 'gray.400')}
          noOfLines={3}
        >
          {snippet.code}
        </Text>
        <HStack spacing={2}>
          <Button
            as={RouterLink}
            to={`/snippets/${snippet._id}`}
            size="sm"
            colorScheme="brand"
            variant="outline"
          >
            View Snippet
          </Button>
          <Button
            size="sm"
            colorScheme="red"
            variant="outline"
            leftIcon={<Icon as={FiTrash2} />}
            onClick={() => setIsDeleteAlertOpen(true)}
          >
            Delete
          </Button>
        </HStack>
      </VStack>

      <AlertDialog
        isOpen={isDeleteAlertOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setIsDeleteAlertOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Snippet
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to delete this snippet? This action cannot be undone.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setIsDeleteAlertOpen(false)}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={() => {
                onDelete(snippet._id);
                setIsDeleteAlertOpen(false);
              }} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};

const Dashboard = () => {
  const [snippets, setSnippets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [languageFilter, setLanguageFilter] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const [availableLanguages, setAvailableLanguages] = useState([]);
  const toast = useToast();

  const fetchSnippets = async () => {
    try {
      setLoading(true);
      const response = await snippetsAPI.getAll({
        title: searchQuery,
        language: languageFilter,
        tags: selectedTags,
      });
      
      setSnippets(response.data.snippets);
      setAvailableLanguages(response.data.filters.languages);
      
      // Extract all unique tags
      const tags = new Set();
      response.data.snippets.forEach(snippet => {
        snippet.tags.forEach(tag => tags.add(tag));
      });
      setAllTags(Array.from(tags));
    } catch (error) {
      setError('Failed to fetch snippets');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (snippetId) => {
    try {
      await snippetsAPI.delete(snippetId);
      setSnippets(snippets.filter(snippet => snippet._id !== snippetId));
      toast({
        title: 'Success',
        description: 'Snippet deleted successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete snippet',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Debounce search and filter changes
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchSnippets();
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, languageFilter, selectedTags]);

  const handleTagSelect = (tag) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  if (loading && snippets.length === 0) {
    return (
      <Center h="100vh">
        <Spinner size="xl" color="brand.500" />
      </Center>
    );
  }

  if (error) {
    return (
      <Center h="100vh">
        <Text color="red.500">{error}</Text>
      </Center>
    );
  }

  return (
    <Container maxW="1200px" py={8}>
      <VStack spacing={8} align="stretch">
        <HStack justify="space-between">
          <Heading>My Snippets</Heading>
          <Button
            as={RouterLink}
            to="/snippets/new"
            leftIcon={<Icon as={FiPlus} />}
            colorScheme="brand"
          >
            New Snippet
          </Button>
        </HStack>

        <HStack spacing={4}>
          <Box flex="1">
            <Input
              placeholder="Search snippets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftElement={<Icon as={FiSearch} color="gray.400" />}
            />
          </Box>
          <Select
            placeholder="Filter by language"
            value={languageFilter}
            onChange={(e) => setLanguageFilter(e.target.value)}
            maxW="200px"
          >
            {availableLanguages.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </Select>
          <Menu>
            <MenuButton
              as={Button}
              rightIcon={<Icon as={FiChevronDown} />}
              leftIcon={<Icon as={FiFilter} />}
            >
              Add Tags
            </MenuButton>
            <MenuList maxH="300px" overflowY="auto">
              {allTags.map((tag) => (
                <MenuItem
                  key={tag}
                  onClick={() => handleTagSelect(tag)}
                  isDisabled={selectedTags.includes(tag)}
                >
                  {tag}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
        </HStack>

        {selectedTags.length > 0 && (
          <Wrap spacing={2}>
            <Icon as={FiFilter} mt={2} />
            {selectedTags.map((tag) => (
              <WrapItem key={tag}>
                <Tag
                  size="md"
                  borderRadius="full"
                  variant="solid"
                  colorScheme="brand"
                >
                  <TagLabel>{tag}</TagLabel>
                  <TagCloseButton
                    onClick={() =>
                      setSelectedTags(selectedTags.filter((t) => t !== tag))
                    }
                  />
                </Tag>
              </WrapItem>
            ))}
          </Wrap>
        )}

        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {snippets.map((snippet) => (
            <SnippetCard 
              key={snippet._id} 
              snippet={snippet} 
              onDelete={handleDelete}
            />
          ))}
        </SimpleGrid>
      </VStack>
    </Container>
  );
};

export default Dashboard; 