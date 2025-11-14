import { Tabs } from "expo-router";

const AppLayout = () => {
  return (
    <Tabs>
      <Tabs.Screen name="movements" />
      <Tabs.Screen name="camera" />
      <Tabs.Screen name="settings" />
    </Tabs>
  );
};

export default AppLayout;
