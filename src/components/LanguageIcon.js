// LanguageIcon component is temporarily disabled
// import React from 'react';
// import { Icon } from '@chakra-ui/react';
// import {
//   SiJavascript,
//   SiPython,
//   SiTypescript,
//   SiPhp,
//   SiHtml5,
//   SiCss3,
//   SiReact,
//   SiNodedotjs,
//   SiGo,
//   SiRuby,
//   SiSwift,
//   SiKotlin,
//   SiRust,
//   SiCplusplus,
// } from 'react-icons/si';

// const languageIcons = {
//   javascript: { icon: SiJavascript, color: '#F7DF1E' },
//   python: { icon: SiPython, color: '#3776AB' },
//   typescript: { icon: SiTypescript, color: '#3178C6' },
//   php: { icon: SiPhp, color: '#777BB4' },
//   html: { icon: SiHtml5, color: '#E34F26' },
//   css: { icon: SiCss3, color: '#1572B6' },
//   react: { icon: SiReact, color: '#61DAFB' },
//   nodejs: { icon: SiNodedotjs, color: '#339933' },
//   go: { icon: SiGo, color: '#00ADD8' },
//   ruby: { icon: SiRuby, color: '#CC342D' },
//   swift: { icon: SiSwift, color: '#FA7343' },
//   kotlin: { icon: SiKotlin, color: '#7F52FF' },
//   rust: { icon: SiRust, color: '#000000' },
//   cpp: { icon: SiCplusplus, color: '#00599C' },
// };

// const LanguageIcon = ({ language, size = '1.5em', ...props }) => {
//   const languageConfig = languageIcons[language.toLowerCase()];
  
//   if (!languageConfig) {
//     return null;
//   }

//   return (
//     <Icon
//       as={languageConfig.icon}
//       color={languageConfig.color}
//       boxSize={size}
//       {...props}
//     />
//   );
// };

// export default LanguageIcon; 