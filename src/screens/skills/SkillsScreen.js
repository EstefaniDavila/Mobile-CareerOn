import {Text, View, ScrollView,TouchableOpacity, Alert} from "react-native";
import { useState, useEffect, useCallback } from "react";
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import userSkillService from "../../services/userSkill";
import skillService from "../../services/skill";
import styles from "./components/components";
import CourseModal from "./components/CourseModal";
import { useMascota } from "../../components/mascota/MascotaProvider";


export default function SkillsScreen() {
  const [showCourseModal, setShowCourseModal] =
    useState(false);

  const [selectedSkill, setSelectedSkill] =
    useState(null);

  const [selectedCategory, setSelectedCategory] =
    useState(null);

  const [skillsCatalog, setSkillsCatalog] =
    useState([]);

  const [userSkills, setUserSkills] =
    useState([]);

  const [isLoading, setIsLoading] =
    useState(false);

  const [classProgress, setClassProgress] =
    useState({}); // { skillId: numCompletedClasses }
    
  const { notifySkills } = useMascota();

  useFocusEffect(
    useCallback(() => {
      if (notifySkills) {
        notifySkills();
      }
    }, [notifySkills])
  );

  useEffect(() => {
    loadData();
  }, []);

 const loadData = async () => {
    setIsLoading(true);

    try {
      const [
        skillsResult,
        userSkillsResult,
      ] = await Promise.all([
        skillService.getSkills(),
        userSkillService.getMySkills(),
      ]);

      console.log(
        "skillsResult:",
        JSON.stringify(skillsResult, null, 2)
      );

      console.log(
        "userSkillsResult:",
        JSON.stringify(userSkillsResult, null, 2)
      );

      if (skillsResult.success) {
        const skills =
          skillsResult.data || [];

        setSkillsCatalog(skills);

        if (
          skills.length > 0 &&
          !selectedCategory
        ) {
          setSelectedCategory(
            skills[0].category
          );
        }
      }

      if (userSkillsResult.success) {
        setUserSkills(
          userSkillsResult.data || []
        );
      }
    } catch (error) {
      console.error(
        "Error loading data:",
        error
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Cargar progreso local de clases completadas
  const loadClassProgress = async (skills) => {
    const progress = {};
    for (const skill of skills) {
      try {
        const data = await AsyncStorage.getItem(`@completed_classes_${skill.id}`);
        if (data) {
          progress[skill.id] = JSON.parse(data).length;
        }
      } catch (e) {
        // ignorar
      }
    }
    setClassProgress(progress);
  };

  useEffect(() => {
    if (skillsCatalog.length > 0) {
      loadClassProgress(skillsCatalog);
    }
  }, [skillsCatalog, showCourseModal]);

  const addUserSkill = async (
    skillId
    ) => {
      try {
        const result =
          await userSkillService.createUserSkill({
            skill_id: skillId,
            level: "beginner",
          });

        console.log(
          "createUserSkill:",
          result
        );

        if (result.success) {
          await loadData();

          Alert.alert(
            "Éxito",
            "Skill agregada correctamente"
          );
        } else {
          Alert.alert(
            "Error",
            result.error
          );
        }
      } catch (error) {
        console.error(error);

        Alert.alert(
          "Error",
          "No se pudo agregar la skill"
        );
      }
    };

  const getUserSkill = (skillId) => {
    return userSkills.find(
      (skill) =>
        skill.skill_id === skillId || skill.id === skillId || skill.skill?.id === skillId
    );
  };

  const getSkillStatus = (skillId) => {
    const userSkill =
      getUserSkill(skillId);

    if (!userSkill)
      return "pending";

    if (
      userSkill.level === "advanced"
    )
      return "completed";

    return "in-progress";
  };

  const handleNodePress = (skill) => {
    setSelectedSkill(skill);
    setShowCourseModal(true);
  };

  const categories = [
    ...new Set(
      skillsCatalog.map(
        (skill) => skill.category
      )
    ),
  ];

  const skillsByCategory =
    skillsCatalog.filter(
      (skill) =>
        skill.category ===
        selectedCategory
    );

  // Contar por categoría actual usando progreso de clases
  const getSkillRealStatus = (skill) => {
    const userSkill = getUserSkill(skill.id);
    const classCount = classProgress[skill.id] || 0;
    
    if (userSkill?.level === "advanced" || classCount >= 5) return "completed";
    if (userSkill || classCount > 0) return "in-progress";
    return "pending";
  };

  const completedCount = skillsByCategory.filter(
    skill => getSkillRealStatus(skill) === "completed"
  ).length;

  const inProgressCount = skillsByCategory.filter(
    skill => getSkillRealStatus(skill) === "in-progress"
  ).length;

  const pendingCount = skillsByCategory.filter(
    skill => getSkillRealStatus(skill) === "pending"
  ).length;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text
          style={styles.headerTitle}
        >
          Skills & Roadmap
        </Text>

        <Text
          style={
            styles.headerSubtitle
          }
        >
          Construye tu plan de carrera
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={
          false
        }
      >
        {/* Categorías */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={
            false
          }
          style={
            styles.categorySelector
          }
        >
          {categories.map(
            (category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryButton,
                  selectedCategory ===
                    category &&
                    styles.categoryButtonActive,
                ]}
                onPress={() =>
                  setSelectedCategory(
                    category
                  )
                }
              >
                <Text
                  style={[
                    styles.categoryText,
                    selectedCategory ===
                      category &&
                      styles.categoryTextActive,
                  ]}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            )
          )}
        </ScrollView>

        {/* Información */}
        <View
          style={styles.roadmapInfo}
        >
          <Text
            style={
              styles.roadmapTitle
            }
          >
            {selectedCategory}
          </Text>

          <Text
            style={
              styles.roadmapDescription
            }
          >
            Habilidades disponibles en esta categoría
          </Text>
        </View>

        {/* Skills */}
        <View
          style={
            styles.roadmapContainer
          }
        >
          <Text
            style={
              styles.sectionTitle
            }
          >
            Ruta de aprendizaje
          </Text>
              {skillsByCategory.map((skill) => {
                const status = getSkillRealStatus(skill);

                return (
                  <TouchableOpacity
                    key={skill.id}
                    style={[
                      styles.nodeCard,
                      status === "completed" &&
                        styles.nodeCardCompleted,
                      status === "in-progress" &&
                        styles.nodeCardProgress,
                    ]}
                    onPress={() =>
                      handleNodePress(skill)
                    }
                  >
                    <View style={styles.nodeLeft}>
                      <View
                        style={[
                          styles.nodeStatusIcon,
                          status === "completed" &&
                            styles.nodeStatusCompleted,
                          status === "in-progress" &&
                            styles.nodeStatusProgress,
                        ]}
                      >
                        <Text
                          style={
                            styles.nodeStatusText
                          }
                        >
                          {status ===
                          "completed"
                            ? "✓"
                            : status ===
                              "in-progress"
                            ? "●"
                            : "+"}
                        </Text>
                      </View>

                      <View style={styles.nodeContent}>
                        <Text
                          style={styles.nodeName}
                        >
                          {skill.name}
                        </Text>

                        <View
                          style={styles.nodeTags}
                        >
                          <View style={styles.tag}>
                            <Text
                              style={
                                styles.tagText
                              }
                            >
                              {skill.category}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </View>

                    {status === "pending" && (
                      <TouchableOpacity
                        onPress={() =>
                          addUserSkill(
                            skill.id
                          )
                        }
                      >
                        <Text>
                          ➕ Agregar
                        </Text>
                      </TouchableOpacity>
                    )}

                    {status ===
                      "completed" && (
                      <View
                        style={
                          styles.completedBadge
                        }
                      >
                        <Text
                          style={
                            styles.completedBadgeText
                          }
                        >
                          ✓
                        </Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
                      
        </View>

        {/* Estadísticas */}
        <View
          style={
            styles.statsContainer
          }
        >
          <Text
            style={
              styles.sectionTitle
            }
          >
            Tu progreso
          </Text>

          <View
            style={
              styles.globalProgress
            }
          >
            <View
              style={
                styles.globalProgressHeader
              }
            >
              <Text
                style={
                  styles.globalProgressLabel
                }
              >
                Avance general
              </Text>

              <Text
                style={
                  styles.globalProgressPercent
                }
              >
                {Math.round(
                  ((completedCount +
                    inProgressCount) /
                    Math.max(
                      skillsByCategory.length,
                      1
                    )) *
                    100
                )}
                %
              </Text>
            </View>

            <View
              style={
                styles.globalProgressBar
              }
            >
              <View
                style={[
                  styles.globalProgressFill,
                  {
                    width: `${Math.round(
                      ((completedCount +
                        inProgressCount) /
                        Math.max(
                          skillsByCategory.length,
                          1
                        )) *
                        100
                    )}%`,
                  },
                ]}
              />
            </View>
          </View>

          <View
            style={
              styles.skillStats
            }
          >
            <View
              style={
                styles.skillStatCard
              }
            >
              <Text
                style={
                  styles.skillStatNumber
                }
              >
                {completedCount}
              </Text>

              <Text
                style={
                  styles.skillStatLabel
                }
              >
                Completadas
              </Text>
            </View>

            <View
              style={
                styles.skillStatCard
              }
            >
              <Text
                style={
                  styles.skillStatNumber
                }
              >
                {inProgressCount}
              </Text>

              <Text
                style={
                  styles.skillStatLabel
                }
              >
                En curso
              </Text>
            </View>

            <View
              style={
                styles.skillStatCard
              }
            >
              <Text
                style={
                  styles.skillStatNumber
                }
              >
                {pendingCount}
              </Text>

              <Text
                style={
                  styles.skillStatLabel
                }
              >
                Pendientes
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

    <CourseModal
      visible={showCourseModal}
      selectedSkill={selectedSkill}
      isLoading={false}
      onClose={() =>
        setShowCourseModal(false)
      }
      onCompleteCourse={(skillId, courseName) => {
        const existing = getUserSkill(skillId);
        if (existing) {
          userSkillService.updateUserSkill(existing.id || existing.skill_id, 'advanced').then(() => loadData());
        } else {
          userSkillService.createUserSkill({ skill_id: skillId, level: 'advanced' }).then(() => loadData());
        }
      }}
    />

    </View>
  );
}