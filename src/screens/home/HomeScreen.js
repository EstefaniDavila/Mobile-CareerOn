import { StyleSheet, Text, View, Image, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { useState } from 'react';

export default function HomeScreen() {
  const [likedPosts, setLikedPosts] = useState({});

  const handleLike = (postId) => {
    setLikedPosts(prev => ({ ...prev, [postId]: !prev[postId] }));
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
    { name: "React", demand: "+45%" },
    { name: "Python", demand: "+38%" },
    { name: "SQL", demand: "+32%" },
    { name: "Cloud AWS", demand: "+28%" },
  ];

  return (
    <View style={styles.container}>
      {/* Header con logo - TAMAÑO REDUCIDO */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Image 
            source={{ uri: "https://res.cloudinary.com/dpuu7ddmk/image/upload/f_auto,q_auto/v1/WhatsApp_Image_2026-05-15_at_07.33.47_f5iq9x" }} 
            style={styles.logo} 
          />
          <View>
            <Text style={styles.logoText}>CarrerOn</Text>
            <Text style={styles.logoSubtext}>Tu Copiloto de Empleabilidad</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.profileButton}>
          <Image source={{ uri: "https://randomuser.me/api/portraits/women/68.jpg" }} style={styles.profileAvatar} />
        </TouchableOpacity>
      </View>

      {/* Contenido principal - 3 columnas en web (simulado con flex wrap para mobile) */}
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.gridContainer}>
          
          {/* COLUMNA IZQUIERDA - Perfil del usuario */}
          <View style={styles.leftColumn}>
            <View style={styles.profileCard}>
              <Image source={{ uri: "https://randomuser.me/api/portraits/men/32.jpg" }} style={styles.userAvatarLarge} />
              <Text style={styles.userName}>Ana Martínez</Text>
              <Text style={styles.userRole}>Desarrolladora Full Stack</Text>
              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: "75%" }]} />
                </View>
                <Text style={styles.progressText}>75% de perfil completado</Text>
              </View>
              <TouchableOpacity style={styles.completeButton}>
                <Text style={styles.completeButtonText}>Completar perfil</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* COLUMNA CENTRAL - Feed principal */}
          <View style={styles.centerColumn}>
            {/* Input para crear publicación rápida */}
            <View style={styles.createPostCard}>
              <Image source={{ uri: "https://randomuser.me/api/portraits/men/32.jpg" }} style={styles.userAvatarSmall} />
              <TextInput 
                placeholder="¿Qué quieres compartir hoy?" 
                placeholderTextColor="#5F6368"
                style={styles.postInput}
              />
              <TouchableOpacity style={styles.createPostButton}>
                <Text style={styles.createPostButtonText}>Publicar</Text>
              </TouchableOpacity>
            </View>

            {/* Tarjetas del feed */}
            {feedPosts.map(post => (
              <View key={post.id} style={styles.postCard}>
                <View style={styles.postHeader}>
                  <Image source={{ uri: post.avatar }} style={styles.postAvatar} />
                  <View style={styles.postUserInfo}>
                    <Text style={styles.postUserName}>{post.user}</Text>
                    <Text style={styles.postUserRole}>{post.role}</Text>
                    <Text style={styles.postTime}>{post.time}</Text>
                  </View>
                </View>
                <Text style={styles.postContent}>{post.content}</Text>
                {post.course && (
                  <View style={styles.courseBadge}>
                    <Text style={styles.courseBadgeText}>🎓 {post.course}</Text>
                  </View>
                )}
                <View style={styles.postActions}>
                  <TouchableOpacity style={styles.actionButton} onPress={() => handleLike(post.id)}>
                    <Text style={[styles.actionIcon, likedPosts[post.id] && styles.actionIconActive]}>❤️</Text>
                    <Text style={[styles.actionText, likedPosts[post.id] && styles.actionTextActive]}>{post.likes + (likedPosts[post.id] ? 1 : 0)}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionButton}>
                    <Text style={styles.actionIcon}>💬</Text>
                    <Text style={styles.actionText}>{post.comments}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionButton}>
                    <Text style={styles.actionIcon}>🔄</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>

          {/* COLUMNA DERECHA - Sugerencias y tendencias */}
          <View style={styles.rightColumn}>
            {/* Sugerencias de empleo */}
            <View style={styles.suggestionsCard}>
              <Text style={styles.suggestionsTitle}>💼 Empleos destacados</Text>
              {suggestedJobs.map(job => (
                <TouchableOpacity key={job.id} style={styles.jobItem}>
                  <View>
                    <Text style={styles.jobTitle}>{job.title}</Text>
                    <Text style={styles.jobCompany}>{job.company}</Text>
                    <Text style={styles.jobMeta}>{job.location} • {job.salary}</Text>
                  </View>
                  <TouchableOpacity style={styles.saveJobButton}>
                    <Text style={styles.saveJobText}>Guardar</Text>
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
              <TouchableOpacity style={styles.viewMoreButton}>
                <Text style={styles.viewMoreText}>Ver más empleos →</Text>
              </TouchableOpacity>
            </View>

            {/* Tendencias del mercado */}
            <View style={styles.trendsCard}>
              <Text style={styles.trendsTitle}>📈 Habilidades más buscadas</Text>
              {trendingSkills.map(skill => (
                <View key={skill.name} style={styles.skillItem}>
                  <Text style={styles.skillName}>{skill.name}</Text>
                  <Text style={styles.skillDemand}>{skill.demand}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Botón flotante para crear publicación (mobile) */}
      <TouchableOpacity style={styles.fab}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#DCE5EC',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
    backgroundColor: '#4320C9',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logo: {
    width: 45,
    height: 45,
    resizeMode: 'contain',
    borderRadius: 10,
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
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F3F3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 16,
  },
  leftColumn: {
    flex: 1,
    minWidth: 250,
  },
  centerColumn: {
    flex: 2,
    minWidth: 300,
  },
  rightColumn: {
    flex: 1,
    minWidth: 250,
    gap: 16,
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  userAvatarLarge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 12,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1C1C1C',
  },
  userRole: {
    fontSize: 14,
    color: '#5F6368',
    marginBottom: 16,
  },
  progressContainer: {
    width: '100%',
    marginBottom: 16,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#DCE5EC',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#5B34F2',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#5F6368',
    marginTop: 6,
    textAlign: 'center',
  },
  completeButton: {
    backgroundColor: '#F25F63',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
  },
  completeButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  createPostCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
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
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  postInput: {
    flex: 1,
    backgroundColor: '#F3F3F3',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    color: '#1C1C1C',
  },
  createPostButton: {
    backgroundColor: '#5B34F2',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 25,
  },
  createPostButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  postCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  postHeader: {
    flexDirection: 'row',
    marginBottom: 12,
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
  postUserName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1C1C1C',
  },
  postUserRole: {
    fontSize: 13,
    color: '#5F6368',
  },
  postTime: {
    fontSize: 11,
    color: '#5F6368',
    marginTop: 2,
  },
  postContent: {
    fontSize: 14,
    color: '#1C1C1C',
    lineHeight: 20,
    marginBottom: 12,
  },
  courseBadge: {
    backgroundColor: '#0F6C7A',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  courseBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  postActions: {
    flexDirection: 'row',
    gap: 24,
    borderTopWidth: 1,
    borderTopColor: '#DCE5EC',
    paddingTop: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionIcon: {
    fontSize: 18,
    color: '#5F6368',
  },
  actionIconActive: {
    color: '#F25F63',
  },
  actionText: {
    fontSize: 14,
    color: '#5F6368',
  },
  actionTextActive: {
    color: '#F25F63',
  },
  suggestionsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  suggestionsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1C1C1C',
    marginBottom: 16,
  },
  jobItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#DCE5EC',
  },
  jobTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1C1C1C',
  },
  jobCompany: {
    fontSize: 12,
    color: '#5F6368',
    marginTop: 2,
  },
  jobMeta: {
    fontSize: 11,
    color: '#5F6368',
    marginTop: 2,
  },
  saveJobButton: {
    backgroundColor: '#5B34F2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  saveJobText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  viewMoreButton: {
    marginTop: 12,
    alignItems: 'center',
  },
  viewMoreText: {
    color: '#5B34F2',
    fontSize: 13,
    fontWeight: '500',
  },
  trendsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  trendsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1C1C1C',
    marginBottom: 16,
  },
  skillItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#DCE5EC',
  },
  skillName: {
    fontSize: 14,
    color: '#1C1C1C',
  },
  skillDemand: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0F6C7A',
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
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  fabText: {
    fontSize: 28,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});