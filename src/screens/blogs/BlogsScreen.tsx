import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  useWindowDimensions,
  Platform,
  TextInput,
  ImageBackground,
} from 'react-native';
import Layout from '../../layout/Layout';
import { COLORS } from '../../constants/theme';
import {
  Clock,
  User,
  Calendar,
  ArrowRight,
  Search,
  Mail,
  ChevronRight,
  TrendingUp,
} from 'lucide-react-native';

// --- Dummy Data ---
const BLOG_CATEGORIES = [
  'All',
  'Market Trends',
  'Investment',
  'Legal',
  'Commercial',
  'Residential',
];

const BLOG_POSTS = [
  {
    id: '1',
    title: 'The Future of Commercial Real Estate in India: 2026 Outlook',
    excerpt:
      'Explore the emerging trends shaping the commercial property landscape, from sustainable workspaces to the rise of Tier-2 cities.',
    author: 'Rajesh Kumar',
    date: 'Oct 15, 2025',
    readTime: '5 min read',
    category: 'Market Trends',
    image:
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2670&auto=format&fit=crop',
    featured: true,
  },
  {
    id: '2',
    title: 'Pre-Leased Properties: A Safe Haven for Investors?',
    excerpt:
      'Why high-net-worth individuals are shifting their portfolios towards pre-leased assets offering steady rental yields.',
    author: 'Sarah Jenkins',
    date: 'Oct 12, 2025',
    readTime: '4 min read',
    category: 'Investment',
    image:
      'https://images.unsplash.com/photo-1460472178825-e5240623afd5?q=80&w=2669&auto=format&fit=crop',
    featured: false,
  },
  {
    id: '3',
    title: 'Navigating Property Taxes: A Comprehensive Guide',
    excerpt:
      'Understanding the nuances of GST, stamp duty, and registration charges when buying commercial property.',
    author: 'Amit Singh',
    date: 'Oct 08, 2025',
    readTime: '7 min read',
    category: 'Legal',
    image:
      'https://images.unsplash.com/photo-1554224155-9844c6331906?q=80&w=2672&auto=format&fit=crop',
    featured: false,
  },
  {
    id: '4',
    title: 'Co-Working Spaces: The New Norm?',
    excerpt:
      'How the hybrid work culture is driving the demand for flexible office spaces across metro cities.',
    author: 'Priya Mehta',
    date: 'Oct 05, 2025',
    readTime: '3 min read',
    category: 'Commercial',
    image:
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=2670&auto=format&fit=crop',
    featured: false,
  },
  {
    id: '5',
    title: 'Residential vs. Commercial: Where to Put Your Money?',
    excerpt:
      'A comparative analysis of rental yields, capital appreciation, and risk factors in both sectors.',
    author: 'Vikram Malhotra',
    date: 'Sept 28, 2025',
    readTime: '6 min read',
    category: 'Investment',
    image:
      'https://images.unsplash.com/photo-1448630360428-65456885c650?q=80&w=2667&auto=format&fit=crop',
    featured: false,
  },
  {
    id: '6',
    title: 'Sustainable Architecture: Green Buildings Explained',
    excerpt:
      'Why "Green Certification" is becoming a critical factor for tenant retention and asset valuation.',
    author: 'Nisha Gupta',
    date: 'Sept 22, 2025',
    readTime: '5 min read',
    category: 'Market Trends',
    image:
      'https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=2565&auto=format&fit=crop',
    featured: false,
  },
];

const BlogCard = ({ item, width }: { item: any; width: number }) => {
  const isDesktop = width >= 1024;
  const isTablet = width >= 768 && width < 1024;

  // Responsive Width Calculation
  let cardWidth: any = '100%';
  if (isDesktop) cardWidth = '31%'; // 3 columns
  else if (isTablet) cardWidth = '48%'; // 2 columns

  return (
    <TouchableOpacity style={[styles.card, { width: cardWidth }]}>
      <View style={styles.cardImageContainer}>
        <Image source={{ uri: item.image }} style={styles.cardImage} />
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{item.category}</Text>
        </View>
      </View>
      <View style={styles.cardContent}>
        <View style={styles.cardMetaRow}>
          <View style={styles.metaItem}>
            <Calendar size={14} color={COLORS.textSecondary} />
            <Text style={styles.metaText}>{item.date}</Text>
          </View>
          <View style={styles.metaItem}>
            <Clock size={14} color={COLORS.textSecondary} />
            <Text style={styles.metaText}>{item.readTime}</Text>
          </View>
        </View>

        <Text style={styles.cardTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.cardExcerpt} numberOfLines={3}>
          {item.excerpt}
        </Text>

        <View style={styles.cardFooter}>
          <View style={styles.authorRow}>
            <View style={styles.authorAvatar}>
              <User size={16} color={COLORS.white} />
            </View>
            <View>
              <Text style={styles.authorLabel}>Written by</Text>
              <Text style={styles.authorName}>{item.author}</Text>
            </View>
          </View>
          <View style={styles.readMoreWrapper}>
            <Text style={styles.readMoreText}>Read Article</Text>
            <ArrowRight size={16} color={COLORS.primary} strokeWidth={2.5} />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const FeaturedBlog = ({ item, width }: { item: any; width: number }) => {
  const isMobile = width < 768;
  return (
    <TouchableOpacity
      style={[styles.featuredContainer, { height: isMobile ? 500 : 450 }]}
    >
      <ImageBackground
        source={{ uri: item.image }}
        style={styles.featuredImage}
        imageStyle={{ borderRadius: 20 }}
      >
        <View style={styles.featuredOverlay}>
          <View
            style={[
              styles.featuredContent,
              { maxWidth: isMobile ? '100%' : 700 },
            ]}
          >
            <View style={styles.badgeRow}>
              <View style={styles.featuredBadge}>
                <TrendingUp size={14} color={COLORS.white} />
                <Text style={styles.featuredBadgeText}>Trending Now</Text>
              </View>
              <View style={styles.categoryPillTransparent}>
                <Text style={styles.categoryPillTextTransparent}>
                  {item.category}
                </Text>
              </View>
            </View>

            <Text
              style={[
                styles.featuredTitle,
                {
                  fontSize: isMobile ? 28 : 36,
                  lineHeight: isMobile ? 36 : 44,
                },
              ]}
            >
              {item.title}
            </Text>
            <Text
              style={styles.featuredExcerpt}
              numberOfLines={isMobile ? 3 : 2}
            >
              {item.excerpt}
            </Text>

            <View style={[styles.featuredMetaRow, { flexWrap: 'wrap' }]}>
              <View style={styles.avatarGroup}>
                <View style={styles.featuredAvatar}>
                  <User size={16} color={COLORS.textDark} />
                </View>
                <Text style={styles.featuredAuthor}>By {item.author}</Text>
              </View>
              <View style={styles.dotDivider} />
              <Text style={styles.featuredDate}>{item.date}</Text>
              <View
                style={[styles.dotDivider, isMobile && { display: 'none' }]}
              />
              <Text style={styles.featuredReadTime}>{item.readTime}</Text>
            </View>
          </View>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
};

const NewsletterSection = () => {
  return (
    <View style={styles.newsletterContainer}>
      <View style={styles.newsletterContent}>
        <View style={styles.newsletterIconWrapper}>
          <Mail size={32} color={COLORS.primary} />
        </View>
        <View style={styles.newsletterTextWrapper}>
          <Text style={styles.newsletterTitle}>
            Subscribe to our Newsletter
          </Text>
          <Text style={styles.newsletterSubtitle}>
            Get the latest property insights and market trends delivered
            directly to your inbox.
          </Text>
        </View>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.emailInput}
            placeholder="Enter your email address"
            placeholderTextColor={COLORS.textSecondary}
          />
          <TouchableOpacity style={styles.subscribeBtn}>
            <Text style={styles.subscribeBtnText}>Subscribe</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const BlogsScreen = () => {
  const { width } = useWindowDimensions();
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredPosts = BLOG_POSTS.filter(
    post =>
      !post.featured &&
      (selectedCategory === 'All' || post.category === selectedCategory),
  );

  const featuredPost = BLOG_POSTS.find(post => post.featured);

  return (
    <Layout>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerLabel}>OUR BLOG</Text>
          <Text style={styles.headerTitle}>Strategies & Insights</Text>
          <Text style={styles.headerSubtitle}>
            Expert analysis on commercial real estate, investment opportunities,
            and market trends to help you make informed decisions.
          </Text>
        </View>

        <View style={styles.mainWrapper}>
          {/* Categories */}
          <View style={styles.categoriesWrapper}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoriesContainer}
            >
              {BLOG_CATEGORIES.map(cat => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.categoryTab,
                    selectedCategory === cat && styles.categoryTabActive,
                  ]}
                  onPress={() => setSelectedCategory(cat)}
                >
                  <Text
                    style={[
                      styles.categoryTabText,
                      selectedCategory === cat && styles.categoryTabTextActive,
                    ]}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Content */}
          <View style={styles.contentSection}>
            {/* Featured Post */}
            {featuredPost && selectedCategory === 'All' && (
              <View style={styles.featuredSection}>
                <FeaturedBlog item={featuredPost} width={width} />
              </View>
            )}

            {/* Latest Posts Grid */}
            <View style={styles.gridHeader}>
              <Text style={styles.gridTitle}>Latest Articles</Text>
              <View style={styles.dividerLine} />
            </View>

            <View style={styles.gridContainer}>
              {filteredPosts.map(post => (
                <BlogCard key={post.id} item={post} width={width} />
              ))}
            </View>

            {filteredPosts.length === 0 && (
              <View style={styles.emptyState}>
                <Search size={48} color={COLORS.divider} />
                <Text style={styles.emptyText}>No articles found.</Text>
                <TouchableOpacity
                  style={styles.clearFilterBtn}
                  onPress={() => setSelectedCategory('All')}
                >
                  <Text style={styles.clearFilterText}>View All Articles</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Load More Button (Dummy) */}
            {filteredPosts.length > 0 && (
              <TouchableOpacity style={styles.loadMoreBtn}>
                <Text style={styles.loadMoreText}>Load More Articles</Text>
                <ChevronRight size={16} color={COLORS.textSecondary} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Newsletter Section */}
        <NewsletterSection />
      </ScrollView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  contentContainer: {
    paddingBottom: 0,
  },
  mainWrapper: {
    maxWidth: 1200,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: 20,
  },
  // Header
  header: {
    paddingTop: 60,
    paddingBottom: 40,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
    paddingHorizontal: 20,
    marginBottom: 0,
  },
  headerLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.primary,
    letterSpacing: 1.5,
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  headerTitle: {
    fontSize: 42,
    fontWeight: '800',
    color: COLORS.textDark,
    marginBottom: 16,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 18,
    color: COLORS.textSecondary,
    textAlign: 'center',
    maxWidth: 600,
    lineHeight: 28,
  },
  // Categories
  categoriesWrapper: {
    marginVertical: 30,
  },
  categoriesContainer: {
    gap: 12,
    paddingVertical: 5,
  },
  categoryTab: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 30,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.divider,
  },
  categoryTabActive: {
    backgroundColor: COLORS.textDark,
    borderColor: COLORS.textDark,
  },
  categoryTabText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  categoryTabTextActive: {
    color: COLORS.white,
  },
  // Content
  contentSection: {
    paddingBottom: 60,
  },
  featuredSection: {
    marginBottom: 50,
  },
  gridHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    gap: 16,
  },
  gridTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.divider,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 24,
    justifyContent: 'space-between',
  },
  // Featured Component
  featuredContainer: {
    width: '100%',
    height: 450,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  featuredImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
  },
  featuredOverlay: {
    height: '100%',
    justifyContent: 'flex-end',
    padding: 30,
    backgroundColor: 'rgba(0,0,0,0.3)', // Basic fallback
    ...Platform.select({
      web: {
        background:
          'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.2) 100%)',
      },
    }),
  },
  featuredContent: {
    maxWidth: 700,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  featuredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  featuredBadgeText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  categoryPillTransparent: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  categoryPillTextTransparent: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '600',
  },
  featuredTitle: {
    fontSize: 36,
    fontWeight: '800',
    color: COLORS.white,
    marginBottom: 12,
    lineHeight: 44,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  featuredExcerpt: {
    fontSize: 16,
    color: COLORS.divider,
    marginBottom: 20,
    lineHeight: 24,
    maxWidth: 600,
  },
  featuredMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  featuredAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featuredAuthor: {
    color: COLORS.white,
    fontWeight: '600',
    fontSize: 14,
  },
  featuredDate: {
    color: COLORS.divider, // Keep light for contrast on dark bg
    fontSize: 14,
    fontWeight: '500',
  },
  featuredReadTime: {
    color: COLORS.divider, // Keep light for contrast on dark bg
    fontSize: 14,
    fontWeight: '500',
  },
  dotDivider: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.textSecondary, // Keep light for contrast
  },
  // Card Component
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.divider,
    marginBottom: 8,
    // layout handled by parent
  },
  cardImageContainer: {
    height: 220,
    width: '100%',
    position: 'relative',
    backgroundColor: COLORS.divider,
  },
  cardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  categoryBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    ...Platform.select({
      web: {
        backdropFilter: 'blur(4px)',
      },
    }),
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textDark,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  cardContent: {
    padding: 24,
  },
  cardMetaRow: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  metaText: {
    // used in Card
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.textDark,
    marginBottom: 8,
    lineHeight: 28,
    height: 56,
  },
  cardExcerpt: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 22,
    marginBottom: 24,
    height: 66,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
    paddingTop: 16,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  authorAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  authorLabel: {
    fontSize: 10,
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  authorName: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textDark,
  },
  readMoreWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  readMoreText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
  },
  // Newsletter
  newsletterContainer: {
    backgroundColor: COLORS.textDark,
    paddingVertical: 60,
    paddingHorizontal: 20,
    marginTop: 20,
  },
  newsletterContent: {
    maxWidth: 800,
    width: '100%',
    alignSelf: 'center',
    alignItems: 'center',
  },
  newsletterIconWrapper: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  newsletterTextWrapper: {
    alignItems: 'center',
    marginBottom: 30,
  },
  newsletterTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.white,
    marginBottom: 10,
    textAlign: 'center',
  },
  newsletterSubtitle: {
    fontSize: 16,
    color: COLORS.divider,
    textAlign: 'center',
    maxWidth: 500,
    lineHeight: 24,
  },
  inputRow: {
    flexDirection: 'row',
    width: '100%',
    maxWidth: 500,
    gap: 10,
  },
  emailInput: {
    flex: 1,
    height: 50,
    backgroundColor: COLORS.white,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    color: COLORS.textDark,
  },
  subscribeBtn: {
    backgroundColor: COLORS.primary,
    height: 50,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subscribeBtnText: {
    color: COLORS.white,
    fontWeight: '700',
    fontSize: 16,
  },
  // Loading / Empty
  loadMoreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    marginTop: 20,
    gap: 8,
  },
  loadMoreText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  emptyState: {
    width: '100%',
    padding: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    marginTop: 10,
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  clearFilterBtn: {
    marginTop: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: COLORS.divider,
    borderRadius: 6,
  },
  clearFilterText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textDark,
  },
});

export default BlogsScreen;
