import * as Linking from 'expo-linking';

export function parseReferenceLink (referenceValue: string): string {
  if (referenceValue.startsWith('http://') || referenceValue.startsWith('https://')) {
    return referenceValue;
  }else if (referenceValue.startsWith('mailto:')) {
    return referenceValue;
  }else if (referenceValue.startsWith('PMID:')) {
    const pmid = referenceValue.substring(5);
    return `https://pubmed.ncbi.nlm.nih.gov/${pmid}`;
  }else if (referenceValue.startsWith('doi:')) {
    const doi = referenceValue.substring(4);
    return `https://doi.org/${doi}`;
  }
  return referenceValue; // No special link found
};

export async function openLink(url?: string): Promise<void> {
  if (!url) return;
  const supported = await Linking.canOpenURL(url);
  if (supported) {
    await Linking.openURL(url);
  } else {
    console.warn(`Don't know how to open this URL: ${url}`);
  }
};
