import {Text, View, ScrollView,TouchableOpacity, Alert} from "react-native";
import { useState, useEffect } from "react";
import userSkillService from "../../services/userSkill";
import skillService from "../../services/skill";
import styles from "./components/components";
import CourseModal from "./components/CourseModal";


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
        skill.skill_id === skillId
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

  const completedCount =
    userSkills.filter(
      (skill) =>
        skill.level === "advanced"
    ).length;

  const inProgressCount =
    userSkills.filter(
      (skill) =>
        skill.level ===
          "beginner" ||
        skill.level ===
          "intermediate"
    ).length;

  const totalSkills =
    skillsByCategory.length;

  const pendingCount = Math.max(
    0,
    totalSkills -
      completedCount -
      inProgressCount
  );

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
                const status = getSkillStatus(skill.id);

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
                      totalSkills,
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
                          totalSkills,
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
      onCompleteCourse={(
        skillName,
        courseName
      ) => {
        Alert.alert(
          "Curso iniciado",
          `${courseName} - ${skillName}`
        );
      }}
    />

    </View>
  );
}