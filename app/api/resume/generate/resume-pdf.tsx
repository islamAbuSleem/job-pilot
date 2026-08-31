import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 24,
    fontFamily: "Helvetica",
    fontSize: 10,
    color: "#1a1a1a",
  },
  header: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#111",
  },
  subheader: {
    fontSize: 8,
    color: "#666",
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "bold",
    marginTop: 8,
    marginBottom: 4,
    borderBottom: "1px solid #ccc",
    paddingBottom: 2,
  },
  bodyText: {
    fontSize: 9,
    lineHeight: 1.3,
    marginBottom: 3,
  },
  bullet: {
    fontSize: 9,
    lineHeight: 1.2,
    marginBottom: 2,
    paddingLeft: 8,
  },
  skillsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 4,
  },
  skillTag: {
    fontSize: 8,
    backgroundColor: "#f0f0f0",
    padding: 2,
    marginRight: 2,
    marginBottom: 2,
    borderRadius: 3,
  },
});

type ResumePDFProps = {
  data: {
    summary: string;
    experience: string[];
    education: string;
    skills_highlight: string[];
    full_name?: string;
    current_title?: string;
  };
};

export default function ResumePDF({ data }: ResumePDFProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View>
          {data.full_name && <Text style={styles.header}>{data.full_name}</Text>}
          {data.current_title && <Text style={styles.subheader}>{data.current_title}</Text>}

          {data.summary && (
            <View>
              <Text style={styles.sectionTitle}>Professional Summary</Text>
              <Text style={styles.bodyText}>{data.summary}</Text>
            </View>
          )}

          {data.experience && data.experience.length > 0 && (
            <View>
              <Text style={styles.sectionTitle}>Experience</Text>
              {data.experience.map((exp, i) => (
                <Text key={i} style={styles.bullet}>• {exp}</Text>
              ))}
            </View>
          )}

          {data.education && (
            <View>
              <Text style={styles.sectionTitle}>Education</Text>
              <Text style={styles.bodyText}>{data.education}</Text>
            </View>
          )}

          {data.skills_highlight && data.skills_highlight.length > 0 && (
            <View>
              <Text style={styles.sectionTitle}>Key Skills</Text>
              <View style={styles.skillsRow}>
                {data.skills_highlight.map((skill, i) => (
                  <Text key={i} style={styles.skillTag}>
                    {skill}
                  </Text>
                ))}
              </View>
            </View>
          )}
        </View>
      </Page>
    </Document>
  );
}
