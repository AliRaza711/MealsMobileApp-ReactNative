import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  FlatList, 
  TouchableOpacity, 
  Image, 
  StyleSheet, 
  Switch,
  ActivityIndicator,
  Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {

  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [meals, setMeals] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('');
  const [isVegetarian, setIsVegetarian] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('Search for a recipe or select a category to begin.');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('https://www.themealdb.com/api/json/v1/1/categories.php');
      const data = await response.json();
      setCategories(data.categories || []);
    } catch (error) {
      console.error(error);
    }
  };

  const searchMeals = async () => {
    if (!searchQuery.trim()) {
      Alert.alert('Validation', 'Please enter an ingredient to search.');
      return;
    }
    
    setLoading(true);
    setActiveCategory(''); // Reset category when searching
    try {
      const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchQuery}`);
      const data = await response.json();
      
      if (data.meals) {
        setMeals(data.meals);
        setMessage('');
      } else {
        setMeals([]);
        setMessage('No recipes found. Try another ingredient!');
      }
    } catch (error) {
      console.error(error);
      setMessage('Error fetching recipes.');
    } finally {
      setLoading(false);
    }
  };

  const fetchByCategory = async (categoryName) => {
    setLoading(true);
    setActiveCategory(categoryName);
    setSearchQuery(''); // Reset search when clicking category
    try {
      const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${categoryName}`);
      const data = await response.json();
      
      if (data.meals) {
        setMeals(data.meals);
        setMessage('');
      } else {
        setMeals([]);
        setMessage(`No recipes found for ${categoryName}.`);
      }
    } catch (error) {
      console.error(error);
      setMessage('Error fetching recipes.');
    } finally {
      setLoading(false);
    }
  };

  const getFilteredMeals = () => {
    // 1. If the switch is off, show everything
    if (!isVegetarian) return meals;

    // 2. If a category is selected, the API already filtered it for us! 
    // Since the switch is on, we know they clicked either Vegan or Vegetarian.
    if (activeCategory) {
      return meals; 
    }

    // 3. If they used the Search bar, the API gives us the full recipe details.
    // So here, we MUST filter out the non-veg recipes locally.
    return meals.filter(meal => 
      meal.strCategory === 'Vegetarian' || meal.strCategory === 'Vegan'
    );
  };

  const renderCategory = ({ item }) => {
    const isActive = activeCategory === item.strCategory;
    return (
      <TouchableOpacity 
        style={[styles.categoryCard, isActive && styles.categoryCardActive]} 
        onPress={() => fetchByCategory(item.strCategory)}
        activeOpacity={0.7}
      >
        <Text style={[styles.categoryText, isActive && styles.categoryTextActive]}>
          {item.strCategory}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderMeal = ({ item }) => (
    <TouchableOpacity 
      style={styles.mealCard} 
      onPress={() => navigation.navigate('RecipeDetails', { idMeal: item.idMeal })}
      activeOpacity={0.9}
    >
      <Image source={{ uri: item.strMealThumb }} style={styles.mealImage} />
      <View style={styles.mealInfo}>
        <Text style={styles.mealTitle} numberOfLines={2}>{item.strMeal}</Text>
      </View>
    </TouchableOpacity>
  );

  const displayedCategories = isVegetarian 
    ? categories.filter(c => c.strCategory === 'Vegetarian' || c.strCategory === 'Vegan')
    : categories;

  const displayedMeals = getFilteredMeals();

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search ingredients (e.g., chicken, rice)..."
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={searchMeals}
          returnKeyType="search"
        />
      </View>

      {/* Filter & Categories Header */}
      <View style={styles.filterRow}>
        <Text style={styles.sectionTitle}>Categories</Text>
        <View style={styles.toggleWrapper}>
          <Text style={styles.toggleText}>Veg Only</Text>
          <Switch
            value={isVegetarian}
            onValueChange={setIsVegetarian}
            trackColor={{ false: '#e0e0e0', true: '#FFD7C9' }}
            thumbColor={isVegetarian ? '#FA4A0C' : '#f4f3f4'}
            style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
          />
        </View>
      </View>

      {/* Categories List */}
      <View style={styles.categoriesContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          // CHANGE THIS LINE: from data={categories} to data={displayedCategories}
          data={displayedCategories} 
          keyExtractor={(item) => item.idCategory}
          renderItem={renderCategory}
          contentContainerStyle={{ paddingRight: 20 }}
        />
      </View>

      {/* Recipe Grid */}
      <Text style={[styles.sectionTitle, { marginBottom: 15 }]}>Results</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#FA4A0C" style={styles.loader} />
      ) : displayedMeals.length > 0 ? (
        <FlatList
          data={displayedMeals}
          keyExtractor={(item) => item.idMeal}
          renderItem={renderMeal}
          numColumns={2}
          columnWrapperStyle={styles.row}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 30 }}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.messageText}>{message}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  searchContainer: {
    marginBottom: 20,
  },
  searchInput: {
    backgroundColor: '#fff',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 25,
    fontSize: 16,
    color: '#333',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#222',
  },
  toggleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  toggleText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#555',
    marginRight: 4,
  },
  categoriesContainer: {
    marginBottom: 25,
  },
  categoryCard: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#eee',
  },
  categoryCardActive: {
    backgroundColor: '#FA4A0C',
    borderColor: '#FA4A0C',
  },
  categoryText: {
    color: '#666',
    fontWeight: '600',
    fontSize: 14,
  },
  categoryTextActive: {
    color: '#fff',
  },
  row: {
    justifyContent: 'space-between',
  },
  mealCard: {
    backgroundColor: '#fff',
    width: '47%',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  mealImage: {
    width: '100%',
    height: 140,
    backgroundColor: '#f0f0f0',
  },
  mealInfo: {
    padding: 12,
  },
  mealTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
    lineHeight: 20,
  },
  loader: {
    marginTop: 40,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 40,
  },
  messageText: {
    textAlign: 'center',
    color: '#888',
    fontSize: 16,
    lineHeight: 24,
  }
});