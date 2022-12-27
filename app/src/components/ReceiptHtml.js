import { View, Text } from "react-native";
import React from "react";
import { WebView } from "react-native-webview";

export default function ReceiptHtml(props) {
  var { html } = props;

  html == null ? (html = "<h1>No existe ningún recibo.</h1>") : (html = html);

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
