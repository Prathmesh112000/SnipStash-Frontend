import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  HStack,
  Tag,
  TagLabel,
  TagCloseButton,
  useToast,
  Icon,
  VStack,
  Divider,
  useColorModeValue,
  Textarea,
  Select,
  IconButton,
  Spinner,
  Center,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Input,
  InputGroup,
  InputRightElement,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';
import { FiCopy, FiEdit2, FiTrash2, FiSave, FiX, FiPlus } from 'react-icons/fi';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { snippetsAPI } from '../services/api';
import { getLanguageIcon, getLanguageColor } from '../utils/languageIcons';

const SnippetDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [snippet, setSnippet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedSnippet, setEditedSnippet] = useState(null);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const cancelRef = React.useRef();
  const [newTag, setNewTag] = useState('');

  // Move all useColorModeValue hooks to the top
  const bgColor = useColorModeValue('gray.50', 'gray.700');
  const codeBgColor = useColorModeValue('gray.50', 'gray.700');
  const headerBgColor = useColorModeValue('gray.50', 'gray.700');

  useEffect(() => {
    const fetchSnippet = async () => {
      try {
        const response = await snippetsAPI.getById(id);
        setSnippet(response.data);
        setEditedSnippet(response.data);
      } catch (error) {
        setError('Failed to fetch snippet');
        toast({
          title: 'Error',
          description: 'Failed to load snippet',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSnippet();
  }, [id, toast]);

  const handleSave = async () => {
    try {
      await snippetsAPI.update(id, editedSnippet);
      setSnippet(editedSnippet);
      setIsEditing(false);
      toast({
        title: 'Success',
        description: 'Snippet updated successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update snippet',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleCancel = () => {
    setEditedSnippet(snippet);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    try {
      await snippetsAPI.delete(id);
      toast({
        title: 'Success',
        description: 'Snippet deleted successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      navigate('/dashboard');
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

  const handleAddTag = () => {
    if (newTag.trim() && !editedSnippet.tags.includes(newTag.trim())) {
      setEditedSnippet({
        ...editedSnippet,
        tags: [...editedSnippet.tags, newTag.trim()]
      });
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setEditedSnippet({
      ...editedSnippet,
      tags: editedSnippet.tags.filter(tag => tag !== tagToRemove)
    });
  };

  if (loading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" color="brand.500" />
      </Center>
    );
  }

  if (error || !snippet) {
    return (
      <Center h="100vh">
        <Text color="red.500">{error || 'Snippet not found'}</Text>
      </Center>
    );
  }

  return (
    <Container maxW="1200px" py={8}>
      <VStack spacing={8} align="stretch">
        <HStack justify="space-between">
          <Heading size="lg">{snippet.title}</Heading>
          <HStack>
            {isEditing ? (
              <>
                <Button
                  leftIcon={<Icon as={FiSave} />}
                  colorScheme="green"
                  onClick={handleSave}
                >
                  Save
                </Button>
                <Button
                  leftIcon={<Icon as={FiX} />}
                  variant="outline"
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <Button
                  leftIcon={<Icon as={FiEdit2} />}
                  colorScheme="brand"
                  onClick={() => setIsEditing(true)}
                >
                  Edit
                </Button>
                <Button
                  leftIcon={<Icon as={FiTrash2} />}
                  colorScheme="red"
                  variant="outline"
                  onClick={() => setIsDeleteAlertOpen(true)}
                >
                  Delete
                </Button>
              </>
            )}
          </HStack>
        </HStack>

        <HStack spacing={2}>
          <Tag colorScheme="blue" size="md">
            {snippet.language}
          </Tag>
          {snippet.tags.map((tag) => (
            <Tag key={tag} size="md" variant="subtle" colorScheme="gray">
              <TagLabel>{tag}</TagLabel>
            </Tag>
          ))}
        </HStack>

        <Divider />

        {isEditing ? (
          <VStack spacing={4} align="stretch">
            <Box>
              <Text mb={2}>Code</Text>
              <Box
                position="relative"
                borderWidth="1px"
                borderRadius="md"
                overflow="hidden"
              >
                <Textarea
                  value={editedSnippet.code}
                  onChange={(e) =>
                    setEditedSnippet({ ...editedSnippet, code: e.target.value })
                  }
                  fontFamily="mono"
                  minH="400px"
                  p={4}
                  borderRadius="md"
                  bg={bgColor}
                  resize="vertical"
                />
                <Box
                  position="absolute"
                  top={2}
                  right={2}
                  bg={bgColor}
                  p={2}
                  rounded="md"
                  shadow="sm"
                  maxW="50%"
                  overflow="auto"
                >
                  <SyntaxHighlighter
                    language={editedSnippet.language}
                    style={tomorrow}
                    customStyle={{
                      margin: 0,
                      background: 'transparent',
                      fontSize: '14px',
                    }}
                  >
                    {editedSnippet.code}
                  </SyntaxHighlighter>
                </Box>
              </Box>
            </Box>

            <Box>
              <Text mb={2}>Language</Text>
              <Select
                value={editedSnippet.language}
                onChange={(e) =>
                  setEditedSnippet({ ...editedSnippet, language: e.target.value })
                }
                maxW="200px"
              >
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
                <option value="cpp">C++</option>
                <option value="html">HTML</option>
                <option value="css">CSS</option>
                <option value="php">PHP</option>
                <option value="ruby">Ruby</option>
              </Select>
            </Box>

            <Box>
              <Text mb={2}>Tags</Text>
              <Wrap spacing={2} mb={4}>
                {editedSnippet.tags.map((tag) => (
                  <WrapItem key={tag}>
                    <Tag
                      size="md"
                      borderRadius="full"
                      variant="solid"
                      colorScheme="brand"
                    >
                      <TagLabel>{tag}</TagLabel>
                      <TagCloseButton onClick={() => handleRemoveTag(tag)} />
                    </Tag>
                  </WrapItem>
                ))}
              </Wrap>
              <InputGroup size="md" maxW="300px">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add new tag"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                />
                <InputRightElement>
                  <IconButton
                    size="sm"
                    icon={<Icon as={FiPlus} />}
                    onClick={handleAddTag}
                    aria-label="Add tag"
                  />
                </InputRightElement>
              </InputGroup>
            </Box>
          </VStack>
        ) : (
          <Box
            borderWidth="1px"
            borderRadius="md"
            overflow="hidden"
            bg={codeBgColor}
          >
            <Box p={4} bg={headerBgColor}>
              <HStack spacing={2}>
                <Icon as={getLanguageIcon(snippet.language)} color={getLanguageColor(snippet.language)} />
                <Text fontWeight="medium">{snippet.language}</Text>
              </HStack>
            </Box>
            <Box p={4} overflowX="auto">
              <SyntaxHighlighter
                language={snippet.language}
                style={tomorrow}
                customStyle={{
                  margin: 0,
                  padding: 0,
                  background: 'transparent',
                }}
              >
                {snippet.code}
              </SyntaxHighlighter>
            </Box>
          </Box>
        )}

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
                <Button colorScheme="red" onClick={handleDelete} ml={3}>
                  Delete
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      </VStack>
    </Container>
  );
};

export default SnippetDetail; 