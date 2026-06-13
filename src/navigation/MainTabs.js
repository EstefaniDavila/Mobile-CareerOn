import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import HomeScreen from "../screens/home/HomeScreen";
import JobsScreen from "../screens/jobs/JobsScreen";
import ApplicationsScreen from "../screens/applications/ApplicationsScreen";
import SkillsScreen from "../screens/skills/SkillsScreen";
import ProfileScreen from "../screens/profile/ProfileScreen";

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerStyle: {
          backgroundColor: "#4320C9",
        },
        headerShown: false,
        headerTintColor: "#FFFFFF",

        tabBarActiveTintColor: "#5B34F2",

        tabBarInactiveTintColor: "#5F6368",

        tabBarStyle: {
          height: 65,
          paddingBottom: 8,
          paddingTop: 8,
        },

        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          switch (route.name) {
            case "Logros":
              iconName = focused ? "trophy" : "trophy-outline";
              break;

            case "Empleos":
              iconName = focused ? "search" : "search-outline";
              break;

            case "Postulaciones":
              iconName = focused ? "briefcase" : "briefcase-outline";
              break;

            case "Skills":
              iconName = focused ? "school" : "school-outline";
              break;

            case "Perfil":
              iconName = focused ? "person" : "person-outline";
              break;

            default:
              iconName = "ellipse";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Empleos" component={JobsScreen} />

      <Tab.Screen name="Postulaciones" component={ApplicationsScreen} />

      <Tab.Screen name="Logros" component={HomeScreen} />

      <Tab.Screen name="Skills" component={SkillsScreen} />

      <Tab.Screen name="Perfil" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
