import { View, Text } from "react-native";
import React from "react";
import { WebView } from "react-native-webview";

export default function ReceiptHtml(props) {
  const { html } = props;

  return (
    <WebView
      nestedScrollEnabled={true}
      source={{
        html: html,
      }}
      style={{ marginTop: 0, height: 600 }}
    />
  );
}
