import React, { useEffect, useState } from 'react';
import { Text, Linking, StyleSheet, TextStyle } from 'react-native';
import { supabase } from '@/lib/supabase';
import { palette } from '@/constants/colors';

interface AffiliateKeyword {
  keyword: string;
  affiliate_url: string;
}

interface AutoAffiliateTextProps {
  content: string;
  style?: TextStyle | TextStyle[];
}

export default function AutoAffiliateText({ content, style }: AutoAffiliateTextProps) {
  const [keywords, setKeywords] = useState<AffiliateKeyword[]>([]);

  useEffect(() => {
    fetchAffiliates();
  }, []);

  const fetchAffiliates = async () => {
    const { data } = await supabase
      .from('affiliate_keywords')
      .select('keyword, affiliate_url');
      
    if (data) {
      // Filter out empty or trivially short string vulnerabilities impacting RegExp
      const valid = data.filter(k => k.keyword.trim().length >= 2);
      // Sort by length descending, so we match longer phrases before shorter substrings
      const sorted = valid.sort((a, b) => b.keyword.length - a.keyword.length);
      setKeywords(sorted);
    }
  };

  if (!content) return null;

  // If no keywords exist, just return standard text
  if (keywords.length === 0) {
    return <Text style={style}>{content}</Text>;
  }

  // Parse text against keywords
  let elements: React.ReactNode[] = [];
  let remainingText = content;

  // Build a single Regex pattern to capture any keyword
  // Escape regex special chars in keywords
  const escapeRegExp = (string: string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const wordPattern = keywords.map(k => escapeRegExp(k.keyword)).join('|');
  const regex = new RegExp(`(${wordPattern})`, 'gi');

  let lastIndex = 0;
  let match;

  while ((match = regex.exec(content)) !== null) {
    const matchedStr = match[0];
    const startIndex = match.index;

    // Push the preceding normal text
    if (startIndex > lastIndex) {
      elements.push(
        <Text key={`text-${lastIndex}`}>{content.substring(lastIndex, startIndex)}</Text>
      );
    }

    // Find the corresponding URL (case-insensitive search)
    const exactKeywordTarget = keywords.find(k => k.keyword.toLowerCase() === matchedStr.toLowerCase());

    if (exactKeywordTarget) {
      elements.push(
        <Text 
          key={`link-${startIndex}`} 
          style={[styles.link]} 
          onPress={() => Linking.openURL(exactKeywordTarget.affiliate_url)}
        >
          {matchedStr}
        </Text>
      );
    } else {
      // Revert if mismatch
      elements.push(<Text key={`miss-${startIndex}`}>{matchedStr}</Text>);
    }

    lastIndex = regex.lastIndex;
  }

  // Push the trailing remainder
  if (lastIndex < content.length) {
    elements.push(<Text key={`text-${lastIndex}`}>{content.substring(lastIndex)}</Text>);
  }

  return <Text style={style}>{elements}</Text>;
}

const styles = StyleSheet.create({
  link: {
    color: palette.primary,
    fontWeight: '700',
    textDecorationLine: 'underline',
  }
});
