import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
const styles = StyleSheet.create({ page: { padding: 20 } });
export function JBDDocument({ data }) {
  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        <Text>Rig: {String(data?.rig)}</Text>
      </Page>
    </Document>
  );
}
