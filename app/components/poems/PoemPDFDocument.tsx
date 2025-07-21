import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import type { BasePoem } from '~/types/poem';

interface PoemPDFDocumentProps {
  poem: BasePoem;
}

const styles = StyleSheet.create({
  page: {
    padding: 60,
    backgroundColor: '#ffffff',
    fontFamily: 'Times-Roman',
  },
  container: {
    border: '2px solid #333333',
    borderRadius: 8,
    padding: 40,
    minHeight: '80%',
    position: 'relative',
  },
  decorativeBorder: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    bottom: 10,
    border: '1px solid #cccccc',
    borderRadius: 4,
  },
  header: {
    marginBottom: 30,
    textAlign: 'center',
    borderBottom: '1px solid #eeeeee',
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Times-Bold',
    marginBottom: 10,
    color: '#333333',
  },
  category: {
    fontSize: 12,
    fontFamily: 'Times-Italic',
    color: '#666666',
    textTransform: 'capitalize',
    marginBottom: 5,
  },
  author: {
    fontSize: 14,
    fontFamily: 'Times-Italic',
    color: '#666666',
    marginTop: 5,
  },
  content: {
    fontSize: 12,
    lineHeight: 1.8,
    fontFamily: 'Times-Roman',
    color: '#333333',
    marginBottom: 30,
    textAlign: 'left',
  },
  stanza: {
    marginBottom: 15,
  },
  line: {
    marginBottom: 2,
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 40,
    right: 40,
    textAlign: 'center',
    borderTop: '1px solid #eeeeee',
    paddingTop: 15,
  },
  website: {
    fontSize: 10,
    fontFamily: 'Times-Roman',
    color: '#888888',
  },
  copyright: {
    fontSize: 10,
    fontFamily: 'Times-Italic',
    color: '#888888',
    marginTop: 5,
  },
  ornament: {
    fontSize: 16,
    color: '#cccccc',
    textAlign: 'center',
    marginVertical: 10,
  },
});

export function PoemPDFDocument({ poem }: PoemPDFDocumentProps) {
  // Split content into stanzas (separated by double line breaks)
  const stanzas = poem.content.split('\n\n').filter(stanza => stanza.trim());

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.container}>
          <View style={styles.decorativeBorder} />
          
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.category}>{poem.category} poem</Text>
            <Text style={styles.title}>{poem.title}</Text>
            <Text style={styles.ornament}>❦</Text>
          </View>

          {/* Content */}
          <View style={styles.content}>
            {stanzas.map((stanza, stanzaIndex) => (
              <View key={stanzaIndex} style={styles.stanza}>
                {stanza.split('\n').map((line, lineIndex) => (
                  <Text key={lineIndex} style={styles.line}>
                    {line}
                  </Text>
                ))}
              </View>
            ))}
          </View>

          {/* Decorative ornament */}
          <Text style={styles.ornament}>❦ ❦ ❦</Text>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.website}>www.iambicnana.com</Text>
            {poem.copyright && (
              <Text style={styles.copyright}>{poem.copyright}</Text>
            )}
          </View>
        </View>
      </Page>
    </Document>
  );
}