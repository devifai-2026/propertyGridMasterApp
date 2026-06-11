import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  useWindowDimensions,
  ActivityIndicator,
} from 'react-native';
import {
  ChevronLeft,
  Calendar,
  Clock,
  User,
  ArrowLeft,
} from 'lucide-react-native';
import Layout from '../../layout/Layout';
import { useNavigation } from '../../context/NavigationContext';
import { usePropertyAPIs } from '../../../helpers/hooks/propertyAPIs/usePropertyApis';

const BRAND_RED = '#EE2529';

const formatBlogDate = (value?: string) => {
  if (!value) return '';
  const date = new Date(value);
  if (isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const BlogDetailScreen = () => {
  const { width } = useWindowDimensions();
  const { currentPath, navigate, goBack } = useNavigation();
  const { getBlogBySlug, loading } = usePropertyAPIs();
  const isMobile = width < 768;

  const slug = currentPath.split('/blog/')[1];
  const [post, setPost] = useState<any | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) {
      setNotFound(true);
      return;
    }
    setNotFound(false);
    setPost(null);
    getBlogBySlug(
      slug,
      data => {
        if (data && (data.blogId || data.slug)) {
          setPost(data);
        } else {
          setNotFound(true);
        }
      },
      err => {
        console.error('Error fetching blog:', err);
        setNotFound(true);
      },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  if (loading && !post) {
    return (
      <Layout>
        <View style={styles.notFoundContainer}>
          <ActivityIndicator size="large" color={BRAND_RED} />
          <Text style={[styles.notFoundText, { marginTop: 16 }]}>
            Loading article...
          </Text>
        </View>
      </Layout>
    );
  }

  if (notFound || !post) {
    return (
      <Layout>
        <View style={styles.notFoundContainer}>
          <Text style={styles.notFoundTitle}>Article not found</Text>
          <Text style={styles.notFoundText}>
            The article you're looking for doesn't exist or may have been
            removed.
          </Text>
          <TouchableOpacity
            style={styles.backToBlogsBtn}
            onPress={() => navigate('/blogs')}
          >
            <ArrowLeft size={18} color="#FFF" />
            <Text style={styles.backToBlogsText}>Back to Blog</Text>
          </TouchableOpacity>
        </View>
      </Layout>
    );
  }

  // Split the body into paragraphs on blank lines; fall back to the whole body
  // (or the excerpt) as a single paragraph when no structure is present.
  const bodyParagraphs = (post.body || post.excerpt || '')
    .split(/\n\s*\n/)
    .map((p: string) => p.trim())
    .filter((p: string) => p.length > 0);

  const displayDate = formatBlogDate(post.publishedAt || post.createdAt);

  return (
    <Layout>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.article}>
          {/* Back Button */}
          <TouchableOpacity style={styles.backButton} onPress={goBack}>
            <ChevronLeft size={20} color={BRAND_RED} />
            <Text style={styles.backButtonText}>Back to Blog</Text>
          </TouchableOpacity>

          {/* Category */}
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{post.category}</Text>
          </View>

          {/* Title */}
          <Text style={[styles.title, isMobile && { fontSize: 28, lineHeight: 36 }]}>
            {post.title}
          </Text>

          {/* Meta Row */}
          <View style={styles.metaRow}>
            <View style={styles.authorRow}>
              <View style={styles.authorAvatar}>
                <User size={16} color="#FFF" />
              </View>
              <Text style={styles.authorName}>By {post.author}</Text>
            </View>
            {displayDate ? (
              <View style={styles.metaItem}>
                <Calendar size={14} color="#666" />
                <Text style={styles.metaText}>{displayDate}</Text>
              </View>
            ) : null}
            {post.readTime ? (
              <View style={styles.metaItem}>
                <Clock size={14} color="#666" />
                <Text style={styles.metaText}>{post.readTime}</Text>
              </View>
            ) : null}
          </View>

          {/* Hero Image */}
          <Image
            source={{ uri: post.imageUrl }}
            style={[styles.heroImage, isMobile && { height: 220 }]}
            resizeMode="cover"
          />

          {/* Body */}
          <View style={styles.body}>
            {bodyParagraphs.map((para: string, index: number) => (
              <Text key={index} style={styles.paragraph}>
                {para}
              </Text>
            ))}
          </View>

          {/* Footer CTA */}
          <View style={styles.footerCta}>
            <Text style={styles.footerCtaTitle}>Enjoyed this article?</Text>
            <Text style={styles.footerCtaText}>
              Explore more strategies and insights on commercial real estate.
            </Text>
            <TouchableOpacity
              style={styles.footerCtaBtn}
              onPress={() => navigate('/blogs')}
            >
              <Text style={styles.footerCtaBtnText}>Read More Articles</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  contentContainer: {
    paddingBottom: 60,
  },
  article: {
    width: '100%',
    maxWidth: 820,
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 24,
    alignSelf: 'flex-start',
  },
  backButtonText: {
    color: BRAND_RED,
    fontSize: 15,
    fontWeight: '600',
    fontFamily: 'Montserrat',
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFF0F0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 16,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '700',
    color: BRAND_RED,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontFamily: 'Montserrat',
  },
  title: {
    fontSize: 40,
    lineHeight: 50,
    fontWeight: '800',
    color: '#1A1A1A',
    marginBottom: 20,
    fontFamily: 'Montserrat',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 20,
    marginBottom: 28,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  authorAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: BRAND_RED,
    alignItems: 'center',
    justifyContent: 'center',
  },
  authorName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
    fontFamily: 'Montserrat',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
    fontFamily: 'Montserrat',
  },
  heroImage: {
    width: '100%',
    height: 380,
    borderRadius: 16,
    backgroundColor: '#F1F3F5',
    marginBottom: 32,
  },
  body: {
    gap: 20,
  },
  paragraph: {
    fontSize: 17,
    lineHeight: 28,
    color: '#333',
    fontFamily: 'Montserrat',
  },
  footerCta: {
    marginTop: 48,
    backgroundColor: '#FFF0F0',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
  },
  footerCtaTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: BRAND_RED,
    marginBottom: 8,
    fontFamily: 'Montserrat',
    textAlign: 'center',
  },
  footerCtaText: {
    fontSize: 15,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 22,
    fontFamily: 'Montserrat',
  },
  footerCtaBtn: {
    backgroundColor: BRAND_RED,
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 8,
  },
  footerCtaBtnText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '700',
    fontFamily: 'Montserrat',
  },
  // Not found
  notFoundContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    backgroundColor: '#FFFFFF',
    minHeight: 400,
  },
  notFoundTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1A1A1A',
    marginBottom: 12,
    fontFamily: 'Montserrat',
  },
  notFoundText: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    maxWidth: 380,
    lineHeight: 22,
    marginBottom: 24,
    fontFamily: 'Montserrat',
  },
  backToBlogsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: BRAND_RED,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  backToBlogsText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '700',
    fontFamily: 'Montserrat',
  },
});

export default BlogDetailScreen;
