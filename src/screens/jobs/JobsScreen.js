// screens/jobs/JobSearchScreen.js - VERSIÓN CORREGIDA COMPLETA

import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  SafeAreaView,
  DeviceEventEmitter,
} from "react-native";
import { useState, useEffect, useCallback } from "react";
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import studentService from "../../services/student";
import JobSwiper from "./components/JobSwiper";
import { useMascota } from "../../components/mascota/MascotaProvider";

export default function JobSearchScreen() {
  const { notifyBestMatch, notifyApplied, isOffline } = useMascota();
  const [showFilters, setShowFilters] = useState(true);
  const [jobs, setJobs] = useState([]);
  const [allJobs, setAllJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterOptions, setFilterOptions] = useState({
    roles: [],
    locations: [],
    modalities: [],
    companies: [],
  });

  const [filters, setFilters] = useState({
    role: "",
    location: "",
    modality: "",
    salary: "",
    company: "",
  });

  useFocusEffect(
    useCallback(() => {
      if (allJobs.length > 0) {
        const bestJob = allJobs.reduce((prev, current) => 
          (prev.match_score > current.match_score) ? prev : current
        );
        notifyBestMatch({ ...bestJob, match_score: bestJob.match_score > 0 ? bestJob.match_score : 100 });
      }
    }, [allJobs])
  );

  const loadJobs = async () => {
    try {
      setLoading(true);
      
      if (isOffline) {
        console.log("📡 Modo offline: Cargando empleos desde caché local...");
        const cachedJobsStr = await AsyncStorage.getItem('@cached_jobs');
        if (cachedJobsStr) {
          const cachedJobs = JSON.parse(cachedJobsStr);
          setAllJobs(cachedJobs);
          extractFilterOptions(cachedJobs);
          applyFilters(cachedJobs, filters);
        } else {
          setAllJobs([]);
          setJobs([]);
        }
        setLoading(false);
        return;
      }

      console.log("📡 Cargando ofertas desde la API...");
      const result = await studentService.getJobs();

      const jobsData = result.data.jobs || result.data; // Por si acaso es array u objeto

      if (result.success && jobsData && jobsData.length > 0) {
        console.log("✅ Ofertas reales cargadas:", jobsData.length);
        
        const formattedJobs = jobsData.map((job) => ({
          id: job.id,
          title: job.title,
          company: job.company,
          location: job.location,
          modality: job.modality || "Remoto",
          salary: job.salary_range || job.salary || "No especificado",
          description: job.description || "",
          requirements: job.requirements || [],
          benefits: job.benefits || [],
          companyLogo: job.company_logo || `https://logo.clearbit.com/${job.company?.toLowerCase().replace(/\s/g, "")}.com`,
          skills: job.skills || job.requirements?.slice(0, 3) || [],
          match_score: job.match_score || 0,
          is_match: job.is_match || false,
        }));
        
        // GUARDAR EN CACHÉ
        await AsyncStorage.setItem('@cached_jobs', JSON.stringify(formattedJobs));
        
        setAllJobs(formattedJobs);
        extractFilterOptions(formattedJobs);
        applyFilters(formattedJobs, filters);
      } else {
        console.log("⚠️ No hay ofertas en la base de datos");
        setAllJobs([]);
        setJobs([]);
      }
    } catch (error) {
      console.error("❌ Error cargando ofertas, intentando caché:", error);
      try {
        const cachedJobsStr = await AsyncStorage.getItem('@cached_jobs');
        if (cachedJobsStr) {
          const cachedJobs = JSON.parse(cachedJobsStr);
          setAllJobs(cachedJobs);
          extractFilterOptions(cachedJobs);
          applyFilters(cachedJobs, filters);
        }
      } catch (e) {
        setAllJobs([]);
        setJobs([]);
      }
    } finally {
      setLoading(false);
    }
  };
  const extractFilterOptions = (jobsList) => {
    const roles = new Set();
    const locations = new Set();
    const modalities = new Set();
    const companies = new Set();

    jobsList.forEach(job => {
      if (job.title) roles.add(job.title);
      if (job.location) locations.add(job.location);
      if (job.modality) modalities.add(job.modality);
      if (job.company) companies.add(job.company);
    });

    setFilterOptions({
      roles: Array.from(roles).sort(),
      locations: Array.from(locations).sort(),
      modalities: Array.from(modalities).sort(),
      companies: Array.from(companies).sort(),
    });
  };

  const applyFilters = (jobsList, currentFilters) => {
    let filtered = [...jobsList];

    if (currentFilters.role) {
      filtered = filtered.filter(job => 
        job.title.toLowerCase().includes(currentFilters.role.toLowerCase())
      );
    }

    if (currentFilters.location) {
      filtered = filtered.filter(job => 
        job.location.toLowerCase().includes(currentFilters.location.toLowerCase())
      );
    }

    if (currentFilters.modality) {
      filtered = filtered.filter(job => 
        job.modality.toLowerCase() === currentFilters.modality.toLowerCase()
      );
    }

    if (currentFilters.company) {
      filtered = filtered.filter(job => 
        job.company.toLowerCase().includes(currentFilters.company.toLowerCase())
      );
    }

    if (currentFilters.salary) {
      filtered = filtered.filter(job => {
        const salaryStr = job.salary.toString().toLowerCase();
        switch(currentFilters.salary) {
          case "< $1500":
            return salaryStr.includes("menor") || salaryStr.includes("<") || 
                   (parseInt(salaryStr) < 1500);
          case "$1500-$2500":
            return salaryStr.includes("1500") || salaryStr.includes("2500") ||
                   (parseInt(salaryStr) >= 1500 && parseInt(salaryStr) <= 2500);
          case "$2500-$4000":
            return salaryStr.includes("2500") || salaryStr.includes("4000") ||
                   (parseInt(salaryStr) >= 2500 && parseInt(salaryStr) <= 4000);
          case "> $4000":
            return salaryStr.includes("mayor") || salaryStr.includes(">") ||
                   (parseInt(salaryStr) > 4000);
          default:
            return true;
        }
      });
    }

    setJobs(filtered);
  };

  const handleFilterChange = (filterType, value) => {
    const newFilters = { ...filters, [filterType]: value };
    setFilters(newFilters);
    applyFilters(allJobs, newFilters);
  };

  const resetFilters = () => {
    const emptyFilters = {
      role: "",
      location: "",
      modality: "",
      salary: "",
      company: "",
    };
    setFilters(emptyFilters);
    applyFilters(allJobs, emptyFilters);
  };

  const handleJobAction = async (action, job) => {
    if (action === 'save') {
      const result = await studentService.applyToJob(job.id);
      if (result.success) {
        console.log("✅ Aplicación exitosa:", result.data);
      } else {
        console.log("❌ Error al aplicar:", result.error);
      }
    }
  };

  useEffect(() => {
    loadJobs();

    // Escuchar cuando el usuario hace clic en "Ir a ver" en el globo de la mascota
    const listener = DeviceEventEmitter.addListener('openBestMatchJob', (job) => {
      setShowFilters(false);
      setJobs(prevJobs => {
        // Asegurar que el trabajo sugerido aparezca primero
        const otherJobs = prevJobs.filter(j => j.id !== job.id);
        return [job, ...otherJobs];
      });
    });

    return () => {
      listener.remove();
    };
  }, []);

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#4F46E5" />
        <Text style={styles.loadingText}>Cargando ofertas...</Text>
      </View>
    );
  }

  if (showFilters) {
    return (
      <SafeAreaView style={styles.safeContainer}>
        <ScrollView
          contentContainerStyle={styles.filtersContentContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.filtersHeader}>
            <Text style={styles.filtersTitle}>Buscar Empleos</Text>
            <Text style={styles.filtersSubtitle}>
              Encuentra tu próxima oportunidad
            </Text>
          </View>

          <View style={styles.filterGroup}>
            <Text style={styles.filterLabel}>Rol / Puesto</Text>
            <TextInput
              style={styles.filterInput}
              placeholder="Ej: Desarrollador React"
              placeholderTextColor="#9CA3AF"
              value={filters.role}
              onChangeText={(text) => handleFilterChange("role", text)}
            />
            {filterOptions.roles.length > 0 && (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.suggestionsContainer}>
                {filterOptions.roles.slice(0, 10).map((role) => (
                  <TouchableOpacity
                    key={role}
                    style={styles.suggestionChip}
                    onPress={() => handleFilterChange("role", role)}
                  >
                    <Text style={styles.suggestionText}>{role}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
          </View>

          <View style={styles.filterGroup}>
            <Text style={styles.filterLabel}>Empresa</Text>
            <TextInput
              style={styles.filterInput}
              placeholder="Nombre de la empresa"
              placeholderTextColor="#9CA3AF"
              value={filters.company}
              onChangeText={(text) => handleFilterChange("company", text)}
            />
            {filterOptions.companies.length > 0 && (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.suggestionsContainer}>
                {filterOptions.companies.slice(0, 10).map((company) => (
                  <TouchableOpacity
                    key={company}
                    style={styles.suggestionChip}
                    onPress={() => handleFilterChange("company", company)}
                  >
                    <Text style={styles.suggestionText}>{company}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
          </View>

          <View style={styles.filterGroup}>
            <Text style={styles.filterLabel}>Ubicación</Text>
            <TextInput
              style={styles.filterInput}
              placeholder="Ciudad o Remoto"
              placeholderTextColor="#9CA3AF"
              value={filters.location}
              onChangeText={(text) => handleFilterChange("location", text)}
            />
            {filterOptions.locations.length > 0 && (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.suggestionsContainer}>
                {filterOptions.locations.slice(0, 10).map((location) => (
                  <TouchableOpacity
                    key={location}
                    style={styles.suggestionChip}
                    onPress={() => handleFilterChange("location", location)}
                  >
                    <Text style={styles.suggestionText}>{location}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
          </View>

          <View style={styles.filterGroup}>
            <Text style={styles.filterLabel}>Modalidad</Text>
            <View style={styles.modalityButtons}>
              {filterOptions.modalities.length > 0 ? (
                filterOptions.modalities.map((mod) => (
                  <TouchableOpacity
                    key={mod}
                    style={[
                      styles.modalityButton,
                      filters.modality === mod && styles.modalityButtonActive,
                    ]}
                    onPress={() => handleFilterChange("modality", filters.modality === mod ? "" : mod)}
                  >
                    <Text
                      style={[
                        styles.modalityText,
                        filters.modality === mod && styles.modalityTextActive,
                      ]}
                    >
                      {mod}
                    </Text>
                  </TouchableOpacity>
                ))
              ) : (
                <>
                  {["Remoto", "Híbrido", "Presencial"].map((mod) => (
                    <TouchableOpacity
                      key={mod}
                      style={[
                        styles.modalityButton,
                        filters.modality === mod && styles.modalityButtonActive,
                      ]}
                      onPress={() => handleFilterChange("modality", filters.modality === mod ? "" : mod)}
                    >
                      <Text
                        style={[
                          styles.modalityText,
                          filters.modality === mod && styles.modalityTextActive,
                        ]}
                      >
                        {mod}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </>
              )}
            </View>
          </View>

          <View style={[styles.filterStats, { backgroundColor: "#EEF2FF", borderColor: "#C7D2FE", borderWidth: 1 }]}>
            <Text style={[styles.filterStatsText, { color: "#4F46E5", fontSize: 15 }]}>
              ✨ ¡Mira tus recomendaciones para hoy!
            </Text>
            <Text style={{ color: "#6366F1", fontSize: 13, marginTop: 4, textAlign: "center" }}>
              Tenemos {jobs.length} ofertas que quedan perfecto contigo
            </Text>
          </View>

          <View style={styles.filterActions}>
            <TouchableOpacity
              style={styles.resetButton}
              onPress={resetFilters}
            >
              <Text style={styles.resetText}>Resetear filtros</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.searchButton}
              onPress={() => setShowFilters(false)}
            >
              <Text style={styles.searchButtonText}>
                Ver ofertas ({jobs.length}) →
              </Text>
            </TouchableOpacity>
          </View>
          
          {/* ESPACIO EXTRA AL FINAL PARA QUE LOS BOTONES NO QUEDEN TAPADOS */}
          <View style={styles.bottomSpacer} />
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (jobs.length === 0) {
    return (
      <View style={styles.endContainer}>
        <Text style={styles.endEmoji}>📭</Text>
        <Text style={styles.endTitle}>No hay ofertas con estos filtros</Text>
        <Text style={styles.endSubtitle}>
          Prueba con otros criterios de búsqueda
        </Text>
        <TouchableOpacity
          style={styles.resetSearchButton}
          onPress={() => {
            resetFilters();
            setShowFilters(true);
          }}
        >
          <Text style={styles.resetSearchText}>Ajustar filtros</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <JobSwiper 
      jobs={jobs} 
      onBack={() => setShowFilters(true)}
      onJobAction={handleJobAction}
    />
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  filtersContentContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 120, // ← ESPACIO GRANDE AL FINAL
  },
  filtersHeader: {
    marginBottom: 32,
  },
  filtersTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 8,
  },
  filtersSubtitle: {
    fontSize: 14,
    color: "#6B7280",
  },
  filterGroup: {
    marginBottom: 24,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  filterInput: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  suggestionsContainer: {
    flexDirection: "row",
    marginTop: 8,
  },
  suggestionChip: {
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
  },
  suggestionText: {
    fontSize: 12,
    color: "#4B5563",
  },
  modalityButtons: {
    flexDirection: "row",
    gap: 10,
  },
  modalityButton: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingVertical: 12,
    borderRadius: 30,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  modalityButtonActive: {
    backgroundColor: "#4F46E5",
    borderColor: "#4F46E5",
  },
  modalityText: {
    color: "#6B7280",
    fontWeight: "500",
  },
  modalityTextActive: {
    color: "#FFFFFF",
  },
  salaryButtons: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  salaryButton: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  salaryButtonActive: {
    backgroundColor: "#4F46E5",
    borderColor: "#4F46E5",
  },
  salaryText: {
    color: "#6B7280",
    fontSize: 13,
  },
  salaryTextActive: {
    color: "#FFFFFF",
  },
  filterStats: {
    backgroundColor: "#F3F4F6",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 20,
  },
  filterStatsText: {
    fontSize: 14,
    color: "#4B5563",
    fontWeight: "500",
  },
  filterActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 20,
    marginBottom: 20,
  },
  resetButton: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  resetText: {
    color: "#6B7280",
    fontWeight: "500",
  },
  searchButton: {
    flex: 2,
    backgroundColor: "#4F46E5",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  searchButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  bottomSpacer: {
    height: 40, // Espacio extra al final
  },
  endContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  endEmoji: {
    fontSize: 64,
    marginBottom: 20,
  },
  endTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 8,
  },
  endSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 32,
  },
  resetSearchButton: {
    backgroundColor: "#4F46E5",
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 30,
  },
  resetSearchText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F7FA",
  },
  loadingText: {
    marginTop: 12,
    color: "#6B7280",
    fontSize: 14,
  },
});