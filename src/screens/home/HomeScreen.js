import { StyleSheet, Text, View, Image, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { useState } from 'react';

export default function HomeScreen() {
  const [likedPosts, setLikedPosts] = useState({});
  const [savedJobs, setSavedJobs] = useState({});

  const handleLike = (postId) => {
    setLikedPosts(prev => ({ ...prev, [postId]: !prev[postId] }));
  };

  const handleSaveJob = (jobId) => {
    setSavedJobs(prev => ({ ...prev, [jobId]: !prev[jobId] }));
  };

  const feedPosts = [
    {
      id: 1,
      user: "María González",
      role: "Desarrolladora Frontend",
      avatar: "https://randomuser.me/api/portraits/women/1.jpg",
      time: "Hace 2 horas",
      content: "¡Acabo de terminar el curso 'React Avanzado'! Aprendí sobre hooks complejos y optimización de renders. ¿Alguien más aplicando esto en proyectos reales?",
      type: "achievement",
      course: "React Avanzado",
      likes: 24,
      comments: 7,
    },
    {
      id: 2,
      user: "Carlos Ruiz",
      role: "Data Analyst Jr",
      avatar: "https://randomuser.me/api/portraits/men/2.jpg",
      time: "Hace 5 horas",
      content: "Completé el Roadmap de SQL Intermedio. Ahora puedo hacer consultas complejas y optimizar bases de datos. ¡Recomendado!",
      type: "course",
      course: "SQL Intermedio",
      likes: 42,
      comments: 12,
    },
    {
      id: 3,
      user: "Sistema CarrerOn",
      role: "Recomendación",
      avatar: "https://randomuser.me/api/portraits/lego/1.jpg",
      time: "Hace 1 día",
      content: "Según tu perfil, te recomiendo el curso 'Power BI desde Cero'. Tiene 85% de inserción laboral en los últimos 3 meses.",
      type: "recommendation",
      course: "Power BI desde Cero",
      likes: 8,
      comments: 3,
    },
  ];

  const suggestedJobs = [
    { id: 1, title: "Frontend Developer", company: "Tech Solutions", location: "Remoto", salary: "$2,500 - $3,200" },
    { id: 2, title: "Data Analyst", company: "MercadoLibre", location: "Buenos Aires", salary: "$1,800 - $2,400" },
    { id: 3, title: "UX/UI Designer", company: "Globant", location: "Remoto", salary: "$2,200 - $3,000" },
  ];

  const trendingSkills = [
    { name: "React", demand: "+45%", level: 85 },
    { name: "Python", demand: "+38%", level: 78 },
    { name: "SQL", demand: "+32%", level: 72 },
    { name: "Cloud AWS", demand: "+28%", level: 68 },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoInitial}>C</Text>
          </View>
          <View>
            <Text style={styles.logoText}>CarrerOn</Text>
            <Text style={styles.logoSubtext}>Tu Copiloto de Empleabilidad</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.profileButton}>
          <Image source={{ uri: "https://randomuser.me/api/portraits/women/68.jpg" }} style={styles.profileAvatar} />
          <View style={styles.onlineDot} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.gridContainer}>
          
          {/* COLUMNA IZQUIERDA */}
          <View style={styles.leftColumn}>
            <View style={styles.profileCard}>
              <View style={styles.profileCover} />
              <Image source={{ uri: "https://randomuser.me/api/portraits/men/32.jpg" }} style={styles.userAvatarLarge} />
              <Text style={styles.userName}>Ana Martínez</Text>
              <Text style={styles.userRole}>Desarrolladora Full Stack</Text>
              
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>12</Text>
                  <Text style={styles.statLabel}>Cursos</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>8</Text>
                  <Text style={styles.statLabel}>Logros</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>5</Text>
                  <Text style={styles.statLabel}>Proyectos</Text>
                </View>
              </View>

              <View style={styles.progressContainer}>
                <View style={styles.progressHeader}>
                  <Text style={styles.progressLabel}>Perfil completado</Text>
                  <Text style={styles.progressPercent}>75%</Text>
                </View>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: "75%" }]} />
                </View>
              </View>
              
              <TouchableOpacity style={styles.completeButton}>
                <Text style={styles.completeButtonText}>Completar perfil</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* COLUMNA CENTRAL */}
          <View style={styles.centerColumn}>
            <View style={styles.createPostCard}>
              <Image source={{ uri: "https://randomuser.me/api/portraits/men/32.jpg" }} style={styles.userAvatarSmall} />
              <TextInput 
                placeholder="¿Qué quieres compartir?" 
                placeholderTextColor="#9CA3AF"
                style={styles.postInput}
              />
              <TouchableOpacity style={styles.createPostButton}>
                <Text style={styles.createPostButtonText}>Publicar</Text>
              </TouchableOpacity>
            </View>

            {feedPosts.map(post => (
              <View key={post.id} style={styles.postCard}>
                <View style={styles.postHeader}>
                  <Image source={{ uri: post.avatar }} style={styles.postAvatar} />
                  <View style={styles.postUserInfo}>
                    <View style={styles.postNameRow}>
                      <Text style={styles.postUserName}>{post.user}</Text>
                      <View style={styles.postBadge}>
                        <Text style={styles.postBadgeText}>🏆</Text>
                      </View>
                    </View>
                    <Text style={styles.postUserRole}>{post.role}</Text>
                    <Text style={styles.postTime}>{post.time}</Text>
                  </View>
                </View>
                
                <Text style={styles.postContent}>{post.content}</Text>
                
                {post.course && (
                  <View style={styles.courseBadge}>
                    <Text style={styles.courseBadgeIcon}>🎓</Text>
                    <Text style={styles.courseBadgeText}>{post.course}</Text>
                  </View>
                )}
                
                <View style={styles.postActions}>
                  <TouchableOpacity style={styles.actionButton} onPress={() => handleLike(post.id)}>
                    <View style={[styles.actionIconWrapper, likedPosts[post.id] && styles.actionIconActive]}>
                      <Text style={styles.actionIcon}>❤️</Text>
                    </View>
                    <Text style={[styles.actionText, likedPosts[post.id] && styles.actionTextActive]}>
                      {post.likes + (likedPosts[post.id] ? 1 : 0)}
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity style={styles.actionButton}>
                    <View style={styles.actionIconWrapper}>
                      <Text style={styles.actionIcon}>💬</Text>
                    </View>
                    <Text style={styles.actionText}>{post.comments}</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity style={styles.actionButton}>
                    <View style={styles.actionIconWrapper}>
                      <Text style={styles.actionIcon}>🔄</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>

          {/* COLUMNA DERECHA */}
          <View style={styles.rightColumn}>
            <View style={styles.suggestionsCard}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Empleos destacados</Text>
                <Text style={styles.cardSubtitle}>🔥 15 nuevas ofertas</Text>
              </View>
              
              {suggestedJobs.map(job => (
                <TouchableOpacity key={job.id} style={styles.jobItem}>
                  <View style={styles.jobIcon}>
                    <Text style={styles.jobIconText}>💼</Text>
                  </View>
                  <View style={styles.jobInfo}>
                    <Text style={styles.jobTitle}>{job.title}</Text>
                    <Text style={styles.jobCompany}>{job.company}</Text>
                    <View style={styles.jobMetaRow}>
                      <Text style={styles.jobMeta}>📍 {job.location}</Text>
                      <Text style={styles.jobMeta}>💰 {job.salary}</Text>
                    </View>
                  </View>
                  <TouchableOpacity 
                    style={[styles.saveJobButton, savedJobs[job.id] && styles.saveJobButtonActive]}
                    onPress={() => handleSaveJob(job.id)}
                  >
                    <Text style={[styles.saveJobText, savedJobs[job.id] && styles.saveJobTextActive]}>
                      {savedJobs[job.id] ? '✓' : '+'}
                    </Text>
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
              
              <TouchableOpacity style={styles.viewMoreButton}>
                <Text style={styles.viewMoreText}>Ver más empleos →</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.trendsCard}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Habilidades trending</Text>
                <Text style={styles.cardSubtitle}>Última semana</Text>
              </View>
              
              {trendingSkills.map(skill => (
                <View key={skill.name} style={styles.skillItem}>
                  <View style={styles.skillInfo}>
                    <Text style={styles.skillName}>{skill.name}</Text>
                    <View style={styles.skillBarContainer}>
                      <View style={[styles.skillBar, { width: `${skill.level}%` }]} />
                    </View>
                  </View>
                  <Text style={styles.skillDemand}>{skill.demand}</Text>
                </View>
              ))}
            </View>

            <View style={styles.tipCard}>
              <Text style={styles.tipIcon}>💡</Text>
              <Text style={styles.tipTitle}>Tip del día</Text>
              <Text style={styles.tipText}>
                Personaliza tu perfil con palabras clave relevantes para aumentar un 40% tus oportunidades.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.fab}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 16,
    backgroundColor: '#4320C9',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoInitial: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  logoText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  logoSubtext: {
    fontSize: 11,
    color: '#DCE5EC',
  },
  profileButton: {
    position: 'relative',
  },
  profileAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  onlineDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 16,
  },
  leftColumn: {
    flex: 1,
    minWidth: 260,
  },
  centerColumn: {
    flex: 2,
    minWidth: 320,
  },
  rightColumn: {
    flex: 1,
    minWidth: 280,
    gap: 16,
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  profileCover: {
    height: 80,
    backgroundColor: '#5B34F2',
  },
  userAvatarLarge: {
    width: 88,
    height: 88,
    borderRadius: 44,
    marginTop: -44,
    marginLeft: 20,
    borderWidth: 4,
    borderColor: '#FFFFFF',
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 12,
    marginLeft: 20,
  },
  userRole: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
    marginLeft: 20,
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#F3F4F6',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    backgroundColor: '#E5E7EB',
  },
  progressContainer: {
    padding: 20,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 13,
    color: '#6B7280',
  },
  progressPercent: {
    fontSize: 13,
    fontWeight: '600',
    color: '#5B34F2',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#5B34F2',
    borderRadius: 4,
  },
  completeButton: {
    backgroundColor: '#F3F4F6',
    marginHorizontal: 20,
    marginBottom: 20,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  completeButtonText: {
    color: '#5B34F2',
    fontWeight: '600',
    fontSize: 14,
  },
  createPostCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  userAvatarSmall: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  postInput: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: '#1F2937',
  },
  createPostButton: {
    backgroundColor: '#5B34F2',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 24,
  },
  createPostButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 13,
  },
  postCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  postHeader: {
    flexDirection: 'row',
    marginBottom: 14,
  },
  postAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  postUserInfo: {
    flex: 1,
  },
  postNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  postUserName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
  },
  postBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 12,
  },
  postBadgeText: {
    fontSize: 10,
  },
  postUserRole: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  postTime: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 2,
  },
  postContent: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
    marginBottom: 14,
  },
  courseBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 14,
    gap: 8,
  },
  courseBadgeIcon: {
    fontSize: 14,
  },
  courseBadgeText: {
    color: '#4F46E5',
    fontSize: 13,
    fontWeight: '500',
  },
  postActions: {
    flexDirection: 'row',
    gap: 24,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 14,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionIconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionIcon: {
    fontSize: 16,
  },
  actionIconActive: {
    backgroundColor: '#FEF2F2',
  },
  actionText: {
    fontSize: 13,
    color: '#6B7280',
  },
  actionTextActive: {
    color: '#EF4444',
  },
  suggestionsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  jobItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    gap: 12,
  },
  jobIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  jobIconText: {
    fontSize: 22,
  },
  jobInfo: {
    flex: 1,
  },
  jobTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  jobCompany: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  jobMetaRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },
  jobMeta: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  saveJobButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#5B34F2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveJobButtonActive: {
    backgroundColor: '#10B981',
  },
  saveJobText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  saveJobTextActive: {
    fontSize: 14,
  },
  viewMoreButton: {
    marginTop: 12,
    alignItems: 'center',
    paddingVertical: 10,
  },
  viewMoreText: {
    color: '#5B34F2',
    fontSize: 13,
    fontWeight: '500',
  },
  trendsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  skillItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    gap: 12,
  },
  skillInfo: {
    flex: 1,
  },
  skillName: {
    fontSize: 14,
    color: '#1F2937',
    marginBottom: 6,
  },
  skillBarContainer: {
    height: 4,
    backgroundColor: '#F3F4F6',
    borderRadius: 2,
    overflow: 'hidden',
  },
  skillBar: {
    height: '100%',
    backgroundColor: '#0F6C7A',
    borderRadius: 2,
  },
  skillDemand: {
    fontSize: 13,
    fontWeight: '600',
    color: '#10B981',
  },
  tipCard: {
    backgroundColor: '#FEF3C7',
    borderRadius: 20,
    padding: 16,
  },
  tipIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#92400E',
    marginBottom: 4,
  },
  tipText: {
    fontSize: 13,
    color: '#78350F',
    lineHeight: 18,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#5B34F2',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  fabText: {
    fontSize: 28,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});