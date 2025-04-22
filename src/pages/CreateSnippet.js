import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  VStack,
  Heading,
  useToast,
  HStack,
  Tag,
  TagLabel,
  TagCloseButton,
  InputGroup,
  InputRightElement,
  Icon,
  Text,
  Wrap,
  WrapItem,
  Grid,
  GridItem,
  IconButton,
} from '@chakra-ui/react';
import { useColorMode } from '@chakra-ui/color-mode';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { FiHash, FiPlus, FiTag } from 'react-icons/fi';
import { snippetsAPI } from '../services/api';
import { generateSmartTags, getTagColor } from '../utils/smartTags';
import CodePreview from '../components/CodePreview';

const autoTagPatterns = {
  // Loop patterns (multi-language)
  loop: {
    patterns: {
      javascript: ['for\\s*\\(', 'while\\s*\\(', 'forEach\\s*\\(', 'map\\s*\\(', 'filter\\s*\\(', 'reduce\\s*\\('],
      python: ['for\\s+\\w+\\s+in', 'while\\s+\\w+:', 'map\\s*\\(', 'filter\\s*\\(', 'reduce\\s*\\('],
      java: ['for\\s*\\(', 'while\\s*\\(', 'forEach\\s*\\(', 'stream\\(\\)\\.map', 'stream\\(\\)\\.filter'],
      cpp: ['for\\s*\\(', 'while\\s*\\(', 'for\\s+\\w+\\s*:', 'std::for_each', 'std::transform'],
      php: ['for\\s*\\(', 'while\\s*\\(', 'foreach\\s*\\(', 'array_map', 'array_filter'],
      ruby: ['for\\s+\\w+\\s+in', 'while\\s+\\w+', 'each\\s*\\{', 'map\\s*\\{', 'filter\\s*\\{']
    },
    tag: 'loop'
  },
  // API patterns (multi-language)
  api: {
    patterns: {
      javascript: ['fetch\\s*\\(', 'axios\\.', 'XMLHttpRequest', 'http\\.', 'https\\.'],
      python: ['requests\\.', 'urllib\\.', 'http\\.', 'https\\.', 'aiohttp\\.'],
      java: ['HttpClient', 'HttpURLConnection', 'RestTemplate', 'WebClient'],
      cpp: ['curl_', 'httplib::', 'http::', 'https::'],
      php: ['curl_', 'file_get_contents\\s*\\(', 'http_build_query'],
      ruby: ['Net::HTTP', 'Faraday\\.', 'HTTParty\\.']
    },
    tag: 'api'
  },
  // Error handling patterns (multi-language)
  error: {
    patterns: {
      javascript: ['try\\s*\\{', 'catch\\s*\\(', 'throw\\s+new\\s+Error', 'Promise\\.reject'],
      python: ['try:', 'except\\s+\\w+:', 'raise\\s+\\w+', 'assert\\s+\\w+'],
      java: ['try\\s*\\{', 'catch\\s*\\(', 'throw\\s+new\\s+\\w+', 'throws\\s+\\w+'],
      cpp: ['try\\s*\\{', 'catch\\s*\\(', 'throw\\s+\\w+'],
      php: ['try\\s*\\{', 'catch\\s*\\(', 'throw\\s+new\\s+\\w+'],
      ruby: ['begin', 'rescue\\s+\\w+', 'raise\\s+\\w+']
    },
    tag: 'error-handling'
  },
  // Array/List operations (multi-language)
  array: {
    patterns: {
      javascript: ['\\.map\\s*\\(', '\\.filter\\s*\\(', '\\.reduce\\s*\\(', '\\.forEach\\s*\\(', '\\.find\\s*\\('],
      python: ['map\\s*\\(', 'filter\\s*\\(', 'reduce\\s*\\(', 'list\\.append', 'list\\.extend'],
      java: ['stream\\(\\)\\.map', 'stream\\(\\)\\.filter', 'stream\\(\\)\\.reduce', 'Arrays\\.'],
      cpp: ['std::transform', 'std::for_each', 'std::accumulate', 'std::vector::push_back'],
      php: ['array_map', 'array_filter', 'array_reduce', 'array_push'],
      ruby: ['map\\s*\\{', 'select\\s*\\{', 'reduce\\s*\\{', 'each\\s*\\{']
    },
    tag: 'array-ops'
  },
  // Debugging patterns (multi-language)
  debug: {
    patterns: {
      javascript: ['console\\.log', 'console\\.error', 'console\\.warn', 'debugger;'],
      python: ['print\\s*\\(', 'logging\\.', 'pdb\\.set_trace\\(\\)'],
      java: ['System\\.out\\.println', 'Logger\\.', 'log\\.'],
      cpp: ['std::cout', 'std::cerr', 'printf\\s*\\('],
      php: ['echo\\s+', 'print_r\\s*\\(', 'var_dump\\s*\\('],
      ruby: ['puts\\s+', 'print\\s+', 'p\\s+', 'logger\\.']
    },
    tag: 'debugging'
  },
  // Database operations (multi-language)
  database: {
    patterns: {
      javascript: ['mongoose\\.', 'db\\.', 'collection\\.', 'Model\\.', 'findOne', 'findMany'],
      python: ['sqlite3\\.', 'psycopg2\\.', 'pymongo\\.', 'Model\\.', 'query\\.'],
      java: ['EntityManager', 'Session\\.', 'Query\\.', 'Criteria\\.'],
      cpp: ['sqlite3_', 'mysql_', 'pqxx::'],
      php: ['mysqli_', 'PDO::', 'query\\s*\\(', 'prepare\\s*\\('],
      ruby: ['ActiveRecord::', 'Mongo::', 'query\\.', 'where\\.']
    },
    tag: 'database'
  },
  // File operations (multi-language)
  file: {
    patterns: {
      javascript: ['fs\\.', 'readFile\\s*\\(', 'writeFile\\s*\\(', 'require\\s*\\(', 'import\\s+'],
      python: ['open\\s*\\(', 'with\\s+open', 'os\\.', 'shutil\\.'],
      java: ['File\\s+', 'FileReader', 'FileWriter', 'Files\\.'],
      cpp: ['std::ifstream', 'std::ofstream', 'fopen\\s*\\('],
      php: ['fopen\\s*\\(', 'file_get_contents', 'file_put_contents'],
      ruby: ['File\\.', 'Dir\\.', 'require\\s+', 'load\\s+']
    },
    tag: 'file-ops'
  },
  // String operations (multi-language)
  string: {
    patterns: {
      javascript: ['\\.split\\s*\\(', '\\.join\\s*\\(', '\\.replace\\s*\\(', '\\.match\\s*\\(', 'RegExp\\s*\\('],
      python: ['\\.split\\s*\\(', '\\.join\\s*\\(', '\\.replace\\s*\\(', 're\\.', 'str\\.'],
      java: ['String\\.split', 'String\\.join', 'String\\.replace', 'Pattern\\.'],
      cpp: ['std::string::', 'std::regex', 'strtok\\s*\\('],
      php: ['explode\\s*\\(', 'implode\\s*\\(', 'str_replace', 'preg_'],
      ruby: ['\\.split\\s*\\{', '\\.join\\s*\\{', '\\.gsub\\s*\\{', 'Regexp\\.']
    },
    tag: 'string-ops'
  }
};

const codePatterns = {
  // Function patterns
  function: {
    patterns: ['function\\s+\\w+\\s*\\(', 'const\\s+\\w+\\s*=\\s*\\(', 'let\\s+\\w+\\s*=\\s*\\(', '\\w+\\s*=\\s*\\('],
    description: 'Function definition'
  },
  // Loop patterns
  loop: {
    patterns: ['for\\s*\\(', 'while\\s*\\(', 'forEach\\s*\\(', 'map\\s*\\(', 'filter\\s*\\(', 'reduce\\s*\\('],
    description: 'Loop operation'
  },
  // API patterns
  api: {
    patterns: ['fetch\\s*\\(', 'axios\\.', 'XMLHttpRequest', 'http\\.', 'https\\.'],
    description: 'API call'
  },
  // Error handling patterns
  error: {
    patterns: ['try\\s*\\{', 'catch\\s*\\(', 'throw\\s+new\\s+Error', 'Promise\\.reject'],
    description: 'Error handling'
  },
  // Array operations
  array: {
    patterns: ['\\.map\\s*\\(', '\\.filter\\s*\\(', '\\.reduce\\s*\\(', '\\.forEach\\s*\\(', '\\.find\\s*\\('],
    description: 'Array operation'
  },
  // DOM manipulation
  dom: {
    patterns: ['document\\.', 'querySelector', 'getElement', 'addEventListener', 'innerHTML', 'appendChild'],
    description: 'DOM manipulation'
  },
  // State management
  state: {
    patterns: ['useState', 'useEffect', 'useReducer', 'setState', 'this\\.state'],
    description: 'State management'
  },
  // Database operations
  database: {
    patterns: ['mongoose\\.', 'db\\.', 'collection\\.', 'Model\\.', 'findOne', 'findMany', 'create', 'update'],
    description: 'Database operation'
  },
  // Authentication
  auth: {
    patterns: ['login', 'signup', 'register', 'authenticate', 'jwt', 'token', 'session'],
    description: 'Authentication'
  }
};

const CreateSnippet = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { colorMode } = useColorMode();
  const [title, setTitle] = useState('');
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [tags, setTags] = useState([]);
  const [smartTags, setSmartTags] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [autoTags, setAutoTags] = useState([]);
  const [description, setDescription] = useState('');
  const [autoDescription, setAutoDescription] = useState('');
  const [newTag, setNewTag] = useState('');

  const bgColor = colorMode === 'light' ? 'white' : 'gray.800';
  const textColor = colorMode === 'light' ? 'gray.800' : 'white';

  // Generate smart tags when code changes
  useEffect(() => {
    const newSmartTags = generateSmartTags(code);
    setSmartTags(newSmartTags);
  }, [code]);

  // Function to analyze code and generate auto-tags
  const generateAutoTags = (codeContent, language) => {
    const detectedTags = new Set();
    
    Object.values(autoTagPatterns).forEach(({ patterns, tag }) => {
      const languagePatterns = patterns[language] || patterns.javascript; // Fallback to JavaScript patterns if language not found
      const hasPattern = languagePatterns.some(pattern => {
        const regex = new RegExp(pattern, 'i');
        return regex.test(codeContent);
      });
      
      if (hasPattern) {
        detectedTags.add(tag);
      }
    });

    return Array.from(detectedTags);
  };

  // Update auto-tags when code changes
  useEffect(() => {
    if (code) {
      const newAutoTags = generateAutoTags(code, language);
      setAutoTags(newAutoTags);
    } else {
      setAutoTags([]);
    }
  }, [code, language]);

  // Function to generate description based on code analysis
  const generateDescription = (codeContent) => {
    const detectedPatterns = new Set();
    
    Object.values(codePatterns).forEach(({ patterns, description }) => {
      const hasPattern = patterns.some(pattern => {
        const regex = new RegExp(pattern, 'i');
        return regex.test(codeContent);
      });
      
      if (hasPattern) {
        detectedPatterns.add(description);
      }
    });

    const patternsList = Array.from(detectedPatterns);
    
    if (patternsList.length === 0) {
      return 'Code snippet';
    }

    // Generate a natural language description
    let desc = 'This code snippet contains ';
    if (patternsList.length === 1) {
      desc += patternsList[0].toLowerCase();
    } else if (patternsList.length === 2) {
      desc += `${patternsList[0].toLowerCase()} and ${patternsList[1].toLowerCase()}`;
    } else {
      const lastPattern = patternsList.pop();
      desc += `${patternsList.join(', ').toLowerCase()}, and ${lastPattern.toLowerCase()}`;
    }

    // Add language-specific context
    const languageContext = {
      javascript: 'JavaScript',
      python: 'Python',
      java: 'Java',
      cpp: 'C++',
      html: 'HTML',
      css: 'CSS',
      php: 'PHP',
      ruby: 'Ruby'
    };

    desc += ` in ${languageContext[language] || 'the selected language'}.`;

    return desc;
  };

  // Update auto-description when code or language changes
  useEffect(() => {
    if (code) {
      const newDescription = generateDescription(code);
      setAutoDescription(newDescription);
      // If no manual description is set, use the auto-generated one
      if (!description) {
        setDescription(newDescription);
      }
    } else {
      setAutoDescription('');
      if (!description) {
        setDescription('');
      }
    }
  }, [code, language]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Combine manual tags and smart tags
      const allTags = [...new Set([...tags, ...smartTags])];
      
      await snippetsAPI.create({
        title,
        code,
        language,
        tags: allTags,
        description: description || autoDescription,
      });
      toast({
        title: 'Snippet created',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      navigate('/');
    } catch (error) {
      toast({
        title: 'Error creating snippet',
        description: error.response?.data?.message || 'An error occurred',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTagAdd = (tag) => {
    if (!tags.includes(tag)) {
      setTags([...tags, tag]);
    }
  };

  const handleTagRemove = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleAddTag = () => {
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setNewTag('');
    }
  };

  return (
    <Container maxW="1400px" py={8}>
      <VStack spacing={8} align="stretch">
        <Heading>Create New Snippet</Heading>

        <Box as="form" onSubmit={handleSubmit}>
          <Grid templateColumns="repeat(2, 1fr)" gap={8}>
            <GridItem>
              <VStack spacing={6} align="stretch">
                <FormControl isRequired>
                  <FormLabel>Title</FormLabel>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter snippet title"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Language</FormLabel>
                  <Select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
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
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Code</FormLabel>
                  <Textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Enter your code here"
                    fontFamily="mono"
                    minH="400px"
                    resize="vertical"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Description</FormLabel>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder={autoDescription || "Enter snippet description"}
                    minH="100px"
                  />
                  {autoDescription && !description && (
                    <Text fontSize="sm" color="gray.500" mt={2}>
                      Auto-generated description based on code analysis
                    </Text>
                  )}
                </FormControl>

                <FormControl>
                  <FormLabel>Tags</FormLabel>
                  <Wrap spacing={2}>
                    {tags.map((tag) => (
                      <WrapItem key={tag}>
                        <Tag
                          size="md"
                          borderRadius="full"
                          variant="solid"
                          colorScheme={getTagColor(tag)}
                        >
                          <TagLabel>{tag}</TagLabel>
                          <TagCloseButton onClick={() => handleTagRemove(tag)} />
                        </Tag>
                      </WrapItem>
                    ))}
                    {smartTags.map((tag) => (
                      <WrapItem key={tag}>
                        <Tag
                          size="md"
                          borderRadius="full"
                          variant="subtle"
                          colorScheme={getTagColor(tag)}
                        >
                          <TagLabel>{tag}</TagLabel>
                        </Tag>
                      </WrapItem>
                    ))}
                  </Wrap>
                  <InputGroup size="md" mt={4}>
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
                </FormControl>

                <Button
                  type="submit"
                  colorScheme="brand"
                  size="lg"
                  width="full"
                  isLoading={isLoading}
                >
                  Save Snippet
                </Button>
              </VStack>
            </GridItem>

            <GridItem>
              <Box h="100%">
                <Text mb={2} fontWeight="medium">Preview</Text>
                <CodePreview code={code} language={language} />
              </Box>
            </GridItem>
          </Grid>
        </Box>
      </VStack>
    </Container>
  );
};

export default CreateSnippet; 