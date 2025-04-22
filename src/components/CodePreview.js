import React from 'react';
import {
  Box,
  HStack,
  Text,
  Icon,
  useColorModeValue,
} from '@chakra-ui/react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow, oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { getLanguageIcon, getLanguageColor } from '../utils/languageIcons';

const CodePreview = ({ code, language }) => {
  const headerBgColor = useColorModeValue('gray.50', 'gray.800');
  const codeBgColor = useColorModeValue('white', 'gray.900');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'gray.200');
  const syntaxStyle = useColorModeValue(tomorrow, oneDark);

  return (
    <Box
      borderWidth="1px"
      borderColor={borderColor}
      borderRadius="md"
      overflow="hidden"
      bg={codeBgColor}
      h="100%"
      boxShadow="sm"
    >
      <Box 
        p={4} 
        bg={headerBgColor}
        borderBottomWidth="1px"
        borderColor={borderColor}
      >
        <HStack spacing={2}>
          <Icon as={getLanguageIcon(language)} color={getLanguageColor(language)} />
          <Text fontWeight="medium" color={textColor}>{language}</Text>
        </HStack>
      </Box>
      <Box 
        p={4} 
        overflowX="auto" 
        h="calc(100% - 60px)"
        bg={codeBgColor}
      >
        <SyntaxHighlighter
          language={language}
          style={syntaxStyle}
          customStyle={{
            margin: 0,
            padding: 0,
            background: 'transparent',
            height: '100%',
            fontSize: '14px',
            lineHeight: '1.5',
          }}
          codeTagProps={{
            style: {
              fontFamily: 'monospace',
              fontSize: '14px',
            }
          }}
        >
          {code}
        </SyntaxHighlighter>
      </Box>
    </Box>
  );
};

export default CodePreview; 