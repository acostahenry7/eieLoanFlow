import { View, Text, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import { getVisitsApi } from "../../api/visit";
import useAuth from "../../hooks/useAuth";

export default function Visits(props) {
  const { auth } = useAuth();
  const [visits, setVisits] = useState();

  useEffect(() => {
    (async () => {
      let data = {
        userId: auth.user_id,
        startingDate: "2022-05-25",
        endDate: "2022-05-25",
      };
      console.log(data);
      const response = await getVisitsApi(data);
      setVisits(response);
    })();
  }, []);

  return (
    <FlatList
      keyExtractor={(item) => item.visit_id}
      data={visits}
      renderItem={({ item, index }) => (
        <View>
          <Text>{item.visit_date}</Text>
        </View>
      )}
    />
  );
}
