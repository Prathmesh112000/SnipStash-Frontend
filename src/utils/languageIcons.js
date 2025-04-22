import {
  FaJs,
  FaPython,
  FaJava,
  FaCode,
  FaHtml5,
  FaCss3,
  FaPhp,
  FaGem,
} from 'react-icons/fa';

const getLanguageIcon = (language) => {
  const iconMap = {
    javascript: FaJs,
    python: FaPython,
    java: FaJava,
    cpp: FaCode,
    html: FaHtml5,
    css: FaCss3,
    php: FaPhp,
    ruby: FaGem,
  };

  return iconMap[language] || null;
};

const getLanguageColor = (language) => {
  const colorMap = {
    javascript: 'yellow.400',
    python: 'blue.400',
    java: 'red.400',
    cpp: 'blue.500',
    html: 'orange.400',
    css: 'blue.300',
    php: 'purple.400',
    ruby: 'red.500',
  };

  return colorMap[language] || 'gray.400';
};

export { getLanguageIcon, getLanguageColor }; 